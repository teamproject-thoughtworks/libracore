var mongoose=require("mongoose");
var SignUpSchema=mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    role: String,
});

var SignUpModel=mongoose.model("SignUp",SignUpSchema);
module.exports=SignUpModel;