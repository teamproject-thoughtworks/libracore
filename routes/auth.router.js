var express=require("express");
var router=express.Router();
const {
  SignUp,
  Login,
} = require("../controllers/auth.controller");

router
  .post("/signup", SignUp)
  .post("/login",Login);

module.exports= router;