const Book = require("../models/Book.model");

const addBook = async (bookData, filename) => {
  const existing = await Book.findOne({ bookname: bookData.bookname.trim() });
  if (existing) {
    const err = new Error("A book with this name already exists.");
    err.statusCode = 409;
    err.code = "BOOK_EXISTS";
    throw err;
  }
  const book = await Book.create({
    ...bookData,
    bookimg: filename || "",
    totalCopies: Number(bookData.quantity) || 0,
  });
  return book;
};

const getAllBooks = async ({ page = 1, limit = 50, search, category, status } = {}) => {
  const query = {};
  if (search) {
    query.$or = [
      { bookname: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { ISBN: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  if (category) query.category = category;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [books, total] = await Promise.all([
    Book.find(query).skip(skip).limit(Number(limit)).lean(),
    Book.countDocuments(query),
  ]);
  return {
    books,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit)),
  };
};

const getBookById = async (id) => {
  const book = await Book.findById(id).lean();
  if (!book) {
    const err = new Error("Book not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return book;
};

const updateBook = async (id, updateData, filename) => {
  const data = { ...updateData };
  if (filename) data.bookimg = filename;
  if (data.quantity !== undefined) {
    data.quantity = Number(data.quantity);
  }
  const book = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!book) {
    const err = new Error("Book not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return book;
};

const deleteBook = async (bookname) => {
  const book = await Book.findOneAndDelete({ bookname });
  if (!book) {
    const err = new Error("Book not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return book;
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
