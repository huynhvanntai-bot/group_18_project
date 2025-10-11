// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  uploadAvatar,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
// 🟢 Admin quản lý user
router.get("/users", protect, adminOnly, getUsers);
router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// 🟢 Quên mật khẩu → gửi email reset
router.post("/forgot-password", forgotPassword);

// 🟢 Đặt lại mật khẩu → dùng token
router.post("/reset-password", resetPassword);

// 🟢 Upload avatar → yêu cầu đăng nhập
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
