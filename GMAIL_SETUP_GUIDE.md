# 🔧 SV3: Gmail SMTP Configuration Guide - nguyenquocvinh

## 📧 Cách Setup Gmail để gửi email thật

### Bước 1: Tạo Gmail App Password

1. **Đăng nhập Gmail** của bạn
2. Vào **Google Account Settings**: https://myaccount.google.com/
3. Chọn **Security** (Bảo mật)
4. Bật **2-Step Verification** (Xác minh 2 bước) nếu chưa có
5. Trong phần **2-Step Verification**, chọn **App passwords**
6. Chọn **Select app** → **Other (Custom name)**
7. Nhập tên: **RBAC System**
8. Click **Generate**
9. **Copy 16-character password** (dạng: `abcd efgh ijkl mnop`)

### Bước 2: Cập nhật file .env

Mở file `backend/.env` và cập nhật:

```env
# Email Configuration - SV3
EMAIL_USER=your-gmail@gmail.com          # Thay bằng Gmail thật của bạn
EMAIL_PASS=abcd efgh ijkl mnop           # Thay bằng App Password vừa tạo (16 ký tự)
```

### Bước 3: Test Email Service

```bash
cd backend
node test_email_service.js
```

## 🎯 Email Templates sẽ gửi:

### 1. Password Reset Request
- **Subject**: 🔐 Reset Your Password - RBAC System
- **Nội dung**: HTML email đẹp với reset link
- **Expires**: 1 giờ
- **Security**: Token chỉ dùng 1 lần

### 2. Reset Confirmation
- **Subject**: ✅ Password Reset Successful - RBAC System
- **Nội dung**: Xác nhận password đã đổi thành công

## 🔒 Security Features:

1. **Token Expiry**: 1 giờ tự động hết hạn
2. **Single Use**: Token chỉ dùng được 1 lần
3. **Secure Headers**: High priority email
4. **HTML + Text**: Hỗ trợ cả 2 format
5. **User Info**: Hiển thị thông tin account và thời gian

## 📝 Thông tin team:

- **SV3**: nguyenquocvinh - Email Service & SMTP Configuration
- **SV1**: huynhvantai - API Endpoints (tiếp theo)
- **SV2**: phamquanghuy1661 - Frontend Forms (tiếp theo)

## 🚀 Test Commands:

```bash
# Test email service
node test_email_service.js

# Start server với email
npm start

# Check logs
npm run dev
```

## ⚠️ Lưu ý quan trọng:

1. **App Password ≠ Gmail Password**: Phải dùng App Password 16 ký tự
2. **2-Factor Authentication**: Bắt buộc phải bật để tạo App Password
3. **Less Secure Apps**: Không cần bật (deprecated)
4. **Gmail SMTP**: Port 587, TLS enabled
5. **Rate Limit**: Gmail có giới hạn gửi email (500/day cho free)

## 🎉 Sau khi setup xong:

1. Email sẽ được gửi từ Gmail thật của bạn
2. User nhận email trong hộp thư thật
3. Click link hoặc copy token để reset password
4. Hệ thống tự động xác thực và đổi password

**Ready cho SV1 implement API endpoints! 🚀**