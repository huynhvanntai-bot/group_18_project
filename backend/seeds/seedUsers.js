// backend/seeds/seedUsers.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    
    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);
    
    // Dữ liệu mẫu với các role khác nhau
    const sampleUsers = [
      {
        ten: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        mssv: "ADM001",
        lop: "Admin"
      },
      {
        ten: "Moderator User", 
        email: "moderator@example.com",
        password: hashedPassword,
        role: "moderator",
        mssv: "MOD001",
        lop: "Moderator"
      },
      {
        ten: "Regular User",
        email: "user@example.com", 
        password: hashedPassword,
        role: "user",
        mssv: "USR001",
        lop: "User"
      },
      {
        ten: "Nguyen Quoc Vinh",
        email: "nguyenquocvinh@example.com",
        password: hashedPassword,
        role: "admin",
        mssv: "SV001",
        lop: "CNTT"
      },
      {
        ten: "Huynh Van Tai", 
        email: "huynhvantai@example.com",
        password: hashedPassword,
        role: "moderator",
        mssv: "SV002",
        lop: "CNTT"
      },
      {
        ten: "Pham Quang Huy",
        email: "phamquanghuy1661@example.com",
        password: hashedPassword,
        role: "user",
        mssv: "SV003",
        lop: "CNTT"
      }
    ];
    
    // Thêm dữ liệu mẫu
    await User.insertMany(sampleUsers);
    
    console.log("✅ Đã thêm dữ liệu mẫu users với các role:");
    console.log("👑 Admin: admin@example.com, nguyenquocvinh@example.com");
    console.log("🛡️ Moderator: moderator@example.com, huynhvantai@example.com"); 
    console.log("👤 User: user@example.com, phamquanghuy1661@example.com");
    console.log("🔑 Password cho tất cả: 123456");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed users:", error);
    process.exit(1);
  }
};

seedUsers();