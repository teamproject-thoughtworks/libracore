const express = require("express");
const router = express.Router();

const Book = require("../model/book.model");
const Borrow = require("../model/borrow.model");
const Queue = require("../model/Queue.model");
const Notification = require("../model/Notification.model");

// BORROW BOOK
const borrowBook= async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // FIND BOOK
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // CHECK BORROW LIMIT
    const borrowedCount = await Borrow.countDocuments({
      userId,
      status: "borrowed"
    });

    if (borrowedCount >= 2) {
      return res.status(400).json({
        message: "You reached maximum borrow limit"
      });
    }

    // IF BOOK AVAILABLE
    if (book.quantity > 0) {
      // Return Date = 7 days
      const returnDate = new Date();

      returnDate.setDate(returnDate.getDate() + 7);

      // Create Borrow Record
      const borrow = new Borrow({
        userId,
        bookId,
        borrowDate: new Date(),
        returnDate,
        status: "borrowed"
      });

      await borrow.save();

      // Reduce Copies
      book.quantity -= 1;

      await book.save();

      return res.json({
        message: "Book borrowed successfully",
        borrow
      });

    }

    // IF BOOK NOT AVAILABLE → ADD TO QUEUE

    let queue = await Queue.findOne({ bookId });

    // Create Queue if not exists
    if (!queue) {
      queue = new Queue({
        bookId,
        users: []
      });

    }

    // Check duplicate queue entry
    const alreadyInQueue = queue.users.find(
      u => u.userId.toString() === userId
    );

    if (alreadyInQueue) {
      return res.status(400).json({
        message: "You are already in queue"
      });
    }

    // Add User to Queue
    queue.users.push({
      userId,
      joinedAt: new Date()
    });

    await queue.save();

    // Queue Position
    const position = queue.users.length;

    return res.json({
      message: "Book not available. Added to queue.",
      queuePosition: position
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// RETURN BOOK
const returnBook=async (req, res) => {
  try {
    const { borrowId } = req.body;

    // FIND BORROW RECORD
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });

    }

    // CHECK ALREADY RETURNED
    if (borrow.status === "returned") {
      return res.status(400).json({
        message: "Book already returned"
      });

    }

    // UPDATE BORROW STATUS
    borrow.status = "returned";
    await borrow.save();

    // INCREASE AVAILABLE COPIES
    const book = await Book.findById(borrow.bookId);
    book.quantity += 1;
    await book.save();


    // PROCESS QUEUE AUTOMATICALLY
    const queue = await Queue.findOne({
      bookId: borrow.bookId
    });

    // IF QUEUE EXISTS
    if (queue && queue.users.length > 0) {

      // FIFO → First User
      const nextUser = queue.users.shift();
      await queue.save();

      // CREATE NEW BORROW RECORD
      const returnDate = new Date();

      returnDate.setDate(returnDate.getDate() + 7);

      const newBorrow = new Borrow({
        userId: nextUser.userId,
        bookId: borrow.bookId,
        borrowDate: new Date(),
        returnDate,
        status: "borrowed"
      });

      await newBorrow.save();

      // DECREASE AVAILABLE COPIES AGAIN
      book.quantity-= 1;
      await book.save();

      // CREATE NOTIFICATION
      await Notification.create({
        userId: nextUser.userId,
        message:
          "Book is now available and assigned to you."

      });

    }

    // FINAL RESPONSE
    res.json({
      message: "Book returned successfully"
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
    borrowBook,
    returnBook
};