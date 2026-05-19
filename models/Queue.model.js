const mongoose = require("mongoose");

// Flat model: one document per queue entry (replaces embedded array)
// Eliminates MongoDB 16MB document size limit for popular books
const queueSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    position: { type: Number, required: true },
    status: {
      type: String,
      enum: ["waiting", "assigned", "expired", "cancelled"],
      default: "waiting",
    },
    joinedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    notifiedAt: { type: Date },
  },
  { timestamps: true }
);

// Compound indexes
queueSchema.index({ bookId: 1, position: 1 });
queueSchema.index({ bookId: 1, status: 1 });
queueSchema.index({ userId: 1, bookId: 1 });
queueSchema.index({ status: 1 });

module.exports = mongoose.model("Queue", queueSchema);