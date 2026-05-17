require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User.model");
const bcrypt = require("bcryptjs");

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Hash the password directly here to avoid pre-save hook issues with updates
    const hashedPassword = await bcrypt.hash("Admin@123456", 12);

    const user = await User.findOneAndUpdate(
      { email: "admin@readora.com" },
      { 
        password: hashedPassword,
        role: "admin",
        isActive: true
      },
      { new: true, upsert: true }
    );
    
    console.log("Admin user successfully reset!");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    
    // Verify it matches
    const isMatch = await bcrypt.compare("Admin@123456", user.password);
    console.log("Password check 'Admin@123456':", isMatch);
    
  } catch (err) {
    console.error("Error resetting admin:", err);
  } finally {
    process.exit();
  }
}

resetAdmin();
