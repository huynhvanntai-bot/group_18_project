const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🟢 Middleware kiểm tra đăng nhập
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password"); // lưu user vào req
      
      if (!req.user) {
        return res.status(401).json({ 
          message: "Người dùng không tồn tại!",
          code: "USER_NOT_FOUND"
        });
      }
      
      next();
    } catch (error) {
      console.error("❌ Token không hợp lệ:", error);
      
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          message: "Access token đã hết hạn!",
          code: "TOKEN_EXPIRED"
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ 
          message: "Token không hợp lệ!",
          code: "INVALID_TOKEN"
        });
      }
      
      return res.status(401).json({ 
        message: "Token không hợp lệ!",
        code: "TOKEN_ERROR"
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      message: "Không có token, từ chối truy cập!",
      code: "NO_TOKEN"
    });
  }
};

// 🟢 Middleware chỉ cho phép Admin truy cập
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ Admin mới được truy cập!" });
  }
};
