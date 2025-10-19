# 📮 HƯỚNG DẪN TEST AVATAR API TRÊN POSTMAN

## 🚀 SETUP POSTMAN

### 1. Import Collection:
1. Mở Postman
2. Click **Import** 
3. Chọn file: `postman_avatar_api_collection.json`
4. Collection sẽ xuất hiện với 5 API endpoints

### 2. Setup Environment:
1. Tạo Environment mới tên: **Avatar API Test**
2. Add variable:
   - `baseUrl`: `http://localhost:5000`
   - `accessToken`: (để trống, sẽ điền sau)

---

## 🧪 TEST SEQUENCE

### ✅ BƯỚC 1: LOGIN ADMIN
**Request**: `POST /api/login`
```json
{
  "email": "admin1@gmail.com", 
  "password": "123456"
}
```

**Expected Response**:
```json
{
  "message": "Đăng nhập thành công!",
  "accessToken": "eyJhbGciOiJIUz...",
  "refreshToken": "fb7b139d22f277...",
  "user": {
    "id": "68f4ed97c717f775fd58a643",
    "ten": "Admin 1",
    "email": "admin1@gmail.com", 
    "role": "admin"
  }
}
```

**Action**: Copy `accessToken` để dùng cho các request tiếp theo

---

### ✅ BƯỚC 2: GET CURRENT AVATAR (trước khi upload)
**Request**: `GET /api/users/avatar`
**Headers**: 
- `Authorization: Bearer {{accessToken}}`

**Expected Response** (chưa có avatar):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "68f4ed97c717f775fd58a643",
      "ten": "Admin 1",
      "email": "admin1@gmail.com",
      "avatar": {
        "url": "",
        "uploadedAt": null
      }
    }
  }
}
```

---

### ✅ BƯỚC 3: UPLOAD AVATAR
**Request**: `POST /api/users/avatar`
**Headers**: 
- `Authorization: Bearer {{accessToken}}`
**Body**: `form-data`
- Key: `avatar` (type: File)
- Value: Chọn một file ảnh (JPG/PNG < 5MB)

**Expected Response**:
```json
{
  "success": true,
  "message": "Upload avatar thành công!",
  "data": {
    "user": {
      "_id": "68f4ed97c717f775fd58a643",
      "ten": "Admin 1", 
      "email": "admin1@gmail.com",
      "role": "admin",
      "avatar": {
        "url": "https://res.cloudinary.com/djjykndmz/image/upload/v1760881145/avatars/avatar_68e9251acd1bb1760413fe1f_1760881143020.jpg",
        "uploadedAt": "2025-10-19T13:39:06.681Z"
      }
    },
    "upload": {
      "url": "https://res.cloudinary.com/...",
      "size": "300x300",
      "format": "jpg",
      "bytes": 644
    }
  }
}
```

**✅ Kiểm tra**: Copy URL avatar và mở trong browser → should show resized image 300x300

---

### ✅ BƯỚC 4: GET AVATAR AFTER UPLOAD 
**Request**: `GET /api/users/avatar` (same as step 2)

**Expected Response** (có avatar rồi):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "68f4ed97c717f775fd58a643",
      "ten": "Admin 1",
      "email": "admin1@gmail.com", 
      "avatar": {
        "url": "https://res.cloudinary.com/djjykndmz/image/upload/v1760881145/avatars/avatar_68e9251acd1bb1760413fe1f_1760881143020.jpg",
        "uploadedAt": "2025-10-19T13:39:06.681Z"
      }
    }
  }
}
```

---

### ✅ BƯỚC 5: REPLACE AVATAR (upload lại)
**Request**: `POST /api/users/avatar` (same as step 3)
**Body**: Chọn file ảnh khác

**Expected**: 
- Old avatar tự động bị xóa trên Cloudinary
- New avatar uploaded với URL mới
- Response tương tự step 3 nhưng URL khác

---

### ✅ BƯỚC 6: DELETE AVATAR
**Request**: `DELETE /api/users/avatar`
**Headers**: 
- `Authorization: Bearer {{accessToken}}`

**Expected Response**:
```json
{
  "success": true,
  "message": "Xóa avatar thành công!",
  "data": {
    "user": {
      "_id": "68f4ed97c717f775fd58a643",
      "ten": "Admin 1",
      "email": "admin1@gmail.com",
      "avatar": {
        "url": "",
        "publicId": "",
        "uploadedAt": null
      }
    }
  }
}
```

**✅ Kiểm tra**: Avatar URL cũ không còn hoạt động (404 on Cloudinary)

---

## 🔒 ERROR TESTING

### ❌ Test Without Token:
**Request**: Bất kỳ endpoint nào không có Authorization header
**Expected**: `401 Unauthorized`

### ❌ Test Wrong File Type:
**Request**: Upload file .txt hoặc .pdf
**Expected**: `400 Bad Request` - "Chỉ cho phép upload file ảnh"

### ❌ Test Large File:
**Request**: Upload file > 5MB  
**Expected**: `400 Bad Request` - "File quá lớn"

### ❌ Test No File:
**Request**: POST upload without file
**Expected**: `400 Bad Request` - "Vui lòng chọn file ảnh"

---

## 🏆 EXPECTED RESULTS SUMMARY

✅ **Login**: Get valid JWT token  
✅ **Get Avatar**: Return avatar info (empty initially)  
✅ **Upload**: File uploaded to Cloudinary, resized 300x300  
✅ **Replace**: Old avatar deleted, new one uploaded  
✅ **Delete**: Avatar removed from cloud & database  
✅ **Error Handling**: Proper validation & error messages  

---

## 📊 CLOUDINARY VERIFICATION

Sau khi test upload, check trên Cloudinary Dashboard:
1. Login: https://cloudinary.com
2. Media Library → avatars folder
3. Confirm ảnh được upload với:
   - ✅ Size: 300x300px
   - ✅ Format: JPEG optimized
   - ✅ Folder: `avatars/`
   - ✅ Public ID format: `avatar_{userId}_{timestamp}`

---

## 🚀 POSTMAN TEST REPORT

Sau khi test xong, export kết quả:
1. **Run Collection** → chạy tất cả tests
2. **Export Results** → save test report  
3. **Screenshots** → chụp màn hình responses thành công

**🎯 POSTMAN TESTING: HOÀN THÀNH** ✅