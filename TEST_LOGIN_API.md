# 🧪 Hướng dẫn Test Login API

## 📋 API Details

### Endpoint
```
POST http://localhost:8080/api/auth/login
```

### Request Body
```json
{
  "email": "linh@gmail.com",
  "password": "1234567"
}
```

### Expected Response
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

---

## 🎯 Cách Test

### **Option 1: Test trong React App** (Recommended)

1. Chạy React app:
```bash
npm start
```

2. Mở browser và truy cập:
```
http://localhost:3000/test-login
```

3. Form sẽ có sẵn data mẫu, click "🔐 Đăng nhập"

4. Xem kết quả response với parsed data và localStorage status

**Features:**
- ✅ Form với data mẫu
- ✅ Display request body
- ✅ Display full response JSON
- ✅ Parsed data (userId, username, role, token)
- ✅ localStorage status (real-time)
- ✅ Clear token button
- ✅ Console logs chi tiết

---

### **Option 2: Test với HTML file**

1. Mở file:
```
test-login-api.html
```

2. Double click để mở trong browser

3. Điền thông tin và click "🔐 Đăng nhập"

4. Token tự động lưu vào localStorage

---

### **Option 3: Test với curl**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "linh@gmail.com",
    "password": "1234567"
  }'
```

---

### **Option 4: Test với Postman**

1. Method: **POST**
2. URL: `http://localhost:8080/api/auth/login`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "linh@gmail.com",
  "password": "1234567"
}
```

---

## 📝 Test Cases

### ✅ Test Case 1: Đăng nhập thành công
**Input:**
```json
{
  "email": "linh@gmail.com",
  "password": "1234567"
}
```

**Expected Output:**
```json
{
  "data": {
    "userId": 1,
    "username": "Linh",
    "role": 0,
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
    }
  },
  "message": "Login successful!",
  "status": 200
}
```

**Expected localStorage:**
```javascript
authToken: "eyJhbGciOiJIUzI1NiJ9..."
userData: '{"id":1,"name":"Linh","email":"linh@gmail.com","role":0}'
```

---

### ❌ Test Case 2: Sai mật khẩu
**Input:**
```json
{
  "email": "linh@gmail.com",
  "password": "wrongpassword"
}
```

**Expected Output:**
```json
{
  "message": "Email hoặc mật khẩu không đúng",
  "status": 401
}
```

---

### ❌ Test Case 3: Email không tồn tại
**Input:**
```json
{
  "email": "notexist@gmail.com",
  "password": "1234567"
}
```

**Expected Output:**
```json
{
  "message": "Email không tồn tại",
  "status": 404
}
```

---

### ❌ Test Case 4: Thiếu thông tin
**Input:**
```json
{
  "email": "linh@gmail.com"
  // Thiếu password
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

## 🔍 AuthService.js Xử lý Response

### Code đã được cập nhật:
```javascript
// Response format: { data: { userId, username, role, auth: { accessToken } }, message, status }
if (data.status === 200 && data.data && data.data.auth) {
  const { userId, username, role, auth } = data.data;
  
  // Save token to localStorage
  localStorage.setItem("authToken", auth.accessToken);
  
  // Save user data
  const userData = {
    id: userId,
    name: username,
    email: credentials.email,
    role: role,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
  
  return {
    success: true,
    user: userData,
    token: auth.accessToken,
    message: data.message || "Đăng nhập thành công!",
  };
}
```

---

## 💾 LocalStorage Management

### Được lưu sau khi login thành công:

**1. authToken**
```javascript
localStorage.getItem("authToken")
// "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaW5oQGdtYWlsLmNvbSIsImlhdCI6MTc2MDEyMjExMywiZXhwIjoxNzYwMTI1NzEzfQ.70D_5UPEihwcgoGcN-Q0G7G__-4Ngp2vGXGdffqtKUo"
```

**2. userData**
```javascript
localStorage.getItem("userData")
// '{"id":1,"name":"Linh","email":"linh@gmail.com","role":0}'
```

### Sử dụng trong các API call khác:
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

## 🔐 JWT Token Details

### Token Structure:
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaW5oQGdtYWlsLmNvbSIsImlhdCI6MTc2MDEyMjExMywiZXhwIjoxNzYwMTI1NzEzfQ.70D_5UPEihwcgoGcN-Q0G7G__-4Ngp2vGXGdffqtKUo
```

**Decoded Payload:**
```json
{
  "sub": "linh@gmail.com",
  "iat": 1760122113,
  "exp": 1760125713
}
```

**Fields:**
- `sub`: Email (subject)
- `iat`: Issued at (timestamp)
- `exp`: Expiration time (timestamp)

**Token lifetime:** 1 hour (3600 seconds)

---

## 🎭 Role System

| Role Value | Meaning | Description |
|------------|---------|-------------|
| 0 | User | User thường |
| 1 | Admin | Quản trị viên |

**Used for:**
- Authorization checks
- UI conditional rendering
- API permission validation

---

## 🐛 Troubleshooting

### Lỗi CORS
Backend cần enable CORS:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Token expired
- Check `exp` trong JWT payload
- Re-login để lấy token mới
- Implement token refresh mechanism

### Network Error
1. Kiểm tra backend đang chạy
2. Verify URL đúng
3. Check browser DevTools → Network tab

### LocalStorage không lưu
1. Check browser privacy settings
2. Ensure not in incognito/private mode
3. Verify JavaScript không bị block

---

## 📊 Testing Workflow

### Complete Flow:
```
1. User nhập email + password
   ↓
2. Frontend gửi POST /api/auth/login
   ↓
3. Backend validate credentials
   ↓
4. Backend generate JWT token
   ↓
5. Backend return response with token
   ↓
6. Frontend save token to localStorage
   ↓
7. Frontend save userData to localStorage
   ↓
8. Frontend redirect to home page
   ↓
9. Frontend use token for subsequent API calls
```

### Verify Success:
✅ Response status = 200  
✅ Token exists in localStorage  
✅ userData exists in localStorage  
✅ User redirected to home page  
✅ AuthContext updated  
✅ UI shows user info  

---

## 🚀 Integration với React App

### AuthContext tự động cập nhật:
```javascript
// After successful login
authController.login(formData)
  ↓
authService.login(credentials)
  ↓
localStorage.setItem("authToken", token)
  ↓
AuthContext updates
  ↓
UI re-renders with user info
```

### Sử dụng trong components:
```javascript
import { useAuth } from "./contexts/AuthContext";

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      Welcome, {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 📌 Important Notes

1. **Token Security:**
   - Token trong localStorage có thể bị XSS attack
   - Consider httpOnly cookies cho production
   - Always use HTTPS in production

2. **Token Expiration:**
   - Default: 1 hour
   - Frontend cần handle expired token
   - Implement auto logout when expired

3. **Password Security:**
   - Never log password trong production
   - Backend phải hash password (bcrypt)
   - Enforce strong password policy

4. **Error Handling:**
   - Display user-friendly error messages
   - Log technical errors for debugging
   - Don't expose sensitive info in errors

---

## ✨ Features Checklist

- ✅ API call với đúng format
- ✅ Response parsing
- ✅ Token storage
- ✅ User data storage
- ✅ Error handling
- ✅ Loading states
- ✅ Auto redirect
- ✅ Console logging
- ✅ Test tools (React + HTML)
- ✅ Documentation
- ✅ Integration với AuthContext
- ✅ Clear token functionality

**Everything is ready to use!** 🎉

