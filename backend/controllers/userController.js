const User = require("../models/User");

// Lấy toàn bộ user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { ten, email, mssv, lop } = req.body;

    if (!ten || !email) {
      return res.status(400).json({ message: "Thiếu tên hoặc email" });
    }

    const newUser = new User({ ten, email, mssv, lop });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Đã xóa user thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
