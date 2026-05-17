const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
    isExtended: { type: Boolean, default: false },
    extensionDays: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    autoReturned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound indexes for fast queries
borrowSchema.index({ userId: 1, status: 1 });
borrowSchema.index({ bookId: 1, status: 1 });
borrowSchema.index({ status: 1 });
borrowSchema.index({ returnDate: 1 });

module.exports = mongoose.model("Borrow", borrowSchema);