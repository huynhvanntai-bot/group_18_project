import React, { useState } from "react";
import "./ResetPassword.css";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Đặt lại mật khẩu thành công! Hãy quay lại trang đăng nhập.");
        setToken("");
        setPassword("");
      } else {
        setMessage(data.message || "❌ Token không hợp lệ hoặc đã hết hạn!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi kết nối máy chủ!");
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleResetPassword}>
        <h2>Đặt lại mật khẩu</h2>
        <input
          type="text"
          placeholder="Nhập token được gửi đến email"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="reset-input"
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="reset-input"
        />
        <button type="submit" className="reset-btn">
          Cập nhật mật khẩu
        </button>
        {message && <p className="reset-message">{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
