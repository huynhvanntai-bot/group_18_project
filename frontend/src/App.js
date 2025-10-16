// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import Register from "./pages/Register";
import "./App.css";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";   // 👈 thêm
import ResetPassword from "./pages/ResetPassword";     // 👈 thêm
import UploadAvatar from  "./pages/UploadAvatar";
import TokenTestPage from "./pages/TokenTestPage";     // 👈 thêm SV2
import tokenService from "./services/tokenService";

function App() {
  const handleLogout = async () => {
    try {
      await tokenService.logout();
      alert("Đăng xuất thành công!");
      // Có thể redirect về trang chủ
      window.location.href = "/";
    } catch (err) {
      alert("Lỗi khi đăng xuất!");
      console.error("Logout error:", err);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav style={{ padding: "20px", background: "#f5f5f5" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Trang chủ</Link>
          <Link to="/login" style={{ marginRight: "15px" }}>Đăng nhập</Link>
          <Link to="/register" style={{ marginRight: "15px" }}>Đăng ký</Link>
          <Link to="/profile" style={{ marginRight: "15px" }}>Profile</Link>
          <Link to="/AdminPage" style={{ marginRight: "15px" }}>Admin</Link>
          <Link to="/token-test" style={{ marginRight: "15px" }}>🔧 Token Test</Link>
          <button onClick={handleLogout} style={{ marginLeft: "15px" }}>Đăng xuất</button>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/token-test" element={<TokenTestPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/upload-avatar" element={<UploadAvatar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
