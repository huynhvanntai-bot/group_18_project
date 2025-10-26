const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require('../middleware/rateLimit');
const logActivity = require('../middleware/logActivity');

// ------------------- AUTH -------------------
router.post("/signup", signup);
// attach logActivity and rateLimit to login route
router.post("/login", logActivity, rateLimit(), login);
router.post("/refresh", refreshAccessToken); // ✅ Thêm route refresh token
router.post("/logout", logout);

// ------------------- PROFILE -------------------
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
