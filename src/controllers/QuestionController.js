import QuestionService from '../services/QuestionService.js';
import SubjectService from '../services/SubjectService.js';

class QuestionController {
  constructor() {
    this.questions = [];
    this.subjects = [];
    this.loading = false;
    this.error = null;
    this.editingId = null;
    this.highlightedQuestionId = null;
    this.filterSubjectId = "";
    this.formData = {
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      subjectId: null,
      subjectName: "",
    };
    this.showSubjectPopup = false;
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
        questions: this.questions,
        subjects: this.subjects,
        loading: this.loading,
        error: this.error,
        editingId: this.editingId,
        highlightedQuestionId: this.highlightedQuestionId,
        filterSubjectId: this.filterSubjectId,
        formData: this.formData,
        showSubjectPopup: this.showSubjectPopup,
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
    this.formData = {
      ...this.formData,
      [name]: value,
    };
    this.notifyUpdate();
  }

  // Handle subject selection
  handleSubjectSelect(subject) {
    this.formData = {
      ...this.formData,
      subjectId: subject.id,
      subjectName: subject.name,
    };
    this.showSubjectPopup = false;
    this.notifyUpdate();
  }

  // Handle form submission
  async handleSubmit() {
    if (!this.formData.content || !this.formData.subjectId) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    this.loading = true;
    this.error = null;
    this.notifyUpdate();

    try {
      const questionService = new QuestionService();
      const questionData = {
        id: this.editingId,
        content: this.formData.content,
        optionA: this.formData.optionA,
        optionB: this.formData.optionB,
        optionC: this.formData.optionC,
        optionD: this.formData.optionD,
        correctAnswer: this.formData.correctAnswer,
        subjectId: this.formData.subjectId,
        subjectName: this.formData.subjectName,
      };

      if (this.editingId) {
        this.questions = await questionService.updateQuestion(this.editingId, questionData);
        this.editingId = null;
        this.scrollToAndHighlightQuestion(this.editingId);
      } else {
        this.questions = await questionService.createQuestion(questionData);
        // Find the newly created question and highlight it
        const newQuestion = this.questions[this.questions.length - 1];
        if (newQuestion) {
          this.scrollToAndHighlightQuestion(newQuestion.id);
        }
      }

      this.resetForm();
    } catch (error) {
      console.error('Error processing question:', error);
      this.error = this.editingId ? 'Không thể cập nhật câu hỏi. Vui lòng thử lại.' : 'Không thể tạo câu hỏi. Vui lòng thử lại.';
    } finally {
      this.loading = false;
      this.notifyUpdate();
    }
  }

  // Handle edit question
  handleEditQuestion(question) {
    this.editingId = question.id;
    this.formData = {
      content: question.content,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      subjectId: question.subjectId,
      subjectName: question.subjectName,
    };
    this.notifyUpdate();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle delete question
  handleDeleteQuestion(id) {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      this.questions = this.questions.filter(q => q.id !== id);
      this.notifyUpdate();
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
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      subjectId: null,
      subjectName: "",
    };
    this.notifyUpdate();
  }

  // Handle subject popup
  handleShowSubjectPopup() {
    this.showSubjectPopup = true;
    this.notifyUpdate();
  }

  handleCloseSubjectPopup() {
    this.showSubjectPopup = false;
    this.notifyUpdate();
  }

  // Handle filter
  handleFilterChange(subjectId) {
    this.filterSubjectId = subjectId;
    this.notifyUpdate();
  }

  // Get filtered questions
  getFilteredQuestions() {
    if (!this.filterSubjectId) return this.questions;
    return this.questions.filter(q => q.subjectId === parseInt(this.filterSubjectId));
  }

  // Scroll to and highlight question
  scrollToAndHighlightQuestion(questionId) {
    setTimeout(() => {
      const questionElement = document.getElementById(`question-${questionId}`);
      if (questionElement) {
        questionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        this.highlightedQuestionId = questionId;
        this.notifyUpdate();
        setTimeout(() => {
          this.highlightedQuestionId = null;
          this.notifyUpdate();
        }, 2000);
      }
    }, 100);
  }

  // Get correct answer text
  getCorrectAnswerText(correctAnswer) {
    const options = { A: "A", B: "B", C: "C", D: "D" };
    return options[correctAnswer] || correctAnswer;
  }
}

export default QuestionController;
