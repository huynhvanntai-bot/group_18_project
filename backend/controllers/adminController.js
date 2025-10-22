// Admin Controller - SV1: huynhvantai
// API quản lý users và thống kê hệ thống

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🆕 1. Lấy tất cả users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    // Build filter
    let filter = {};
    if (role && role !== "all") {
      filter.role = role;
    }
    if (search) {
      // match against both 'ten' and 'username' (some parts of the app use one or the other)
      filter.$or = [
        { ten: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách users:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách users",
      error: error.message
    });
  }
};

// 🆕 2. Tạo user mới (Admin only)
const createUser = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email và password là bắt buộc!"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email hoặc username đã tồn tại!"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    // Note: the User schema requires 'ten' (display name). Some front-end code sends 'username'.
    // Set both fields so validation passes and older code remains compatible.
    const newUser = new User({
      username,
      ten: username || "",
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Return user without password
    const userResponse = await User.findById(newUser._id).select("-password");

    res.status(201).json({
      success: true,
      message: "Tạo user thành công!",
      user: userResponse
    });
  } catch (error) {
    console.error("❌ Lỗi tạo user:", error);
    res.status(500).json({
      message: "Lỗi server khi tạo user",
      error: error.message
    });
  }
};

// 🆕 3. Cập nhật user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
  const { username, email, role, password } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user!"
      });
    }

    // Prepare update data
    const updateData = {};
    if (username) {
      updateData.username = username;
      updateData.ten = username; // keep 'ten' in sync with 'username'
    }
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    // Hash new password if provided
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Cập nhật user thành công!",
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật user:", error);
    res.status(500).json({
      message: "Lỗi server khi cập nhật user",
      error: error.message
    });
  }
};

// 🆕 4. Xóa user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user!"
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "Không thể xóa chính mình!"
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Xóa user thành công!",
      deletedUser: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Lỗi xóa user:", error);
    res.status(500).json({
      message: "Lỗi server khi xóa user",
      error: error.message
    });
  }
};

// 🆕 5. Thống kê hệ thống (Moderator & Admin)
const getSystemStats = async (req, res) => {
  try {
    // Count users by role
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Total users
    const totalUsers = await User.countDocuments();

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Format stats
    const roleStats = {
      admin: 0,
      moderator: 0,
      user: 0
    };

    userStats.forEach(stat => {
      roleStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        recentUsers,
        roleDistribution: roleStats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thống kê:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy thống kê",
      error: error.message
    });
  }
};

// 🆕 6. Lấy thông tin user theo ID (Moderator & Admin)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user!"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("❌ Lỗi lấy user:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy thông tin user",
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getSystemStats,
  getUserById
};