const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  email: { type: String, required: true },
  mssv: { type: String },
  lop: { type: String },
});

module.exports = mongoose.model("User", userSchema);
