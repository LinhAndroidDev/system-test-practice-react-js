# Web App Tạo Đề Thi Trắc Nghiệm

Ứng dụng web tạo và quản lý đề thi trắc nghiệm với giao diện thân thiện và kiến trúc MVC.

## 🚀 Tính năng chính

### 📚 **Tab Subject (Chủ đề)**
- ✅ Thêm, sửa, xóa chủ đề
- ✅ Giao diện sticky header không bị cuộn
- ✅ Popup xác nhận xóa đẹp mắt
- ✅ Tích hợp API backend
- ✅ Kiến trúc MVC (Model-View-Controller)

### ❓ **Tab Question (Câu hỏi)**
- ✅ Tạo câu hỏi trắc nghiệm với 4 lựa chọn (A, B, C, D)
- ✅ Chọn đáp án đúng bằng radio button
- ✅ Liên kết câu hỏi với chủ đề
- ✅ Popup chọn chủ đề từ danh sách
- ✅ Scroll và highlight câu hỏi sau khi cập nhật
- ✅ Tích hợp API backend
- ✅ Lưu trữ local cho Exam

### 📝 **Tab Exam (Đề thi)**
- ✅ Tạo đề thi từ các câu hỏi đã có
- ✅ Lọc câu hỏi theo chủ đề
- ✅ Chọn nhiều câu hỏi cho đề thi
- ✅ Thiết lập thời gian làm bài (giây)
- ✅ Lưu trữ local

## 🏗️ Kiến trúc dự án

### **MVC Pattern**
```
src/
├── models/           # Data models
│   ├── Subject.js
│   ├── Question.js
│   └── Exam.js
├── views/            # UI components
│   └── SubjectView.js
├── controllers/      # Business logic
│   └── SubjectController.js
├── services/         # API calls
│   ├── SubjectService.js
│   ├── QuestionService.js
│   └── ExamService.js
└── components/       # React components
    ├── QuestionTab.js
    └── ExamTab.js
```

### **API Integration**
- **Subject API**: `http://localhost:8080/api/subject/`
  - `GET /get_subjects` - Lấy danh sách chủ đề
  - `POST /add_subject` - Thêm chủ đề mới
  - `PUT /update` - Cập nhật chủ đề
  - `DELETE /delete/{id}` - Xóa chủ đề

- **Question API**: `http://localhost:8080/api/question/`
  - `GET /get_questions` - Lấy danh sách câu hỏi
  - `POST /add_question` - Thêm câu hỏi mới
  - `PUT /update` - Cập nhật câu hỏi

## 🎨 Giao diện người dùng

### **UI/UX Features**
- 🎯 **Sticky Navigation**: Header và tabs cố định khi cuộn
- 🎨 **Modern Design**: Gradient backgrounds, card layouts
- ⚡ **Smooth Animations**: Scroll mượt mà, highlight effects
- 📱 **Responsive**: Tương thích mobile và desktop
- 🎭 **Custom Popups**: Popup xác nhận xóa đẹp mắt
- 🔄 **Loading States**: Hiển thị trạng thái loading
- ❌ **Error Handling**: Xử lý lỗi thân thiện

### **Visual Effects**
- ✨ **Highlight Animation**: Câu hỏi được cập nhật sẽ highlight 2 giây
- 🎯 **Auto Scroll**: Tự động cuộn đến item vừa cập nhật
- 🎨 **Hover Effects**: Hiệu ứng hover cho buttons và cards
- 🌈 **Color Coding**: Màu sắc phân biệt các trạng thái

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

## 🎯 Tính năng nâng cao

### **Data Persistence**
- **Subjects**: Lưu trữ qua API backend
- **Questions**: Lưu trữ qua API backend  
- **Exams**: Lưu trữ local với localStorage

### **User Experience**
- 🔄 **Real-time Updates**: Cập nhật dữ liệu real-time
- 🎯 **Smart Navigation**: Tự động cuộn và highlight
- ⚡ **Fast Loading**: Tối ưu hóa performance
- 🎨 **Visual Feedback**: Phản hồi trực quan cho mọi thao tác

## 📚 Học thêm

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [MVC Pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

Dự án này được phát hành dưới MIT License.