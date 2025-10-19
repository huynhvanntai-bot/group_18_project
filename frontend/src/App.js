// frontend/src/App.js - Updated with RBAC Navigation - SV2: phamquanghuy1661
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";  // 🆕 New Navigation component
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UploadAvatar from  "./pages/UploadAvatar";
import TokenTestPage from "./pages/TokenTestPage";
import AdminUsersPage from "./pages/AdminUsersPage";  // 🆕 Admin Users Management
import AdminStatsPage from "./pages/AdminStatsPage";  // 🆕 Admin Stats
import "./App.css";
import tokenService from "./services/tokenService";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />  {/* 🆕 New RBAC Navigation */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />  {/* 🆕 */}
          <Route path="/admin/stats" element={<AdminStatsPage />} />  {/* 🆕 */}
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
