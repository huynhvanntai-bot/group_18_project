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
  resetPasswordBody,
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
// Also accept token in JSON body { token, newPassword } for clients that prefer body
router.post("/reset-password", resetPasswordBody);

// 🟢 Upload avatar → yêu cầu đăng nhập
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

// -----------------------
// Dev helper (ONLY in development): get reset token for an email
// Usage: GET /api/dev/reset-token?email=you@example.com
if (process.env.NODE_ENV === 'development') {
  router.get('/dev/reset-token', async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ success: false, message: 'email query required' });
    const User = require('../models/User');
    try {
      const user = await User.findOne({ email }).select('resetToken resetTokenExpire');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, resetToken: user.resetToken, resetTokenExpire: user.resetTokenExpire });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });
}

module.exports = router;
