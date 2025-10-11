import React, { useState } from "react";
import { resetPassword } from "../services/userService";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(token, password);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div className="reset-container">
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đổi mật khẩu</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
