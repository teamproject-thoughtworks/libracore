const mongoose = require("mongoose");
const Book = require("../models/Book.model");
const Borrow = require("../models/Borrow.model");
const Queue = require("../models/Queue.model");
const { createNotification } = require("./notification.service");
const { BORROW_LIMIT, BORROW_DAYS, FINE_PER_DAY } = require("../constants");

/**
 * Borrow a book. If unavailable, join the queue.
 * Uses a MongoDB session/transaction to prevent race conditions.
 */
const borrowBook = async ({ userId, bookId }, io) => {
  // 1. Check borrow limit
  const activeBorrows = await Borrow.countDocuments({ userId, status: "borrowed" });
  if (activeBorrows >= BORROW_LIMIT) {
    const err = new Error(`You have reached the maximum borrow limit of ${BORROW_LIMIT} books.`);
    err.statusCode = 400;
    err.code = "BORROW_LIMIT_REACHED";
    throw err;
  }

  // 2. Check duplicate active borrow of same book
  const duplicate = await Borrow.findOne({ userId, bookId, status: "borrowed" });
  if (duplicate) {
    const err = new Error("You have already borrowed this book.");
    err.statusCode = 400;
    err.code = "DUPLICATE_BORROW";
    throw err;
  }

  // 2.5 Check lifetime borrow limit for the same book (max 3 times)
  const lifetimeBorrows = await Borrow.countDocuments({ userId, bookId });
  if (lifetimeBorrows >= 3) {
    const err = new Error("You have reached the maximum borrow limit (3 times) for this specific book.");
    err.statusCode = 400;
    err.code = "LIFETIME_LIMIT_REACHED";
    throw err;
  }

  // 3. Find book
  const book = await Book.findById(bookId);
  if (!book) {
    const err = new Error("Book not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  // 4. Book is available — borrow directly
  if (book.quantity > 0) {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + BORROW_DAYS);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const borrow = await Borrow.create([{ userId, bookId, returnDate, status: "borrowed" }], { session });
      await Book.findByIdAndUpdate(bookId, { $inc: { quantity: -1 } }, { session });
      await session.commitTransaction();
      session.endSession();
      return { borrow: borrow[0], queued: false };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // 5. Book unavailable — check queue
  const alreadyInQueue = await Queue.findOne({ bookId, userId, status: "waiting" });
  if (alreadyInQueue) {
    const err = new Error("You are already in the queue for this book.");
    err.statusCode = 400;
    err.code = "ALREADY_IN_QUEUE";
    throw err;
  }

  // 6. Add to queue (get next position)
  const lastInQueue = await Queue.findOne({ bookId, status: "waiting" }).sort({ position: -1 });
  const position = lastInQueue ? lastInQueue.position + 1 : 1;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 3);

  const queueEntry = await Queue.create({ bookId, userId, position, expiresAt });

  // Emit real-time update
  if (io) io.to(`book_${bookId}`).emit("queue_updated", { bookId, position });

  return { queueEntry, queued: true, queuePosition: position };
};

/**
 * Return a book. Uses transaction to prevent race conditions in queue assignment.
 */
const returnBook = async (borrowId, io) => {
  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    const err = new Error("Borrow record not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  if (borrow.status === "returned") {
    const err = new Error("This book has already been returned.");
    err.statusCode = 400;
    err.code = "ALREADY_RETURNED";
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Mark borrow as returned
    const actualReturnDate = new Date();
    const fine = borrow.status === "overdue"
      ? Math.ceil((actualReturnDate - borrow.returnDate) / (1000 * 60 * 60 * 24)) * FINE_PER_DAY
      : 0;

    await Borrow.findByIdAndUpdate(borrowId, { status: "returned", actualReturnDate, fine }, { session });

    // Find next in queue (FIFO)
    const nextInQueue = await Queue.findOneAndUpdate(
      { bookId: borrow.bookId, status: "waiting" },
      { status: "assigned", notifiedAt: new Date() },
      { sort: { position: 1 }, new: true, session }
    );

    if (nextInQueue) {
      // Auto-assign to next user in queue
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + BORROW_DAYS);

      await Borrow.create(
        [{ userId: nextInQueue.userId, bookId: borrow.bookId, returnDate, status: "borrowed" }],
        { session }
      );
      // Book quantity stays 0 (one returned, one immediately re-borrowed)
    } else {
      // No queue — restore book quantity
      await Book.findByIdAndUpdate(borrow.bookId, { $inc: { quantity: 1 } }, { session });
    }

    await session.commitTransaction();
    session.endSession();

    // Send notification outside transaction
    if (nextInQueue) {
      await createNotification(
        {
          userId: nextInQueue.userId,
          message: "Great news! The book you were waiting for is now available and has been assigned to you.",
          type: "book_assigned",
          relatedBookId: borrow.bookId,
          relatedBorrowId: borrow._id,
        },
        io
      );
      if (io) io.to(`book_${borrow.bookId}`).emit("book_assigned", { bookId: borrow.bookId, userId: nextInQueue.userId });
    }

    return { fine };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getBorrowsByStatus = async (status, page = 1, limit = 20, userId = null) => {
  const query = { status };
  if (userId) query.userId = userId;

  const skip = (page - 1) * limit;
  const [borrows, total] = await Promise.all([
    Borrow.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .populate("bookId", "bookname author bookimg")
      .lean(),
    Borrow.countDocuments(query),
  ]);

  return { borrows, total, page: Number(page), limit: Number(limit) };
};

module.exports = { borrowBook, returnBook, getBorrowsByStatus };
