const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/role.middleware");
const { getDashboard } = require("../controllers/dashboard.controller");

router.get("/stats", authenticate, requireAdmin, getDashboard);

module.exports = router;
