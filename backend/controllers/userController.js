// controllers/userController.js
const User = require("../models/User");

// Lấy toàn bộ user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách user:", err);
    res.status(500).json({ message: "Không thể tải danh sách user." });
  }
};

// Tạo user mới
exports.createUser = async (req, res) => {
  try {
    console.log("Dữ liệu nhận được:", req.body);
    const { ten, email, mssv, lop } = req.body;

    // Kiểm tra trường bắt buộc
    if (!ten || !email) {
      return res.status(400).json({ message: "Thiếu tên hoặc email." });
    }

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    // Tạo mới user
    const newUser = new User({ ten, email, mssv, lop });
    const savedUser = await newUser.save();
    console.log("User mới được thêm:", savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Lỗi khi thêm user:", err);
    res.status(500).json({ message: "Lỗi server khi thêm người dùng." });
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Lỗi khi cập nhật user:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật user." });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    res.json({ message: "Đã xóa user thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa user:", err);
    res.status(500).json({ message: "Lỗi server khi xóa user." });
  }
};
