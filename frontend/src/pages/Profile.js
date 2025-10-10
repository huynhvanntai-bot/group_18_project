import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  const [email, setEmail] = useState("");
  const [ten, setTen] = useState("");
  const [mssv, setMssv] = useState("");
  const [lop, setLop] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ten, mssv, lop }),
      });
      const data = await res.json();
      alert(data.message || "Cập nhật thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật!");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Thông tin cá nhân</h2>
        <form onSubmit={handleUpdate}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Tên</label>
          <input
            type="text"
            placeholder="Nhập họ tên"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
          />

          <label>MSSV</label>
          <input
            type="text"
            placeholder="Nhập mã số sinh viên"
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
          />

          <label>Lớp</label>
          <input
            type="text"
            placeholder="Nhập lớp"
            value={lop}
            onChange={(e) => setLop(e.target.value)}
          />

          <button type="submit">Cập nhật</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
