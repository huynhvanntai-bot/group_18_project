// backend/server.js
require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const logsRoutes = require("./routes/logs");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/adminRoutes"); // 🆕 SV1: Admin routes
const avatarRoutes = require("./routes/avatarRoutes"); // 🆕 SV1: Avatar routes

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Thêm mới – route test để kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("🔥 Backend server đang hoạt động!");
});

// Mount routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes); // 🆕 SV1: Admin API routes
app.use("/api/users/avatar", avatarRoutes); // 🆕 SV1: Avatar API routes

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB Atlas thành công");
    app.listen(PORT, () => console.log(`🚀 Server đang chạy ở cổng ${PORT}`));
  })
  .catch((err) => console.log("❌ Lỗi kết nối MongoDB:", err));
