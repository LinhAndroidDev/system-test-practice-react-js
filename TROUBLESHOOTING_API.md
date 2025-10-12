# 🔧 Troubleshooting API Errors

## ❌ Lỗi: POST http://localhost:8080/api/subject net::ERR_FAILED

### 🔍 Nguyên nhân có thể:

#### **1. Backend chưa cập nhật endpoint mới** ⚠️
Backend có thể vẫn đang dùng endpoint cũ `/api/subject/add_subject` thay vì `/api/subject`

**Giải pháp:**
```java
// Backend cần có endpoint này:
@PostMapping("/api/subject")  // ← Không phải /add_subject
public ResponseEntity<?> createSubject(@RequestBody SubjectRequest request) {
    // ...
}
```

---

#### **2. CORS chưa được enable** 🚫
Backend cần enable CORS cho phép request từ `http://localhost:3000`

**Giải pháp:**
```java
@CrossOrigin(
    origins = "http://localhost:3000",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowedHeaders = {"Authorization", "Content-Type"}
)
```

---

#### **3. Backend không chạy** 🛑
Server backend có thể đã bị tắt

**Giải pháp:**
```bash
# Check backend có đang chạy không
curl http://localhost:8080/api/subject/get_subjects

# Nếu không có response → Backend đã tắt
# Start lại backend
```

---

#### **4. Authorization header issue** 🔐
Backend có thể reject request vì thiếu hoặc invalid token

**Giải pháp:**
```java
// Backend cần config để accept Bearer token
@Configuration
public class SecurityConfig {
    // Allow OPTIONS requests (preflight)
    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    // Require auth for others
    .anyRequest().authenticated()
}
```

---

## 🧪 Debug Steps

### **Step 1: Check Console Logs**

Với code đã update, bạn sẽ thấy logs trong console:

```javascript
📤 Creating subject: {
  url: "http://localhost:8080/api/subject",
  method: "POST",
  data: { nameSubject: "Toán học" }
}
```

Nếu thấy log này → Frontend đang gửi đúng request

---

### **Step 2: Check Network Tab**

**Mở DevTools → Network:**

1. Tìm request `subject` (màu đỏ)
2. Click vào để xem details
3. Check:
   - **Request URL:** `http://localhost:8080/api/subject`
   - **Request Method:** POST
   - **Status Code:** (failed)
   - **Headers:**
     - Authorization: Bearer ...
     - Content-Type: application/json

---

### **Step 3: Test Backend trực tiếp**

#### **A. Test với curl:**

```bash
# 1. Login để lấy token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"linh@gmail.com","password":"1234567"}'

# Copy accessToken từ response

# 2. Test create subject
curl -X POST http://localhost:8080/api/subject \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"nameSubject":"Test Subject"}'
```

**Expected response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [...]
}
```

**Nếu lỗi 404:** Backend chưa có endpoint `/api/subject` với POST method
**Nếu lỗi 401:** Token issue
**Nếu lỗi 403:** Authorization issue
**Nếu connection refused:** Backend không chạy

---

#### **B. Test với Postman:**

1. **Method:** POST
2. **URL:** `http://localhost:8080/api/subject`
3. **Headers:**
   - Authorization: `Bearer YOUR_TOKEN`
   - Content-Type: `application/json`
4. **Body (raw JSON):**
```json
{
  "nameSubject": "Test Subject"
}
```

5. Click **Send**

---

### **Step 4: Check Backend Logs**

Check backend console để xem:
- Request có đến backend không?
- Error message là gì?
- Endpoint có tồn tại không?

---

## 🔄 Temporary Workaround

Nếu backend chưa update được ngay, tạm thời rollback frontend về endpoint cũ:

### **SubjectService.js:**
```javascript
// Temporary - Use old endpoint
async createSubject(subjectData) {
  const response = await fetch(`${this.baseUrl}/add_subject`, {  // ← Old endpoint
    method: 'POST',
    headers: this.getAuthHeaders(),
    body: JSON.stringify({
      nameSubject: subjectData.name
    })
  });
  // ...
}
```

### **QuestionService.js:**
```javascript
// Temporary - Use old endpoints
async createQuestion(questionData) {
  const response = await fetch(`${this.baseUrl}/add_question`, {  // ← Old
    method: 'POST',
    // ...
  });
}

async updateQuestion(id, questionData) {
  const response = await fetch(`${this.baseUrl}/update`, {  // ← Old
    method: 'PUT',
    // ...
  });
}

async deleteQuestion(id) {
  const response = await fetch(`${this.baseUrl}/delete/${id}`, {  // ← Old
    method: 'DELETE',
    // ...
  });
}
```

### **ExamService.js:**
```javascript
// Same pattern as above
```

---

## ✅ Solution Checklist

### **Frontend:**
- ✅ URL đúng: `http://localhost:8080/api/subject`
- ✅ Method đúng: POST
- ✅ Headers có Authorization
- ✅ Body format đúng: `{ nameSubject: "..." }`

### **Backend cần:**
- ⚠️ Endpoint: `POST /api/subject` (không phải `/add_subject`)
- ⚠️ CORS enabled cho `http://localhost:3000`
- ⚠️ Accept Authorization header
- ⚠️ Accept Content-Type: application/json
- ⚠️ Response format: `{ status: 200, data: [...] }`

---

## 🎯 Backend Code Example (Spring Boot)

```java
@RestController
@RequestMapping("/api/subject")
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectController {

    // ✅ NEW: RESTful endpoint
    @PostMapping("")  // POST /api/subject
    public ResponseEntity<?> createSubject(@RequestBody SubjectRequest request) {
        // Logic here
        return ResponseEntity.ok(response);
    }

    // ✅ NEW: RESTful endpoint
    @PutMapping("")  // PUT /api/subject
    public ResponseEntity<?> updateSubject(@RequestBody SubjectRequest request) {
        // Logic here
        return ResponseEntity.ok(response);
    }

    // ✅ NEW: RESTful endpoint
    @DeleteMapping("/{id}")  // DELETE /api/subject/{id}
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        // Logic here
        return ResponseEntity.ok(response);
    }

    // Keep old endpoint for backward compatibility (optional)
    @GetMapping("/get_subjects")
    public ResponseEntity<?> getSubjects() {
        // Logic here
        return ResponseEntity.ok(response);
    }
}
```

---

## 📊 Quick Diagnosis

| Symptom | Cause | Solution |
|---------|-------|----------|
| `net::ERR_FAILED` | Backend không chạy | Start backend |
| `404 Not Found` | Endpoint không tồn tại | Update backend routes |
| `401 Unauthorized` | Token invalid/missing | Login lại |
| `403 Forbidden` | No permission | Check authorization |
| `CORS error` | CORS chưa enable | Update CORS config |
| `500 Server Error` | Backend error | Check backend logs |

---

## 🔍 Real-time Debugging

### **Enhanced Console Logs:**

Code đã được update để show chi tiết logs:

```javascript
// Khi gọi API, bạn sẽ thấy:
📤 Creating subject: {
  url: "http://localhost:8080/api/subject",
  method: "POST",
  data: { nameSubject: "Toán học" }
}

// Nếu success:
📥 Response status: 200
✅ Result: { status: 200, data: [...] }

// Nếu error:
❌ Error response: "404 Not Found"
💥 Create subject error: Error: HTTP 404: ...
```

---

## 🚀 Next Steps

1. **Check backend logs** - Xem error message
2. **Test với curl** - Verify endpoint tồn tại
3. **Check CORS** - Verify headers được phép
4. **Verify token** - Check localStorage có token không
5. **Update backend** - Thêm RESTful endpoints mới

---

## 📞 Need Help?

Debug checklist:
```
□ Backend đang chạy?
□ Endpoint /api/subject tồn tại?
□ CORS enabled?
□ Token có trong localStorage?
□ Request headers đúng?
□ Backend logs có error?
```

**Gửi screenshot của:**
1. Console logs (frontend)
2. Network tab (DevTools)
3. Backend logs
4. Backend endpoint code

---

**Theo lỗi hiện tại, khả năng cao nhất là backend chưa có endpoint mới `POST /api/subject`** ⚠️

