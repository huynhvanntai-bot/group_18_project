// controllers/userController.js
const User = require("../models/User");

// -------------------
// 🧩 1. Đăng ký
// -------------------
const signup = async (req, res) => {
  res.status(501).json({ message: "Chưa triển khai signup ở userController.js" });
};

// -------------------
// 🧩 2. Đăng nhập
// -------------------
const login = async (req, res) => {
  res.status(501).json({ message: "Chưa triển khai login ở userController.js" });
};

// -------------------
// 🧩 3. Đăng xuất
// -------------------
const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công!" });
};

// -------------------
// 🧩 4. Lấy toàn bộ user
// -------------------
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể tải danh sách user." });
  }
};

// -------------------
// 🧩 5. Tạo user mới
// -------------------
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

// -------------------
// 🧩 6. Cập nhật user (bằng ID)
// -------------------
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

// -------------------
// 🧩 7. Xóa user
// -------------------
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

// -------------------
// 🆕 8. Xem thông tin cá nhân (GET /profile)
// -------------------
const getProfile = async (req, res) => {
  try {
    const email = req.query.email; // Lấy email từ query (hoặc từ token nếu có)
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json(user);
  } catch (err) {
    console.error("Lỗi khi lấy profile:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin." });
  }
};

// -------------------
// 🆕 9. Cập nhật thông tin cá nhân (PUT /profile)
// -------------------
const updateProfile = async (req, res) => {
  try {
    const { email, ten, mssv, lop } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { ten, mssv, lop },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    console.error("Lỗi khi cập nhật profile:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật." });
  }
};

// -------------------
// ✅ Xuất tất cả hàm ra cuối cùng
// -------------------
module.exports = {
  signup,
  login,
  logout,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,      // thêm mới
  updateProfile,   // thêm mới
};
