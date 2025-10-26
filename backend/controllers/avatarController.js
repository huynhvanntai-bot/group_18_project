// SV1: Avatar Controller - huynhvantai  
// Xử lý upload, update, delete avatar của user

const User = require("../models/User");
const { uploadAvatar, deleteAvatar } = require("../utils/cloudinaryUtils");

// @desc    Upload/Update Avatar
// @route   POST /api/users/avatar
// @access  Private (JWT required)
const uploadUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageBuffer = req.file.buffer;

    console.log(`📷 User ${userId} uploading avatar...`);

    // Lấy thông tin user hiện tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user!"
      });
    }

    // Xóa avatar cũ nếu có
    if (user.avatar && user.avatar.publicId) {
      console.log(`🗑️ Deleting old avatar: ${user.avatar.publicId}`);
      try {
        await deleteAvatar(user.avatar.publicId);
      } catch (error) {
        console.warn("Warning: Could not delete old avatar:", error.message);
        // Không fail API, chỉ warning
      }
    }

    // Upload avatar mới lên Cloudinary
    const uploadResult = await uploadAvatar(imageBuffer, userId);
    
    // Update user với avatar mới.
    // Use a direct update to avoid triggering full-document validation which may fail
    // if other required fields (e.g. `ten`) are missing or empty in the database.
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'avatar.url': uploadResult.url,
          'avatar.publicId': uploadResult.publicId,
          'avatar.uploadedAt': new Date()
        }
      },
      { new: true, runValidators: false }
    );
    // reflect updated user for response
    user.avatar = updated.avatar;

    console.log(`✅ Avatar uploaded successfully for user ${userId}`);

    res.status(200).json({
      success: true,
        message: "avarta thành công",
      data: {
        user: {
          _id: user._id,
          ten: user.ten,
          email: user.email,
          role: user.role,
          avatar: {
            url: user.avatar.url,
            uploadedAt: user.avatar.uploadedAt
          }
        },
        upload: {
          url: uploadResult.url,
          size: `${uploadResult.width}x${uploadResult.height}`,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        }
      }
    });

  } catch (error) {
    console.error("❌ Upload avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi upload avatar!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Get User Avatar Info
// @route   GET /api/users/avatar
// @access  Private (JWT required)
const getUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("ten email avatar");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user!"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          ten: user.ten,
          email: user.email,
          avatar: user.avatar || { url: "", uploadedAt: null }
        }
      }
    });

  } catch (error) {
    console.error("❌ Get avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin avatar!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Delete User Avatar
// @route   DELETE /api/users/avatar
// @access  Private (JWT required)
const deleteUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user!"
      });
    }

    // Kiểm tra có avatar không
    if (!user.avatar || !user.avatar.publicId) {
      return res.status(400).json({
        success: false,
        message: "User chưa có avatar để xóa!"
      });
    }

    console.log(`🗑️ User ${userId} deleting avatar: ${user.avatar.publicId}`);

    // Xóa avatar trên Cloudinary
    await deleteAvatar(user.avatar.publicId);

    // Reset avatar fields trong database
    user.avatar = {
      url: "",
      publicId: "",
      uploadedAt: null
    };
    
    await user.save();

    console.log(`✅ Avatar deleted successfully for user ${userId}`);

    res.status(200).json({
      success: true,
      message: "Xóa avatar thành công!",
      data: {
        user: {
          _id: user._id,
          ten: user.ten,
          email: user.email,
          avatar: user.avatar
        }
      }
    });

  } catch (error) {
    console.error("❌ Delete avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa avatar!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// @desc    Get Avatar for Admin (view any user's avatar)
// @route   GET /api/users/:userId/avatar
// @access  Private (Admin only)
const getAnyUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("ten email avatar role");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user!"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          ten: user.ten,
          email: user.email,
          role: user.role,
          avatar: user.avatar || { url: "", uploadedAt: null }
        }
      }
    });

  } catch (error) {
    console.error("❌ Get any user avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy avatar!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = {
  uploadUserAvatar,
  getUserAvatar,
  deleteUserAvatar,
  getAnyUserAvatar
};