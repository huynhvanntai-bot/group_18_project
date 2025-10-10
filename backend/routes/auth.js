const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// ------------------- AUTH -------------------
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ------------------- PROFILE -------------------
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
