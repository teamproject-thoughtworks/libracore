const notificationService = require("../services/notification.service");
const { success } = require("../utils/apiResponse");

const getNotification = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;
    const result = await notificationService.getNotificationsByUser(userId, page, limit);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return success(res, notification, "Notification marked as read.");
  } catch (err) {
    next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.params.userId);
    return success(res, null, "All notifications marked as read.");
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotification, markRead, markAllRead };