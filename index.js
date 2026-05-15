require("dotenv").config();
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var dbConnect=require("./db");
var multer = require("multer");
var authRouter= require("./routes/auth.router");
var bookRouter= require("./routes/book.router");
var queueRouter=require("./routes/queue.router");
var borrowRouter=require("./routes/borrow.router");
var notificationRouter=require("./routes/notification.router");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log("req.file::", file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.single("bookimg"));

dbConnect();

app.use("/auth",authRouter);
app.use("/book",bookRouter);
app.use("/queue",queueRouter);
app.use("/borrow",borrowRouter);
app.use("/notification",notificationRouter);

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:4000')
})