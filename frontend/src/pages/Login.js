import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import tokenService from "../services/tokenService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Sử dụng TokenService
      const data = await tokenService.login(email, password);
      
      alert("Đăng nhập thành công!");
      console.log("✅ Tokens đã được lưu:", {
        accessToken: data.accessToken.substring(0, 30) + "...",
        refreshToken: data.refreshToken.substring(0, 30) + "...",
        user: data.user
      });

      // ✅ Chuyển hướng sang trang admin
      navigate("/AdminPage");
      
    } catch (error) {
      // ✅ Xử lý lỗi từ TokenService
      if (error.message === "Email không tồn tại!") {
        alert("❌ Email không tồn tại. Vui lòng kiểm tra lại!");
      } else if (error.message === "Sai mật khẩu!") {
        alert("❌ Mật khẩu không đúng. Vui lòng thử lại!");
      } else {
        alert("⚠️ " + error.message);
      }
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
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
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Link to="/forgot-password" className="login-link">
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      <p>
        Chưa có tài khoản?{" "}
        <Link className="login-link" to="/register">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default Login;
