// Admin Users Management Page - SV2: phamquanghuy1661
import React, { useState, useEffect } from "react";
import tokenService from "../services/tokenService";
import "./AdminUsersPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: "all",
    search: ""
  });

  // New user form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    
    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.role && filters.role !== "all") queryParams.append("role", filters.role);
      if (filters.search) queryParams.append("search", filters.search);

      const response = await tokenService.authenticatedFetch(
        `http://localhost:5000/api/admin/users?${queryParams.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Lỗi khi tải danh sách users");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await tokenService.authenticatedFetch(
        "http://localhost:5000/api/admin/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        }
      );

      if (response.ok) {
        setSuccess("Tạo user thành công!");
        setNewUser({ username: "", email: "", password: "", role: "user" });
        setShowCreateForm(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Lỗi khi tạo user");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
      console.error("Create user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc muốn xóa user "${username}"?`)) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await tokenService.authenticatedFetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setSuccess(`Đã xóa user "${username}"`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Lỗi khi xóa user");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
      console.error("Delete user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <h1>👥 Quản lý Users</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "❌ Hủy" : "➕ Tạo User Mới"}
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>🔍 Tìm kiếm:</label>
          <input
            type="text"
            placeholder="Username hoặc email..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
          />
        </div>
        
        <div className="filter-group">
          <label>👤 Role:</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value, page: 1})}
          >
            <option value="all">Tất cả</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📄 Số lượng:</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({...filters, limit: e.target.value, page: 1})}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="create-user-form">
          <h3>➕ Tạo User Mới</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "⏳ Đang tạo..." : "✅ Tạo User"}
            </button>
          </form>
        </div>
      )}

      {/* Messages */}
      {error && <div className="alert alert-error">❌ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      {/* Users Table */}
      <div className="users-table-container">
        {loading && <div className="loading">⏳ Đang tải...</div>}
        
        <table className="users-table">
          <thead>
            <tr>
              <th>👤 Username</th>
              <th>📧 Email</th>
              <th>🎭 Role</th>
              <th>📅 Ngày tạo</th>
              <th>⚙️ Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user._id, user.username)}
                    disabled={loading}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="no-users">
            📭 Không tìm thấy users nào
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            disabled={!pagination.hasPrev}
            onClick={() => setFilters({...filters, page: filters.page - 1})}
          >
            ⬅️ Trước
          </button>
          
          <span>
            Trang {pagination.current} / {pagination.pages} 
            ({pagination.total} users)
          </span>
          
          <button
            disabled={!pagination.hasNext}
            onClick={() => setFilters({...filters, page: filters.page + 1})}
          >
            Sau ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;