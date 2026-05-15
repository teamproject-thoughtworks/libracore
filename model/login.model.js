var mongoose=require("mongoose");
var LoginSchema=mongoose.Schema({
    email: String,
    password: String,
});

var LoginModel=mongoose.model("Login",LoginSchema);
module.exports=LoginModel;