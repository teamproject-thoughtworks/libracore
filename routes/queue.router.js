const express = require("express");
const router = express.Router();
const {
  queuePosition,
  queue,
}=require("../controllers/queue.controller")

// GET QUEUE POSITION
router.get("/queue/:bookId/:userId", queuePosition);

// 📋 Get Full Queue (Admin)
router.get("/:bookId", queue);

module.exports = router;