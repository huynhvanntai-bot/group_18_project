import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function UserList({ reload }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    ten: "",
    email: "",
    mssv: "",
    lop: "",
  });

  // 🟢 Lấy danh sách user
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  // 🟠 Khi bấm nút Sửa
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      ten: user.ten,
      email: user.email,
      mssv: user.mssv,
      lop: user.lop,
    });
  };

  // 🔵 Cập nhật user (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/users/${editingUser}`, formData);
      alert("Cập nhật thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Không thể cập nhật user!");
    }
  };

  // 🔴 Xóa user (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa user này?")) {
      try {
        await API.delete(`/api/users/${id}`);
        alert("Xóa thành công!");
        fetchUsers();
      } catch (err) {
        console.error("Lỗi khi xóa user:", err);
        alert("Không thể xóa user!");
      }
    }
  };

  return (
    <div>
      {editingUser ? (
        <form onSubmit={handleUpdate} style={{ marginBottom: 20 }}>
          <input
            placeholder="Tên"
            value={formData.ten}
            onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
          />
          <input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            placeholder="MSSV"
            value={formData.mssv}
            onChange={(e) => setFormData({ ...formData, mssv: e.target.value })}
          />
          <input
            placeholder="Lớp"
            value={formData.lop}
            onChange={(e) => setFormData({ ...formData, lop: e.target.value })}
          />
          <button type="submit">💾 Lưu</button>
          <button type="button" onClick={() => setEditingUser(null)}>
            ❌ Hủy
          </button>
        </form>
      ) : null}

      {users.length === 0 ? (
        <p>Không có user nào</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>MSSV</th>
              <th>Lớp</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.ten}</td>
                <td>{u.email}</td>
                <td>{u.mssv}</td>
                <td>{u.lop}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(u._id)}>🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}