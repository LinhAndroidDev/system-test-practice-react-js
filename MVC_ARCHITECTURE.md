# MVC Architecture Documentation

## 📁 Cấu trúc thư mục

```
src/
├── models/           # Data Models
│   ├── Subject.js
│   ├── Question.js
│   └── Exam.js
├── views/            # View Components
│   └── SubjectView.js
├── controllers/      # Business Logic Controllers
│   └── SubjectController.js
├── services/         # API Services
│   ├── SubjectService.js
│   ├── QuestionService.js
│   └── ExamService.js
└── components/       # Legacy Components (đang migration)
    ├── QuestionTab.js
    └── ExamTab.js
```

## 🏗️ Kiến trúc MVC

### **Model Layer (Models)**
- **Chức năng**: Định nghĩa cấu trúc dữ liệu và business rules
- **Ví dụ**: `Subject.js`, `Question.js`, `Exam.js`
- **Tính năng**:
  - Data validation
  - Data transformation (API ↔ App format)
  - Business logic methods

### **View Layer (Views)**
- **Chức năng**: Hiển thị UI và xử lý user interactions
- **Ví dụ**: `SubjectView.js`
- **Tính năng**:
  - React components
  - Event handling
  - UI state management

### **Controller Layer (Controllers)**
- **Chức năng**: Điều phối giữa Model và View
- **Ví dụ**: `SubjectController.js`
- **Tính năng**:
  - Business logic orchestration
  - State management
  - Event coordination

### **Service Layer (Services)**
- **Chức năng**: Xử lý API calls và external data
- **Ví dụ**: `SubjectService.js`
- **Tính năng**:
  - HTTP requests
  - Data transformation
  - Error handling

## 🔄 Data Flow

```
User Action → View → Controller → Service → API
                ↓
User Interface ← View ← Controller ← Service ← API Response
```

## 📋 Ví dụ cụ thể

### **Subject MVC Implementation**

#### **1. Model (Subject.js)**
```javascript
class Subject {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
  
  static fromApiResponse(apiData) {
    return new Subject(apiData.id, apiData.nameSubject);
  }
  
  isValid() {
    return this.name && this.name.trim().length > 0;
  }
}
```

#### **2. Service (SubjectService.js)**
```javascript
class SubjectService {
  async getSubjects() {
    const response = await fetch(`${this.baseUrl}/get_subjects`);
    const result = await response.json();
    return result.data.map(item => Subject.fromApiResponse(item));
  }
}
```

#### **3. Controller (SubjectController.js)**
```javascript
class SubjectController {
  async getSubjects() {
    this.loading = true;
    try {
      this.subjects = await this.service.getSubjects();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
      this.notify();
    }
  }
}
```

#### **4. View (SubjectView.js)**
```javascript
const SubjectView = () => {
  const [controller] = useState(() => new SubjectController());
  
  useEffect(() => {
    controller.addListener(handleUpdate);
    controller.getSubjects();
  }, []);
  
  return <div>...</div>;
};
```

## ✨ Lợi ích của MVC

### **1. Separation of Concerns**
- **Model**: Chỉ quản lý data và business rules
- **View**: Chỉ quản lý UI và user interactions
- **Controller**: Điều phối giữa Model và View

### **2. Maintainability**
- Code dễ đọc và hiểu
- Dễ debug và test
- Dễ thay đổi và mở rộng

### **3. Reusability**
- Models có thể tái sử dụng
- Services có thể dùng cho nhiều controllers
- Views có thể tái sử dụng logic

### **4. Testability**
- Mỗi layer có thể test độc lập
- Mock services dễ dàng
- Unit tests rõ ràng

## 🚀 Migration Plan

### **Phase 1: Subject (Completed)**
- ✅ Subject Model
- ✅ Subject Service  
- ✅ Subject Controller
- ✅ Subject View

### **Phase 2: Question (Next)**
- 🔄 Question Model (Completed)
- 🔄 Question Service (Completed)
- 🔄 Question Controller (In Progress)
- 🔄 Question View (In Progress)

### **Phase 3: Exam (Future)**
- 🔄 Exam Model (Completed)
- 🔄 Exam Service (Completed)
- 🔄 Exam Controller (In Progress)
- 🔄 Exam View (In Progress)

## 📝 Best Practices

### **1. Model Rules**
- Luôn validate data trong model
- Sử dụng static methods cho factory patterns
- Implement clone() method cho immutability

### **2. Service Rules**
- Một service cho một domain
- Handle errors gracefully
- Transform data between API và App format

### **3. Controller Rules**
- Một controller cho một feature
- Manage state và notify views
- Handle business logic

### **4. View Rules**
- Chỉ quản lý UI state
- Subscribe to controller updates
- Handle user interactions

## 🔧 Usage Examples

### **Creating a new Subject**
```javascript
// In View
const handleAddSubject = async (e) => {
  e.preventDefault();
  const success = await controller.createSubject(formData.name);
  if (success) {
    // Success handling
  }
};
```

### **Fetching Subjects**
```javascript
// In Controller
async getSubjects() {
  this.loading = true;
  this.subjects = await this.service.getSubjects();
  this.loading = false;
  this.notify();
}
```

### **Data Transformation**
```javascript
// In Model
static fromApiResponse(apiData) {
  return new Subject(apiData.id, apiData.nameSubject);
}
```
