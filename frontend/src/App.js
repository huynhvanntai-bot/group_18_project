import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/AdminPage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      localStorage.removeItem("token");
      alert(data.message || "Đăng xuất thành công!");
    } catch (err) {
      alert("Lỗi khi đăng xuất!");
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
          <button onClick={handleLogout} style={{ marginLeft: "15px" }}>
            Đăng xuất
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AdminPage" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
