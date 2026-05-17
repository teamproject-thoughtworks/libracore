const express = require("express");
const router = express.Router();
const { SignUp, Login, getUserById } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/signup", SignUp);
router.post("/login", Login);
router.get("/:id", authenticate, getUserById);

module.exports = router;
