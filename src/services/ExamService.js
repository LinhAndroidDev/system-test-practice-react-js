import Exam from '../models/Exam.js';

class ExamService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api/exam';
  }

  // Get auth headers with token
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getExams() {
    try {
      const response = await fetch(`${this.baseUrl}/get_exams`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        return data.data.map(examData => Exam.fromApiResponse(examData));
      } else {
        throw new Error(data.message || 'Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }

  async createExam(examData) {
    try {
      // Convert questionIds array to string format for API
      const questionsString = examData.questionIds.join(', ');
      
      const requestBody = {
        subjectId: examData.subjectId,
        title: examData.title,
        durationSeconds: examData.durationSeconds,
        questions: questionsString
      };

      const response = await fetch(`${this.baseUrl}/add_exam`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        return data.data.map(examData => Exam.fromApiResponse(examData));
      } else {
        throw new Error(data.message || 'Failed to create exam');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  async updateExam(id, examData) {
    try {
      // Convert questionIds array to string format for API
      const questionsString = examData.questionIds.join(', ');
      
      const requestBody = {
        id: id,
        subjectId: examData.subjectId,
        title: examData.title,
        durationSeconds: examData.durationSeconds,
        questions: questionsString
      };

      const response = await fetch(`${this.baseUrl}/update`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        return data.data.map(examData => Exam.fromApiResponse(examData));
      } else {
        throw new Error(data.message || 'Failed to update exam');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  }

  async deleteExam(id) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        return data.data.map(examData => Exam.fromApiResponse(examData));
      } else {
        throw new Error(data.message || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  }
}

export default ExamService;