import Question from '../models/Question.js';

class QuestionService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api/question';
  }

  // Get all questions
  async getQuestions() {
    try {
      const response = await fetch(`${this.baseUrl}/get_questions`);
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        return result.data.map(item => Question.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  // Get questions by subject
  async getQuestionsBySubject(subjectId) {
    try {
      const response = await fetch(`${this.baseUrl}/get_by_subject/${subjectId}`);
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        return result.data.map(item => Question.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to fetch questions by subject');
      }
    } catch (error) {
      console.error('Error fetching questions by subject:', error);
      throw error;
    }
  }

  // Create new question
  async createQuestion(questionData) {
    try {
      // Create Question instance from the data
      const question = new Question(
        questionData.id,
        questionData.content,
        questionData.optionA,
        questionData.optionB,
        questionData.optionC,
        questionData.optionD,
        questionData.correctAnswer,
        questionData.subjectId,
        questionData.subjectName
      );
      
      const requestBody = question.toApiFormat();
      
      const response = await fetch(`${this.baseUrl}/add_question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // API returns updated list of all questions, return the entire list
        return result.data.map(item => Question.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to create question');
      }
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  // Update question
  async updateQuestion(id, questionData) {
    try {
      // Create Question instance from the data
      const question = new Question(
        questionData.id,
        questionData.content,
        questionData.optionA,
        questionData.optionB,
        questionData.optionC,
        questionData.optionD,
        questionData.correctAnswer,
        questionData.subjectId,
        questionData.subjectName
      );
      
      const requestBody = question.toApiFormat();
      
      const response = await fetch(`${this.baseUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // API returns updated list of all questions, return the entire list
        return result.data.map(item => Question.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to update question');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  // Delete question
  async deleteQuestion(id) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status === 200) {
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
}

export default QuestionService;
