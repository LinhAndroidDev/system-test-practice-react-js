import Subject from '../models/Subject.js';
import SubjectService from '../services/SubjectService.js';

class SubjectController {
  constructor() {
    this.service = new SubjectService();
    this.subjects = [];
    this.loading = false;
    this.error = null;
    this.listeners = [];
  }

  // Add event listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove event listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach(listener => listener({
      subjects: this.subjects,
      loading: this.loading,
      error: this.error
    }));
  }

  // Get all subjects
  async getSubjects() {
    this.loading = true;
    this.error = null;
    this.notify();

    try {
      this.subjects = await this.service.getSubjects();
      this.error = null;
    } catch (error) {
      this.error = error.message;
      console.error('Error in SubjectController.getSubjects:', error);
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  // Create new subject
  async createSubject(name) {
    if (!name || !name.trim()) {
      this.error = 'Tên chủ đề không được để trống';
      this.notify();
      return false;
    }

    const subject = new Subject(null, name.trim());
    
    if (!subject.isValid()) {
      this.error = 'Dữ liệu chủ đề không hợp lệ';
      this.notify();
      return false;
    }

    this.loading = true;
    this.error = null;
    this.notify();

    try {
      const updatedSubjects = await this.service.createSubject(subject);
      
      // Validate received data
      if (!Array.isArray(updatedSubjects)) {
        throw new Error('Dữ liệu từ server không hợp lệ');
      }
      
      // Replace the entire list with the updated list from API
      this.subjects = updatedSubjects;
      this.error = null;
      this.notify();
      return true;
    } catch (error) {
      this.error = error.message;
      this.notify();
      return false;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  // Update subject
  async updateSubject(id, name) {
    if (!name || !name.trim()) {
      this.error = 'Tên chủ đề không được để trống';
      this.notify();
      return false;
    }

    const subject = new Subject(id, name.trim());
    
    if (!subject.isValid()) {
      this.error = 'Dữ liệu chủ đề không hợp lệ';
      this.notify();
      return false;
    }

    this.loading = true;
    this.error = null;
    this.notify();

    try {
      console.log('Controller: Updating subject:', id, name);
      const updatedSubjects = await this.service.updateSubject(id, subject);
      console.log('Controller: Received updated subjects:', updatedSubjects);
      
      // Validate received data
      if (!Array.isArray(updatedSubjects)) {
        throw new Error('Dữ liệu từ server không hợp lệ');
      }
      
      // Replace the entire list with the updated list from API
      this.subjects = updatedSubjects;
      this.error = null;
      console.log('Controller: Subject updated successfully');
      this.notify();
      return true;
    } catch (error) {
      console.error('Controller: Error updating subject:', error);
      this.error = error.message;
      this.notify();
      return false;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  // Delete subject
  async deleteSubject(id) {
    this.loading = true;
    this.error = null;
    this.notify();

    try {
      const updatedSubjects = await this.service.deleteSubject(id);
      
      // Validate received data
      if (!Array.isArray(updatedSubjects)) {
        throw new Error('Dữ liệu từ server không hợp lệ');
      }
      
      // Replace the entire list with the updated list from API
      this.subjects = updatedSubjects;
      this.error = null;
      this.notify();
      return true;
    } catch (error) {
      this.error = error.message;
      this.notify();
      return false;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  // Get subject by ID
  getSubjectById(id) {
    return this.subjects.find(s => s.id === id);
  }

  // Clear error
  clearError() {
    this.error = null;
    this.notify();
  }
}

export default SubjectController;
