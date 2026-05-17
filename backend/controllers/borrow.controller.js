const borrowService = require("../services/borrow.service");
const { success } = require("../utils/apiResponse");

const getIo = (req) => req.app.get("io");

const borrowBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) {
      const err = new Error("userId and bookId are required.");
      err.statusCode = 400;
      err.code = "VALIDATION_ERROR";
      return next(err);
    }
    const result = await borrowService.borrowBook({ userId, bookId }, getIo(req));
    const message = result.queued
      ? `Book not available. You are #${result.queuePosition} in the queue.`
      : "Book borrowed successfully.";
    return success(res, result, message, result.queued ? 200 : 201);
  } catch (err) {
    next(err);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { borrowId } = req.body;
    if (!borrowId) {
      const err = new Error("borrowId is required.");
      err.statusCode = 400;
      err.code = "VALIDATION_ERROR";
      return next(err);
    }
    const result = await borrowService.returnBook(borrowId, getIo(req));
    return success(res, result, "Book returned successfully.");
  } catch (err) {
    next(err);
  }
};

const getBorrowBooks = async (req, res, next) => {
  try {
    const { page, limit, userId } = req.query;
    const result = await borrowService.getBorrowsByStatus("borrowed", page, limit, userId || null);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

const getreturnBooks = async (req, res, next) => {
  try {
    const { page, limit, userId } = req.query;
    const result = await borrowService.getBorrowsByStatus("returned", page, limit, userId || null);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = { borrowBook, returnBook, getBorrowBooks, getreturnBooks };