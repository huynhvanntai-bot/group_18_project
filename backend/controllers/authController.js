// backend/controllers/authController.js - Updated by SV1: huynhvantai
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendPasswordResetEmail, sendPasswordResetConfirmationEmail } = require("../services/emailService");

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
// =============== QUÊN MẬT KHẨU - SV1: huynhvantai ======
// ========================================================
exports.forgotPassword = async (req, res) => {
  try {
    console.log("🔐 SV1: Processing forgot password request - huynhvantai");
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email là bắt buộc!" 
      });
    }

    // Tìm user trong database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Email không tồn tại trong hệ thống!" 
      });
    }

    console.log(`📧 Found user: ${user.ten} (${user.email})`);

    // Tạo secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expireTime = Date.now() + 60 * 60 * 1000; // 1 giờ (3600000ms)

    // Lưu token vào database
    user.resetToken = resetToken;
    user.resetTokenExpire = expireTime;
    await user.save();

    console.log(`🔑 Generated reset token: ${resetToken}`);
    console.log(`⏰ Token expires at: ${new Date(expireTime).toLocaleString('vi-VN')}`);

    // Gửi email thật với SV3's email service
    try {
      const emailResult = await sendPasswordResetEmail(email, resetToken, user.ten);
      
      if (emailResult.success) {
        console.log("✅ Password reset email sent successfully!");
        console.log("📧 Message ID:", emailResult.messageId);
        // In development include the token in the response to make testing easier
        const respData = {
          email: email,
          tokenExpires: new Date(expireTime).toISOString(),
          messageId: emailResult.messageId
        };
        if (process.env.NODE_ENV === 'development') {
          respData.token = resetToken; // only expose in dev
        }

        res.status(200).json({
          success: true,
          message: "Email reset password đã được gửi! Kiểm tra hộp thư của bạn.",
          data: respData
        });

      } else {
        throw new Error("Email service returned failure");
      }

    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError.message);
      
      // Xóa token nếu gửi email thất bại
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Không thể gửi email reset password. Vui lòng thử lại sau.",
        error: emailError.message
      });
    }

  } catch (error) {
    console.error("❌ Lỗi forgotPassword:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi xử lý quên mật khẩu!",
      error: error.message 
    });
  }
};

// ========================================================
// =============== ĐẶT LẠI MẬT KHẨU - SV1: huynhvantai ===
// ========================================================
exports.resetPassword = async (req, res) => {
  try {
    console.log("🔄 SV1: Processing reset password request - huynhvantai");
    const { token } = req.params;
    const { newPassword } = req.body;

    // Debug: log incoming token preview
    try {
      const preview = token && (token.length > 20 ? token.slice(0, 12) + '...' + token.slice(-4) : token);
      console.log(`[reset] incoming token param preview: ${preview} (len=${token ? token.length : 0})`);
    } catch (dbg) {
      console.warn('[reset] preview error', dbg && dbg.message);
    }

    // Validate input
    if (!newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới là bắt buộc!" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự!"
      });
    }

    console.log(`🔍 Looking for user with token (raw): ${token}`);

    // Trim token to avoid whitespace mismatches
    const tokenToFind = token ? String(token).trim() : token;
    console.log(`[reset] tokenToFind='${tokenToFind}'`);

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetToken: tokenToFind,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (user) {
      console.log(`[reset] Found user=${user.email} with resetToken length=${user.resetToken ? user.resetToken.length : 0}, expires=${user.resetTokenExpire}`);
    }

    if (!user) {
      console.log("❌ Invalid or expired token");
      return res.status(400).json({ 
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn! Vui lòng yêu cầu reset lại." 
      });
    }

    console.log(`✅ Valid token found for user: ${user.ten} (${user.email})`);

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật password và xóa reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    console.log("🔐 Password updated successfully");

    // Gửi email xác nhận reset thành công
    try {
      await sendPasswordResetConfirmationEmail(user.email, user.ten);
      console.log("📧 Confirmation email sent successfully");
    } catch (emailError) {
      console.error("⚠️ Failed to send confirmation email:", emailError.message);
      // Không fail request nếu confirmation email lỗi
    }

    res.status(200).json({ 
      success: true,
      message: "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.",
      data: {
        email: user.email,
        resetTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Lỗi resetPassword:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi đặt lại mật khẩu!",
      error: error.message 
    });
  }
};

// Wrapper to accept token in request body { token, newPassword }
exports.resetPasswordBody = async (req, res) => {
  try {
    console.log("🔄 SV1: Processing reset password request (body version) - huynhvantai");
    const { token, newPassword } = req.body;

    // Validate input
    if (!newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới là bắt buộc!" 
      });
    }

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Reset token là bắt buộc!" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự!"
      });
    }

    console.log(`🔍 Looking for user with token: ${token.substring(0, 10)}...`);

    // Tìm user với token hợp lệ và chưa hết hạn
    const User = require("../models/User");
    const bcrypt = require("bcryptjs");

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      console.log("❌ Invalid or expired token");
      return res.status(400).json({ 
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn! Vui lòng yêu cầu reset lại." 
      });
    }

    console.log(`✅ Valid token found for user: ${user.ten} (${user.email})`);

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật password và xóa reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    console.log("🔐 Password updated successfully");

    res.status(200).json({ 
      success: true,
      message: "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.",
      data: {
        email: user.email,
        resetTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Lỗi resetPasswordBody:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi đặt lại mật khẩu!",
      error: error.message 
    });
  }
};

// DEV helper: return stored reset token for an email (ONLY in development)
exports.devGetResetToken = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Missing email query' });

    const user = await User.findOne({ email }).select('resetToken resetTokenExpire email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, data: { email: user.email, resetToken: user.resetToken, resetTokenExpire: user.resetTokenExpire } });
  } catch (error) {
    console.error('DEV getResetToken error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
