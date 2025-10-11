# API Format - Authentication

## 📝 Tổng quan
Document này mô tả format request/response cho các API authentication.

---

## 1. Đăng ký (Register)

### **POST** `/api/auth/register`

#### Request Body:
```json
{
  "name": "Phan Văn Hùng",
  "email": "hungpv@gmail.com",
  "password": "1234567",
  "role": 0
}
```

**Fields:**
- `name` (string, required): Tên người dùng
- `email` (string, required): Email đăng nhập
- `password` (string, required): Mật khẩu (tối thiểu 6 ký tự)
- `role` (number, required): Vai trò (0 = user thường, 1 = admin)

#### Response (Success - 200):
```json
{
  "data": {
    "userId": 2
  },
  "message": "Registration successful!",
  "status": 200
}
```

#### Response (Error - 400):
```json
{
  "message": "Email đã tồn tại",
  "status": 400
}
```

---

## 2. Đăng nhập (Login)

### **POST** `/api/auth/login`

#### Request Body:
```json
{
  "email": "linh@gmail.com",
  "password": "1234567"
}
```

**Fields:**
- `email` (string, required): Email đăng nhập
- `password` (string, required): Mật khẩu

#### Response (Success - 200):
```json
{
  "data": {
    "userId": 1,
    "username": "Linh",
    "role": 0,
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaW5oQGdtYWlsLmNvbSIsImlhdCI6MTc2MDEyMjExMywiZXhwIjoxNzYwMTI1NzEzfQ.70D_5UPEihwcgoGcN-Q0G7G__-4Ngp2vGXGdffqtKUo"
    }
  },
  "message": "Login successful!",
  "status": 200
}
```

**Response Fields:**
- `data.userId` (number): ID của user
- `data.username` (string): Tên user
- `data.role` (number): Vai trò (0 = user, 1 = admin)
- `data.auth.accessToken` (string): JWT token để authenticate các request sau
- `message` (string): Thông báo
- `status` (number): HTTP status code

#### Response (Error - 401):
```json
{
  "message": "Email hoặc mật khẩu không đúng",
  "status": 401
}
```

---

## 3. Validation Rules

### Đăng ký:
- **name**: Bắt buộc, chuỗi không rỗng
- **email**: Bắt buộc, định dạng email hợp lệ
- **password**: Bắt buộc, tối thiểu 6 ký tự

### Đăng nhập:
- **email**: Bắt buộc, định dạng email hợp lệ
- **password**: Bắt buộc

---

## 4. Authentication Token

Token (accessToken) được lưu trong `localStorage` với key `authToken`.

### Header cho các request cần authentication:
```
Authorization: Bearer <accessToken>
```

**Example:**
```javascript
const token = localStorage.getItem("authToken");
fetch("http://localhost:8080/api/subjects", {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
```

---

## 5. Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (wrong credentials) |
| 409 | Conflict (email already exists) |
| 500 | Internal Server Error |

---

## 6. Local Storage Keys

- `authToken`: JWT access token (string)
- `userData`: JSON string of user object

**Example userData:**
```json
{
  "id": 1,
  "name": "Linh",
  "email": "linh@gmail.com",
  "role": 0
}
```

---

## 📌 Notes

1. Token có thời gian hết hạn (do backend quyết định)
2. Khi logout, cần xóa cả `authToken` và `userData` khỏi localStorage
3. Mật khẩu phải được hash ở backend (bcrypt recommended)
4. Frontend validate form trước khi gửi request

