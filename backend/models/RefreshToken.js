// backend/models/RefreshToken.js
const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB sẽ tự động xóa token hết hạn
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Lưu thông tin thiết bị/IP để bảo mật
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  }
});

// Index để tìm kiếm nhanh
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

// Static method để tạo refresh token mới
refreshTokenSchema.statics.createToken = async function(userId, deviceInfo) {
  const crypto = require("crypto");
  
  // Tạo token ngẫu nhiên
  const token = crypto.randomBytes(64).toString("hex");
  
  // Thời hạn 7 ngày
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  const refreshToken = new this({
    token,
    userId,
    expiresAt,
    deviceInfo
  });
  
  await refreshToken.save();
  return refreshToken;
};

// Instance method để revoke token
refreshTokenSchema.methods.revoke = async function() {
  this.isRevoked = true;
  await this.save();
};

// Static method để verify token
refreshTokenSchema.statics.verifyToken = async function(token) {
  const refreshToken = await this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).populate("userId");
  
  return refreshToken;
};

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);