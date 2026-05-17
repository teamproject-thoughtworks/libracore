const queueService = require("../services/queue.service");
const { success } = require("../utils/apiResponse");

const queuePosition = async (req, res, next) => {
  try {
    const { bookId, userId } = req.params;
    const position = await queueService.getQueuePosition(bookId, userId);
    return success(res, { position });
  } catch (err) {
    next(err);
  }
};

const getFullQueue = async (req, res, next) => {
  try {
    const queue = await queueService.getFullQueue(req.params.bookId);
    return success(res, queue);
  } catch (err) {
    next(err);
  }
};

const removeFromQueue = async (req, res, next) => {
  try {
    const { bookId, userId } = req.params;
    await queueService.removeFromQueue(bookId, userId);
    return success(res, null, "Removed from queue.");
  } catch (err) {
    next(err);
  }
};

module.exports = { queuePosition, getFullQueue, removeFromQueue };