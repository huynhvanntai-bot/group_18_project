// Cloudinary Upload Utility - SV3: nguyenquocvinh
// Test upload và lấy URL để lưu MongoDB

const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");

/**
 * Upload avatar to Cloudinary với resize
 * @param {Buffer} fileBuffer - Buffer của file ảnh
 * @param {string} userId - ID của user để tạo tên file unique
 * @returns {Promise<Object>} - Object chứa URL và publicId
 */
const uploadAvatar = async (fileBuffer, userId) => {
  try {
    // Resize ảnh trước khi upload
    const resizedBuffer = await sharp(fileBuffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toBuffer();

    // Convert buffer to base64 for upload
    const base64String = `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'avatars',
      public_id: `avatar_${userId}_${Date.now()}`,
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto' },
        { format: 'webp' }
      ],
      overwrite: true,
      resource_type: 'auto'
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };

  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Xóa avatar cũ từ Cloudinary
 * @param {string} publicId - Public ID của ảnh cần xóa
 * @returns {Promise<Object>} - Kết quả xóa
 */
const deleteAvatar = async (publicId) => {
  try {
    if (!publicId) {
      return { success: true, message: "No image to delete" };
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    return {
      success: result.result === 'ok',
      result: result.result,
      publicId
    };

  } catch (error) {
    console.error("❌ Cloudinary delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Test connection tới Cloudinary
 * @returns {Promise<boolean>} - True nếu kết nối thành công
 */
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error);
    return false;
  }
};

/**
 * Lấy thông tin ảnh từ Cloudinary
 * @param {string} publicId - Public ID của ảnh
 * @returns {Promise<Object>} - Thông tin ảnh
 */
const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      createdAt: result.created_at
    };
  } catch (error) {
    console.error("❌ Get image info error:", error);
    throw new Error(`Get info failed: ${error.message}`);
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
  testCloudinaryConnection,
  getImageInfo
};