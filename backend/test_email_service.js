// SV3: Test Email Service - nguyenquocvinh
// Test kết nối Gmail SMTP và gửi email thật

require('dotenv').config();
const { testEmailConnection, sendPasswordResetEmail } = require('./services/emailService');

async function testEmailService() {
  console.log("🧪 Testing Email Service - SV3: nguyenquocvinh");
  console.log("=" .repeat(50));

  // Test 1: Kiểm tra environment variables
  console.log("\n📝 1. Checking Environment Variables:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
  console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "http://localhost:3000 (default)");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n❌ Missing email credentials in .env file!");
    console.log("Please add:");
    console.log("EMAIL_USER=your-gmail@gmail.com");
    console.log("EMAIL_PASS=your-app-password");
    console.log("\n📖 To get Gmail App Password:");
    console.log("1. Go to Google Account settings");
    console.log("2. Security > 2-Step Verification");
    console.log("3. App passwords > Generate");
    console.log("4. Use the 16-character password");
    return;
  }

  // Test 2: Kiểm tra kết nối SMTP
  console.log("\n🔌 2. Testing SMTP Connection:");
  try {
    const connected = await testEmailConnection();
    if (connected) {
      console.log("✅ Gmail SMTP connection successful!");
    } else {
      console.log("❌ Gmail SMTP connection failed!");
      return;
    }
  } catch (error) {
    console.log("❌ SMTP Error:", error.message);
    return;
  }

  // Test 3: Gửi email test thật
  console.log("\n📧 3. Sending Test Reset Password Email:");
  try {
    const testEmail = process.env.EMAIL_USER; // Gửi cho chính mình để test
    const testToken = "test-token-" + Date.now();
    const testUser = "Test User";

    console.log(`Sending test email to: ${testEmail}`);
    console.log(`Reset token: ${testToken}`);

    const result = await sendPasswordResetEmail(testEmail, testToken, testUser);

    if (result.success) {
      console.log("✅ Test email sent successfully!");
      console.log("📧 Message ID:", result.messageId);
      console.log("🔗 Reset URL:", result.resetURL);
      console.log("📱 Check your Gmail inbox!");
    }

  } catch (error) {
    console.log("❌ Failed to send test email:", error.message);
  }

  console.log("\n" + "=" .repeat(50));
  console.log("🎯 Email Service Test Complete - SV3");
  console.log("✅ Ready for forgot password feature!");
}

// Run test
if (require.main === module) {
  testEmailService().catch(console.error);
}

module.exports = { testEmailService };