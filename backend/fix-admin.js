require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User.model");

async function fixAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate(
    { email: "admin@readora.com" },
    { role: "admin" },
    { new: true }
  );
  console.log("Admin user updated in DB:", user);
  process.exit();
}
fixAdmin();
