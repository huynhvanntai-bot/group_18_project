import React, { useState } from "react";
import "./Profile.css";
import tokenService from "../services/tokenService";

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

    // ✅ Kiểm tra token bằng TokenService
    if (!tokenService.hasTokens()) {
      alert("Không có token, vui lòng đăng nhập lại!");
      return;
    }

    try {
      // ✅ Sử dụng TokenService với auto-refresh
      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/profile", {
        method: "PUT",
        body: JSON.stringify({ email, ten, mssv, lop }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Cập nhật thông tin thành công!");
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

    // ✅ Kiểm tra token bằng TokenService
    if (!tokenService.hasTokens()) {
      return alert("Không có token, vui lòng đăng nhập lại!");
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      // ✅ Sử dụng TokenService với auto-refresh cho FormData
      const headers = tokenService.getAuthHeaders();
      delete headers['Content-Type']; // Để browser tự set cho FormData

      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/upload-avatar", {
        method: "POST",
        headers: {
          'Authorization': headers.Authorization
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Cập nhật ảnh đại diện thành công!");
        setPreview(data.imageUrl); // cập nhật ảnh mới ngay
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
