import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import SubjectView from "./views/SubjectView";
import QuestionView from "./views/QuestionView";
import ExamView from "./views/ExamView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import TestRegisterAPI from "./views/TestRegisterAPI";
import TestLoginAPI from "./views/TestLoginAPI";

function MainApp() {
  const [activeTab, setActiveTab] = useState("subject");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case "subject":
        return <SubjectView />;
      case "question":
        return <QuestionView />;
      case "exam":
        return <ExamView />;
      default:
        return <SubjectView />;
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="App">
      <div className="sticky-container">
        <header className="app-header">
          <p style={{ fontSize: "28px", color: "white", fontWeight: "bold" }}>
            Hệ thống tạo đề thi trắc nghiệm
          </p>
          
          <div className="auth-controls">
            {isAuthenticated ? (
              <>
                <span className="user-info">
                  👤 {user?.name || user?.email}
                </span>
                <button className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button 
                  className="login-button" 
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
                <button 
                  className="register-button" 
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </header>

        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "subject" ? "active" : ""}`}
            onClick={() => setActiveTab("subject")}
          >
            Chủ đề
          </button>
          <button
            className={`tab-button ${activeTab === "question" ? "active" : ""}`}
            onClick={() => setActiveTab("question")}
          >
            Câu hỏi
          </button>
          <button
            className={`tab-button ${activeTab === "exam" ? "active" : ""}`}
            onClick={() => setActiveTab("exam")}
          >
            Đề thi
          </button>
        </nav>
      </div>

      <main className="tab-content">{renderTabContent()}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/test-register" element={<TestRegisterAPI />} />
      <Route path="/test-login" element={<TestLoginAPI />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}

export default App;
