import Subject from '../models/Subject.js';

class SubjectService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api/subject';
  }

  // Get all subjects
  async getSubjects() {
    try {
      const response = await fetch(`${this.baseUrl}/get_subjects`);
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        return result.data.map(item => Subject.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to fetch subjects');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }

  // Create new subject
  async createSubject(subjectData) {
    try {
      const response = await fetch(`${this.baseUrl}/add_subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameSubject: subjectData.name
        })
      });
      
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // API returns updated list of all subjects, return the entire list
        return result.data.map(item => Subject.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to create subject');
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
  }

  // Update subject
  async updateSubject(id, subjectData) {
    try {
      const requestBody = {
        id: id,
        nameSubject: subjectData.name
      };
      
      const response = await fetch(`${this.baseUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // API returns updated list of all subjects, return the entire list
        return result.data.map(item => Subject.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to update subject');
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  // Delete subject
  async deleteSubject(id) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // API returns updated list of all subjects, return the entire list
        return result.data.map(item => Subject.fromApiResponse(item));
      } else {
        throw new Error(result.message || 'Failed to delete subject');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }
}

export default SubjectService;
