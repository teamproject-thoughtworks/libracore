require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User.model");

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: "admin@readora.com" });
  console.log("Admin user in DB:", user);
  process.exit();
}
checkAdmin();
