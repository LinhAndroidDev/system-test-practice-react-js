import React, { useState } from "react";
import "./App.css";
import SubjectView from "./views/SubjectView";
import QuestionView from "./views/QuestionView";
import ExamView from "./views/ExamView";

function App() {
  const [activeTab, setActiveTab] = useState("subject");

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

  return (
    <div className="App">
      <div className="sticky-container">
        <header className="app-header">
          <p style={{ fontSize: "28px", color: "white", fontWeight: "bold" }}>
            Hệ thống tạo đề thi trắc nghiệm
          </p>
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

export default App;
