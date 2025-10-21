// backend/routes/userRoutes.js - Updated by SV1: huynhvantai
const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} = require("../controllers/userController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController"); // SV1: Import từ authController
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
// 🟢 Admin quản lý user
router.get("/users", protect, adminOnly, getUsers);
router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// 🟢 Quên mật khẩu → gửi email reset (SV1: huynhvantai)
router.post("/forgot-password", forgotPassword);

// 🟢 Đặt lại mật khẩu → dùng token từ URL params (SV1: huynhvantai)
router.post("/reset-password/:token", resetPassword);

// 🟢 Upload avatar → yêu cầu đăng nhập
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
