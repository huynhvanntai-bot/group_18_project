// SV1: Test Avatar API - huynhvantai
// Script test các API endpoints cho avatar upload

require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const BASE_URL = "http://localhost:5000";

// Test credentials
const testUser = {
  email: "admin@example.com",
  password: "123456"
};

let authToken = null;

// Helper function to create test image
const createTestImage = async (filename, color = { r: 100, g: 149, b: 237 }) => {
  const buffer = await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 3,
      background: color
    }
  })
  .jpeg({ quality: 80 })
  .toBuffer();
  
  return buffer;
};

// Step 1: Login to get JWT token
const loginUser = async () => {
  try {
    console.log("🔐 Logging in...");
    const response = await axios.post(`${BASE_URL}/api/login`, testUser);
    
    if (response.data.success || response.data.accessToken) {
      authToken = response.data.accessToken;
      console.log("✅ Login successful");
      console.log("👤 User:", response.data.user.email);
      console.log("🎫 Token:", authToken.substring(0, 20) + "...");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Login failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    return false;
  }
};

// Step 2: Test GET current user avatar
const getCurrentUserAvatar = async () => {
  try {
    console.log("\n📷 Getting current user avatar...");
    const response = await axios.get(`${BASE_URL}/api/users/avatar`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log("✅ Get avatar successful:");
    console.log("📱 Response:", {
      user: response.data.data.user.ten,
      email: response.data.data.user.email,
      avatarUrl: response.data.data.user.avatar.url || "No avatar",
      uploadedAt: response.data.data.user.avatar.uploadedAt || "Never"
    });
    return response.data.data.user.avatar.url;
  } catch (error) {
    console.error("❌ Get avatar failed:", error.response?.data || error.message);
    return null;
  }
};

// Step 3: Test POST upload avatar
const uploadAvatar = async () => {
  try {
    console.log("\n⬆️ Uploading avatar...");
    
    // Create test image
    const imageBuffer = await createTestImage("test-avatar.jpg", { r: 255, g: 100, b: 100 });
    
    // Create form data
    const formData = new FormData();
    formData.append("avatar", imageBuffer, {
      filename: "test-avatar.jpg",
      contentType: "image/jpeg"
    });

    const response = await axios.post(`${BASE_URL}/api/users/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });

    console.log("✅ Upload successful:");
    console.log("📸 Avatar URL:", response.data.data.user.avatar.url);
    console.log("📏 Size:", response.data.data.upload.size);
    console.log("📄 Format:", response.data.data.upload.format);
    console.log("💾 Bytes:", response.data.data.upload.bytes);
    
    return response.data.data.user.avatar.url;
  } catch (error) {
    console.error("❌ Upload failed:", error.response?.data || error.message);
    return null;
  }
};

// Step 4: Test upload another avatar (replace old one)
const replaceAvatar = async () => {
  try {
    console.log("\n🔄 Replacing avatar with new one...");
    
    // Create different test image
    const imageBuffer = await createTestImage("test-avatar-2.jpg", { r: 100, g: 255, b: 100 });
    
    const formData = new FormData();
    formData.append("avatar", imageBuffer, {
      filename: "test-avatar-2.jpg",
      contentType: "image/jpeg"
    });

    const response = await axios.post(`${BASE_URL}/api/users/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });

    console.log("✅ Replace successful:");
    console.log("📸 New Avatar URL:", response.data.data.user.avatar.url);
    console.log("📏 Size:", response.data.data.upload.size);
    
    return response.data.data.user.avatar.url;
  } catch (error) {
    console.error("❌ Replace failed:", error.response?.data || error.message);
    return null;
  }
};

// Step 5: Test DELETE avatar
const deleteAvatar = async () => {
  try {
    console.log("\n🗑️ Deleting avatar...");
    const response = await axios.delete(`${BASE_URL}/api/users/avatar`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log("✅ Delete successful:");
    console.log("📱 Response:", response.data.message);
    console.log("👤 User:", response.data.data.user.ten);
    console.log("📸 Avatar URL:", response.data.data.user.avatar.url || "No avatar");
    
    return true;
  } catch (error) {
    console.error("❌ Delete failed:", error.response?.data || error.message);
    return false;
  }
};

// Step 6: Test error cases
const testErrorCases = async () => {
  try {
    console.log("\n🧪 Testing error cases...");
    
    // Test 1: Upload without file
    console.log("Test 1: Upload without file...");
    try {
      const formData = new FormData();
      await axios.post(`${BASE_URL}/api/users/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...formData.getHeaders()
        }
      });
    } catch (error) {
      console.log("✅ Expected error:", error.response.data.message);
    }

    // Test 2: Upload without auth
    console.log("Test 2: Upload without auth...");
    try {
      const imageBuffer = await createTestImage("test.jpg");
      const formData = new FormData();
      formData.append("avatar", imageBuffer, "test.jpg");
      
      await axios.post(`${BASE_URL}/api/users/avatar`, formData, {
        headers: formData.getHeaders()
      });
    } catch (error) {
      console.log("✅ Expected error:", error.response.data.message);
    }

    // Test 3: Delete avatar when no avatar exists
    console.log("Test 3: Delete non-existent avatar...");
    try {
      await axios.delete(`${BASE_URL}/api/users/avatar`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.log("✅ Expected error:", error.response.data.message);
    }

  } catch (error) {
    console.error("❌ Error test failed:", error.message);
  }
};

// Main test function
const runAvatarAPITests = async () => {
  console.log("🚀 Starting Avatar API Tests...\n");

  try {
    // Login
    const loginSuccess = await loginUser();
    if (!loginSuccess) {
      console.log("❌ Cannot proceed without login");
      return;
    }

    // Test sequence
    await getCurrentUserAvatar();
    await uploadAvatar();
    await getCurrentUserAvatar();
    await replaceAvatar();
    await getCurrentUserAvatar();
    await deleteAvatar();
    await getCurrentUserAvatar();
    await testErrorCases();

    console.log("\n🎉 All Avatar API tests completed!");

  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
  }
};

// Run if called directly
if (require.main === module) {
  runAvatarAPITests();
}

module.exports = runAvatarAPITests;