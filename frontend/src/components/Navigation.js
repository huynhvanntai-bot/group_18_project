// Navigation Component với Role-based Display - SV2: phamquanghuy1661
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tokenService from "../services/tokenService";
import "./Navigation.css";

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    updateUserInfo();
    
    // Check auth status every second
    const interval = setInterval(updateUserInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateUserInfo = () => {
    const currentUser = tokenService.getUser();
    const hasTokens = tokenService.hasTokens();
    
    setUser(currentUser);
    setIsLoggedIn(hasTokens && currentUser);
  };

  const handleLogout = async () => {
    try {
      await tokenService.logout();
      alert("Đăng xuất thành công!");
      setUser(null);
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (err) {
      alert("Lỗi khi đăng xuất!");
      console.error("Logout error:", err);
    }
  };

  // Determine which links to show based on role
  const getNavigationLinks = () => {
    const baseLinks = [
      { to: "/", label: "🏠 Trang chủ", roles: ["all"] }
    ];

    if (!isLoggedIn) {
      return [
        ...baseLinks,
        { to: "/login", label: "🔐 Đăng nhập", roles: ["all"] },
        { to: "/register", label: "📝 Đăng ký", roles: ["all"] }
      ];
    }

    const loggedInLinks = [
      { to: "/profile", label: "👤 Profile", roles: ["user", "moderator", "admin"] },
      { to: "/token-test", label: "🔧 Token Test", roles: ["user", "moderator", "admin"] }
    ];

    // Moderator and Admin links
    if (user?.role === "moderator" || user?.role === "admin") {
      loggedInLinks.push(
        { to: "/admin/stats", label: "📊 Thống kê", roles: ["moderator", "admin"] }
      );
    }

    // Admin only links
    if (user?.role === "admin") {
      loggedInLinks.push(
        { to: "/admin/users", label: "👥 Quản lý Users", roles: ["admin"] },
        { to: "/AdminPage", label: "👑 Admin Panel", roles: ["admin"] }
      );
    }

    return [...baseLinks, ...loggedInLinks];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="app-nav">
      <div className="nav-brand">
        <span className="brand-text">🎯 RBAC System</span>
        {isLoggedIn && (
          <span className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className={`role-badge role-${user?.role}`}>
              {user?.role?.toUpperCase()}
            </span>
          </span>
        )}
      </div>
      
      <div className="nav-links">
        {navigationLinks.map((link, index) => (
          <Link 
            key={index}
            to={link.to} 
            className={`nav-link ${link.roles.includes(user?.role) || link.roles.includes("all") ? "" : "hidden"}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      {isLoggedIn && (
        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Đăng xuất
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;