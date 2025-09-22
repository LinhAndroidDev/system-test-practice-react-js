import React, { useState, useEffect } from "react";
import SubjectController from "../controllers/SubjectController.js";

const SubjectView = () => {
  const [controller] = useState(() => new SubjectController());
  const [state, setState] = useState({
    subjects: [],
    loading: false,
    error: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    editingId: null,
    editingName: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // Subscribe to controller updates
  useEffect(() => {
    const handleUpdate = (newState) => {
      setState(newState);
    };

    controller.addListener(handleUpdate);

    // Load subjects on mount
    controller.getSubjects();

    return () => {
      controller.removeListener(handleUpdate);
    };
  }, [controller]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    const success = await controller.createSubject(formData.name);
    if (success) {
      setFormData((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleEditSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      editingId: subject.id,
      editingName: subject.name,
    }));
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    const success = await controller.updateSubject(
      formData.editingId,
      formData.editingName
    );
    if (success) {
      setFormData((prev) => ({
        ...prev,
        editingId: null,
        editingName: "",
      }));
    }
  };

  const handleDeleteSubject = (subject) => {
    setSubjectToDelete(subject);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (subjectToDelete) {
      const success = await controller.deleteSubject(subjectToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setSubjectToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSubjectToDelete(null);
  };

  const handleCancelEdit = () => {
    setFormData((prev) => ({
      ...prev,
      editingId: null,
      editingName: "",
    }));
  };

  return (
    <div className="subject-tab">
      <div className="tab-header">
        <h2>Quản lý chủ đề</h2>
        <p>Thêm, sửa, xóa các chủ đề cho câu hỏi</p>
      </div>

      <div className="add-subject-form">
        <h3>Thêm chủ đề mới</h3>
        <form onSubmit={handleAddSubject}>
          <div className="form-group">
            <label htmlFor="name">Tên chủ đề:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên chủ đề"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Thêm chủ đề
          </button>
        </form>
      </div>

      <div className="subjects-list">
        <h3>Danh sách chủ đề ({state.subjects.length})</h3>

        {state.error && (
          <div className="error-message">
            <p>❌ {state.error}</p>
            <button
              onClick={() => controller.getSubjects()}
              className="btn btn-outline btn-sm"
            >
              Thử lại
            </button>
          </div>
        )}

        {state.loading && (
          <div className="loading-message">
            <p>⏳ Đang xử lý...</p>
          </div>
        )}

        {!state.loading && !state.error && state.subjects.length === 0 && (
          <p className="empty-message">
            Chưa có chủ đề nào. Hãy thêm chủ đề đầu tiên!
          </p>
        )}

        {!state.loading && !state.error && state.subjects.length > 0 && (
          <div
            className="subjects-grid"
            style={{ marginTop: "15px", marginBottom: "30px" }}
          >
            {state.subjects.map((subject) => (
              <div key={subject.id} className="subject-card">
                {formData.editingId === subject.id ? (
                  <form onSubmit={handleUpdateSubject} className="edit-form">
                    <input
                      type="text"
                      name="editingName"
                      value={formData.editingName}
                      onChange={handleInputChange}
                      className="edit-input"
                      required
                    />
                    <div className="edit-actions">
                      <button type="submit" className="btn btn-success btn-sm">
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn btn-secondary btn-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="subject-info">
                      <h4>{subject.name}</h4>
                    </div>
                    <div className="subject-actions">
                      <button
                        onClick={() => handleEditSubject(subject)}
                        className="btn btn-warning btn-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject)}
                        className="btn btn-danger btn-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="popup-overlay">
          <div className="popup-content delete-confirm">
            <div className="popup-header">
              <h3>Xác nhận xóa chủ đề</h3>
            </div>
            <div className="popup-body">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <p>
                  Bạn có chắc chắn muốn xóa chủ đề{" "}
                  <strong>"{subjectToDelete?.name}"</strong>?
                </p>
                <p className="warning-text">
                  Hành động này không thể hoàn tác và sẽ xóa tất cả câu hỏi
                  thuộc chủ đề này.
                </p>
              </div>
            </div>
            <div className="popup-actions">
              <button onClick={cancelDelete} className="btn btn-secondary">
                Hủy
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Xóa chủ đề
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectView;
