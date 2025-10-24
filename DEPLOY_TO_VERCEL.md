Hướng dẫn triển khai frontend React lên Vercel (chi tiết, cho repo mono)

Mục tiêu: tạo branch sẵn sàng import vào Vercel và có hướng dẫn từng bước, kèm cấu hình tối thiểu để SPA hoạt động.

1) Kiểm tra thư mục frontend
- Trong repo này, thư mục frontend là `frontend/`.

2) Tạo branch deploy (đã có thể tự động push bằng script kèm theo)
- Branch được sử dụng: `deploy/frontend-vercel` (có thể đổi tên tuỳ bạn).

3) File cấu hình deploy
- `frontend/vercel.json` xác định cách Vercel build và route SPA.
- `frontend/.vercelignore` loại trừ các file không cần thiết.

4) Thiết lập biến môi trường trên Vercel
- REACT_APP_API_URL = https://your-backend.example.com (Production)
- Nếu bạn dùng Preview deployments cho PR, thêm biến tương ứng cho `Preview`.

5) Các bước trên web UI Vercel
- Đăng nhập -> New Project -> Import Git Repository
- Chọn repo chứa project này
- Trong màn hình Configure Project:
  - Framework Preset: "Create React App" hoặc "React"
  - Root Directory: `frontend/`
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Add Environment Variable: `REACT_APP_API_URL` (Production/Preview as needed)
- Deploy

6) Sau deploy
- Kiểm tra console/network của site; nếu API request lỗi do CORS, thêm domain Vercel vào backend CORS allow list.

7) Nếu muốn dùng Vercel CLI thay vì Web UI
- Cài vercel: `npm i -g vercel`
- Đăng nhập: `vercel login`
- Từ folder `frontend/`: `vercel --prod`

8) Kiểm tra nhanh
- Mở domain do Vercel cấp. Test: register/login/upload avatar (network shows requests to `REACT_APP_API_URL`).

9) Ghi chú cho giáo viên / nộp bài
- Chụp ảnh màn hình: (1) màn hình Deploy success trên Vercel (domain), (2) giao diện web hiển thị, (3) Postman test thành công (login + upload avatar).
- Kèm đường dẫn repo + branch `deploy/frontend-vercel`.

---
Nếu bạn muốn, tôi sẽ tự động tạo branch, commit và push các file hỗ trợ (tôi đã chuẩn bị các file trong repo). Sau đó bạn chỉ cần mở Vercel UI và import branch này.
