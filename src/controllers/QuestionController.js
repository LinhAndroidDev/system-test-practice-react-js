import QuestionService from "../services/QuestionService.js";
import SubjectService from "../services/SubjectService.js";
import UploadService from "../services/UploadService.js";

class QuestionController {
  constructor() {
    this.questions = [];
    this.subjects = [];
    this.loading = false;
    this.error = null;
    this.editingId = null;
    this.highlightedQuestionId = null;
    this.filterSubjectId = "";
    this.uploadingImage = false;
    this.uploadingExplanationImage = false;
    this.deletingImage = false;
    this.deletingExplanationImage = false;
    this.resetHelpers = false;
    this.originalImageUrl = "";
    this.originalExplanationImageUrl = "";
    this.formData = {
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      imageUrl: "",
      explanationImageUrl: "",
      subjectId: null,
      subjectName: "",
    };
    this.showSubjectPopup = false;
    this.callbacks = {};
    this.questionService = new QuestionService();
    this.subjectService = new SubjectService();
    this.uploadService = new UploadService();
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
        uploadingImage: this.uploadingImage,
        uploadingExplanationImage: this.uploadingExplanationImage,
        deletingImage: this.deletingImage,
        deletingExplanationImage: this.deletingExplanationImage,
        resetHelpers: this.resetHelpers,
        originalImageUrl: this.originalImageUrl,
        originalExplanationImageUrl: this.originalExplanationImageUrl,
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
      this.subjects = await this.subjectService.getSubjects();

      // Load questions
      this.questions = await this.questionService.getQuestions();

      this.error = null;
    } catch (error) {
      console.error("Error loading data:", error);
      this.error = "Không thể tải dữ liệu từ server";
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
    // Validate: must have either content or image
    if (!this.formData.content && !this.formData.imageUrl) {
      alert("Vui lòng nhập nội dung câu hỏi hoặc thêm hình ảnh!");
      return;
    }

    // Validate: must have subject
    if (!this.formData.subjectId) {
      alert("Vui lòng chọn chủ đề!");
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
        explanation: this.formData.explanation || "",
        imageUrl: this.formData.imageUrl || "",
        explanationImageUrl: this.formData.explanationImageUrl || "",
        subjectId: this.formData.subjectId,
        subjectName: this.formData.subjectName,
      };

      if (this.editingId) {
        const targetQuestionId = this.editingId;
        this.questions = await this.questionService.updateQuestion(
          this.editingId,
          questionData
        );
        this.editingId = null;
        this.scrollToAndHighlightQuestion(targetQuestionId);
      } else {
        this.questions = await this.questionService.createQuestion(questionData);
        // Find the newly created question and highlight it
        const newQuestion = this.questions[this.questions.length - 1];
        if (newQuestion) {
          this.scrollToAndHighlightQuestion(newQuestion.id);
        }
      }

      this.resetForm();
      // Reset all helpers after successful submission
      this.resetHelpers = true;
      this.notifyUpdate();
      // Reset the flag after a short delay
      setTimeout(() => {
        this.resetHelpers = false;
        this.notifyUpdate();
      }, 100);
    } catch (error) {
      console.error("Error processing question:", error);
      this.error = this.editingId
        ? "Không thể cập nhật câu hỏi. Vui lòng thử lại."
        : "Không thể tạo câu hỏi. Vui lòng thử lại.";
    } finally {
      this.loading = false;
      this.notifyUpdate();
    }
  }

  // Handle edit question
  handleEditQuestion(question) {
    this.editingId = question.id;
    this.originalImageUrl = question.imageUrl || "";
    this.originalExplanationImageUrl = question.explanationImageUrl || "";
    this.formData = {
      content: question.content,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      imageUrl: question.imageUrl || "",
      explanationImageUrl: question.explanationImageUrl || "",
      subjectId: question.subjectId,
      subjectName: question.subjectName,
    };
    this.notifyUpdate();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle delete question
  async handleDeleteQuestion(id) {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      this.loading = true;
      this.error = null;
      this.notifyUpdate();

      try {
        this.questions = await this.questionService.deleteQuestion(id);
        this.notifyUpdate();
      } catch (error) {
        this.error = "❌ Không thể xóa câu hỏi. Vui lòng thử lại.";
        this.notifyUpdate();
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
    this.originalImageUrl = "";
    this.originalExplanationImageUrl = "";
    this.formData = {
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      imageUrl: "",
      explanationImageUrl: "",
      subjectId: null,
      subjectName: "",
    };
    this.notifyUpdate();
  }

  // Handle image upload
  async handleImageUpload(file) {
    const validation = this.uploadService.validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    this.uploadingImage = true;
    this.error = null;
    this.notifyUpdate();

    try {
      const imageUrl = await this.uploadService.uploadImage(file);
      this.formData = {
        ...this.formData,
        imageUrl: imageUrl,
      };
      this.error = null;
    } catch (error) {
      console.error("Error uploading image:", error);
      this.error = "Không thể tải lên hình ảnh. Vui lòng thử lại.";
    } finally {
      this.uploadingImage = false;
      this.notifyUpdate();
    }
  }

  // Handle remove image
  async handleRemoveImage() {
    this.deletingImage = true;
    this.error = null;
    this.notifyUpdate();

    try {
      // If there's an image, delete it from server
      if (this.formData.imageUrl) {
        // If editing and current image is same as original, don't delete (it's still used in database)
        if (this.editingId && this.formData.imageUrl === this.originalImageUrl) {
          console.log("Skipping delete - image is original and still used in database");
        } else {
          // Delete image (either new upload during edit, or any upload during create)
          try {
            // Extract filename from URL
            const urlParts = this.formData.imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            await this.uploadService.deleteImage(fileName);
            console.log("Deleted image:", fileName);
          } catch (error) {
            console.error("Error deleting image:", error);
            // Continue with removal even if delete fails
          }
        }
      }
      
      this.formData = {
        ...this.formData,
        imageUrl: "",
      };
    } catch (error) {
      console.error("Error in handleRemoveImage:", error);
      this.error = "Không thể xóa ảnh. Vui lòng thử lại.";
    } finally {
      this.deletingImage = false;
      this.notifyUpdate();
    }
  }

  // Handle explanation image upload
  async handleExplanationImageUpload(file) {
    const validation = this.uploadService.validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    this.uploadingExplanationImage = true;
    this.error = null;
    this.notifyUpdate();

    try {
      const imageUrl = await this.uploadService.uploadImage(file);
      this.formData = {
        ...this.formData,
        explanationImageUrl: imageUrl,
      };
      this.error = null;
    } catch (error) {
      console.error("Error uploading explanation image:", error);
      this.error = "Không thể tải lên hình ảnh giải thích. Vui lòng thử lại.";
    } finally {
      this.uploadingExplanationImage = false;
      this.notifyUpdate();
    }
  }

  // Handle remove explanation image
  async handleRemoveExplanationImage() {
    this.deletingExplanationImage = true;
    this.error = null;
    this.notifyUpdate();

    try {
      // If there's an explanation image, delete it from server
      if (this.formData.explanationImageUrl) {
        // If editing and current image is same as original, don't delete (it's still used in database)
        if (this.editingId && this.formData.explanationImageUrl === this.originalExplanationImageUrl) {
          console.log("Skipping delete - explanation image is original and still used in database");
        } else {
          // Delete image (either new upload during edit, or any upload during create)
          try {
            // Extract filename from URL
            const urlParts = this.formData.explanationImageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            await this.uploadService.deleteImage(fileName);
            console.log("Deleted explanation image:", fileName);
          } catch (error) {
            console.error("Error deleting explanation image:", error);
            // Continue with removal even if delete fails
          }
        }
      }
      
      this.formData = {
        ...this.formData,
        explanationImageUrl: "",
      };
    } catch (error) {
      console.error("Error in handleRemoveExplanationImage:", error);
      this.error = "Không thể xóa ảnh giải thích. Vui lòng thử lại.";
    } finally {
      this.deletingExplanationImage = false;
      this.notifyUpdate();
    }
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
    return this.questions.filter(
      (q) => q.subjectId === parseInt(this.filterSubjectId)
    );
  }

  // Scroll to and highlight question
  scrollToAndHighlightQuestion(questionId) {
    setTimeout(() => {
      const questionElement = document.getElementById(`question-${questionId}`);
      if (questionElement) {
        questionElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
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
