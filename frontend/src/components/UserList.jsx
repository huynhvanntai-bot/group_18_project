import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function UserList({ reload }) {
  const [users, setUsers] = useState([]);
<<<<<<< HEAD
  const [form, setForm] = useState({ name: "", email: "", mssv: "", lop: "" });
  const [editId, setEditId] = useState(null);

  // Lấy danh sách user từ MongoDB
=======
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

>>>>>>> 80b00bf4 (Thêm chức năng Sửa/Xóa user trên React)
  useEffect(() => {
    fetchUsers();
  }, [reload]);

<<<<<<< HEAD
  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  // Xử lý thêm hoặc cập nhật
  const handleSubmit = async () => {
    if (editId) {
      await API.put(`/users/${editId}`, form);
      setEditId(null);
    } else {
      await API.post("/users", form);
    }
    setForm({ name: "", email: "", mssv: "", lop: "" });
    fetchUsers();
  };

  // Khi bấm nút “Sửa”
  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      mssv: user.mssv,
      lop: user.lop,
    });
    setEditId(user._id);
  };

  // Khi bấm nút “Xóa”
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      await API.delete(`/users/${id}`);
      fetchUsers();
=======
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
>>>>>>> 80b00bf4 (Thêm chức năng Sửa/Xóa user trên React)
    }
  };

  return (
    <div>
<<<<<<< HEAD
      <h3>📋 Danh sách User (MongoDB)</h3>
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="MSSV"
          value={form.mssv}
          onChange={(e) => setForm({ ...form, mssv: e.target.value })}
        />
        <input
          placeholder="Lớp"
          value={form.lop}
          onChange={(e) => setForm({ ...form, lop: e.target.value })}
        />
        <button onClick={handleSubmit}>
          {editId ? "Cập nhật" : "Thêm"}
        </button>
      </div>

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>MSSV</th>
            <th>Lớp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                Không có user nào
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
=======
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
>>>>>>> 80b00bf4 (Thêm chức năng Sửa/Xóa user trên React)
                <td>{u.email}</td>
                <td>{u.mssv}</td>
                <td>{u.lop}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>✏️ Sửa</button>
<<<<<<< HEAD
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ marginLeft: "8px", color: "red" }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
=======
                  <button onClick={() => handleDelete(u._id)}>🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
>>>>>>> 80b00bf4 (Thêm chức năng Sửa/Xóa user trên React)
    </div>
  );
}
