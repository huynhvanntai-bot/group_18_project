// Admin Routes - SV1: huynhvantai
// Routes cho quản lý users và thống kê hệ thống

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getSystemStats,
  getUserById
} = require("../controllers/adminController");

const { protect, checkRole, moderatorOrAdmin } = require("../middleware/authMiddleware");

// =================== USER MANAGEMENT (ADMIN ONLY) ===================

// GET /api/admin/users - Lấy tất cả users với pagination
router.get("/users", protect, checkRole("admin"), getAllUsers);

// POST /api/admin/users - Tạo user mới
router.post("/users", protect, checkRole("admin"), createUser);

// GET /api/admin/users/:id - Lấy thông tin user theo ID
router.get("/users/:id", protect, moderatorOrAdmin, getUserById);

// PUT /api/admin/users/:id - Cập nhật user
router.put("/users/:id", protect, checkRole("admin"), updateUser);

// DELETE /api/admin/users/:id - Xóa user
router.delete("/users/:id", protect, checkRole("admin"), deleteUser);

// =================== SYSTEM STATISTICS (MODERATOR & ADMIN) ===================

// GET /api/admin/stats - Thống kê hệ thống
router.get("/stats", protect, moderatorOrAdmin, getSystemStats);

// =================== ROLE-BASED TEST ENDPOINTS ===================

// GET /api/admin/test/admin - Test endpoint chỉ admin
router.get("/test/admin", protect, checkRole("admin"), (req, res) => {
  res.json({
    success: true,
    message: "🎉 Chúc mừng! Bạn có quyền Admin!",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    },
    timestamp: new Date()
  });
});

// GET /api/admin/test/moderator - Test endpoint moderator hoặc admin
router.get("/test/moderator", protect, moderatorOrAdmin, (req, res) => {
  res.json({
    success: true,
    message: "✅ Bạn có quyền Moderator hoặc Admin!",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    },
    timestamp: new Date()
  });
});

// GET /api/admin/test/user - Test endpoint cho tất cả users đã login
router.get("/test/user", protect, (req, res) => {
  res.json({
    success: true,
    message: "👤 Endpoint này dành cho tất cả users đã đăng nhập!",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    },
    timestamp: new Date()
  });
});

module.exports = router;