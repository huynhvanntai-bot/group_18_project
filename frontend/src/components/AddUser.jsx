import { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [mssv, setMssv] = useState("");
  const [lop, setLop] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", {
        ten,
        email,
        mssv,
        lop,
      });

      // Gọi lại fetchUsers ở App.jsx để reload danh sách
      onUserAdded();

      // Reset form
      setTen("");
      setEmail("");
      setMssv("");
      setLop("");
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={ten}
        onChange={(e) => setTen(e.target.value)}
        placeholder="Tên"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={mssv}
        onChange={(e) => setMssv(e.target.value)}
        placeholder="MSSV"
      />
      <input
        value={lop}
        onChange={(e) => setLop(e.target.value)}
        placeholder="Lớp"
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

export default AddUser;
