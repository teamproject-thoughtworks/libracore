const Queue = require("../models/Queue.model");

const getQueuePosition = async (bookId, userId) => {
  const entry = await Queue.findOne({ bookId, userId, status: "waiting" }).lean();
  if (!entry) return null;
  return entry.position;
};

const getFullQueue = async (bookId) => {
  const queue = await Queue.find({ bookId, status: "waiting" })
    .sort({ position: 1 })
    .populate("userId", "name email")
    .lean();
  return queue;
};

const removeFromQueue = async (bookId, userId) => {
  const deleted = await Queue.findOneAndDelete({ bookId, userId, status: "waiting" });
  if (!deleted) {
    const err = new Error("Queue entry not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return deleted;
};

module.exports = { getQueuePosition, getFullQueue, removeFromQueue };
