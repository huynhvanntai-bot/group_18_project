import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  const [email, setEmail] = useState("");
  const [ten, setTen] = useState("");
  const [mssv, setMssv] = useState("");
  const [lop, setLop] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  // --- Cập nhật thông tin cá nhân ---
  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // ✅ Lấy token từ localStorage
    if (!token) {
      alert("Không có token, vui lòng đăng nhập lại!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ gửi token kèm header
        },
        body: JSON.stringify({ email, ten, mssv, lop }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Cập nhật thông tin thành công!");
      } else if (res.status === 401) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      } else {
        alert(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Lỗi kết nối server!");
    }
  };

  // --- Xử lý chọn ảnh ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // --- Upload avatar ---
  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    if (!avatar) return alert("Vui lòng chọn ảnh!");

    const token = localStorage.getItem("token");
    if (!token) return alert("Không có token, vui lòng đăng nhập lại!");

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await fetch("http://localhost:5000/api/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ gửi token cho backend
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Cập nhật ảnh đại diện thành công!");
        setPreview(data.imageUrl); // cập nhật ảnh mới ngay
      } else if (res.status === 401) {
        setMessage("❌ Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      } else {
        setMessage("❌ " + (data.message || "Lỗi khi tải ảnh!"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Lỗi kết nối server!");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        {/* --- CỘT TRÁI: Thông tin cá nhân --- */}
        <div className="profile-left">
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

            <button type="submit">Cập nhật thông tin</button>
          </form>
        </div>

        {/* --- CỘT PHẢI: Upload ảnh đại diện --- */}
        <div className="profile-right">
          <h3>Ảnh đại diện</h3>
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="Avatar Preview"
            className="avatar-img"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUploadAvatar} className="avatar-btn">
            Tải ảnh lên
          </button>
          {message && <p className="avatar-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;
