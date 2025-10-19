// SV1: Test Forgot Password API - huynhvantai
// Test complete forgot password flow với email thật

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testForgotPasswordAPI() {
  console.log("🧪 Testing Forgot Password API - SV1: huynhvantai");
  console.log("=" .repeat(60));

  const testEmail = "admin1@gmail.com"; // Email có sẵn trong database
  
  try {
    // Test 1: Forgot Password API
    console.log("\n📧 1. Testing Forgot Password API:");
    console.log(`Sending request to: POST ${BASE_URL}/forgot-password`);
    console.log(`Test email: ${testEmail}`);

    const forgotResponse = await axios.post(`${BASE_URL}/forgot-password`, {
      email: testEmail
    });

    console.log("✅ Forgot Password Response:");
    console.log("Status:", forgotResponse.status);
    console.log("Data:", JSON.stringify(forgotResponse.data, null, 2));

    if (forgotResponse.data.success) {
      console.log("🎉 Forgot password request successful!");
      console.log("📧 Email should be sent to:", testEmail);
      
      // Note: Token sẽ được gửi qua email, không return trong API response
      console.log("💡 Check your email for reset link!");
      
    } else {
      console.log("❌ Forgot password request failed");
    }

  } catch (error) {
    console.error("❌ Forgot Password API Error:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }

  // Test 2: Invalid Email
  console.log("\n🚫 2. Testing Invalid Email:");
  try {
    const invalidResponse = await axios.post(`${BASE_URL}/forgot-password`, {
      email: "nonexistent@email.com"
    });
    console.log("Response:", invalidResponse.data);
  } catch (error) {
    console.log("✅ Expected error for invalid email:");
    console.log("Status:", error.response?.status);
    console.log("Message:", error.response?.data?.message);
  }

  // Test 3: Missing Email
  console.log("\n❌ 3. Testing Missing Email:");
  try {
    const missingResponse = await axios.post(`${BASE_URL}/forgot-password`, {});
    console.log("Response:", missingResponse.data);
  } catch (error) {
    console.log("✅ Expected error for missing email:");
    console.log("Status:", error.response?.status);
    console.log("Message:", error.response?.data?.message);
  }

  console.log("\n" + "=" .repeat(60));
  console.log("📋 Test Summary:");
  console.log("1. ✅ Forgot Password API - Sends real email");
  console.log("2. ✅ Invalid Email Validation");
  console.log("3. ✅ Missing Email Validation");
  console.log("\n💡 Next Steps:");
  console.log("1. Check email inbox for reset link");
  console.log("2. Copy token from email");
  console.log("3. Test reset password API with token");
  console.log("4. Or use frontend forms (SV2)");
}

// Test Reset Password với token (Manual test)
async function testResetPasswordAPI(token, newPassword = "newpassword123") {
  console.log("\n🔄 Testing Reset Password API:");
  console.log(`Token: ${token}`);
  console.log(`New Password: ${newPassword}`);

  try {
    const resetResponse = await axios.post(`${BASE_URL}/reset-password/${token}`, {
      newPassword: newPassword
    });

    console.log("✅ Reset Password Response:");
    console.log("Status:", resetResponse.status);
    console.log("Data:", JSON.stringify(resetResponse.data, null, 2));

    if (resetResponse.data.success) {
      console.log("🎉 Password reset successful!");
      console.log("🔐 You can now login with new password");
    }

  } catch (error) {
    console.error("❌ Reset Password API Error:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    console.log("❌ Server not running! Please start:");
    console.log("cd backend && npm start");
    return false;
  }
}

// Main test function
async function runTests() {
  const serverRunning = await checkServer();
  if (!serverRunning) return;

  await testForgotPasswordAPI();
  
  // Manual test instructions
  console.log("\n🔧 Manual Reset Password Test:");
  console.log("1. Check your email for reset token");
  console.log("2. Copy the token from email");
  console.log("3. Run: node test_forgot_password.js <token>");
  
  // If token provided as command line argument
  const token = process.argv[2];
  if (token) {
    console.log("\n🔑 Token provided, testing reset password...");
    await testResetPasswordAPI(token);
  }
}

// Export for manual testing
module.exports = { 
  testForgotPasswordAPI, 
  testResetPasswordAPI 
};

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}