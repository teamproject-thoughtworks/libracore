const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["book_assigned", "borrow_overdue", "extension_approved", "queue_updated", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    relatedBookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    relatedBorrowId: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow" },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);