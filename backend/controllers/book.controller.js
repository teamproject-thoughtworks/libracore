const bookService = require("../services/book.service");
const { success, error } = require("../utils/apiResponse");

const addbook = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, "Book cover image is required.", 400, "VALIDATION_ERROR");
    }
    if (!req.body.bookname || !req.body.author || !req.body.quantity) {
      return error(res, "bookname, author, and quantity are required.", 400, "VALIDATION_ERROR");
    }
    const book = await bookService.addBook(req.body, req.file.filename);
    return success(res, book, "Book added successfully.", 201);
  } catch (err) {
    next(err);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const { page, limit, search, category, status } = req.query;
    const result = await bookService.getAllBooks({ page, limit, search, category, status });
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    return success(res, book);
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body, req.file?.filename);
    return success(res, book, "Book updated successfully.");
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.bookname);
    return success(res, null, "Book deleted successfully.");
  } catch (err) {
    next(err);
  }
};

module.exports = { addbook, getAllBooks, getBookById, updateBook, deleteBook };