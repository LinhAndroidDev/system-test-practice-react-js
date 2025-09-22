import React, { useState, useEffect } from "react";
import SubjectService from '../services/SubjectService.js';

const ExamTab = ({ exams, setExams, questions }) => {
  const [subjects, setSubjects] = useState([]);
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    subjectId: "",
    subjectName: "",
    timeLimit: "",
    questionIds: [],
  });

  // Load subjects on component mount
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectService = new SubjectService();
        const subjectsData = await subjectService.getSubjects();
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error loading subjects:', error);
      }
    };
    
    loadSubjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const subject = subjects.find((s) => s.id === parseInt(subjectId));
    setFormData((prev) => ({
      ...prev,
      subjectId: subjectId,
      subjectName: subject ? subject.name : "",
    }));
    setSelectedSubjectId(subjectId);
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleAddQuestionsToExam = () => {
    setFormData((prev) => ({
      ...prev,
      questionIds: selectedQuestions,
    }));
    setShowQuestionPopup(false);
    setSelectedQuestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.subjectId ||
      formData.questionIds.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một câu hỏi!");
      return;
    }

    const newExam = {
      id: editingId || Date.now(),
      name: formData.name,
      subjectId: parseInt(formData.subjectId),
      subjectName: formData.subjectName,
      timeLimit: parseInt(formData.timeLimit) || 0,
      questionIds: formData.questionIds,
      createdAt: editingId
        ? exams.find((e) => e.id === editingId)?.createdAt
        : new Date().toISOString(),
    };

    if (editingId) {
      setExams(exams.map((exam) => (exam.id === editingId ? newExam : exam)));
      setEditingId(null);
    } else {
      setExams([...exams, newExam]);
    }

    setFormData({
      name: "",
      subjectId: "",
      subjectName: "",
      timeLimit: "",
      questionIds: [],
    });
    setSelectedSubjectId("");
  };

  const handleEditExam = (exam) => {
    setEditingId(exam.id);
    setFormData({
      name: exam.name,
      subjectId: exam.subjectId.toString(),
      subjectName: exam.subjectName,
      timeLimit: exam.timeLimit.toString(),
      questionIds: exam.questionIds,
    });
    setSelectedSubjectId(exam.subjectId.toString());
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExam = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      setExams(exams.filter((exam) => exam.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      subjectId: "",
      subjectName: "",
      timeLimit: "",
      questionIds: [],
    });
    setSelectedSubjectId("");
  };

  const getFilteredQuestions = () => {
    if (!selectedSubjectId) return [];
    return questions.filter((q) => q.subjectId === parseInt(selectedSubjectId));
  };

  const getExamQuestions = (exam) => {
    return questions.filter((q) => exam.questionIds.includes(q.id));
  };

  const formatTime = (seconds) => {
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
  };

  return (
    <div className="exam-tab">
      <div className="tab-header">
        <h2>Quản lý đề thi</h2>
        <p>Tạo và quản lý các đề thi trắc nghiệm</p>
      </div>

      <div className="add-exam-form">
        <h3>{editingId ? "Sửa đề thi" : "Thêm đề thi mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên đề thi:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              value={formData.subjectId}
              onChange={handleSubjectChange}
              required
            >
              <option value="">Chọn chủ đề</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeLimit">Thời gian làm bài (giây):</label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleInputChange}
              placeholder="Nhập thời gian (giây)"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Câu hỏi đã chọn ({formData.questionIds.length}):</label>
            <div className="selected-questions">
              {formData.questionIds.length === 0 ? (
                <p className="no-questions">Chưa chọn câu hỏi nào</p>
              ) : (
                <div className="selected-questions-list">
                  {formData.questionIds.map((questionId) => {
                    const question = questions.find((q) => q.id === questionId);
                    return question ? (
                      <div key={questionId} className="selected-question-item">
                        <span>{question.content.substring(0, 50)}...</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              questionIds: prev.questionIds.filter(
                                (id) => id !== questionId
                              ),
                            }));
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
              onClick={() => setShowQuestionPopup(true)}
              className="btn btn-outline"
              disabled={!formData.subjectId}
            >
              {formData.subjectId ? "Chọn câu hỏi" : "Chọn chủ đề trước"}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Cập nhật đề thi" : "Tạo đề thi"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="exams-list">
        <h3>Danh sách đề thi ({exams.length})</h3>
        {exams.length === 0 ? (
          <p className="empty-message">
            Chưa có đề thi nào. Hãy tạo đề thi đầu tiên!
          </p>
        ) : (
          <div
            className="exams-grid"
            style={{ marginTop: "15px", marginBottom: "30px" }}
          >
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
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
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
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

      {/* Question Selection Popup */}
      {showQuestionPopup && (
        <div className="popup-overlay">
          <div className="popup-content large">
            <div className="popup-header">
              <h3>Chọn câu hỏi cho đề thi</h3>
              <button
                onClick={() => setShowQuestionPopup(false)}
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
                          selectedQuestions.includes(question.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleQuestionSelect(question.id)}
                      >
                        <div className="question-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question.id)}
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
                      disabled={selectedQuestions.length === 0}
                    >
                      Thêm {selectedQuestions.length} câu hỏi
                    </button>
                    <button
                      onClick={() => setShowQuestionPopup(false)}
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
    </div>
  );
};

export default ExamTab;
