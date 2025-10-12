# 🔄 Rollback to Old Endpoints (Temporary)

## Nếu backend chưa update kịp, sử dụng code này:

### **SubjectService.js:**

```javascript
// Line 44-50
const response = await fetch(`${this.baseUrl}/add_subject`, {  // ← OLD
  method: 'POST',
  headers: this.getAuthHeaders(),
  body: JSON.stringify({
    nameSubject: subjectData.name
  })
});

// Line 76-80
const response = await fetch(`${this.baseUrl}/update`, {  // ← OLD
  method: 'PUT',
  headers: this.getAuthHeaders(),
  body: JSON.stringify(requestBody)
});

// Line 99
const response = await fetch(`${this.baseUrl}/delete/${id}`, {  // ← OLD
  method: 'DELETE',
  headers: this.getAuthHeaders()
});
```

---

### **QuestionService.js:**

```javascript
// Create - Line 79
const response = await fetch(`${this.baseUrl}/add_question`, {  // ← OLD
  method: 'POST',
  headers: this.getAuthHeaders(),
  body: JSON.stringify(requestBody)
});

// Update - Line 118
const response = await fetch(`${this.baseUrl}/update`, {  // ← OLD
  method: 'PUT',
  headers: this.getAuthHeaders(),
  body: JSON.stringify(requestBody)
});

// Delete - Line 141
const response = await fetch(`${this.baseUrl}/delete/${id}`, {  // ← OLD
  method: 'DELETE',
  headers: this.getAuthHeaders()
});
```

---

### **ExamService.js:**

```javascript
// Create - Line 57
const response = await fetch(`${this.baseUrl}/add_exam`, {  // ← OLD
  method: 'POST',
  headers: this.getAuthHeaders(),
  body: JSON.stringify(requestBody),
});

// Update - Line 93
const response = await fetch(`${this.baseUrl}/update`, {  // ← OLD
  method: 'PUT',
  headers: this.getAuthHeaders(),
  body: JSON.stringify(requestBody),
});

// Delete - Line 118
const response = await fetch(`${this.baseUrl}/delete/${id}`, {  // ← OLD
  method: 'DELETE',
  headers: this.getAuthHeaders(),
});
```

---

## Khi backend đã update xong, đổi lại về RESTful endpoints!

