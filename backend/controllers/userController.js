// controllers/userController.js
const User = require("../models/User");

// Đăng ký
const signup = async (req, res) => {
  res.status(501).json({ message: "Chưa triển khai signup ở userController.js" });
};

// Đăng nhập
const login = async (req, res) => {
  res.status(501).json({ message: "Chưa triển khai login ở userController.js" });
};

// Đăng xuất
const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công!" });
};

// Lấy toàn bộ user
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể tải danh sách user." });
  }
};

// Tạo user mới
const createUser = async (req, res) => {
  try {
    const { ten, email, mssv, lop } = req.body;
    if (!ten || !email) {
      return res.status(400).json({ message: "Thiếu tên hoặc email." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    const newUser = new User({ ten, email, mssv, lop });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm người dùng." });
  }
};

// Cập nhật user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy user." });
    res.json(updatedUser);
  } catch {
    res.status(500).json({ message: "Lỗi server khi cập nhật user." });
  }
};

// Xóa user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy user." });
    res.json({ message: "Đã xóa user thành công." });
  } catch {
    res.status(500).json({ message: "Lỗi server khi xóa user." });
  }
};

// ✅ Xuất tất cả hàm ở cuối cùng
module.exports = {
  signup,
  login,
  logout,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
