import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthController from "../controllers/AuthController";
import "../styles/Auth.css";

const authController = new AuthController();

function RegisterView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [state, setState] = useState({
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Check if already logged in
    if (authController.isAuthenticated) {
      navigate("/");
    }

    // Subscribe to controller updates
    authController.onUpdate((newState) => {
      setState({
        loading: newState.loading,
        error: newState.error,
      });
    });

    return () => {
      authController.onUpdate(null);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    authController.clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await authController.register(formData);
    
    if (success) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Đăng Ký</h1>
        
        {state.error && (
          <div className="auth-error">
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              disabled={state.loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              disabled={state.loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              disabled={state.loading}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              disabled={state.loading}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={state.loading}
          >
            {state.loading ? "Đang đăng ký..." : "Đăng Ký"}
          </button>

          <div className="auth-link">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="link-button"
            >
              Đăng nhập ngay
            </button>
          </div>

          <div className="auth-link">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="link-button"
            >
              Tiếp tục với tư cách khách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterView;

