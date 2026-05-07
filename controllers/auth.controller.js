const LoginModel = require("../model/login.model");
const SignUpModel = require("../model/SignUp.model");
var jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  try {
    const existingUser = await SignUpModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send("User already exists")
    }
    else{
      const newSignup = new SignUpModel(req.body);
      await newSignup.save();
      res.send("Signup Successful");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const Login = async (req, res) => {
  try {
    const user = await SignUpModel.findOne({
      email: req.body.email,
      password: req.body.password
    });
    if (user) {
      var token = jwt.sign({ ...req.body }, "userToken");
      const newLogin = new LoginModel(req.body);
      await newLogin.save();
      res.send({ msg: "loginsuccess", token, email:req.body.email });
    } 
    else {
      res.send({ msg: "loginfailed" });
    }
    
  } catch (err) {
    res.status(500).send("Server error");
  }
};

module.exports= {
    SignUp,
    Login
};