const cron = require("node-cron");
const Borrow = require("../models/Borrow.model");
const Book = require("../models/Book.model");
const Queue = require("../models/Queue.model");
const { createNotification } = require("../services/notification.service");
const { FINE_PER_DAY, BORROW_DAYS } = require("../constants");
const logger = require("../utils/logger");

let io = null;

const initOverdueJob = (socketIo) => {
  io = socketIo;

  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    logger.info("Running overdue check job...");
    try {
      const now = new Date();

      // Find all borrows that are past due date and still 'borrowed'
      const overdueRecords = await Borrow.find({
        status: "borrowed",
        returnDate: { $lt: now },
      });

      for (const borrow of overdueRecords) {
        const daysOverdue = Math.ceil((now - borrow.returnDate) / (1000 * 60 * 60 * 24));
        const fine = daysOverdue * FINE_PER_DAY;

        // Mark as overdue and calculate fine
        await Borrow.findByIdAndUpdate(borrow._id, {
          status: "overdue",
          fine,
        });

        // Notify student
        await createNotification(
          {
            userId: borrow.userId,
            message: `Your book is overdue by ${daysOverdue} day(s). Fine: ₹${fine}. Please return it immediately.`,
            type: "borrow_overdue",
            relatedBookId: borrow.bookId,
            relatedBorrowId: borrow._id,
          },
          io
        );
      }

      logger.info(`Overdue job: processed ${overdueRecords.length} records.`);
    } catch (err) {
      logger.error("Overdue job error:", err.message);
    }
  });

  logger.info("Overdue cron job initialized (runs daily at midnight).");
};

module.exports = initOverdueJob;
