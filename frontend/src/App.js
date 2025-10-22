// frontend/src/App.js - Updated with RBAC Navigation - SV2: phamquanghuy1661
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";  // 🆕 New Navigation component
import DebugBanner from './components/DebugBanner';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />  {/* 🆕 New RBAC Navigation */}
  <DebugBanner />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/AdminPage" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsersPage /></ProtectedRoute>} />  {/* 🆕 */}
          <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={['moderator','admin']}><AdminStatsPage /></ProtectedRoute>} />  {/* 🆕 */}
          <Route path="/token-test" element={<TokenTestPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:tokenParam" element={<ResetPassword />} /> {/* 🆕 SV2: Token from email link */}
          <Route path="/upload-avatar" element={<UploadAvatar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
