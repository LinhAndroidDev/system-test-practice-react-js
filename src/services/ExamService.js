import Exam from '../models/Exam.js';

class ExamService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api/exam';
  }

  async getExams() {
    try {
      const response = await fetch(`${this.baseUrl}/get_exams`);
      
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
        subject_id: examData.subjectId,
        title: examData.title,
        duration_seconds: examData.durationSeconds,
        questions: questionsString
      };

      const response = await fetch(`${this.baseUrl}/add_exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        subject_id: examData.subjectId,
        title: examData.title,
        duration_seconds: examData.durationSeconds,
        questions: questionsString
      };

      const response = await fetch(`${this.baseUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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