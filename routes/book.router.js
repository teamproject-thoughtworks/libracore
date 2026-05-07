var express= require("express");
var router=express.Router();
const {
  addbook,
  getAllBooks,
  deleteBook,
  updateBook,
} = require("../controllers/book.controller");

router
  .post("/addbook",addbook)
  .get("/",getAllBooks)
  .delete("/:bookname",deleteBook)
  .put("/:bookname",updateBook);

module.exports= router;