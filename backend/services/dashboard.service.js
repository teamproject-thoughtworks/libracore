const Book = require("../models/Book.model");
const Borrow = require("../models/Borrow.model");
const User = require("../models/User.model");
const Queue = require("../models/Queue.model");

const getDashboardStats = async () => {
  const now = new Date();

  const [
    totalBooks,
    totalBorrowed,
    totalAvailable,
    totalOverdue,
    totalQueue,
    totalStudents,
    recentBorrows,
    mostBorrowed,
    overdueList,
  ] = await Promise.all([
    Book.countDocuments(),
    Borrow.countDocuments({ status: "borrowed" }),
    Book.countDocuments({ status: "available" }),
    Borrow.countDocuments({ status: "borrowed", returnDate: { $lt: now } }),
    Queue.countDocuments({ status: "waiting" }),
    User.countDocuments({ role: "student" }),

    // Recent 5 borrows
    Borrow.find({ status: "borrowed" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .populate("bookId", "bookname author")
      .lean(),

    // Top 5 most borrowed books (aggregation)
    Borrow.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
      { $unwind: "$book" },
      { $project: { _id: 0, bookname: "$book.bookname", author: "$book.author", bookimg: "$book.bookimg", count: 1 } },
    ]),

    // Overdue list
    Borrow.find({ status: "borrowed", returnDate: { $lt: now } })
      .populate("userId", "name email")
      .populate("bookId", "bookname")
      .lean(),
  ]);

  return {
    stats: {
      totalBooks,
      totalBorrowed,
      totalAvailable,
      totalOverdue,
      totalQueue,
      totalStudents,
    },
    recentBorrows,
    mostBorrowed,
    overdueList,
  };
};

module.exports = { getDashboardStats };
