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
      next();
    } catch (error) {
      console.error("❌ Token không hợp lệ:", error);
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Không có token, từ chối truy cập!" });
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
