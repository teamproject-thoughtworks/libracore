var bookModel= require("../model/book.model");

const addbook = async (req, res) => {
   try {
    const existingBook = await bookModel.findOne({ bookname:req.body.bookname });
    console.log(existingBook);
    if (existingBook) {
      return res.send("Book already exists")
    }
    else{
      const newbookModel = new bookModel(req.body);
      await newbookModel.save();
      res.send("Book added successfully");
    }
   }
   catch (err) {
    res.status(500).send("Server error");
   }
};

const getAllBooks = (req,res)=>{
    bookModel.find().then((data)=>{
        res.send(data);
    });
};

const deleteBook = async (req, res) => {
   try {
    const DeletedBook = await bookModel.findOneAndDelete({ bookname:req.params.bookname });
    console.log(DeletedBook);
    if (!DeletedBook) {
      return res.send("Book not exists")
    }
    else{
      res.send("Book deleted successfully");
    }
   }
   catch (err) {
    res.status(500).send("Server error");
   }
};

const updateBook = async(req,res)=>{
  try{
    console.log(req.body);
    const UpdatedBook = await bookModel.findOneAndUpdate(
      { bookname:req.params.bookname },
      {$set:{
        quantity: req.body.quantity
      }},
      {new: true}
    );
    console.log(UpdatedBook);
    if (!UpdatedBook) {
      return res.send("Book not exists")
    }
    else{
      res.send("Book updated successfully");
    }
  }catch(err){
    res.status(500).send("Server error");
  }
};

module.exports={
    addbook,
    getAllBooks,
    deleteBook,
    updateBook
};