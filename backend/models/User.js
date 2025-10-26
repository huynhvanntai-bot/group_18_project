// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  username: { type: String }, // Alias for ten field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin", "moderator"], 
    default: "user" 
  },
  mssv: String,
  lop: String,
  // 🆕 SV3: Avatar fields - nguyenquocvinh
  avatar: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    uploadedAt: { type: Date }
  },
  // 🔹 Thêm 2 trường này để reset mật khẩu
  resetToken: { type: String },
  resetTokenExpire: { type: Date },
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model("User", userSchema);
