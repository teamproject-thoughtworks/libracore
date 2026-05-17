const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g. "BOOK_ADDED", "BORROW_CREATED"
    entity: { type: String, required: true }, // e.g. "Book", "Borrow"
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
