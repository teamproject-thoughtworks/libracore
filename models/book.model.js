const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // ── Original fields (kept for backward compatibility) ──
    bookname: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    details: { type: String, trim: true },
    bookimg: { type: String, default: "" },

    // ── Extended fields ──
    ISBN: { type: String, trim: true, sparse: true },
    category: { type: String, trim: true, default: "General" },
    totalCopies: { type: Number, min: 0, default: 0 },
    language: { type: String, trim: true, default: "English" },
    publishedYear: { type: Number },
    publisher: { type: String, trim: true },
    shelfLocation: { type: String, trim: true },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Keep status in sync with quantity before every save
bookSchema.pre("save", function () {
  this.status = this.quantity > 0 ? "available" : "unavailable";
  if (!this.totalCopies) this.totalCopies = this.quantity;
});

// Indexes for fast searching
bookSchema.index({ bookname: "text", author: "text" });
bookSchema.index({ category: 1 });
bookSchema.index({ status: 1 });

module.exports = mongoose.model("Book", bookSchema);