import React, { useState } from "react";
import API from "../services/api";

export default function AddUser({ onUserAdded }) {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [mssv, setMssv] = useState("");
  const [lop, setLop] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ten || !email || !mssv || !lop) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await API.post("/users", { ten, email, mssv, lop });
      onUserAdded();
      setTen("");
      setEmail("");
      setMssv("");
      setLop("");
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("Không thể thêm người dùng!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input placeholder="Tên" value={ten} onChange={(e) => setTen(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="MSSV" value={mssv} onChange={(e) => setMssv(e.target.value)} />
      <input placeholder="Lớp" value={lop} onChange={(e) => setLop(e.target.value)} />
      <button type="submit">➕ Thêm</button>
    </form>
  );
}
