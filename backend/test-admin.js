require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User.model");
const bcrypt = require("bcryptjs");

async function testLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: "admin@readora.com" });
  if (!user) {
    console.log("No admin");
  } else {
    console.log("Admin password hash:", user.password);
    const isMatch = await bcrypt.compare("Admin@123456", user.password);
    console.log("Password matches 'Admin@123456':", isMatch);
  }
  process.exit();
}
testLogin();
