import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import tokenService from "../services/tokenService";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ✅ Sử dụng TokenService với auto-refresh
        const response = await tokenService.authenticatedFetch("http://localhost:5000/api/users");
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách user:", error);
        if (error.message.includes('login')) {
          // Token hết hạn và refresh thất bại, đã redirect về login
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🗑️ Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      // ✅ Sử dụng TokenService với auto-refresh
      const response = await tokenService.authenticatedFetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setUsers(users.filter((u) => u._id !== id));
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      alert("Không thể xóa user!");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
  <div className="admin-page">
    <div className="admin-container">
      <h1 className="admin-title">👑 Quản lý người dùng</h1>

      {users.length === 0 ? (
        <p className="admin-empty">Không có người dùng nào.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.ten || user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "admin" && (
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user._id)}
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
    );
};

export default AdminPage;
