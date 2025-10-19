// Admin Stats Page - SV2: phamquanghuy1661  
import React, { useState, useEffect } from "react";
import tokenService from "../services/tokenService";
import "./AdminStatsPage.css";

const AdminStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(tokenService.getUser());
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await tokenService.authenticatedFetch(
        "http://localhost:5000/api/admin/stats"
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Lỗi khi tải thống kê");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
      console.error("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (count, total) => {
    if (total === 0) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  const formatLastUpdated = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit", 
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="admin-stats-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>⏳ Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-stats-page">
      <div className="page-header">
        <h1>📊 Thống kê Hệ thống</h1>
        <div className="user-role">
          <span className={`role-badge role-${user?.role}`}>
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
          <button onClick={fetchStats} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {stats && (
        <div className="stats-container">
          {/* Overview Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Tổng Users</h3>
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-subtitle">Đã đăng ký</div>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">🆕</div>
              <div className="stat-info">
                <h3>Users Mới</h3>
                <div className="stat-number">{stats.recentUsers}</div>
                <div className="stat-subtitle">7 ngày qua</div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">👑</div>
              <div className="stat-info">
                <h3>Admins</h3>
                <div className="stat-number">{stats.roleDistribution.admin}</div>
                <div className="stat-subtitle">
                  {calculatePercentage(stats.roleDistribution.admin, stats.totalUsers)}% tổng số
                </div>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">🛡️</div>
              <div className="stat-info">
                <h3>Moderators</h3>
                <div className="stat-number">{stats.roleDistribution.moderator}</div>
                <div className="stat-subtitle">
                  {calculatePercentage(stats.roleDistribution.moderator, stats.totalUsers)}% tổng số
                </div>
              </div>
            </div>
          </div>

          {/* Role Distribution Chart */}
          <div className="chart-section">
            <h3>📈 Phân bố theo Role</h3>
            <div className="role-chart">
              <div className="chart-bars">
                <div className="chart-bar">
                  <div className="bar-label">👤 Users</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill user-bar"
                      style={{
                        width: `${calculatePercentage(stats.roleDistribution.user, stats.totalUsers)}%`
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">
                    {stats.roleDistribution.user} 
                    ({calculatePercentage(stats.roleDistribution.user, stats.totalUsers)}%)
                  </div>
                </div>

                <div className="chart-bar">
                  <div className="bar-label">🛡️ Moderators</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill moderator-bar"
                      style={{
                        width: `${calculatePercentage(stats.roleDistribution.moderator, stats.totalUsers)}%`
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">
                    {stats.roleDistribution.moderator}
                    ({calculatePercentage(stats.roleDistribution.moderator, stats.totalUsers)}%)
                  </div>
                </div>

                <div className="chart-bar">
                  <div className="bar-label">👑 Admins</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill admin-bar"
                      style={{
                        width: `${calculatePercentage(stats.roleDistribution.admin, stats.totalUsers)}%`
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">
                    {stats.roleDistribution.admin}
                    ({calculatePercentage(stats.roleDistribution.admin, stats.totalUsers)}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="system-info">
            <h3>ℹ️ Thông tin Hệ thống</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">🕐 Cập nhật lần cuối:</span>
                <span className="info-value">{formatLastUpdated(stats.lastUpdated)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">👤 Người xem:</span>
                <span className="info-value">{user?.username} ({user?.role})</span>
              </div>
              <div className="info-item">
                <span className="info-label">📊 Loại thống kê:</span>
                <span className="info-value">Real-time User Analytics</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>⚡ Hành động nhanh</h3>
            <div className="action-buttons">
              <button onClick={fetchStats} className="action-btn refresh">
                🔄 Làm mới dữ liệu
              </button>
              
              {user?.role === "admin" && (
                <a href="/admin/users" className="action-btn manage">
                  👥 Quản lý Users
                </a>
              )}
              
              <a href="/token-test" className="action-btn test">
                🔧 Test RBAC
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatsPage;