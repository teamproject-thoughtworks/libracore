const Notification = require("../models/Notification.model");

const createNotification = async ({ userId, message, type = "general", relatedBookId, relatedBorrowId }, io) => {
  const notification = await Notification.create({
    userId,
    message,
    type,
    relatedBookId,
    relatedBorrowId,
  });

  // Emit real-time notification via Socket.IO if available
  if (io) {
    io.to(`user_${userId}`).emit("notification_created", {
      _id: notification._id,
      message: notification.message,
      type: notification.type,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};

const getNotificationsByUser = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments({ userId }),
    Notification.countDocuments({ userId, isRead: false }),
  ]);
  return { notifications, total, unreadCount, page, limit };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    const err = new Error("Notification not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

module.exports = { createNotification, getNotificationsByUser, markAsRead, markAllAsRead };
