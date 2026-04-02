const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} = require("../controllers/authController");

// 🔹 Register Route
router.post("/register", registerUser);

// 🔹 Login Route
router.post("/login", loginUser);

// 🔹 Profile Routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
