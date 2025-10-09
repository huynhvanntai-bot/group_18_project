import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
  localStorage.setItem("token", data.token);
  alert("Đăng nhập thành công! Token: " + data.token);
  console.log("JWT Token:", data.token);
  // Chuyển hướng hoặc xử lý tiếp
      } else {
        if (data.message === "Email không tồn tại!") {
          alert("Email không tồn tại. Vui lòng kiểm tra lại!");
        } else if (data.message === "Sai mật khẩu!") {
          alert("Mật khẩu không đúng. Vui lòng thử lại!");
        } else {
          alert(data.message || "Đăng nhập thất bại!");
        }
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-btn" type="submit">Đăng nhập</button>
      </form>
      <p>
        Chưa có tài khoản? <Link className="login-link" to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
}

export default Login;
