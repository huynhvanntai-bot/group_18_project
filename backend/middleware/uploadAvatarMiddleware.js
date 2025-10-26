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

// Middleware for avatar upload
// Accept both correct key 'avatar' and a common misspelling 'avarta' to be forgiving for clients/tests
const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'avarta', maxCount: 1 }
]);

// Wrapper to normalize req.file for downstream handlers (controllers expect req.file)
const uploadAvatar = (req, res, next) => {
  uploadFields(req, res, function (err) {
    if (err) return next(err);

    // If multer populated files under req.files, normalize to req.file so controllers work unchanged
    if (!req.file && req.files) {
      if (req.files.avatar && req.files.avatar.length > 0) {
        req.file = req.files.avatar[0];
      } else if (req.files.avarta && req.files.avarta.length > 0) {
        // accept misspelled field
        req.file = req.files.avarta[0];
      }
    }

    next();
  });
};

// Error handling middleware cho multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    // File too large
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File quá lớn! Vui lòng chọn file nhỏ hơn 5MB."
      });
    }
    // Too many files
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được upload 1 file!"
      });
    }
    // Unexpected field (wrong form key)
    if (error.code === 'LIMIT_UNEXPECTED_FILE' || (error.message && error.message.includes('Unexpected field'))) {
      return res.status(400).json({
        success: false,
        message: 'Tên field không hợp lệ. Vui lòng dùng key form-data là "avatar" (type=file).'
      });
    }
  }

  if (error && error.message && error.message.includes("Chỉ cho phép upload file ảnh")) {
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