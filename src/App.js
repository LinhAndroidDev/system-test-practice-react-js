import React, { useState, useEffect } from "react";
import "./App.css";
import SubjectView from "./views/SubjectView";
import QuestionTab from "./components/QuestionTab";
import ExamTab from "./components/ExamTab";

function App() {
  const [activeTab, setActiveTab] = useState("subject");
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);

  // Load data from localStorage on component mount (only for questions and exams)
  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions");
    const savedExams = localStorage.getItem("exams");

    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedExams) setExams(JSON.parse(savedExams));
  }, []);

  // Save data to localStorage whenever data changes (only for questions and exams)
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "subject":
        return <SubjectView />;
      case "question":
        return (
          <QuestionTab questions={questions} setQuestions={setQuestions} />
        );
      case "exam":
        return (
          <ExamTab exams={exams} setExams={setExams} questions={questions} />
        );
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
