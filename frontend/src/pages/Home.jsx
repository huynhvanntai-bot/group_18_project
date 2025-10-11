import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-icon">🌐</div>
        <h1 className="home-title">Chào mừng đến với <span className="home-highlight">Group 18 Project</span></h1>
        <p className="home-desc">Nền tảng quản lý người dùng hiện đại, bảo mật với JWT, giao diện thân thiện và dễ sử dụng.</p>
        <div className="home-buttons">
          <button className="home-btn login" onClick={() => navigate("/login")}>Đăng nhập</button>
          <button className="home-btn register" onClick={() => navigate("/register")}>Đăng ký</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
