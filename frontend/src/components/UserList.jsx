import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", mssv: "", lop: "" });
  const [editId, setEditId] = useState(null);

  // Lấy danh sách user từ MongoDB
  useEffect(() => {
    fetchUsers();
  }, []);

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
    }
  };

  return (
    <div>
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
                <td>{u.email}</td>
                <td>{u.mssv}</td>
                <td>{u.lop}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>✏️ Sửa</button>
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
    </div>
  );
}
