import ExamService from '../services/ExamService.js';
import SubjectService from '../services/SubjectService.js';
import QuestionService from '../services/QuestionService.js';

class ExamController {
  constructor() {
    this.exams = [];
    this.subjects = [];
    this.questions = [];
    this.loading = false;
    this.error = null;
    this.editingId = null;
    this.highlightedExamId = null;
    this.showQuestionPopup = false;
    this.showTimePopup = false;
    this.selectedSubjectId = "";
    this.selectedQuestions = [];
    this.customTimeInput = "";
    this.formData = {
      name: "",
      subjectId: "",
      subjectName: "",
      timeLimit: "",
      customTimeLimit: "",
      questionIds: [],
    };
    this.callbacks = {};
  }

  // Register callbacks for UI updates
  onUpdate(callback) {
    this.callbacks.update = callback;
  }

  // Notify UI of state changes
  notifyUpdate() {
    if (this.callbacks.update) {
      this.callbacks.update({
        exams: this.exams,
        subjects: this.subjects,
        questions: this.questions,
        loading: this.loading,
        error: this.error,
        editingId: this.editingId,
        highlightedExamId: this.highlightedExamId,
        showQuestionPopup: this.showQuestionPopup,
        showTimePopup: this.showTimePopup,
        selectedSubjectId: this.selectedSubjectId,
        selectedQuestions: this.selectedQuestions,
        customTimeInput: this.customTimeInput,
        formData: this.formData,
      });
    }
  }

  // Load initial data
  async loadData() {
    this.loading = true;
    this.error = null;
    this.notifyUpdate();

    try {
      // Load subjects
      const subjectService = new SubjectService();
      this.subjects = await subjectService.getSubjects();

      // Load exams
      const examService = new ExamService();
      this.exams = await examService.getExams();

      // Load questions
      const questionService = new QuestionService();
      this.questions = await questionService.getQuestions();

      this.error = null;
    } catch (error) {
      console.error('Error loading data:', error);
      this.error = 'Không thể tải dữ liệu từ server';
    } finally {
      this.loading = false;
      this.notifyUpdate();
    }
  }

  // Handle form input changes
  handleInputChange(name, value) {
    if (name === 'timeLimit' && value === 'custom') {
      this.showTimePopup = true;
      return;
    }

    this.formData = {
      ...this.formData,
      [name]: value,
    };
    this.notifyUpdate();
  }

  // Handle subject change
  handleSubjectChange(subjectId) {
    const subject = this.subjects.find(s => s.id === parseInt(subjectId));
    this.formData = {
      ...this.formData,
      subjectId: subjectId,
      subjectName: subject ? subject.name : "",
    };
    this.selectedSubjectId = subjectId;
    this.notifyUpdate();
  }

  // Handle question selection
  handleQuestionSelect(questionId) {
    if (this.selectedQuestions.includes(questionId)) {
      this.selectedQuestions = this.selectedQuestions.filter(id => id !== questionId);
    } else {
      this.selectedQuestions = [...this.selectedQuestions, questionId];
    }
    this.notifyUpdate();
  }

  // Handle add questions to exam
  handleAddQuestionsToExam() {
    this.formData = {
      ...this.formData,
      questionIds: this.selectedQuestions,
    };
    this.showQuestionPopup = false;
    this.selectedQuestions = [];
    this.notifyUpdate();
  }

  // Handle open question popup
  handleOpenQuestionPopup() {
    this.selectedQuestions = this.formData.questionIds;
    this.showQuestionPopup = true;
    this.notifyUpdate();
  }

  // Handle close question popup
  handleCloseQuestionPopup() {
    this.showQuestionPopup = false;
    this.selectedQuestions = [];
    this.notifyUpdate();
  }

  // Handle custom time confirmation
  handleConfirmCustomTime() {
    if (this.customTimeInput && parseInt(this.customTimeInput) > 0) {
      this.formData = {
        ...this.formData,
        timeLimit: this.customTimeInput,
        customTimeLimit: this.customTimeInput,
      };
      this.showTimePopup = false;
      this.customTimeInput = "";
      this.notifyUpdate();
    }
  }

  // Handle custom time cancellation
  handleCancelCustomTime() {
    this.showTimePopup = false;
    this.customTimeInput = "";
    this.formData = {
      ...this.formData,
      timeLimit: this.formData.customTimeLimit || "",
    };
    this.notifyUpdate();
  }

  // Handle form submission
  async handleSubmit() {
    if (!this.formData.name || !this.formData.subjectId || this.formData.questionIds.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một câu hỏi!");
      return;
    }

    this.loading = true;
    this.error = null;
    this.notifyUpdate();

    try {
      const examService = new ExamService();
      
      // Convert minutes to seconds
      let durationInSeconds = 0;
      if (this.formData.timeLimit === 'custom') {
        durationInSeconds = parseInt(this.formData.customTimeLimit) * 60 || 0;
      } else {
        durationInSeconds = parseInt(this.formData.timeLimit) * 60 || 0;
      }
      
      const examData = {
        title: this.formData.name,
        subjectId: parseInt(this.formData.subjectId),
        subjectName: this.formData.subjectName,
        durationSeconds: durationInSeconds,
        questionIds: this.formData.questionIds,
      };

      let updatedExams;
      let targetExamId;
      if (this.editingId) {
        updatedExams = await examService.updateExam(this.editingId, examData);
        targetExamId = this.editingId;
        this.editingId = null;
      } else {
        updatedExams = await examService.createExam(examData);
        targetExamId = updatedExams[updatedExams.length - 1]?.id;
      }
      this.exams = updatedExams;
      
      // Scroll to and highlight the exam
      if (targetExamId) {
        this.scrollToAndHighlightExam(targetExamId);
      }

      this.resetForm();
    } catch (error) {
      console.error('Error processing exam:', error);
      this.error = this.editingId ? 'Không thể cập nhật đề thi. Vui lòng thử lại.' : 'Không thể tạo đề thi. Vui lòng thử lại.';
    } finally {
      this.loading = false;
      this.notifyUpdate();
    }
  }

  // Handle edit exam
  handleEditExam(exam) {
    this.editingId = exam.id;
    
    // Convert seconds to minutes
    const timeInMinutes = Math.floor(exam.timeLimit / 60);
    
    // Check if time matches predefined options
    const predefinedTimes = ['15', '30', '45', '60', '90', '120', '150', '180'];
    const isPredefined = predefinedTimes.includes(timeInMinutes.toString());
    
    this.formData = {
      name: exam.name,
      subjectId: exam.subjectId.toString(),
      subjectName: exam.subjectName,
      timeLimit: isPredefined ? timeInMinutes.toString() : timeInMinutes.toString(),
      customTimeLimit: isPredefined ? "" : timeInMinutes.toString(),
      questionIds: exam.questionIds,
    };
    this.selectedSubjectId = exam.subjectId.toString();
    this.notifyUpdate();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle delete exam
  async handleDeleteExam(id) {
    if (window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      this.loading = true;
      this.error = null;
      this.notifyUpdate();
      
      try {
        const examService = new ExamService();
        this.exams = await examService.deleteExam(id);
      } catch (error) {
        console.error('Error deleting exam:', error);
        this.error = 'Không thể xóa đề thi. Vui lòng thử lại.';
      } finally {
        this.loading = false;
        this.notifyUpdate();
      }
    }
  }

  // Handle cancel edit
  handleCancelEdit() {
    this.editingId = null;
    this.resetForm();
  }

  // Reset form
  resetForm() {
    this.formData = {
      name: "",
      subjectId: "",
      subjectName: "",
      timeLimit: "",
      customTimeLimit: "",
      questionIds: [],
    };
    this.selectedSubjectId = "";
    this.notifyUpdate();
  }

  // Get filtered questions
  getFilteredQuestions() {
    if (!this.selectedSubjectId) return [];
    return this.questions.filter(q => q.subjectId === parseInt(this.selectedSubjectId));
  }

  // Get exam questions
  getExamQuestions(exam) {
    if (exam.questions && exam.questions.length > 0) {
      return exam.questions;
    }
    return this.questions.filter(q => exam.questionIds.includes(q.id));
  }

  // Format time
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Scroll to and highlight exam
  scrollToAndHighlightExam(examId) {
    setTimeout(() => {
      const examElement = document.getElementById(`exam-${examId}`);
      if (examElement) {
        examElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        this.highlightedExamId = examId;
        this.notifyUpdate();
        setTimeout(() => {
          this.highlightedExamId = null;
          this.notifyUpdate();
        }, 2000);
      }
    }, 100);
  }
}

export default ExamController;
