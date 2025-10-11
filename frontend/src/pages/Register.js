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
      const res = await api.post("/signup", { ten, email, password });
      alert("✅ Đăng ký thành công!");
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("❌ Đăng ký thất bại, vui lòng thử lại!");
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
