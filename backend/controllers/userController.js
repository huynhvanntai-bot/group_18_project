// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------------------
// 🧩 1. Đăng ký
// -------------------
const signup = async (req, res) => {
  try {
    const { ten, email, password, role } = req.body;

    // Kiểm tra đủ dữ liệu
    if (!ten || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      ten,
      email,
      password: hashedPassword,
      role: role || "user", // mặc định user
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký!" });
  }
};
// -------------------
// 🧩 2. Đăng nhập
// -------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        ten: user.ten,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("💥 Lỗi chi tiết khi đăng nhập:", error); // ⚠️ Thêm dòng này
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
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
    if (req.user?.role !== "admin") {
  return res.status(403).json({ message: "Chỉ Admin mới xem được danh sách user" });
}
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

    const newUser = new User({ ten, email, mssv, lop, role: req.body.role || "user" });
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
