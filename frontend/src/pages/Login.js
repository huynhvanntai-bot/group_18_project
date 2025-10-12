import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Lưu token vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email); // nếu bạn muốn lưu email luôn

        alert("Đăng nhập thành công!");

        // ✅ Chuyển hướng sang trang admin
        navigate("/AdminPage");
      } else {
        // ✅ Xử lý lỗi rõ ràng
        if (data.message === "Email không tồn tại!") {
          alert("❌ Email không tồn tại. Vui lòng kiểm tra lại!");
        } else if (data.message === "Sai mật khẩu!") {
          alert("❌ Mật khẩu không đúng. Vui lòng thử lại!");
        } else {
          alert(data.message || "Đăng nhập thất bại!");
        }
      }
    } catch (err) {
      alert("⚠️ Lỗi kết nối server! Vui lòng kiểm tra backend.");
      console.error("Login Error:", err);
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
