import React, { useState, useEffect } from "react";
import "./Profile.css";
import tokenService from "../services/tokenService";

function Profile() {
  const [email, setEmail] = useState("");
  const [ten, setTen] = useState("");
  const [mssv, setMssv] = useState("");
  const [lop, setLop] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState(""); // 🆕 SV2: Current avatar from server
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🆕 SV2: Load user profile and avatar on component mount
  useEffect(() => {
    loadUserProfile();
    loadUserAvatar();
  }, []);

  // 🆕 SV2: Load user profile data
  const loadUserProfile = async () => {
    try {
      if (!tokenService.hasTokens()) {
        setLoading(false);
        return;
      }

      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/profile");
      const data = await response.json();

      if (response.ok && data.user) {
        setEmail(data.user.email || "");
        setTen(data.user.ten || "");
        setMssv(data.user.mssv || "");
        setLop(data.user.lop || "");
      }
    } catch (err) {
      console.error("Load profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 SV2: Load user avatar
  const loadUserAvatar = async () => {
    try {
      if (!tokenService.hasTokens()) return;

      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/users/avatar");
      const data = await response.json();

      if (response.ok && data.data.user.avatar.url) {
        setCurrentAvatar(data.data.user.avatar.url);
        setPreview(data.data.user.avatar.url);
      }
    } catch (err) {
      console.error("Load avatar error:", err);
    }
  };

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

  // --- Upload avatar với API mới ---
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
      // 🆕 SV2: Sử dụng API endpoint mới cho avatar
      const headers = tokenService.getAuthHeaders();
      delete headers['Content-Type']; // Để browser tự set cho FormData

      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/users/avatar", {
        method: "POST",
        headers: {
          'Authorization': headers.Authorization
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Cập nhật ảnh đại diện thành công!");
        setCurrentAvatar(data.data.user.avatar.url);
        setPreview(data.data.user.avatar.url);
        
        // Reset form
        setAvatar(null);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ " + (data.message || "Lỗi khi tải ảnh!"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Lỗi kết nối server!");
    }
  };

  // 🆕 SV2: Delete avatar function
  const handleDeleteAvatar = async () => {
    if (!currentAvatar) {
      alert("Không có avatar để xóa!");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc muốn xóa avatar hiện tại?");
    if (!confirmDelete) return;

    try {
      if (!tokenService.hasTokens()) {
        return alert("Không có token, vui lòng đăng nhập lại!");
      }

      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/users/avatar", {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Xóa avatar thành công!");
        setCurrentAvatar("");
        setPreview("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ " + (data.message || "Xóa avatar thất bại!"));
      }
    } catch (err) {
      console.error("Delete avatar error:", err);
      setMessage("❌ Lỗi kết nối server!");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

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
          <h3>🖼️ Ảnh đại diện</h3>
          <div className="avatar-section">
            <img
              src={preview || currentAvatar || "https://via.placeholder.com/150?text=No+Avatar"}
              alt="Avatar Preview"
              className="avatar-img"
            />
            
            {/* Avatar actions */}
            <div className="avatar-actions">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="avatar-file-input"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="avatar-upload-label">
                📁 Chọn ảnh
              </label>
              
              <button 
                onClick={handleUploadAvatar} 
                className="avatar-btn upload-btn"
                disabled={!avatar}
              >
                ⬆️ Tải lên
              </button>
              
              {currentAvatar && (
                <button 
                  onClick={handleDeleteAvatar} 
                  className="avatar-btn delete-btn"
                >
                  🗑️ Xóa avatar
                </button>
              )}
            </div>
          </div>
          
          {message && <p className="avatar-message">{message}</p>}
          
          {/* Quick link to Upload Avatar page */}
          <div className="avatar-link">
            <p>💡 Hoặc sử dụng trang upload chuyên dụng:</p>
            <a href="/upload-avatar" className="upload-page-link">
              🚀 Trang Upload Avatar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
