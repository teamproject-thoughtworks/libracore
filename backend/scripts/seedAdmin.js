const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User.model");

const seedAdmin = async () => {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to DB for seeding");
    }

    const existing = await User.findOne({ email: process.env.ADMIN_SEED_EMAIL });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      return;
    }

    const admin = await User.create({
      name: process.env.ADMIN_SEED_NAME || "Super Admin",
      email: process.env.ADMIN_SEED_EMAIL,
      password: process.env.ADMIN_SEED_PASSWORD,
      role: "admin",
    });

    console.log("Admin seeded successfully:", admin.email);
  } catch (err) {
    console.error("Seed failed:", err.message);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedAdmin().then(() => {
    console.log("Seed process completed.");
    process.exit(0);
  });
}

module.exports = seedAdmin;