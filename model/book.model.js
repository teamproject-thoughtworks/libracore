var mongoose= require("mongoose");
var bookSchema= mongoose.Schema({
    bookname: String,
    author: String,
    quantity: Number,
    details: String,
    image: String,
});

var bookModel= mongoose.model("book",bookSchema);
module.exports=bookModel;