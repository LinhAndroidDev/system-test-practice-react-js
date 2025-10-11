import React, { useState, useEffect } from "react";
import QuestionController from "../controllers/QuestionController.js";
import { useAuth } from "../contexts/AuthContext";

const QuestionView = () => {
  const { isAuthenticated } = useAuth();
  const [controller] = useState(() => new QuestionController());
  const [state, setState] = useState({
    questions: [],
    subjects: [],
    loading: false,
    error: null,
    editingId: null,
    highlightedQuestionId: null,
    filterSubjectId: "",
    formData: {
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      subjectId: null,
      subjectName: "",
    },
    showSubjectPopup: false,
  });

  // Initialize controller
  useEffect(() => {
    controller.onUpdate(setState);
    controller.loadData();
  }, [controller]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    controller.handleInputChange(name, value);
  };

  const handleSubjectSelect = (subject) => {
    controller.handleSubjectSelect(subject);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    controller.handleSubmit();
  };

  const handleEditQuestion = (question) => {
    controller.handleEditQuestion(question);
  };

  const handleDeleteQuestion = (id) => {
    controller.handleDeleteQuestion(id);
  };

  const handleCancelEdit = () => {
    controller.handleCancelEdit();
  };

  const handleShowSubjectPopup = () => {
    controller.handleShowSubjectPopup();
  };

  const handleCloseSubjectPopup = () => {
    controller.handleCloseSubjectPopup();
  };

  const handleFilterChange = (e) => {
    controller.handleFilterChange(e.target.value);
  };

  const getFilteredQuestions = () => {
    return controller.getFilteredQuestions();
  };

  const getCorrectAnswerText = (correctAnswer) => {
    return controller.getCorrectAnswerText(correctAnswer);
  };

  return (
    <div className="question-tab">
      <div className="tab-header">
        <h2>Quản lý câu hỏi</h2>
        <p>{isAuthenticated ? "Tạo và quản lý các câu hỏi trắc nghiệm" : "Xem danh sách câu hỏi trắc nghiệm"}</p>
        {!isAuthenticated && (
          <p style={{ color: "#ff9800", fontSize: "14px", marginTop: "8px" }}>
            ⚠️ Bạn cần đăng nhập để thêm, sửa hoặc xóa câu hỏi
          </p>
        )}
      </div>

      {isAuthenticated && (
        <div className="add-question-form">
        <h3>{state.editingId ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chủ đề:</label>
            <div className="subject-selector">
              {state.formData.subjectName ? (
                <div className="selected-subject">
                  <span>{state.formData.subjectName}</span>
                  <button
                    type="button"
                    onClick={handleShowSubjectPopup}
                    className="btn btn-secondary btn-sm"
                    disabled={state.editingId}
                  >
                    {state.editingId ? "Không thể thay đổi" : "Thay đổi"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleShowSubjectPopup}
                  className="btn btn-outline"
                  disabled={state.editingId}
                >
                  {state.editingId
                    ? "Không thể thay đổi chủ đề"
                    : "Chọn chủ đề"}
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Nội dung câu hỏi:</label>
            <textarea
              id="content"
              name="content"
              value={state.formData.content}
              onChange={handleInputChange}
              placeholder="Nhập nội dung câu hỏi"
              rows="3"
              required
            />
          </div>

          <div
            className="form-row"
            style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}
          >
            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionA">Lựa chọn A:</label>
              <input
                type="text"
                id="optionA"
                name="optionA"
                value={state.formData.optionA}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn A"
                required
              />
            </div>

            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionB">Lựa chọn B:</label>
              <input
                type="text"
                id="optionB"
                name="optionB"
                value={state.formData.optionB}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn B"
                required
              />
            </div>

            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionC">Lựa chọn C:</label>
              <input
                type="text"
                id="optionC"
                name="optionC"
                value={state.formData.optionC}
                onChange={handleInputChange}
                placeholder="Nhập lựa chọn C"
                required
              />
            </div>

            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionD">Lựa chọn D:</label>
              <input
                type="text"
                id="optionD"
                name="optionD"
                value={state.formData.optionD}
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
                  checked={state.formData.correctAnswer === "A"}
                  onChange={handleInputChange}
                />
                A
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="B"
                  checked={state.formData.correctAnswer === "B"}
                  onChange={handleInputChange}
                />
                B
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="C"
                  checked={state.formData.correctAnswer === "C"}
                  onChange={handleInputChange}
                />
                C
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="D"
                  checked={state.formData.correctAnswer === "D"}
                  onChange={handleInputChange}
                />
                D
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="explanation">Giải thích (tùy chọn):</label>
            <textarea
              id="explanation"
              name="explanation"
              value={state.formData.explanation}
              onChange={handleInputChange}
              placeholder="Nhập giải thích cho câu trả lời đúng (không bắt buộc)"
              rows="3"
            />
            <div className="form-text">
              💡 Giải thích giúp học sinh hiểu rõ hơn về câu trả lời đúng
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={state.loading}
            >
              {state.loading
                ? "Đang xử lý..."
                : state.editingId
                ? "Cập nhật câu hỏi"
                : "Thêm câu hỏi"}
            </button>
            {state.editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                disabled={state.loading}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
      )}

      <div className="questions-list">
        <div className="questions-header">
          <h3>
            Danh sách câu hỏi ({getFilteredQuestions().length}
            {state.filterSubjectId && ` / ${state.questions.length}`})
          </h3>
          <div className="filter-controls">
            <label htmlFor="filterSubject">Lọc theo chủ đề:</label>
            <select
              id="filterSubject"
              value={state.filterSubjectId}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả chủ đề</option>
              {state.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state.error && (
          <div className="error-message">
            <p>❌ {state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline btn-sm"
            >
              Thử lại
            </button>
          </div>
        )}

        {state.loading && (
          <div className="loading-message">
            <p>⏳ Đang tải danh sách câu hỏi...</p>
          </div>
        )}

        {!state.loading &&
          !state.error &&
          getFilteredQuestions().length === 0 && (
            <p className="empty-message">
              {state.filterSubjectId
                ? "Không có câu hỏi nào trong chủ đề này."
                : "Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!"}
            </p>
          )}

        {!state.loading &&
          !state.error &&
          getFilteredQuestions().length > 0 && (
            <div
              className="questions-grid"
              style={{ marginTop: "15px", marginBottom: "30px" }}
            >
              {getFilteredQuestions().map((question) => (
                <div
                  key={question.id}
                  id={`question-${question.id}`}
                  className={`question-card ${
                    state.highlightedQuestionId === question.id
                      ? "highlighted"
                      : ""
                  }`}
                >
                  <div className="question-header">
                    <h4>Câu hỏi #{question.id}</h4>
                    <span className="subject-badge">
                      {question.subjectName}
                    </span>
                  </div>
                  <div
                    className="question-content"
                    style={{ marginTop: "12px" }}
                  >
                    <p>{question.content}</p>
                  </div>
                  <div className="question-options">
                    <div className="option">
                      <span className="option-label">A.</span>
                      <span className="option-text">{question.optionA}</span>
                    </div>
                    <div className="option">
                      <span className="option-label">B.</span>
                      <span className="option-text">{question.optionB}</span>
                    </div>
                    <div className="option">
                      <span className="option-label">C.</span>
                      <span className="option-text">{question.optionC}</span>
                    </div>
                    <div className="option">
                      <span className="option-label">D.</span>
                      <span className="option-text">{question.optionD}</span>
                    </div>
                  </div>
                  <div className="question-answer">
                    <strong>
                      Đáp án đúng:{" "}
                      {getCorrectAnswerText(question.correctAnswer)}
                    </strong>
                  </div>
                  {question.explanation && (
                    <div
                      className="question-explanation"
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "6px",
                        fontSize: "14px",
                        color: "#495057",
                      }}
                    >
                      <strong style={{ color: "#007bff" }}>
                        💡 Giải thích:
                      </strong>
                      <p style={{ margin: "8px 0 0 0", lineHeight: "1.5" }}>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                  {isAuthenticated && (
                    <div className="question-actions">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="btn btn-warning btn-sm"
                        disabled={state.loading}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="btn btn-danger btn-sm"
                        disabled={state.loading}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Subject Selection Popup */}
      {state.showSubjectPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Chọn chủ đề</h3>
              <button onClick={handleCloseSubjectPopup} className="close-btn">
                ×
              </button>
            </div>
            <div className="popup-body">
              {state.subjects.length === 0 ? (
                <p>Chưa có chủ đề nào. Hãy thêm chủ đề trước!</p>
              ) : (
                <div className="subjects-list">
                  {state.subjects.map((subject) => {
                    const isSelected = state.formData.subjectId === subject.id;
                    return (
                      <div
                        key={subject.id}
                        className="subject-item"
                        onClick={() => handleSubjectSelect(subject)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          margin: "8px 0",
                          backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
                          border: isSelected
                            ? "2px solid #2196f3"
                            : "1px solid #e9ecef",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected
                            ? "0 4px 8px rgba(33, 150, 243, 0.3)"
                            : "0 2px 4px rgba(0,0,0,0.1)",
                          transform: isSelected
                            ? "translateY(-1px)"
                            : "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.target.style.backgroundColor = "#e3f2fd";
                            e.target.style.borderColor = "#2196f3";
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 8px rgba(0,0,0,0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.target.style.backgroundColor = "#f8f9fa";
                            e.target.style.borderColor = "#e9ecef";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 2px 4px rgba(0,0,0,0.1)";
                          }
                        }}
                      >
                        <span
                          style={{
                            fontSize: "18px",
                            marginRight: "12px",
                            color: isSelected ? "#1976d2" : "#2196f3",
                          }}
                        >
                          📚
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: isSelected ? "600" : "500",
                            color: isSelected ? "#1976d2" : "#333",
                          }}
                        >
                          {subject.name}
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: "14px",
                              color: "#1976d2",
                              fontWeight: "600",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionView;
