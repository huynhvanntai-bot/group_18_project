// SV1: Upload Avatar Middleware - huynhvantai
// Middleware xử lý upload ảnh với Multer và validate file

const multer = require("multer");
const path = require("path");

// Configure multer with memory storage (không lưu file local)
const storage = multer.memoryStorage();

// File filter - chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  // Kiểm tra file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file ảnh (JPEG, JPG, PNG, GIF, WEBP)!"), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Chỉ 1 file
  },
  fileFilter: fileFilter
});

// Middleware for single avatar upload
const uploadAvatar = upload.single("avatar");

// Error handling middleware cho multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File quá lớn! Vui lòng chọn file nhỏ hơn 5MB."
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được upload 1 file!"
      });
    }
  }
  
  if (error.message.includes("Chỉ cho phép upload file ảnh")) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// Middleware validate avatar file exists
const validateAvatarFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn file ảnh để upload!"
    });
  }

  // Validate buffer
  if (!req.file.buffer || req.file.buffer.length === 0) {
    return res.status(400).json({
      success: false,
      message: "File ảnh không hợp lệ!"
    });
  }

  next();
};

module.exports = {
  uploadAvatar,
  handleUploadError,
  validateAvatarFile
};