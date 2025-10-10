// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  mssv: String,
  lop: String,
});

module.exports = mongoose.model("User", userSchema);
