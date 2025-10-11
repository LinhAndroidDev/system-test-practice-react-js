# 🧪 Hướng dẫn Test Register API

## 📋 API Details

### Endpoint
```
POST http://localhost:8080/api/auth/register
```

### Request Body
```json
{
  "name": "Phan Văn Hùng",
  "email": "hungpv@gmail.com",
  "password": "1234567",
  "role": 0
}
```

### Expected Response
```json
{
  "data": {
    "userId": 2
  },
  "message": "Registration successful!",
  "status": 200
}
```

---

## 🎯 Cách Test

### **Option 1: Test trong React App**

1. Chạy React app:
```bash
npm start
```

2. Mở browser và truy cập:
```
http://localhost:3000/test-register
```

3. Form sẽ có sẵn data mẫu, click "📤 Gửi Request"

4. Xem kết quả response ngay trên trang

---

### **Option 2: Test với HTML file**

1. Mở file:
```
test-register-api.html
```

2. Double click để mở trong browser

3. Điền thông tin và click "📤 Gửi Request"

---

### **Option 3: Test với curl**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phan Văn Hùng",
    "email": "hungpv@gmail.com",
    "password": "1234567",
    "role": 0
  }'
```

---

### **Option 4: Test với Postman**

1. Method: **POST**
2. URL: `http://localhost:8080/api/auth/register`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "Phan Văn Hùng",
  "email": "hungpv@gmail.com",
  "password": "1234567",
  "role": 0
}
```

---

## 📝 Test Cases

### ✅ Test Case 1: Đăng ký thành công
**Input:**
```json
{
  "name": "Phan Văn Hùng",
  "email": "hungpv@gmail.com",
  "password": "1234567",
  "role": 0
}
```

**Expected Output:**
```json
{
  "data": {
    "userId": 2
  },
  "message": "Registration successful!",
  "status": 200
}
```

---

### ❌ Test Case 2: Email đã tồn tại
**Input:**
```json
{
  "name": "Test User",
  "email": "hungpv@gmail.com",  // Email đã được đăng ký
  "password": "1234567",
  "role": 0
}
```

**Expected Output:**
```json
{
  "message": "Email đã tồn tại",
  "status": 400
}
```

---

### ❌ Test Case 3: Thiếu thông tin
**Input:**
```json
{
  "name": "Test User",
  "email": "test@gmail.com"
  // Thiếu password và role
}
```

**Expected Output:**
```json
{
  "message": "Validation error",
  "status": 400
}
```

---

## 🔍 Kiểm tra Response

### Response thành công cần có:
✅ `status: 200`  
✅ `data.userId` - ID của user mới tạo  
✅ `message` - Thông báo thành công  

### Code trong AuthService.js đã xử lý:
```javascript
// Response format: { data: { userId: 2 }, message: "...", status: 200 }
if (data.status === 200 && data.data) {
  return {
    success: true,
    userId: data.data.userId,
    message: data.message || "Đăng ký thành công!",
  };
}
```

---

## 🐛 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, backend cần enable CORS:
```java
// Spring Boot
@CrossOrigin(origins = "http://localhost:3000")
```

### Server không chạy
Kiểm tra backend đang chạy ở port 8080:
```bash
curl http://localhost:8080/api/health
```

### Network Error
- Kiểm tra backend có đang chạy không
- Kiểm tra URL đúng chưa
- Mở DevTools → Network tab để xem request

---

## 📌 Notes

1. **Role values:**
   - `0` = User thường
   - `1` = Admin

2. **Password requirements:**
   - Tối thiểu 6 ký tự
   - Validation ở cả frontend và backend

3. **Email validation:**
   - Phải đúng format email
   - Phải unique trong database

4. **Response trả về userId:**
   - Dùng để reference user trong các API khác
   - Có thể dùng để tự động login sau khi register

