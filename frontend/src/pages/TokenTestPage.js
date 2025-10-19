// Test component để demo tự động refresh token
import React, { useState, useEffect } from "react";
import tokenService from "../services/tokenService";
import "./TokenTestPage.css";

const TokenTestPage = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [testResult, setTestResult] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateTokenInfo();
    setIsLoggedIn(tokenService.hasTokens());
    
    // Cập nhật thời gian còn lại mỗi giây
    const interval = setInterval(() => {
      updateTokenInfo();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const updateTokenInfo = () => {
    const accessToken = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();
    const user = tokenService.getUser();

    // Parse JWT token để lấy thông tin
    let tokenData = null;
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        tokenData = {
          userId: payload.id,
          issuedAt: new Date(payload.iat * 1000).toLocaleString(),
          expiresAt: new Date(payload.exp * 1000).toLocaleString(),
          timeLeft: Math.max(0, Math.floor((payload.exp * 1000 - Date.now()) / 1000))
        };
      } catch (e) {
        tokenData = { error: "Không thể parse token" };
      }
    }

    setTokenInfo({
      accessToken: accessToken ? accessToken.substring(0, 50) + "..." : "Không có",
      refreshToken: refreshToken ? refreshToken.substring(0, 50) + "..." : "Không có", 
      user: user ? user.email : "Không có",
      tokenData: tokenData,
      hasTokens: !!(accessToken && refreshToken)
    });
  };

  const testProtectedAPI = async () => {
    setTestResult("");
    setIsLoading(true);
    try {
      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/users");
      if (response.ok) {
        const data = await response.json();
        setTestResult({
          type: "success",
          message: `✅ API thành công! Tìm thấy ${data.length} users`
        });
        updateTokenInfo(); // Cập nhật token info nếu có refresh
      } else {
        setTestResult({
          type: "error", 
          message: `❌ API thất bại: ${response.status}`
        });
      }
    } catch (error) {
      setTestResult({
        type: "error",
        message: `❌ Lỗi: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const manualRefresh = async () => {
    setTestResult("");
    setIsLoading(true);
    try {
      await tokenService.refreshAccessToken();
      setTestResult({
        type: "success",
        message: "✅ Refresh thành công!"
      });
      updateTokenInfo();
    } catch (error) {
      setTestResult({
        type: "error",
        message: `❌ Refresh thất bại: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await tokenService.logout();
    setIsLoggedIn(false);
    setTokenInfo(null);
    setTestResult({
      type: "success",
      message: "✅ Đã đăng xuất thành công"
    });
    setIsLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="token-test-page">
        <h2 className="token-test-header">🔒 Token Test & Demo</h2>
        <div className="login-required">
          <h3>Yêu cầu đăng nhập</h3>
          <p>Vui lòng đăng nhập trước để test tính năng Refresh Token</p>
          <a href="/login" className="login-btn">
            🚀 Đi đến trang đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="token-test-page">
      <h2 className="token-test-header">🔧 Token Test & Demo</h2>
      
      <div className="token-info-card">
        <h3>📊 Thông tin Token hiện tại</h3>
        {tokenInfo && (
          <>
            <div className="token-info-item">
              <strong>👤 User:</strong> {tokenInfo.user}
            </div>
            <div className="token-info-item">
              <strong>🔑 Access Token:</strong> <code>{tokenInfo.accessToken}</code>
            </div>
            <div className="token-info-item">
              <strong>🔄 Refresh Token:</strong> <code>{tokenInfo.refreshToken}</code>
            </div>
            {tokenInfo.tokenData && !tokenInfo.tokenData.error && (
              <>
                <div className="token-info-item">
                  <strong>🆔 User ID:</strong> <code>{tokenInfo.tokenData.userId}</code>
                </div>
                <div className="token-info-item">
                  <strong>📅 Ngày tạo:</strong> <code>{tokenInfo.tokenData.issuedAt}</code>
                </div>
                <div className="token-info-item">
                  <strong>⏰ Hết hạn:</strong> <code>{tokenInfo.tokenData.expiresAt}</code>
                </div>
                <div className="token-info-item">
                  <strong>⏳ Thời gian còn lại:</strong> 
                  <code style={{color: tokenInfo.tokenData.timeLeft < 300 ? '#dc3545' : '#28a745'}}>
                    {tokenInfo.tokenData.timeLeft > 0 ? `${tokenInfo.tokenData.timeLeft}s` : 'Đã hết hạn'}
                  </code>
                </div>
              </>
            )}
            <div className="token-info-item">
              <strong>✅ Trạng thái:</strong> 
              <code style={{color: tokenInfo.hasTokens ? '#28a745' : '#dc3545'}}>
                {tokenInfo.hasTokens ? 'Đã đăng nhập' : 'Chưa đăng nhập'}
              </code>
            </div>
          </>
        )}
      </div>

      <div className="test-functions">
        <h3>🧪 Chức năng Test</h3>
        <div className="test-buttons">
          <button 
            onClick={testProtectedAPI}
            className="test-btn primary"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading-spinner"></span> : "🔒"} 
            Test Protected API
          </button>
          
          <button 
            onClick={manualRefresh}
            className="test-btn success"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading-spinner"></span> : "🔄"} 
            Manual Refresh
          </button>
          
          <button 
            onClick={updateTokenInfo}
            className="test-btn info"
            disabled={isLoading}
          >
            🔍 Cập nhật Token Info
          </button>
          
          <button 
            onClick={handleLogout}
            className="test-btn danger"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading-spinner"></span> : "🚪"} 
            Logout
          </button>
        </div>
      </div>

      {testResult && (
        <div className={`test-result ${testResult.type}`}>
          <strong>Kết quả:</strong> {testResult.message}
        </div>
      )}

      <div className="instructions">
        <h4>📝 Hướng dẫn sử dụng</h4>
        <ol>
          <li><strong>Test Protected API:</strong> Gọi API yêu cầu authentication, tự động refresh nếu token hết hạn</li>
          <li><strong>Manual Refresh:</strong> Làm mới access token thủ công để xem token rotation</li>
          <li><strong>Cập nhật Token Info:</strong> Refresh thông tin token hiển thị</li>
          <li><strong>Logout:</strong> Đăng xuất và revoke refresh token</li>
          <li><strong>Quan sát:</strong> Token sẽ thay đổi sau mỗi lần refresh (token rotation)</li>
        </ol>
      </div>
    </div>
  );
};

export default TokenTestPage;