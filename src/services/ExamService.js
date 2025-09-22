import Exam from '../models/Exam.js';

class ExamService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api/exam';
  }

  // Get all exams
  async getExams() {
    try {
      const response = await fetch(`${this.baseUrl}/get_exams`);
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        return result.data.map(item => Exam.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }

  // Create new exam
  async createExam(examData) {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData.toApiFormat())
      });
      
      const result = await response.json();
      
      if (result.status === 200) {
        return Exam.fromApiResponse(result.data);
      } else {
        throw new Error(result.message || 'Failed to create exam');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  // Update exam
  async updateExam(id, examData) {
    try {
      const response = await fetch(`${this.baseUrl}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData.toApiFormat())
      });
      
      const result = await response.json();
      
      if (result.status === 200) {
        return Exam.fromApiResponse(result.data);
      } else {
        throw new Error(result.message || 'Failed to update exam');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  }

  // Delete exam
  async deleteExam(id) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status === 200) {
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  }
}

export default ExamService;
