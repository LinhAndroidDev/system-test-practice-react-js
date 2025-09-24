# Web App Tạo Đề Thi Trắc Nghiệm

Ứng dụng web tạo và quản lý đề thi trắc nghiệm với giao diện thân thiện và kiến trúc MVC hoàn chỉnh.

## 🚀 Tính năng chính

### 📚 **Tab Subject (Chủ đề)**
- ✅ Thêm, sửa, xóa chủ đề
- ✅ Giao diện sticky header không bị cuộn
- ✅ Popup xác nhận xóa đẹp mắt
- ✅ Tích hợp API backend hoàn chỉnh
- ✅ Kiến trúc MVC (Model-View-Controller)

### ❓ **Tab Question (Câu hỏi)**
- ✅ Tạo câu hỏi trắc nghiệm với 4 lựa chọn (A, B, C, D)
- ✅ Chọn đáp án đúng bằng radio button
- ✅ Liên kết câu hỏi với chủ đề
- ✅ Popup chọn chủ đề từ danh sách
- ✅ **Lọc câu hỏi theo chủ đề** (tính năng mới)
- ✅ Scroll và highlight câu hỏi sau khi cập nhật
- ✅ Tích hợp API backend hoàn chỉnh
- ✅ Kiến trúc MVC (Model-View-Controller)
- ✅ Không thể thay đổi chủ đề khi chỉnh sửa

### 📝 **Tab Exam (Đề thi)**
- ✅ Tạo đề thi từ các câu hỏi đã có
- ✅ Lọc câu hỏi theo chủ đề
- ✅ Chọn nhiều câu hỏi cho đề thi
- ✅ **Thiết lập thời gian làm bài (phút)** với tùy chỉnh
- ✅ **Popup nhập thời gian tùy chỉnh**
- ✅ Tích hợp API backend hoàn chỉnh
- ✅ Kiến trúc MVC (Model-View-Controller)
- ✅ Không thể thay đổi chủ đề khi chỉnh sửa
- ✅ Scroll và highlight đề thi sau khi cập nhật

## 🏗️ Kiến trúc dự án

### **MVC Pattern Hoàn Chỉnh**
```
src/
├── models/           # Data structures & business logic
│   ├── Subject.js
│   ├── Question.js
│   └── Exam.js
├── services/         # API integration layer
│   ├── SubjectService.js
│   ├── QuestionService.js
│   └── ExamService.js
├── controllers/      # Business logic & state management
│   ├── SubjectController.js
│   ├── QuestionController.js
│   └── ExamController.js
├── views/           # UI components (React)
│   ├── SubjectView.js
│   ├── QuestionView.js
│   └── ExamView.js
├── App.js           # Main application entry point
└── App.css          # Global styles
```

### **Architecture Benefits**
- 🎯 **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt
- 🔄 **Loose Coupling**: Views không trực tiếp gọi Services
- 🧪 **Testability**: Controllers có thể test độc lập
- 📈 **Scalability**: Dễ dàng thêm features mới
- 🔧 **Maintainability**: Code dễ maintain và debug

## 🔌 API Integration

### **Subject API**: `http://localhost:8080/api/subject/`
- `GET /get_subjects` - Lấy danh sách chủ đề
- `POST /add_subject` - Thêm chủ đề mới
- `PUT /update` - Cập nhật chủ đề
- `DELETE /delete/{id}` - Xóa chủ đề

### **Question API**: `http://localhost:8080/api/question/`
- `GET /get_questions` - Lấy danh sách câu hỏi
- `POST /add_question` - Thêm câu hỏi mới
- `PUT /update` - Cập nhật câu hỏi

### **Exam API**: `http://localhost:8080/api/exam/`
- `GET /get_exams` - Lấy danh sách đề thi
- `POST /add_exam` - Thêm đề thi mới
- `PUT /update` - Cập nhật đề thi
- `DELETE /delete/{id}` - Xóa đề thi

## 🎨 Giao diện người dùng

### **UI/UX Features**
- 🎯 **Sticky Navigation**: Header và tabs cố định khi cuộn
- 🎨 **Modern Design**: Gradient backgrounds, card layouts
- ⚡ **Smooth Animations**: Scroll mượt mà, highlight effects
- 📱 **Responsive**: Tương thích mobile và desktop
- 🎭 **Custom Popups**: Popup xác nhận xóa, chọn chủ đề, thời gian tùy chỉnh
- 🔄 **Loading States**: Hiển thị trạng thái loading
- ❌ **Error Handling**: Xử lý lỗi thân thiện
- 🔍 **Filter Controls**: Lọc câu hỏi theo chủ đề

### **Visual Effects**
- ✨ **Highlight Animation**: Câu hỏi/đề thi được cập nhật sẽ highlight 2 giây
- 🎯 **Auto Scroll**: Tự động cuộn đến item vừa cập nhật
- 🎨 **Hover Effects**: Hiệu ứng hover cho buttons và cards
- 🌈 **Color Coding**: Màu sắc phân biệt các trạng thái
- ⚠️ **Warning Messages**: Thông báo khi không thể thay đổi chủ đề

## 🛠️ Cài đặt và chạy

### **Yêu cầu hệ thống**
- Node.js >= 14.0.0
- npm >= 6.0.0
- Backend API chạy trên `http://localhost:8080`

### **Cài đặt**
```bash
# Clone repository
git clone <repository-url>
cd test-practice

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

### **Truy cập ứng dụng**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

## 📋 Scripts có sẵn

### `npm start`
Chạy ứng dụng ở chế độ development.\
Mở [http://localhost:3000](http://localhost:3000) để xem trong trình duyệt.

### `npm test`
Chạy test runner ở chế độ interactive watch mode.

### `npm run build`
Build ứng dụng cho production vào thư mục `build`.\
Ứng dụng được tối ưu hóa cho performance tốt nhất.

### `npm run eject`
**Lưu ý: Đây là thao tác một chiều. Một khi `eject`, bạn không thể quay lại!**

## 🔧 Cấu hình API

### **Subject API Format**
```javascript
// GET /get_subjects
{
  "data": [
    { "id": 1, "nameSubject": "Toán" },
    { "id": 2, "nameSubject": "Tiếng Anh" }
  ],
  "message": "Success",
  "status": 200
}

// POST /add_subject
Body: { "name_subject": "Vật Lí" }
Response: { "data": [...], "message": "Subject added successfully" }
```

### **Question API Format**
```javascript
// GET /get_questions
{
  "data": [
    {
      "id": 1,
      "subject": { "id": 1, "nameSubject": "Toán" },
      "content": "Câu hỏi...",
      "option_a": "A", "option_b": "B", "option_c": "C", "option_d": "D",
      "correct_answer": 1  // 0=A, 1=B, 2=C, 3=D
    }
  ]
}

// POST /add_question
Body: {
  "subject_id": 1,
  "content": "Câu hỏi...",
  "option_a": "A", "option_b": "B", "option_c": "C", "option_d": "D",
  "correct_answer": 1
}
```

### **Exam API Format**
```javascript
// GET /get_exams
{
  "data": [
    {
      "id": 1,
      "subject": { "id": 1, "nameSubject": "Toán" },
      "title": "Đề thi Toán 10",
      "duration_seconds": 3600,
      "questions": [...],
      "created_at": "2025-01-23T10:30:00Z"
    }
  ]
}

// POST /add_exam
Body: {
  "subject_id": 1,
  "title": "Đề thi Toán 10",
  "duration_seconds": 3600,
  "questions": "1, 2, 3"  // Comma-separated question IDs
}
```

## 🎯 Tính năng nâng cao

### **Data Management**
- **Subjects**: Lưu trữ qua API backend với real-time sync
- **Questions**: Lưu trữ qua API backend với filter theo chủ đề
- **Exams**: Lưu trữ qua API backend với time management

### **User Experience**
- 🔄 **Real-time Updates**: Cập nhật dữ liệu real-time từ API
- 🎯 **Smart Navigation**: Tự động cuộn và highlight
- ⚡ **Fast Loading**: Tối ưu hóa performance với MVC
- 🎨 **Visual Feedback**: Phản hồi trực quan cho mọi thao tác
- 🔍 **Advanced Filtering**: Lọc câu hỏi theo chủ đề
- ⏰ **Time Management**: Thời gian làm bài với tùy chỉnh linh hoạt

### **Architecture Benefits**
- 🏗️ **MVC Pattern**: Separation of concerns rõ ràng
- 🔧 **Maintainable**: Code dễ maintain và extend
- 🧪 **Testable**: Controllers có thể test độc lập
- 📈 **Scalable**: Dễ dàng thêm features mới
- 🔄 **Reusable**: Components có thể reuse

## 📚 Học thêm

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [MVC Pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC)
- [RESTful API Design](https://restfulapi.net/)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

Dự án này được phát hành dưới MIT License.