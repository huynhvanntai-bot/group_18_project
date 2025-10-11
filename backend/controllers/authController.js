// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// =============== ĐĂNG KÝ ===============
exports.signup = async (req, res) => {
  try {
    console.log("Nhận request đăng ký:", req.body);
    const { ten, email, password } = req.body;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({ ten, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký!" });
  }
};

// =============== ĐĂNG NHẬP ===============
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu!" });

    res.status(200).json({ message: "Đăng nhập thành công!", user });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};

// ========================================================
// =============== QUÊN MẬT KHẨU ===========================
// ========================================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại!" });

    // Tạo token reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expireTime = Date.now() + 10 * 60 * 1000; // 10 phút

    user.resetToken = resetToken;
    user.resetTokenExpire = expireTime;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    console.log("🔗 Link reset password:", resetLink);

    res.status(200).json({
      message: "Token reset đã được tạo. Kiểm tra console hoặc email.",
      resetLink,
    });
  } catch (error) {
    console.error("❌ Lỗi forgotPassword:", error);
    res.status(500).json({ message: "Lỗi server khi quên mật khẩu!" });
  }
};

// ========================================================
// =============== ĐẶT LẠI MẬT KHẨU ========================
// ========================================================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("❌ Lỗi resetPassword:", error);
    res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu!" });
  }
};
