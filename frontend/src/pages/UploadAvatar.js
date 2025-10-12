import React, { useState } from "react";
import "./UploadAvatar.css";

function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Vui lòng chọn ảnh trước!");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload-avatar", {
        method: "Post",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Ảnh đã được tải lên thành công!");
        setPreview(data.url); // server trả về URL từ Cloudinary
      } else {
        setMessage(data.message || "❌ Upload thất bại!");
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối máy chủ!");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Ảnh Đại Diện</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="upload-input"
        />
        <button type="submit" className="upload-btn">Tải lên</button>
      </form>

      {message && <p className="upload-message">{message}</p>}
      {preview && (
        <div className="upload-preview">
          <h4>Ảnh đã tải lên:</h4>
          <img src={preview} alt="Avatar" width="150" />
        </div>
      )}
    </div>
  );
}

export default UploadAvatar;
