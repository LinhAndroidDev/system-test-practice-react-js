import React, { useState, useEffect } from "react";
import QuestionController from "../controllers/QuestionController.js";
import { useAuth } from "../contexts/AuthContext";
import MathTextInput from "../components/MathTextInput";
import MathTextDisplay from "../components/MathTextDisplay";
import MathInput from "../components/MathInput";
import MathDisplay from "../components/MathDisplay";

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
    uploadingImage: false,
    formData: {
      content: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      imageUrl: "",
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      controller.handleImageUpload(file);
    }
  };

  const handleRemoveImage = async () => {
    await controller.handleRemoveImage();
  };

  const handleExplanationImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      controller.handleExplanationImageUpload(file);
    }
  };

  const handleRemoveExplanationImage = async () => {
    await controller.handleRemoveExplanationImage();
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
            <MathTextInput
              name="content"
              value={state.formData.content}
              onChange={handleInputChange}
              placeholder="Nhập nội dung câu hỏi. Ví dụ: Tính giá trị của $x^2 + 2x + 1$ khi $x = 3$"
              resetHelper={state.resetHelpers}
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh cho câu hỏi (tùy chọn nếu có nội dung):</label>
            <div className="image-upload-wrapper">
              {state.formData.imageUrl ? (
                <div className="image-preview-card">
                  <img 
                    src={state.formData.imageUrl} 
                    alt="Question" 
                    className="uploaded-image"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-remove-image"
                    title="Xóa hình ảnh"
                    disabled={state.deletingImage}
                  >
                    {state.deletingImage ? (
                      <div className="upload-spinner"></div>
                    ) : (
                      '✕'
                    )}
                  </button>
                </div>
              ) : (
                <div className="image-upload-zone">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleImageUpload}
                    disabled={state.uploadingImage}
                    className="image-input-hidden"
                  />
                  <label 
                    htmlFor="imageUpload" 
                    className={`image-upload-label ${state.uploadingImage ? 'uploading' : ''}`}
                  >
                    {state.uploadingImage ? (
                      <>
                        <div className="upload-spinner"></div>
                        <span>Đang tải lên...</span>
                      </>
                    ) : (
                      <>
                        <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="upload-text-main">Tải lên hình ảnh</span>
                        <span className="upload-text-sub">JPG, PNG, GIF - Tối đa 5MB</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
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
              <MathTextInput
                name="optionA"
                value={state.formData.optionA}
                onChange={handleInputChange}
                placeholder="Đáp án A"
                resetHelper={state.resetHelpers}
              />
            </div>

            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionB">Lựa chọn B:</label>
              <MathTextInput
                name="optionB"
                value={state.formData.optionB}
                onChange={handleInputChange}
                placeholder="Đáp án B"
                resetHelper={state.resetHelpers}
              />
            </div>

            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionC">Lựa chọn C:</label>
              <MathTextInput
                name="optionC"
                value={state.formData.optionC}
                onChange={handleInputChange}
                placeholder="Đáp án C"
                resetHelper={state.resetHelpers}
              />
            </div>

            <div
              className="form-group"
              style={{ flex: "1", minWidth: "200px" }}
            >
              <label htmlFor="optionD">Lựa chọn D:</label>
              <MathTextInput
                name="optionD"
                value={state.formData.optionD}
                onChange={handleInputChange}
                placeholder="Đáp án D"
                resetHelper={state.resetHelpers}
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
            <MathTextInput
              name="explanation"
              value={state.formData.explanation}
              onChange={handleInputChange}
              placeholder="Nhập giải thích cho câu trả lời đúng. Ví dụ: Áp dụng công thức $a^2 + b^2 = c^2$"
              resetHelper={state.resetHelpers}
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh cho giải thích (tùy chọn):</label>
            <div className="image-upload-wrapper">
              {state.formData.explanationImageUrl ? (
                <div className="image-preview-card">
                  <img 
                    src={state.formData.explanationImageUrl} 
                    alt="Explanation" 
                    className="uploaded-image"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveExplanationImage}
                    className="btn-remove-image"
                    title="Xóa hình ảnh"
                    disabled={state.deletingExplanationImage}
                  >
                    {state.deletingExplanationImage ? (
                      <div className="upload-spinner"></div>
                    ) : (
                      '✕'
                    )}
                  </button>
                </div>
              ) : (
                <div className="image-upload-zone">
                  <input
                    type="file"
                    id="explanationImageUpload"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleExplanationImageUpload}
                    disabled={state.uploadingExplanationImage}
                    className="image-input-hidden"
                  />
                  <label 
                    htmlFor="explanationImageUpload" 
                    className={`image-upload-label ${state.uploadingExplanationImage ? 'uploading' : ''}`}
                  >
                    {state.uploadingExplanationImage ? (
                      <>
                        <div className="upload-spinner"></div>
                        <span>Đang tải lên...</span>
                      </>
                    ) : (
                      <>
                        <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="upload-text-main">Tải lên hình ảnh</span>
                        <span className="upload-text-sub">JPG, PNG, GIF - Tối đa 5MB</span>
                      </>
                    )}
                  </label>
                </div>
              )}
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
                    <p><MathTextDisplay text={question.content} /></p>
                    {question.imageUrl && (
                      <div className="question-image-display">
                        <img 
                          src={question.imageUrl} 
                          alt="Question illustration" 
                        />
                      </div>
                    )}
                  </div>
                  <div className="question-options">
                    <div className="option">
                      <span className="option-label">A.</span>
                      <span className="option-text">
                        <MathTextDisplay text={question.optionA} />
                      </span>
                    </div>
                    <div className="option">
                      <span className="option-label">B.</span>
                      <span className="option-text">
                        <MathTextDisplay text={question.optionB} />
                      </span>
                    </div>
                    <div className="option">
                      <span className="option-label">C.</span>
                      <span className="option-text">
                        <MathTextDisplay text={question.optionC} />
                      </span>
                    </div>
                    <div className="option">
                      <span className="option-label">D.</span>
                      <span className="option-text">
                        <MathTextDisplay text={question.optionD} />
                      </span>
                    </div>
                  </div>
                  <div className="question-answer">
                    <strong>
                      Đáp án đúng:{" "}
                      {getCorrectAnswerText(question.correctAnswer)}
                    </strong>
                  </div>
                  {(question.explanation || question.explanationImageUrl) && (
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
                      {question.explanation && (
                        <p style={{ margin: "8px 0 0 0", lineHeight: "1.5" }}>
                          <MathTextDisplay text={question.explanation} />
                        </p>
                      )}
                      {question.explanationImageUrl && (
                        <div className="question-image-display" style={{ marginTop: question.explanation ? "12px" : "8px" }}>
                          <img 
                            src={question.explanationImageUrl} 
                            alt="Explanation illustration" 
                          />
                        </div>
                      )}
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
