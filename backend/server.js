import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Dùng route /api/users
app.use("/api/users", userRoutes);

// 🔹 Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.log("❌ Lỗi MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
