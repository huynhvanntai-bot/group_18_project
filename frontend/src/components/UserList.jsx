// frontend/src/components/UserList.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import AddUser from "./AddUser";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/users");
      // Ghi log để kiểm tra dữ liệu nhận về
      console.log("🌟 Dữ liệu nhận được từ API:", res.data); 
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu:", err);
      setUsers(null); 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = (newUser) => {
    setUsers((prev) => [...(prev || []), newUser]); 
  };
  
  // Bắt đầu khối hiển thị
  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Danh sách User (MongoDB)</h2>
      
      {/* RENDER FORM ADDUSER LUÔN LUÔN Ở ĐÂY */}
      <AddUser onUserAdded={handleUserAdded} />
      
      {/* Xử lý trạng thái lỗi */}
      {users === null && (
          <div style={{ color: 'red', padding: '10px' }}>⚠️ Đã xảy ra lỗi khi tải dữ liệu. Kiểm tra Backend Server và kết nối MongoDB.</div>
      )}

      {/* Xử lý trạng thái rỗng */}
      {users !== null && !users.length ? (
        <>
          <p style={{ color: '#FFC107', fontWeight: 'bold' }}>⚠️ Hiện chưa có user nào</p>
          <p>Hãy thử thêm user mới!</p>
        </>
      ) : (
        // Hiển thị danh sách nếu có dữ liệu
        users !== null && users.length > 0 && (
          <table border="1" cellPadding="12" style={{ marginTop: "10px", width: '100%', borderCollapse: 'collapse', borderRadius: '5px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ textAlign: 'left' }}>Họ tên</th>
                <th style={{ textAlign: 'left' }}>Email</th>
                <th style={{ textAlign: 'left' }}>MSSV</th>
                <th style={{ textAlign: 'left' }}>Lớp</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u._id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  <td>{u.ten}</td>
                  <td>{u.email}</td>
                  <td>{u.mssv}</td>
                  <td>{u.lop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
