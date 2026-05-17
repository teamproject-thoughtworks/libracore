const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User.model");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const existing = await User.findOne({ email: process.env.ADMIN_SEED_EMAIL });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: process.env.ADMIN_SEED_NAME || "Super Admin",
      email: process.env.ADMIN_SEED_EMAIL,
      password: process.env.ADMIN_SEED_PASSWORD,
      role: "admin",
    });

    console.log("Admin seeded successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
