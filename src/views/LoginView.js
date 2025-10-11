import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthController from "../controllers/AuthController";
import "../styles/Auth.css";

const authController = new AuthController();

function LoginView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      // Redirect to home page on successful login
      if (newState.isAuthenticated) {
        navigate("/");
        window.location.reload(); // Reload to update App state
      }
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
    await authController.login(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Đăng Nhập</h1>
        
        {state.error && (
          <div className="auth-error">
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Nhập mật khẩu"
              disabled={state.loading}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={state.loading}
          >
            {state.loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>

          <div className="auth-link">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="link-button"
            >
              Đăng ký ngay
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

export default LoginView;

