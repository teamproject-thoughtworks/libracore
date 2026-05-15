const express = require("express");
const router = express.Router();
const {
    borrowBook,
    returnBook,
}=require("../controllers/borrow.controller");

// BORROW BOOK
router.post("/borrow", borrowBook);

// RETURN BOOK
router.post("/return", returnBook );

module.exports = router;