// controllers/userController.js
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");

// -------------------
// 🧩 1. Đăng ký
// -------------------
const signup = async (req, res) => {
  try {
    const { ten, email, password, role } = req.body;

    // Kiểm tra đủ dữ liệu
    if (!ten || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập thong tin!" });
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
// 🔧 Helper function để tạo access token
// -------------------
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Access token ngắn hạn 15 phút
  );
};

// -------------------
// 🧩 2. Đăng nhập
// -------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // RATE LIMIT + LOGGING: SV1 (huynhvantai)
    // If rateLimit middleware attached, check if blocked by middleware earlier (it returns 429)

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      // record failure and log
      if (req.rateLimit && typeof req.rateLimit.recordFailure === 'function') req.rateLimit.recordFailure();
      if (req.logActivity) await req.logActivity(null, 'login_failed_no_user', { email });
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (req.rateLimit && typeof req.rateLimit.recordFailure === 'function') req.rateLimit.recordFailure();
      if (req.logActivity) await req.logActivity(user._id, 'login_failed', { email });
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // Tạo access token (ngắn hạn)
    const accessToken = generateAccessToken(user._id, user.role);

    // Lấy thông tin thiết bị
    const deviceInfo = {
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip || req.connection.remoteAddress || ""
    };

    // Tạo refresh token (dài hạn)
    const refreshToken = await RefreshToken.createToken(user._id, deviceInfo);

    // on successful login reset rate limiter and log activity
    if (req.rateLimit && typeof req.rateLimit.reset === 'function') req.rateLimit.reset();
    if (req.logActivity) await req.logActivity(user._id, 'login_success', { ip: req.ip });

    res.json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: 900, // 15 phút tính bằng giây
      user: {
        id: user._id,
        ten: user.ten,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("💥 Lỗi chi tiết khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};

// -------------------
// 🧩 2.5. Refresh Token
// -------------------
const refreshAccessToken = async (req, res) => {
  try {
    // Debug: log where the refresh token appears (masked) to help troubleshoot Postman 401
    try {
      const authHeader = req.headers && req.headers.authorization ? req.headers.authorization : null;
      const authPreview = authHeader ? (authHeader.length > 30 ? authHeader.slice(0, 30) + '...' : authHeader) : null;
      const bodyHas = !!(req.body && req.body.refreshToken);
      const bodyPreview = bodyHas ? (String(req.body.refreshToken).slice(0, 30) + '...') : null;
      const queryHas = !!(req.query && req.query.refreshToken);
      const xRefreshHas = !!(req.headers && req.headers['x-refresh-token']);
      console.log('[DEBUG] refreshAccessToken called - authHeader:', !!authHeader, 'authPreview:', authPreview, 'bodyHas:', bodyHas, 'bodyPreview:', bodyPreview, 'queryHas:', queryHas, 'xRefreshHas:', xRefreshHas);
    } catch (dbgErr) {
      console.log('[DEBUG] refreshAccessToken logging error:', dbgErr && dbgErr.message);
    }

    // Accept refresh token from multiple possible locations to support Postman 'Bearer' field
    let refreshToken = null;

    // 1) From JSON body { refreshToken }
    if (req.body && req.body.refreshToken) refreshToken = req.body.refreshToken;

    // 2) From Authorization: Bearer <token>
    if (!refreshToken && req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) refreshToken = parts[1];
    }

    // 3) From x-refresh-token header (custom)
    if (!refreshToken && req.headers && req.headers['x-refresh-token']) {
      refreshToken = req.headers['x-refresh-token'];
    }

    // 4) From query string ?refreshToken=...
    if (!refreshToken && req.query && req.query.refreshToken) {
      refreshToken = req.query.refreshToken;
    }

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token là bắt buộc!" });
    }

    // Verify refresh token
    const tokenDoc = await RefreshToken.verifyToken(refreshToken);
    if (!tokenDoc) {
      return res.status(401).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn!" });
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken(tokenDoc.userId._id, tokenDoc.userId.role);

    // Tùy chọn: Tạo refresh token mới (rotation)
    const deviceInfo = {
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || req.connection?.remoteAddress || ''
    };

    // Revoke token cũ và tạo token mới để bảo mật tốt hơn
    await tokenDoc.revoke();
    const newRefreshToken = await RefreshToken.createToken(tokenDoc.userId._id, deviceInfo);

    res.json({
      message: 'Refresh token thành công!',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
      expiresIn: 900,
      user: {
        id: tokenDoc.userId._id,
        ten: tokenDoc.userId.ten,
        email: tokenDoc.userId.email,
        role: tokenDoc.userId.role
      }
    });
  } catch (error) {
    console.error('💥 Lỗi khi refresh token:', error);
    res.status(500).json({ message: 'Lỗi server khi refresh token!' });
  }
};

// -------------------
// 🧩 3. Đăng xuất
// -------------------
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Tìm và revoke refresh token
      const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
      if (tokenDoc && !tokenDoc.isRevoked) {
        await tokenDoc.revoke();
      }
    }

    res.json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.json({ message: "Đăng xuất thành công!" }); // Vẫn trả về thành công
  }
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
    // Lấy user từ middleware protect
    const user = req.user; // req.user đã được set bởi protect middleware
    
    if (!user) {
      return res.status(404).json({ 
        message: "Không tìm thấy người dùng",
        code: "USER_NOT_FOUND"
      });
    }

    // Trả về thông tin user (đã loại bỏ password)
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Lỗi khi lấy profile:", err);
    res.status(500).json({ 
      message: "Lỗi server khi lấy thông tin.",
      error: err.message 
    });
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
// ------------------------------
// 🔹 QUÊN MẬT KHẨU (FORGOT PASSWORD)
// ------------------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    // Tạo reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Lưu token & thời hạn vào user
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    // Giả lập gửi mail → chỉ log ra console
    console.log("=====================================");
    console.log(`🔹 Fake mail gửi đến: ${email}`);
    console.log(`🔹 Token đặt lại mật khẩu: ${resetToken}`);
    console.log("=====================================");

    return res.status(200).json({
      message: "Reset token created (email not configured)",
      resetToken,
    });
  } catch (error) {
    console.error("❌ Lỗi forgotPassword:", error);
    return res.status(500).json({ message: "Lỗi server khi tạo token!" });
  }
};

// ------------------------------
// 🔹 ĐẶT LẠI MẬT KHẨU (RESET PASSWORD)
// ------------------------------
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới!" });
    }

    // Tìm user có token hợp lệ và chưa hết hạn
    const user = await User.findOne({
  resetToken: token.trim(),
  resetTokenExpire: { $gt: Date.now() },
});

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // Cập nhật mật khẩu mới
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error("❌ Lỗi resetPassword:", error);
    return res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu!" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn ảnh để upload!" });
    }

    // ✅ multer-storage-cloudinary tự thêm các trường sau:
    // req.file.path → URL ảnh trên Cloudinary
    // req.file.filename → public_id của ảnh
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    return res.status(200).json({
      message: "avarta thành công",
      imageUrl, // 🔥 trả về URL để frontend hiển thị
      publicId,
    });
  } catch (error) {
    console.error("Lỗi upload avatar:", error);
    return res.status(500).json({ message: "Lỗi server khi upload ảnh!" });
  }
};

// -------------------
// ✅ Xuất tất cả hàm ra cuối cùng
// -------------------
module.exports = {
  signup,
  login,
  refreshAccessToken, // thêm mới
  logout,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,      // thêm mới
  updateProfile,   // thêm mới
  forgotPassword,  // thêm mới
  resetPassword,   // thêm mới
  uploadAvatar     // thêm mới
};
