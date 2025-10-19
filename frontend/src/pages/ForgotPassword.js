import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🟢 Thêm dòng này
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 🟢 Khai báo hook điều hướng

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("❌ Vui lòng nhập email hợp lệ!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Vui lòng kiểm tra email của bạn để lấy token đặt lại mật khẩu!");

        // 🟢 Sau khi gửi email thành công → chuyển qua trang nhập token
        setTimeout(() => navigate("/reset-password"), 1500);
      } else {
        setMessage(data.message || "❌ Gửi yêu cầu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage("❌ Lỗi kết nối máy chủ!");
    }
  };

  return (
    <div className="forgot-container">
      <h2>Quên mật khẩu</h2>
      <form className="forgot-form" onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="forgot-input"
        />
        <button type="submit" className="forgot-btn">
          Gửi yêu cầu
        </button>
      </form>

      {message && <p className="forgot-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
