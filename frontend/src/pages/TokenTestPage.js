// Test component để demo tự động refresh token
import React, { useState, useEffect } from "react";
import tokenService from "../services/tokenService";

const TokenTestPage = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [testResult, setTestResult] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    updateTokenInfo();
    setIsLoggedIn(tokenService.hasTokens());
  }, []);

  const updateTokenInfo = () => {
    const accessToken = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();
    const user = tokenService.getUser();

    setTokenInfo({
      accessToken: accessToken ? accessToken.substring(0, 50) + "..." : "Không có",
      refreshToken: refreshToken ? refreshToken.substring(0, 50) + "..." : "Không có",
      user: user ? user.email : "Không có"
    });
  };

  const testProtectedAPI = async () => {
    setTestResult("Đang test...");
    try {
      const response = await tokenService.authenticatedFetch("http://localhost:5000/api/users");
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ API thành công! Tìm thấy ${data.length} users`);
        updateTokenInfo(); // Cập nhật token info nếu có refresh
      } else {
        setTestResult(`❌ API thất bại: ${response.status}`);
      }
    } catch (error) {
      setTestResult(`❌ Lỗi: ${error.message}`);
    }
  };

  const manualRefresh = async () => {
    setTestResult("Đang refresh...");
    try {
      await tokenService.refreshAccessToken();
      setTestResult("✅ Refresh thành công!");
      updateTokenInfo();
    } catch (error) {
      setTestResult(`❌ Refresh thất bại: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await tokenService.logout();
    setIsLoggedIn(false);
    setTokenInfo(null);
    setTestResult("Đã đăng xuất");
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>🔒 Token Test Page</h2>
        <p>Vui lòng đăng nhập trước để test tính năng Refresh Token</p>
        <button onClick={() => window.location.href = "/login"}>
          Đi đến trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🔧 Token Test & Demo</h2>
      
      <div style={{ background: "#f5f5f5", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h3>📊 Thông tin Token hiện tại:</h3>
        {tokenInfo && (
          <>
            <p><strong>User:</strong> {tokenInfo.user}</p>
            <p><strong>Access Token:</strong> <code>{tokenInfo.accessToken}</code></p>
            <p><strong>Refresh Token:</strong> <code>{tokenInfo.refreshToken}</code></p>
          </>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>🧪 Test Functions:</h3>
        <button 
          onClick={testProtectedAPI}
          style={{ margin: "5px", padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
        >
          🔒 Test Protected API (Auto-refresh)
        </button>
        
        <button 
          onClick={manualRefresh}
          style={{ margin: "5px", padding: "10px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
        >
          🔄 Manual Refresh Token
        </button>
        
        <button 
          onClick={updateTokenInfo}
          style={{ margin: "5px", padding: "10px 15px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px" }}
        >
          🔍 Cập nhật Token Info
        </button>
        
        <button 
          onClick={handleLogout}
          style={{ margin: "5px", padding: "10px 15px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
        >
          🚪 Logout
        </button>
      </div>

      {testResult && (
        <div style={{ 
          background: testResult.includes("✅") ? "#d4edda" : "#f8d7da", 
          color: testResult.includes("✅") ? "#155724" : "#721c24",
          padding: "10px", 
          borderRadius: "4px",
          marginTop: "10px"
        }}>
          <strong>Kết quả:</strong> {testResult}
        </div>
      )}

      <div style={{ marginTop: "30px", fontSize: "14px", color: "#666" }}>
        <h4>📝 Hướng dẫn test:</h4>
        <ol>
          <li>Bấm "Test Protected API" để gọi API yêu cầu authentication</li>
          <li>Nếu access token hết hạn, hệ thống sẽ tự động refresh</li>
          <li>Quan sát token thay đổi sau khi refresh</li>
          <li>Thử "Manual Refresh" để refresh thủ công</li>
          <li>Logout để test revoke token</li>
        </ol>
      </div>
    </div>
  );
};

export default TokenTestPage;