import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  email: { type: String, required: true },
  mssv: { type: String },
  lop: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User; // ✅ Xuất default để import chuẩn
