require("dotenv").config();
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var dbConnect=require("./db");
var authRouter= require("./routes/auth.router");
var bookRouter= require("./routes/book.router");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dbConnect();

app.use("/auth",authRouter);
app.use("/book",bookRouter);

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:4000')
})