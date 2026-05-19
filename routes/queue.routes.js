const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/role.middleware");
const { queuePosition, getFullQueue, removeFromQueue } = require("../controllers/queue.controller");

router.get("/position/:bookId/:userId", authenticate, queuePosition);
router.get("/:bookId", authenticate, requireAdmin, getFullQueue);
router.delete("/:bookId/:userId", authenticate, removeFromQueue);

module.exports = router;
