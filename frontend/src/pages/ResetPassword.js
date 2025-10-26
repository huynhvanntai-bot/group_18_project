// SV2: ResetPassword.js - phamquanghuy1661
// Enhanced reset password form với modern UI và password strength
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { tokenParam } = useParams(); // Token từ URL nếu có
  const navigate = useNavigate();

  // Nếu có token trong URL, tự động điền
  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
      console.log("🔑 SV2: Token from URL detected - phamquanghuy1661");
    }
  }, [tokenParam]);

  // Kiểm tra độ mạnh password
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "weak";
    if (password.length < 8) return "medium";
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return "very-strong";
    if (password.length >= 8 && (/[A-Z]/.test(password) || /[0-9]/.test(password))) return "strong";
    return "medium";
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const validateForm = () => {
    if (!token.trim()) {
      setMessage("Vui lòng nhập token reset password!");
      setMessageType("error");
      return false;
    }

    if (!newPassword) {
      setMessage("Vui lòng nhập mật khẩu mới!");
      setMessageType("error");
      return false;
    }

    if (newPassword.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      setMessageType("error");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("🔄 SV2: Submitting reset password - phamquanghuy1661");
      const res = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      console.log("🔄 Reset password response:", data);

      if (res.ok && data.success) {
        setMessage("Mật khẩu đã được cập nhật thành công!");
        setMessageType("success");
        setResetSuccess(true);
        
        // Clear form
        setToken("");
        setNewPassword("");
        setConfirmPassword("");
        
        console.log("✅ Password reset successful");
        
      } else {
        setMessage(data.message || "Token không hợp lệ hoặc đã hết hạn!");
        setMessageType("error");
        console.log("❌ Password reset failed:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setMessage("Lỗi kết nối mạng! Vui lòng thử lại sau.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const getPasswordStrengthInfo = () => {
    switch (passwordStrength) {
      case "weak": return { text: "Yếu", class: "strength-weak" };
      case "medium": return { text: "Trung bình", class: "strength-medium" };
      case "strong": return { text: "Mạnh", class: "strength-strong" };
      case "very-strong": return { text: "Rất mạnh", class: "strength-very-strong" };
      default: return { text: "", class: "" };
    }
  };

  if (resetSuccess) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-success">
            <div className="success-icon">🎉</div>
            <h1 className="reset-password-title">Thành Công!</h1>
            <p className="reset-password-subtitle">
              Mật khẩu của bạn đã được cập nhật thành công.
            </p>
            
            <div className="alert alert-success success-animation">
              <span>✅</span>
              Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ!
            </div>
            
            <button 
              onClick={handleLoginRedirect}
              className="login-button"
            >
              🚀 Đăng Nhập Ngay
            </button>
          </div>
          
          <div style={{ 
            marginTop: '30px', 
            fontSize: '0.85rem', 
            color: '#666',
            borderTop: '1px solid #e1e5e9',
            paddingTop: '15px'
          }}>
            <p><strong>🎯 Hoạt động 4:</strong> Forgot Password & Reset Password</p>
            <p><strong>👤 SV2:</strong> phamquanghuy1661 - Frontend Forms</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-icon">🔑</div>
          <h1 className="reset-password-title">Đặt Lại Mật Khẩu</h1>
          <p className="reset-password-subtitle">
            Nhập token từ email và tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Token Info */}
        {!tokenParam && (
          <div className="token-info">
            <h4>🔑 Cách lấy Token:</h4>
            <p>1. Kiểm tra email từ <code>RBAC System - Group 18</code></p>
            <p>2. Copy token từ email (dạng: <code>a1b2c3d4e5f6...</code>)</p>
            <p>3. Hoặc click link trong email để tự động điền token</p>
          </div>
        )}

        {/* Alert Message */}
        {message && (
          <div className={`alert alert-${messageType} ${messageType === 'success' ? 'success-animation' : ''}`}>
            <span>
              {messageType === 'success' && '✅'}
              {messageType === 'error' && '❌'}
              {messageType === 'info' && 'ℹ️'}
            </span>
            {message}
          </div>
        )}

        {/* Reset Password Form */}
        <form className="reset-password-form" onSubmit={handleResetPassword}>
          {/* Token Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="token">
              🔑 Reset Token
            </label>
            <input
              id="token"
              type="text"
              placeholder="Nhập token từ email (VD: a1b2c3d4e5f6789...)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`form-input token-input ${!token && messageType === 'error' ? 'error' : ''}`}
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          {/* New Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">
              🔐 Mật Khẩu Mới
            </label>
            <div className="password-input-group">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                value={newPassword}
                onChange={handlePasswordChange}
                className={`form-input ${!newPassword && messageType === 'error' ? 'error' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            
            {/* Password Strength */}
            {newPassword && (
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength}`}></div>
                <div className={`strength-text ${passwordStrength}-text`}>
                  Độ mạnh: {getPasswordStrengthInfo().text}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              🔒 Xác Nhận Mật Khẩu
            </label>
            <div className="password-input-group">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${confirmPassword && newPassword !== confirmPassword ? 'error' : confirmPassword && newPassword === confirmPassword ? 'success' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px' }}>
                ❌ Mật khẩu không khớp
              </div>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <div style={{ color: '#27ae60', fontSize: '0.85rem', marginTop: '5px' }}>
                ✅ Mật khẩu khớp
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !token || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {isLoading ? 'Đang cập nhật...' : '🔄 Cập Nhật Mật Khẩu'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="back-to-login">
          <Link to="/login">
            ← Quay lại đăng nhập
          </Link>
          <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
          <Link to="/forgot-password">
            📧 Gửi lại email reset
          </Link>
        </div>

        {/* Dev Info */}
        <div style={{ 
          marginTop: '20px', 
          fontSize: '0.85rem', 
          color: '#666',
          borderTop: '1px solid #e1e5e9',
          paddingTop: '15px'
        }}>
          <p><strong>🎯 Hoạt động 4:</strong> Forgot Password & Reset Password</p>
          <p><strong>👤 SV2:</strong> phamquanghuy1661 - Frontend Forms</p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
