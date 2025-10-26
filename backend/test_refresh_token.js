// Test file để kiểm tra tính năng Refresh Token
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  ten: "Test User",
  email: "test@example.com", 
  password: "123456"
};

async function testRefreshTokenFlow() {
  try {
    console.log("🚀 Bắt đầu test Refresh Token flow...\n");

    // 1. Đăng ký user test
    console.log("1️⃣ Đăng ký user test...");
    try {
      await axios.post(`${API_BASE}/signup`, testUser);
      console.log("✅ Đăng ký thành công");
    } catch (error) {
      if (error.response?.data?.message === "Email đã tồn tại!") {
        console.log("ℹ️ User đã tồn tại, tiếp tục test");
      } else {
        throw error;
      }
    }

    // 2. Đăng nhập để lấy tokens
    console.log("\n2️⃣ Đăng nhập để lấy access token & refresh token...");
    const loginResponse = await axios.post(`${API_BASE}/login`, {
      email: testUser.email,
      password: testUser.password
    });

    const { accessToken, refreshToken, user } = loginResponse.data;
    console.log("✅ Đăng nhập thành công");
    console.log("📝 Access Token:", accessToken.substring(0, 50) + "...");
    console.log("📝 Refresh Token:", refreshToken.substring(0, 50) + "...");
    console.log("👤 User:", user.ten);

    // 3. Test API với access token
    console.log("\n3️⃣ Test API với access token...");
    const protectedResponse = await axios.get(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: { email: testUser.email }
    });
    console.log("✅ Truy cập API thành công với access token");

    // 4. Test refresh token
    console.log("\n4️⃣ Test refresh access token...");
    const refreshResponse = await axios.post(`${API_BASE}/refresh`, {
      refreshToken: refreshToken
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
    console.log("✅ Refresh token thành công");
    console.log("📝 New Access Token:", newAccessToken.substring(0, 50) + "...");
    console.log("📝 New Refresh Token:", newRefreshToken.substring(0, 50) + "...");

    // 5. Test API với token mới
    console.log("\n5️⃣ Test API với token mới...");
    await axios.get(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`
      },
      params: { email: testUser.email }
    });
    console.log("✅ Truy cập API thành công với token mới");

    // 6. Test logout
    console.log("\n6️⃣ Test logout...");
    await axios.post(`${API_BASE}/logout`, {
      refreshToken: newRefreshToken
    });
    console.log("✅ Logout thành công");

    // 7. Test dùng refresh token đã bị revoke
    console.log("\n7️⃣ Test dùng refresh token đã bị revoke...");
    try {
      await axios.post(`${API_BASE}/refresh`, {
        refreshToken: newRefreshToken
      });
      console.log("❌ Lỗi: Token đã bị revoke nhưng vẫn hoạt động");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Token đã bị revoke thành công");
      } else {
        throw error;
      }
    }

    console.log("\n🎉 Tất cả test đều PASSED! Refresh Token hoạt động tốt.");

  } catch (error) {
    console.error("\n❌ Test thất bại:", error.response?.data || error.message);
  }
}

// Chạy test nếu file được thực thi trực tiếp
if (require.main === module) {
  testRefreshTokenFlow();
}

module.exports = { testRefreshTokenFlow };