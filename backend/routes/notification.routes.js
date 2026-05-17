const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { getNotification, markRead, markAllRead } = require("../controllers/notification.controller");

router.get("/notifications/:userId", authenticate, getNotification);
router.patch("/notifications/:id/read", authenticate, markRead);
router.patch("/notifications/:userId/read-all", authenticate, markAllRead);

module.exports = router;
