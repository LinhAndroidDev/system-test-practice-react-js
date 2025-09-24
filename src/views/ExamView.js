import React, { useState, useEffect } from "react";
import ExamController from '../controllers/ExamController.js';

const ExamView = () => {
  const [controller] = useState(() => new ExamController());
  const [state, setState] = useState({
    exams: [],
    subjects: [],
    questions: [],
    loading: false,
    error: null,
    editingId: null,
    highlightedExamId: null,
    showQuestionPopup: false,
    showTimePopup: false,
    selectedSubjectId: "",
    selectedQuestions: [],
    customTimeInput: "",
    formData: {
      name: "",
      subjectId: "",
      subjectName: "",
      timeLimit: "",
      customTimeLimit: "",
      questionIds: [],
    },
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

  const handleSubjectChange = (e) => {
    controller.handleSubjectChange(e.target.value);
  };

  const handleQuestionSelect = (questionId) => {
    controller.handleQuestionSelect(questionId);
  };

  const handleAddQuestionsToExam = () => {
    controller.handleAddQuestionsToExam();
  };

  const handleOpenQuestionPopup = () => {
    controller.handleOpenQuestionPopup();
  };

  const handleConfirmCustomTime = () => {
    controller.handleConfirmCustomTime();
  };

  const handleCancelCustomTime = () => {
    controller.handleCancelCustomTime();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    controller.handleSubmit();
  };

  const handleEditExam = (exam) => {
    controller.handleEditExam(exam);
  };

  const handleDeleteExam = (id) => {
    controller.handleDeleteExam(id);
  };

  const handleCancelEdit = () => {
    controller.handleCancelEdit();
  };

  const getFilteredQuestions = () => {
    return controller.getFilteredQuestions();
  };

  const getExamQuestions = (exam) => {
    return controller.getExamQuestions(exam);
  };

  const formatTime = (seconds) => {
    return controller.formatTime(seconds);
  };

  return (
    <div className="exam-tab">
      <div className="tab-header">
        <h2>Quản lý đề thi</h2>
        <p>Tạo và quản lý các đề thi trắc nghiệm</p>
      </div>

      {state.loading && (
        <div className="loading-message">
          Đang xử lý...
        </div>
      )}

      {state.error && (
        <div className="error-message">
          ❌ {state.error}
        </div>
      )}

      <div className="add-exam-form">
        <h3>{state.editingId ? "Sửa đề thi" : "Thêm đề thi mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên đề thi:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={state.formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên đề thi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subjectId">Chủ đề:</label>
            <select
              id="subjectId"
              name="subjectId"
              value={state.formData.subjectId}
              onChange={handleSubjectChange}
              required
              disabled={state.editingId}
            >
              <option value="">Chọn chủ đề</option>
              {state.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {state.editingId && (
              <div className="form-text text-warning">
                ⚠️ Không thể thay đổi chủ đề khi chỉnh sửa đề thi
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="timeLimit">Thời gian làm bài (phút):</label>
            <select
              id="timeLimit"
              name="timeLimit"
              value={state.formData.timeLimit}
              onChange={handleInputChange}
            >
              <option value="">Chọn thời gian</option>
              <option value="15">15 phút</option>
              <option value="30">30 phút</option>
              <option value="45">45 phút</option>
              <option value="60">1 giờ</option>
              <option value="90">1.5 giờ</option>
              <option value="120">2 giờ</option>
              <option value="150">2.5 giờ</option>
              <option value="180">3 giờ</option>
              <option value="custom">Tùy chỉnh...</option>
              {state.formData.customTimeLimit && (
                <option value={state.formData.customTimeLimit}>
                  {state.formData.customTimeLimit} phút (tùy chỉnh)
                </option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Câu hỏi đã chọn ({state.formData.questionIds.length}):</label>
            <div className="selected-questions">
              {state.formData.questionIds.length === 0 ? (
                <p className="no-questions">Chưa chọn câu hỏi nào</p>
              ) : (
                <div className="selected-questions-list">
                  {state.formData.questionIds.map((questionId) => {
                    const question = state.questions.find((q) => q.id === questionId);
                    return question ? (
                      <div key={questionId} className="selected-question-item">
                        <span>{question.content.substring(0, 50)}...</span>
                        <button
                          type="button"
                          onClick={() => {
                            controller.handleInputChange('questionIds', state.formData.questionIds.filter(id => id !== questionId));
                          }}
                          className="remove-question-btn"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleOpenQuestionPopup}
              className="btn btn-outline"
              disabled={!state.formData.subjectId}
            >
              {state.formData.subjectId ? "Chọn câu hỏi" : "Chọn chủ đề trước"}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={state.loading}>
              {state.loading ? "Đang xử lý..." : (state.editingId ? "Cập nhật đề thi" : "Tạo đề thi")}
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

      <div className="exams-list">
        <h3>Danh sách đề thi ({state.exams.length})</h3>
        {state.exams.length === 0 ? (
          <p className="empty-message">
            Chưa có đề thi nào. Hãy tạo đề thi đầu tiên!
          </p>
        ) : (
          <div
            className="exams-grid"
            style={{ marginTop: "15px", marginBottom: "30px" }}
          >
            {state.exams.map((exam) => (
              <div 
                key={exam.id} 
                id={`exam-${exam.id}`}
                className={`exam-card ${state.highlightedExamId === exam.id ? 'highlighted' : ''}`}
              >
                <div className="exam-header">
                  <h4>{exam.name}</h4>
                  <span className="subject-badge">{exam.subjectName}</span>
                </div>
                <div className="exam-info">
                  <p>
                    <strong>Số câu hỏi:</strong> {exam.questionIds.length}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {formatTime(exam.timeLimit)}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(exam.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="exam-questions-preview">
                  <h5>Câu hỏi trong đề:</h5>
                  {getExamQuestions(exam).length === 0 ? (
                    <p className="no-questions">Không có câu hỏi</p>
                  ) : (
                    <ul>
                      {getExamQuestions(exam)
                        .slice(0, 3)
                        .map((question) => (
                          <li key={question.id}>
                            {question.content.substring(0, 50)}...
                          </li>
                        ))}
                      {getExamQuestions(exam).length > 3 && (
                        <li>
                          ... và {getExamQuestions(exam).length - 3} câu hỏi
                          khác
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="exam-actions">
                  <button
                    onClick={() => handleEditExam(exam)}
                    className="btn btn-warning btn-sm"
                    disabled={state.loading}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="btn btn-danger btn-sm"
                    disabled={state.loading}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question Selection Popup */}
      {state.showQuestionPopup && (
        <div className="popup-overlay">
          <div className="popup-content large">
            <div className="popup-header">
              <h3>Chọn câu hỏi cho đề thi</h3>
              <button
                onClick={() => controller.handleInputChange('showQuestionPopup', false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              {getFilteredQuestions().length === 0 ? (
                <p>Không có câu hỏi nào trong chủ đề này.</p>
              ) : (
                <>
                  <div className="questions-selection">
                    {getFilteredQuestions().map((question) => (
                      <div
                        key={question.id}
                        className={`question-selection-item ${
                          state.selectedQuestions.includes(question.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleQuestionSelect(question.id)}
                      >
                        <div className="question-checkbox">
                          <input
                            type="checkbox"
                            checked={state.selectedQuestions.includes(question.id)}
                            onChange={() => handleQuestionSelect(question.id)}
                          />
                        </div>
                        <div className="question-content">
                          <p>{question.content}</p>
                          <div className="question-options-preview">
                            <span>A. {question.optionA}</span>
                            <span>B. {question.optionB}</span>
                            <span>C. {question.optionC}</span>
                            <span>D. {question.optionD}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="popup-actions">
                    <button
                      onClick={handleAddQuestionsToExam}
                      className="btn btn-primary"
                      disabled={state.selectedQuestions.length === 0}
                    >
                      Thêm {state.selectedQuestions.length} câu hỏi
                    </button>
                    <button
                      onClick={() => controller.handleInputChange('showQuestionPopup', false)}
                      className="btn btn-secondary"
                    >
                      Hủy
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Time Popup */}
      {state.showTimePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Nhập thời gian tùy chỉnh</h3>
              <button
                onClick={handleCancelCustomTime}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              <div className="form-group">
                <label htmlFor="customTimeInput">Thời gian (phút):</label>
                <input
                  type="number"
                  id="customTimeInput"
                  value={state.customTimeInput}
                  onChange={(e) => controller.handleInputChange('customTimeInput', e.target.value)}
                  placeholder="Nhập thời gian (phút)"
                  min="1"
                  autoFocus
                />
              </div>
            </div>
            <div className="popup-actions">
              <button
                onClick={handleConfirmCustomTime}
                className="btn btn-primary"
                disabled={!state.customTimeInput || parseInt(state.customTimeInput) <= 0}
              >
                Xác nhận
              </button>
              <button
                onClick={handleCancelCustomTime}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamView;
