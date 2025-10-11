const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🟢 Lấy thông tin cá nhân
// GET /api/profile?email=abc@gmail.com
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Cập nhật thông tin cá nhân
// PUT /api/profile
router.put("/", async (req, res) => {
  try {
    const { email, ten, mssv, lop } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user để cập nhật" });
    }

    // Cập nhật thông tin
    if (ten) user.ten = ten;
    if (mssv) user.mssv = mssv;
    if (lop) user.lop = lop;

    await user.save();

    res.json({ message: "Cập nhật thông tin thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
