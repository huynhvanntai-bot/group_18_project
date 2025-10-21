// SV2: ForgotPassword.js - phamquanghuy1661
// Enhanced forgot password form với modern UI và better UX
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    // Validation
    if (!email.trim()) {
      setMessage("Vui lòng nhập địa chỉ email!");
      setMessageType("error");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Vui lòng nhập địa chỉ email hợp lệ!");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔐 SV2: Sending forgot password request - phamquanghuy1661");
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json; charset=utf-8" 
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("📧 Forgot password response:", data);

      if (res.ok && data.success) {
        setMessage("Email reset password đã được gửi! Vui lòng kiểm tra hộp thư của bạn.");
        setMessageType("success");
        setEmailSent(true);
        
        // Clear form
        setEmail("");
        
        console.log("✅ Email sent successfully");
        
      } else {
        setMessage(data.message || "Không thể gửi email reset password. Vui lòng thử lại!");
        setMessageType("error");
        console.log("❌ Failed to send email:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setMessage("Lỗi kết nối mạng! Vui lòng kiểm tra kết nối internet và thử lại.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form khi user muốn gửi lại
  const handleSendAgain = () => {
    setEmailSent(false);
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-icon">🔐</div>
          <h1 className="forgot-password-title">
            {emailSent ? "Email Đã Gửi!" : "Quên Mật Khẩu?"}
          </h1>
          <p className="forgot-password-subtitle">
            {emailSent 
              ? "Chúng tôi đã gửi link reset password đến email của bạn"
              : "Nhập email của bạn và chúng tôi sẽ gửi link để reset mật khẩu"
            }
          </p>
        </div>

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

        {!emailSent ? (
          /* Forgot Password Form */
          <form className="forgot-password-form" onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                📧 Địa chỉ Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email của bạn (VD: admin1@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${messageType === 'error' && !email ? 'error' : ''}`}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Đang gửi...' : '🚀 Gửi Email Reset Password'}
            </button>
          </form>
        ) : (
          /* Email Sent Success State */
          <div>
            <div className="instructions">
              <h4>📋 Hướng dẫn tiếp theo:</h4>
              <ol>
                <li>Kiểm tra hộp thư email của bạn</li>
                <li>Tìm email từ "RBAC System - Group 18"</li>
                <li>Click vào link reset password trong email</li>
                <li>Hoặc copy token và nhập vào form reset</li>
                <li>Tạo mật khẩu mới và đăng nhập</li>
              </ol>
            </div>
            
            <button 
              onClick={handleSendAgain}
              className="submit-button"
              style={{ marginTop: '20px' }}
            >
              📧 Gửi Lại Email
            </button>
          </div>
        )}

        {/* Back to Login */}
        <div className="back-to-login">
          <Link to="/login">
            ← Quay lại đăng nhập
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
};

export default ForgotPassword;
