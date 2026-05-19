const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/role.middleware");
const { borrowBook, returnBook, getBorrowBooks, getreturnBooks } = require("../controllers/borrow.controller");

// Any authenticated user can borrow
router.post("/borrowbook", authenticate, borrowBook);

// Admin can return books and see all borrows
router.post("/return", authenticate, requireAdmin, returnBook);
router.get("/getborrowbooks", authenticate, getBorrowBooks);
router.get("/getreturnbooks", authenticate, getreturnBooks);

module.exports = router;
