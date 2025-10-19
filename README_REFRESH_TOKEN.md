# Tính năng Refresh Token - SV1

## Mô tả
Đã triển khai hệ thống JWT với Access Token + Refresh Token để quản lý phiên đăng nhập an toàn.

## Các API đã tạo

### 1. POST /api/login
**Mô tả**: Đăng nhập và nhận access token + refresh token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Đăng nhập thành công!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", 
  "refreshToken": "a1b2c3d4e5f6...",
  "expiresIn": 900,
  "user": {
    "id": "user_id",
    "ten": "Tên user",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### 2. POST /api/refresh
**Mô tả**: Làm mới access token bằng refresh token

**Request**:
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response**:
```json
{
  "message": "Refresh token thành công!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "x1y2z3w4v5u6...",
  "expiresIn": 900,
  "user": {
    "id": "user_id",
    "ten": "Tên user", 
    "email": "user@example.com",
    "role": "user"
  }
}
```

### 3. POST /api/logout
**Mô tả**: Đăng xuất và thu hồi refresh token

**Request**:
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response**:
```json
{
  "message": "Đăng xuất thành công!"
}
```

## Cấu hình

### Token Lifetimes
- **Access Token**: 15 phút
- **Refresh Token**: 7 ngày

### Database Schema
**RefreshToken Collection**:
```javascript
{
  token: String (unique),
  userId: ObjectId (ref User),
  expiresAt: Date,
  isRevoked: Boolean,
  createdAt: Date,
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  }
}
```

## Middleware xác thực

Middleware `protect` đã được cập nhật để xử lý các loại lỗi token:
- `TOKEN_EXPIRED`: Access token hết hạn
- `INVALID_TOKEN`: Token không hợp lệ
- `NO_TOKEN`: Không có token
- `USER_NOT_FOUND`: User không tồn tại

## Test API

### Sử dụng file test:
```bash
cd backend
node test_refresh_token.js
```

### Test với Postman:

1. **Login** - POST `http://localhost:5000/api/login`
2. **Refresh** - POST `http://localhost:5000/api/refresh` 
3. **Protected Route** - GET `http://localhost:5000/api/profile` (với Authorization header)
4. **Logout** - POST `http://localhost:5000/api/logout`

## Tính năng bảo mật

✅ **Token Rotation**: Mỗi lần refresh sẽ tạo token mới và thu hồi token cũ
✅ **Device Tracking**: Lưu thông tin thiết bị (User Agent, IP)
✅ **Auto Expiry**: MongoDB tự động xóa token hết hạn
✅ **Revocation**: Có thể thu hồi token khi logout
✅ **Error Handling**: Phân loại rõ ràng các loại lỗi token

## Cấu trúc File

```
backend/
├── models/
│   ├── RefreshToken.js     # Model quản lý refresh token
│   └── User.js            # User model (đã có)
├── controllers/
│   └── userController.js  # Thêm refreshAccessToken, cập nhật login/logout
├── routes/
│   └── auth.js           # Thêm route /refresh
├── middleware/
│   └── authMiddleware.js # Cải thiện error handling
└── test_refresh_token.js # File test tự động
```

## Status: ✅ HOÀN THÀNH (SV1)

Đã triển khai đầy đủ các yêu cầu của SV1:
- ✅ API /auth/refresh
- ✅ Middleware xác thực Access Token  
- ✅ Lưu trữ Refresh Token trong database
- ✅ Test thành công với Postman/file test