import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Register.css";
import api from "../services/api";

export default function Register() {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Register payload:', { ten, email, password });
      const res = await api.post("/signup", { ten, email, password });
      console.log('Register response:', res && res.data);
      alert("✅ Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      // More detailed error logging for debugging
      console.error('Register error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        alert(`❌ Đăng ký thất bại: ${err.response.data?.message || err.response.status}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        alert('❌ Đăng ký thất bại: không nhận được phản hồi từ server');
      } else {
        alert('❌ Đăng ký thất bại: ' + err.message);
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          className="register-input"
          type="text"
          placeholder="Tên"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          required
        />
        <input
          className="register-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="register-input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="register-btn" type="submit">
          Đăng ký
        </button>
      </form>
      <p>
        Đã có tài khoản?{" "}
        <a className="register-link" href="/login">
          Đăng nhập ngay
        </a>
      </p>
    </div>
  );
}
