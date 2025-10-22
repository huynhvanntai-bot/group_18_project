# Hoạt động 7 — Tổng hợp & Merge vào Main

Tài liệu hướng dẫn nhanh để chạy và kiểm thử toàn bộ flow (đăng ký, đăng nhập, refresh token, upload avatar, reset password, xem logs, phân quyền).

## Yêu cầu môi trường
- Node.js 16+ (LTS)
- MongoDB (local hoặc Atlas) — đặt `MONGO_URI` trong file `.env` của `backend`
- Cập nhật các biến ENV trong `backend/.env`:
  - MONGO_URI
  - JWT_SECRET
  - FRONTEND_URL (ví dụ: http://localhost:3000)
  - CLOUDINARY_... (nếu dùng upload avatar với Cloudinary) — optional
  - EMAIL_* (nếu muốn dùng email service) — optional

## Chạy backend (chạy trong thư mục `backend`)

Windows PowerShell (hoặc bash):
```powershell
cd backend
npm install
# tạo file .env theo mẫu (MONGO_URI, JWT_SECRET,...)
npm run dev
```

Mặc định server lắng nghe: http://localhost:5000

## Chạy frontend (thư mục `frontend`)

```powershell
cd frontend
npm install
npm start
```

Mặc định frontend lắng nghe: http://localhost:3000

## API Endpoints chính
- POST /api/signup — đăng ký public
- POST /api/login — đăng nhập -> trả về accessToken + refreshToken
- POST /api/refresh — lấy access token mới
- POST /api/logout — hủy refresh token
- GET /api/admin/logs — (admin) xem logs
- POST /api/admin/users — (admin) tạo user
- POST /api/users/avatar — upload avatar (Authenticated)
- POST /api/forgot-password — gửi email reset
- POST /api/reset-password — reset mật khẩu bằng token

## Postman / cURL test snippets

Notes: thay `BASE` bằng `http://localhost:5000`. Nếu cần Authorization, set header `Authorization: Bearer <accessToken>`.

1) Đăng ký (signup)

curl:
```powershell
curl -X POST "http://localhost:5000/api/signup" -H "Content-Type: application/json" -d '{"ten":"Test User","email":"test1@example.com","password":"Password123"}'
```

2) Đăng nhập (login)

curl:
```powershell
curl -X POST "http://localhost:5000/api/login" -H "Content-Type: application/json" -d '{"email":"test1@example.com","password":"Password123"}'
```

Lưu `accessToken` và `refreshToken` từ response.

3) Refresh token

curl:
```powershell
curl -X POST "http://localhost:5000/api/refresh" -H "Content-Type: application/json" -d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

4) Upload avatar (multipart/form-data)

curl (PowerShell syntax):
```powershell
curl -X POST "http://localhost:5000/api/users/avatar" -H "Authorization: Bearer <ACCESS_TOKEN>" -F "avatar=@C:\path\to\avatar.jpg"
```

5) Forgot password

curl:
```powershell
curl -X POST "http://localhost:5000/api/forgot-password" -H "Content-Type: application/json" -d '{"email":"test1@example.com"}'
```

6) Reset password (token from email)

curl:
```powershell
curl -X POST "http://localhost:5000/api/reset-password" -H "Content-Type: application/json" -d '{"token":"<RESET_TOKEN>","newPassword":"NewPass123"}'
```

7) View logs (admin)

curl:
```powershell
curl -X GET "http://localhost:5000/api/admin/logs" -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

8) Create user (admin)

curl:
```powershell
curl -X POST "http://localhost:5000/api/admin/users" -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" -H "Content-Type: application/json" -d '{"username":"newuser","email":"new@example.com","password":"Password123","role":"user"}'
```

## Demo checklist (để quay video hoặc kiểm thử bằng tay)
1. Khởi chạy MongoDB, backend và frontend.
2. Đăng ký user mới và xác nhận response.
3. Đăng nhập -> lưu access/refresh token.
4. Dùng access token call một route bảo mật (ví dụ /api/users/profile).
5. Thử refresh token khi access token hết hạn.
6. Upload avatar.
7. Gửi forgot-password và reset password flow.
8. Đăng nhập bằng admin (hoặc tạo admin via DB) và truy cập /api/admin/logs.
9. Tạo user từ Admin UI hoặc curl and confirm in users list.

## Ghi chú
- Nếu frontend và backend chạy trên host/port khác, cập nhật `FRONTEND_URL` và code gọi API nếu cần.
- Nếu dùng Cloudinary, đảm bảo biến môi trường cấu hình chính xác.
- Postman collection có sẵn trong thư mục `postman/` của repo.

---
Created for Hoạt động 7 by team. Commit author will be set as requested when pushing.
