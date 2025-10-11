# 🔐 Token Authentication Implementation

## 📋 Tổng quan

Tất cả các API calls trong app (Subject, Question, Exam) đã được cập nhật để tự động gửi JWT token trong header `Authorization`.

---

## 🎯 Cách hoạt động

### 1. **Login thành công**
```javascript
// User login
POST /api/auth/login
Response: {
  data: {
    auth: {
      accessToken: "eyJhbGciOiJIUzI1NiJ9..."
    }
  }
}

// Token được lưu vào localStorage
localStorage.setItem("authToken", accessToken);
```

### 2. **Token tự động gửi trong mọi API call**
```javascript
// Mỗi Service có method getAuthHeaders()
getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Sử dụng trong fetch
fetch(url, {
  method: 'POST',
  headers: this.getAuthHeaders(),  // ← Token tự động thêm
  body: JSON.stringify(data)
})
```

---

## 📁 Files đã cập nhật

### ✅ **SubjectService.js**
```javascript
class SubjectService {
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getSubjects() {
    const response = await fetch(`${this.baseUrl}/get_subjects`, {
      headers: this.getAuthHeaders()  // ← Token included
    });
  }

  async createSubject(data) {
    const response = await fetch(`${this.baseUrl}/add_subject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),  // ← Token included
      body: JSON.stringify(data)
    });
  }

  async updateSubject(id, data) { /* Token included */ }
  async deleteSubject(id) { /* Token included */ }
}
```

### ✅ **QuestionService.js**
```javascript
class QuestionService {
  getAuthHeaders() { /* Same as above */ }
  
  async getQuestions() { /* Token included */ }
  async getQuestionsBySubject(subjectId) { /* Token included */ }
  async createQuestion(data) { /* Token included */ }
  async updateQuestion(id, data) { /* Token included */ }
  async deleteQuestion(id) { /* Token included */ }
}
```

### ✅ **ExamService.js**
```javascript
class ExamService {
  getAuthHeaders() { /* Same as above */ }
  
  async getExams() { /* Token included */ }
  async createExam(data) { /* Token included */ }
  async updateExam(id, data) { /* Token included */ }
  async deleteExam(id) { /* Token included */ }
}
```

---

## 🔍 Request Headers

### **Khi CHƯA đăng nhập** (Guest mode)
```http
GET /api/subject/get_subjects HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

### **Khi ĐÃ đăng nhập** (Authenticated)
```http
GET /api/subject/get_subjects HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaW5oQGdtYWlsLmNvbSIsImlhdCI6MTc2MDEyMjExMywiZXhwIjoxNzYwMTI1NzEzfQ.70D_5UPEihwcgoGcN-Q0G7G__-4Ngp2vGXGdffqtKUo
```

---

## 🔄 Flow hoàn chỉnh

```
1. User login
   ↓
2. Backend trả về accessToken
   ↓
3. Frontend lưu token vào localStorage
   ↓
4. User thực hiện action (thêm/sửa/xóa)
   ↓
5. Service.getAuthHeaders() lấy token từ localStorage
   ↓
6. Thêm "Authorization: Bearer <token>" vào headers
   ↓
7. Gửi request đến backend
   ↓
8. Backend verify token
   ↓
9. Backend xử lý request
   ↓
10. Trả về response
```

---

## 🛡️ Security Features

### ✅ **Tự động thêm token**
- Không cần manually thêm token mỗi lần
- DRY principle - code reuse
- Consistent across all services

### ✅ **Graceful degradation**
- Nếu không có token → chỉ gửi Content-Type
- App vẫn work cho guest users
- Backend quyết định access control

### ✅ **Token từ localStorage**
- Persistent across page reloads
- Shared across all tabs
- Easy to clear on logout

---

## 🧪 Testing

### **Test với browser DevTools:**

1. **Open DevTools → Network tab**

2. **Trước khi login:**
   - Thực hiện action (get subjects)
   - Check request headers
   - ❌ Không có Authorization header

3. **Sau khi login:**
   - Thực hiện action (get subjects)
   - Check request headers
   - ✅ Có Authorization: Bearer <token>

4. **Verify token:**
```javascript
// Console
localStorage.getItem('authToken')
// "eyJhbGciOiJIUzI1NiJ9..."
```

---

## 📊 All API Endpoints with Token

### **Subject APIs**
| Method | Endpoint | Token Required |
|--------|----------|----------------|
| GET | `/api/subject/get_subjects` | ✅ Auto-included |
| POST | `/api/subject/add_subject` | ✅ Auto-included |
| PUT | `/api/subject/update` | ✅ Auto-included |
| DELETE | `/api/subject/delete/{id}` | ✅ Auto-included |

### **Question APIs**
| Method | Endpoint | Token Required |
|--------|----------|----------------|
| GET | `/api/question/get_questions` | ✅ Auto-included |
| GET | `/api/question/get_by_subject/{id}` | ✅ Auto-included |
| POST | `/api/question/add_question` | ✅ Auto-included |
| PUT | `/api/question/update` | ✅ Auto-included |
| DELETE | `/api/question/delete/{id}` | ✅ Auto-included |

### **Exam APIs**
| Method | Endpoint | Token Required |
|--------|----------|----------------|
| GET | `/api/exam/get_exams` | ✅ Auto-included |
| POST | `/api/exam/add_exam` | ✅ Auto-included |
| PUT | `/api/exam/update` | ✅ Auto-included |
| DELETE | `/api/exam/delete/{id}` | ✅ Auto-included |

---

## 🔧 Backend Requirements

Backend cần:

### ✅ **1. Verify JWT Token**
```java
// Spring Security
@Configuration
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {
    http
      .authorizeRequests()
      .antMatchers("/api/auth/**").permitAll()
      .anyRequest().authenticated()
      .and()
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
  }
}
```

### ✅ **2. Extract Token từ Header**
```java
String authHeader = request.getHeader("Authorization");
if (authHeader != null && authHeader.startsWith("Bearer ")) {
  String token = authHeader.substring(7);
  // Verify token
}
```

### ✅ **3. Handle Token Expiration**
```java
// Return 401 if token expired
if (isTokenExpired(token)) {
  return ResponseEntity
    .status(HttpStatus.UNAUTHORIZED)
    .body("Token expired");
}
```

---

## 🐛 Troubleshooting

### **Problem: 401 Unauthorized**
**Cause:** Token không hợp lệ hoặc đã hết hạn

**Solution:**
1. Check localStorage có token không
2. Check token format (Bearer + space + token)
3. Verify token chưa expired
4. Re-login để lấy token mới

---

### **Problem: Token không được gửi**
**Cause:** localStorage bị clear hoặc user chưa login

**Solution:**
1. Check `localStorage.getItem('authToken')`
2. Login lại
3. Verify token được save sau khi login

---

### **Problem: CORS error**
**Cause:** Backend chưa allow Authorization header

**Solution:**
```java
@CrossOrigin(
  origins = "http://localhost:3000",
  allowedHeaders = {"Authorization", "Content-Type"}
)
```

---

## 💡 Best Practices

### ✅ **Do's:**
1. ✅ Always check token existence trước khi gửi
2. ✅ Handle 401 errors gracefully
3. ✅ Clear token on logout
4. ✅ Use HTTPS in production
5. ✅ Set reasonable token expiration (1 hour)

### ❌ **Don'ts:**
1. ❌ Không log token ra console trong production
2. ❌ Không gửi token trong URL parameters
3. ❌ Không lưu token vào cookies (XSS risk)
4. ❌ Không hardcode token
5. ❌ Không share token giữa users

---

## 🎯 Summary

| Feature | Status |
|---------|--------|
| Token lưu trong localStorage | ✅ |
| Auto-add token to all API calls | ✅ |
| SubjectService updated | ✅ |
| QuestionService updated | ✅ |
| ExamService updated | ✅ |
| getAuthHeaders() method | ✅ |
| Guest mode support | ✅ |
| Authenticated mode support | ✅ |
| Token in Authorization header | ✅ |
| Bearer token format | ✅ |

---

## ✨ Example Usage

### **Example 1: Get Subjects**
```javascript
// User đã login
// Token: "eyJhbGciOiJIUzI1NiJ9..."

const subjectService = new SubjectService();
const subjects = await subjectService.getSubjects();

// Request gửi đi:
// GET /api/subject/get_subjects
// Headers:
//   Content-Type: application/json
//   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### **Example 2: Create Question**
```javascript
const questionService = new QuestionService();
await questionService.createQuestion(questionData);

// Request gửi đi:
// POST /api/question/add_question
// Headers:
//   Content-Type: application/json
//   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
// Body: { content, optionA, optionB, ... }
```

---

**🎉 Token authentication đã được tích hợp hoàn chỉnh vào tất cả các API calls!**

✅ Secure  
✅ Automatic  
✅ Consistent  
✅ Production-ready  

