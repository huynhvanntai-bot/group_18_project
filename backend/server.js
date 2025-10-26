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
// Prefer FRONTEND_URL from environment; fall back to the known Vercel domains for safety.
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.FRONTEND_HOST || null;
const defaultOrigins = [
  'https://group-18-project.vercel.app',
  'https://group-18-project-git-main-huynhvantais-projects.vercel.app',
];

// Allow localhost during development so the local CRA dev server can talk to the deployed
// backend without CORS issues. In production we'll only allow the configured FRONTEND_URL
// or the Vercel domains above.
if (process.env.NODE_ENV !== 'production') {
  defaultOrigins.push('http://localhost:3000');
  defaultOrigins.push('http://127.0.0.1:3000');
}

const corsOrigin = FRONTEND_URL ? FRONTEND_URL : defaultOrigins;
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Log unhandled promise rejections to aid debugging in production
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
