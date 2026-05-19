const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/role.middleware");
const upload = require("../config/multer");
const {
  addbook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

// Public
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin only
router.post("/addbook", authenticate, requireAdmin, upload.single("bookimg"), addbook);
router.put("/:id", authenticate, requireAdmin, upload.single("bookimg"), updateBook);
router.delete("/:bookname", authenticate, requireAdmin, deleteBook);

module.exports = router;
