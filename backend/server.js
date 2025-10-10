// backend/server.js
require("dotenv").config();
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);
console.log("🌐 MONGO_URI:", process.env.MONGO_URI);


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB Atlas thành công");
    app.listen(PORT, () => console.log(`🚀 Server đang chạy ở cổng ${PORT}`));
  })
  .catch((err) => console.log("❌ Lỗi kết nối MongoDB:", err));
