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
        <nav className="app-nav">
          <div className="nav-links">
            <Link to="/" className="nav-link">🏠 Trang chủ</Link>
            <Link to="/login" className="nav-link">🔐 Đăng nhập</Link>
            <Link to="/register" className="nav-link">📝 Đăng ký</Link>
            <Link to="/profile" className="nav-link">👤 Profile</Link>
            <Link to="/AdminPage" className="nav-link">👑 Admin</Link>
            <Link to="/token-test" className="nav-link special">🔧 Token Test</Link>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Đăng xuất
          </button>
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
