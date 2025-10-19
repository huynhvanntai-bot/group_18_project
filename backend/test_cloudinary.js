// Test Cloudinary Upload - SV3: nguyenquocvinh
// Script để test upload và lấy URL lưu MongoDB

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const { testCloudinaryConnection, uploadAvatar } = require("./utils/cloudinaryUtils");
const fs = require("fs");
const path = require("path");

const testCloudinaryUpload = async () => {
  try {
    console.log("🚀 Testing Cloudinary Upload...");

    // 1. Test connection
    console.log("\n1. Testing Cloudinary connection...");
    const isConnected = await testCloudinaryConnection();
    if (!isConnected) {
      throw new Error("Cannot connect to Cloudinary");
    }

    // 2. Connect to MongoDB
    console.log("\n2. Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 3. Find a test user
    console.log("\n3. Finding test user...");
    let testUser = await User.findOne({ email: "admin1@gmail.com" });
    if (!testUser) {
      console.log("Creating test user...");
      testUser = new User({
        ten: "Test User",
        username: "testuser",
        email: "admin1@gmail.com",
        password: "hashedpassword",
        role: "admin"
      });
      await testUser.save();
    }
    console.log(`✅ Test user found: ${testUser.email}`);

    // 4. Create a test image buffer (simple colored square)
    console.log("\n4. Creating test image...");
    const sharp = require("sharp");
    const testImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 100, g: 149, b: 237 }
      }
    })
    .png()
    .toBuffer();
    
    console.log(`✅ Test image created: ${testImageBuffer.length} bytes`);

    // 5. Upload to Cloudinary
    console.log("\n5. Uploading to Cloudinary...");
    const uploadResult = await uploadAvatar(testImageBuffer, testUser._id);
    console.log("✅ Upload successful:", {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      size: `${uploadResult.width}x${uploadResult.height}`,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    });

    // 6. Update user avatar in MongoDB
    console.log("\n6. Updating user avatar in MongoDB...");
    testUser.avatar = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      uploadedAt: new Date()
    };
    await testUser.save();
    console.log("✅ User avatar updated in database");

    // 7. Verify data in MongoDB
    console.log("\n7. Verifying data in MongoDB...");
    const updatedUser = await User.findById(testUser._id);
    console.log("✅ Database verification:", {
      userId: updatedUser._id,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatar.url,
      avatarPublicId: updatedUser.avatar.publicId,
      uploadedAt: updatedUser.avatar.uploadedAt
    });

    console.log("\n🎉 All tests passed! Cloudinary upload integration working correctly.");
    
    return {
      success: true,
      user: updatedUser,
      upload: uploadResult
    };

  } catch (error) {
    console.error("❌ Test failed:", error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testCloudinaryUpload()
    .then(result => {
      if (result.success) {
        console.log("\n✅ Test completed successfully!");
        process.exit(0);
      } else {
        console.log("\n❌ Test failed!");
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("❌ Test error:", error);
      process.exit(1);
    });
}

module.exports = testCloudinaryUpload;