// SV1: Avatar Routes - huynhvantai
// Định nghĩa các API endpoints cho avatar upload

const express = require("express");
const router = express.Router();

// Import middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { 
  uploadAvatar, 
  handleUploadError, 
  validateAvatarFile 
} = require("../middleware/uploadAvatarMiddleware");

// Import controllers
const {
  uploadUserAvatar,
  getUserAvatar,
  deleteUserAvatar,
  getAnyUserAvatar
} = require("../controllers/avatarController");

// @route   POST /api/users/avatar
// @desc    Upload/Update user avatar
// @access  Private (JWT required)
router.post(
  "/",
  protect,
  uploadAvatar,
  handleUploadError,
  validateAvatarFile,
  uploadUserAvatar
);

// @route   GET /api/users/avatar
// @desc    Get current user's avatar info
// @access  Private (JWT required)
router.get(
  "/",
  protect,
  getUserAvatar
);

// @route   DELETE /api/users/avatar
// @desc    Delete current user's avatar
// @access  Private (JWT required)
router.delete(
  "/",
  protect,
  deleteUserAvatar
);

// @route   GET /api/users/:userId/avatar
// @desc    Get any user's avatar (Admin only)
// @access  Private (Admin only)
router.get(
  "/:userId",
  protect,
  adminOnly,
  getAnyUserAvatar
);

module.exports = router;