const express = require("express");
const router = express.Router();
const {
    getNotification,
}=require("../controllers/notification.controller");

// GET NOTIFICATIONS
router.get("/notifications/:userId", getNotification);

module.exports = router;