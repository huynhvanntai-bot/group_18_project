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
        ten: "Admin 1",
        email: "admin1@gmail.com", // 🔥 Email bạn quen thuộc
        password: hashedPassword,
        role: "admin",
        mssv: "220656",
        lop: "DH22TIN04"
      },
      {
        ten: "Super Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        mssv: "****",
        lop: "DH22TIN04"
      },
      {
        ten: "Moderator User", 
        email: "moderator@gmail.com",
        password: hashedPassword,
        role: "moderator",
        mssv: "****",
        lop: "DH22TIN04"
      },
      {
        ten: "Regular User",
        email: "user@gmail.com", 
        password: hashedPassword,
        role: "user",
        mssv: "****",
        lop: "DH22TIN04"
      },
      {
        ten: "Nguyen Quoc Vinh",
        email: "nguyenquocvinh@gmail.com",
        password: hashedPassword,
        role: "admin",
        mssv: "223424",
        lop: "DH22TIN04"
      },
      {
        ten: "Huynh Van Tai", 
        email: "huynhvantai@gmail.com",
        password: hashedPassword,
        role: "moderator",
        mssv: "220656",
        lop: "DH22TIN04"
      },
      {
        ten: "Pham Quang Huy",
        email: "phamquanghuy1661@gmail.com",
        password: hashedPassword,
        role: "user",
        mssv: "2110061",
        lop: "DH22TIN04"
      }
    ];
    
    // Thêm dữ liệu mẫu
    await User.insertMany(sampleUsers);
    
    console.log("✅ Đã thêm dữ liệu mẫu users với các role:");
    console.log("👑 Admin: admin1@gmail.com, admin@gmail.com, nguyenquocvinh@gmail.com");
    console.log("🛡️ Moderator: moderator@gmail.com, huynhvantai@gmail.com"); 
    console.log("👤 User: user@gmail.com, phamquanghuy1661@gmail.com");
    console.log("🔑 Password cho tất cả: 123456");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed users:", error);
    process.exit(1);
  }
};

seedUsers();