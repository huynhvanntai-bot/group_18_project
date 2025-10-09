const express = require("express");
const router = express.Router();
const { signup, login, logout, getProfile, updateProfile } = require("../controllers/userController");

// Định nghĩa các API
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;
