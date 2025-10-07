import Question from './Question.js';

class Exam {
  constructor(id, name, subjectId, subjectName, timeLimit, questionIds, createdAt, questions = []) {
    this.id = id;
    this.name = name;
    this.subjectId = subjectId;
    this.subjectName = subjectName;
    this.timeLimit = timeLimit;
    this.questionIds = questionIds || [];
    this.questions = questions || []; // Store actual question objects
    this.createdAt = createdAt || new Date().toISOString();
  }

  // Static method to create from API response
  static fromApiResponse(apiData) {
    // Handle nested subject object
    const subjectId = apiData.subject ? apiData.subject.id : apiData.subjectId;
    const subjectName = apiData.subject ? apiData.subject.nameSubject : (apiData.subjectName || '');
    
    // Handle questions array - extract question IDs and convert to Question objects
    const questionIds = apiData.questions ? apiData.questions.map(q => q.id) : (apiData.questionIds || []);
    const questions = apiData.questions ? apiData.questions.map(q => Question.fromApiResponse(q)) : [];
    
    return new Exam(
      apiData.id,
      apiData.title,
      subjectId,
      subjectName,
      apiData.durationSeconds,
      questionIds,
      apiData.createdAt,
      questions
    );
  }

  // Convert to API format
  toApiFormat() {
    return {
      id: this.id,
      title: this.name,
      subjectId: this.subjectId,
      subjectName: this.subjectName,
      durationSeconds: this.timeLimit,
      questionIds: this.questionIds,
      createdAt: this.createdAt
    };
  }

  // Validation
  isValid() {
    return this.name && 
           this.subjectId && 
           this.questionIds.length > 0;
  }

  // Format time display
  formatTime() {
    const hours = Math.floor(this.timeLimit / 3600);
    const minutes = Math.floor((this.timeLimit % 3600) / 60);
    const seconds = this.timeLimit % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Get formatted creation date
  getFormattedDate() {
    return new Date(this.createdAt).toLocaleDateString();
  }

  // Clone method
  clone() {
    return new Exam(
      this.id,
      this.name,
      this.subjectId,
      this.subjectName,
      this.timeLimit,
      [...this.questionIds],
      this.createdAt,
      [...this.questions]
    );
  }
}

export default Exam;
