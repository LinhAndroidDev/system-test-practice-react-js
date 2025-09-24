import React, { useState, useEffect } from "react";
import SubjectService from '../services/SubjectService.js';
import QuestionService from '../services/QuestionService.js';

const QuestionTab = ({ questions, setQuestions }) => {
  const [subjects, setSubjects] = useState([]);
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedQuestionId, setHighlightedQuestionId] = useState(null);
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [formData, setFormData] = useState({
    content: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    subjectId: null,
    subjectName: "",
  });

  // Load subjects and questions on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load subjects for the popup
        const subjectService = new SubjectService();
        const subjectsData = await subjectService.getSubjects();
        setSubjects(subjectsData);
        
        // Load questions
        const questionService = new QuestionService();
        const questionsData = await questionService.getQuestions();
        setQuestions(questionsData);
        
        setError(null);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Không thể tải dữ liệu từ server');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [setQuestions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectSelect = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjectId: subject.id,
      subjectName: subject.name,
    }));
    setShowSubjectPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.content ||
      !formData.optionA ||
      !formData.optionB ||
      !formData.optionC ||
      !formData.optionD ||
      !formData.correctAnswer ||
      !formData.subjectId
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const questionService = new QuestionService();
      
      if (editingId) {
        // Update existing question
        const questionData = {
          id: editingId,
          content: formData.content,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          correctAnswer: formData.correctAnswer,
          subjectId: formData.subjectId,
          subjectName: formData.subjectName,
        };

        const updatedQuestions = await questionService.updateQuestion(editingId, questionData);
        setQuestions(updatedQuestions);
        setEditingId(null);
        
        // Scroll to and highlight the updated question
        scrollToAndHighlightQuestion(editingId);
      } else {
        // Create new question
        const questionData = {
          id: null,
          content: formData.content,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          correctAnswer: formData.correctAnswer,
          subjectId: formData.subjectId,
          subjectName: formData.subjectName,
        };

        const updatedQuestions = await questionService.createQuestion(questionData);
        setQuestions(updatedQuestions);
        
        // Find the newly created question (it should be the last one in the list)
        const newQuestion = updatedQuestions[updatedQuestions.length - 1];
        if (newQuestion) {
          // Scroll to and highlight the newly created question
          scrollToAndHighlightQuestion(newQuestion.id);
        }
      }

      // Reset form after successful create/update
      setFormData({
        content: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        subjectId: null,
        subjectName: "",
      });
    } catch (error) {
      console.error('Error processing question:', error);
      setError(editingId ? 'Không thể cập nhật câu hỏi. Vui lòng thử lại.' : 'Không thể tạo câu hỏi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingId(question.id);
    setFormData({
      content: question.content,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      subjectId: question.subjectId,
      subjectName: question.subjectName,
    });
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      subjectId: null,
      subjectName: "",
    });
  };

  // Function to scroll to and highlight a question
  const scrollToAndHighlightQuestion = (questionId) => {
    // Use setTimeout to ensure DOM is updated after state change
    setTimeout(() => {
      const questionElement = document.getElementById(`question-${questionId}`);
      
      if (questionElement) {
        questionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Highlight the question
        setHighlightedQuestionId(questionId);
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
          setHighlightedQuestionId(null);
        }, 2000);
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  const getCorrectAnswerText = (correctAnswer) => {
    const options = { A: "A", B: "B", C: "C", D: "D" };
    return options[correctAnswer] || correctAnswer;
  };

  // Filter questions by subject
  const getFilteredQuestions = () => {
    if (!filterSubjectId) return questions;
    return questions.filter(q => q.subjectId === parseInt(filterSubjectId));
  };

  return (
    <div className="question-tab">
      <div className="tab-header">
        <h2>Quản lý câu hỏi</h2>
        <p>Tạo và quản lý các câu hỏi trắc nghiệm</p>
      </div>

      <div className="add-question-form">
        <h3>{editingId ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Nội dung câu hỏi:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Nhập nội dung câu hỏi"
              rows="3"
              required
            />
          </div>

          <div className="options-grid">
            <div className="form-group">
              <label htmlFor="optionA">Lựa chọn A:</label>
              <input
                type="text"
                id="optionA"
                name="optionA"
                value={formData.optionA}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn A"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="optionB">Lựa chọn B:</label>
              <input
                type="text"
                id="optionB"
                name="optionB"
                value={formData.optionB}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn B"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="optionC">Lựa chọn C:</label>
              <input
                type="text"
                id="optionC"
                name="optionC"
                value={formData.optionC}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn C"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="optionD">Lựa chọn D:</label>
              <input
                type="text"
                id="optionD"
                name="optionD"
                value={formData.optionD}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn D"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Chọn đáp án đúng:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="A"
                  checked={formData.correctAnswer === "A"}
                  onChange={handleInputChange}
                />
                A
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="B"
                  checked={formData.correctAnswer === "B"}
                  onChange={handleInputChange}
                />
                B
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="C"
                  checked={formData.correctAnswer === "C"}
                  onChange={handleInputChange}
                />
                C
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="D"
                  checked={formData.correctAnswer === "D"}
                  onChange={handleInputChange}
                />
                D
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Chủ đề:</label>
            <div className="subject-selector">
              {formData.subjectName ? (
                <div className="selected-subject">
                  <span>{formData.subjectName}</span>
                  <button
                    type="button"
                    onClick={() => setShowSubjectPopup(true)}
                    className="btn btn-secondary btn-sm"
                    disabled={editingId}
                  >
                    {editingId ? "Không thể thay đổi" : "Thay đổi"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubjectPopup(true)}
                  className="btn btn-outline"
                  disabled={editingId}
                >
                  {editingId ? "Không thể thay đổi chủ đề" : "Chọn chủ đề"}
                </button>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (editingId ? "Cập nhật câu hỏi" : "Thêm câu hỏi")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                disabled={loading}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="questions-list">
        <div className="questions-header">
          <h3>Danh sách câu hỏi ({questions.length})</h3>
          <div className="filter-controls">
            <label htmlFor="filterSubject">Lọc theo chủ đề:</label>
            <select
              id="filterSubject"
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
            >
              <option value="">Tất cả chủ đề</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-outline btn-sm">
              Thử lại
            </button>
          </div>
        )}
        
        {loading && (
          <div className="loading-message">
            <p>⏳ Đang tải danh sách câu hỏi...</p>
          </div>
        )}
        
        {!loading && !error && getFilteredQuestions().length === 0 && (
          <p className="empty-message">
            {filterSubjectId ? "Không có câu hỏi nào trong chủ đề này." : "Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!"}
          </p>
        )}
        
        {!loading && !error && getFilteredQuestions().length > 0 && (
          <div
            className="questions-grid"
            style={{ marginTop: "15px", marginBottom: "30px" }}
          >
            {getFilteredQuestions().map((question) => (
              <div 
                key={question.id} 
                id={`question-${question.id}`}
                className={`question-card ${highlightedQuestionId === question.id ? 'highlighted' : ''}`}
              >
                <div className="question-header">
                  <h4>Câu hỏi #{question.id}</h4>
                  <span className="subject-badge">{question.subjectName}</span>
                </div>
                <div className="question-content" style={{ marginTop: "10px" }}>
                  <p>{question.content}</p>
                </div>
                <div className="question-options">
                  <div className="option">A. {question.optionA}</div>
                  <div className="option">B. {question.optionB}</div>
                  <div className="option">C. {question.optionC}</div>
                  <div className="option">D. {question.optionD}</div>
                </div>
                <div className="correct-answer">
                  <strong>
                    Đáp án đúng: {getCorrectAnswerText(question.correctAnswer)}
                  </strong>
                </div>
                <div className="question-actions">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="btn btn-warning btn-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Selection Popup */}
      {showSubjectPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Chọn chủ đề</h3>
              <button
                onClick={() => setShowSubjectPopup(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              {subjects.length === 0 ? (
                <p>Chưa có chủ đề nào. Hãy thêm chủ đề trước!</p>
              ) : (
                <div className="subjects-list-popup">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="subject-item"
                      onClick={() => handleSubjectSelect(subject)}
                    >
                      {subject.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTab;
