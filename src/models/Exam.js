class Exam {
  constructor(id, name, subjectId, subjectName, timeLimit, questionIds, createdAt) {
    this.id = id;
    this.name = name;
    this.subjectId = subjectId;
    this.subjectName = subjectName;
    this.timeLimit = timeLimit;
    this.questionIds = questionIds || [];
    this.createdAt = createdAt || new Date().toISOString();
  }

  // Static method to create from API response
  static fromApiResponse(apiData) {
    return new Exam(
      apiData.id,
      apiData.name,
      apiData.subjectId,
      apiData.subjectName,
      apiData.timeLimit,
      apiData.questionIds,
      apiData.createdAt
    );
  }

  // Convert to API format
  toApiFormat() {
    return {
      id: this.id,
      name: this.name,
      subjectId: this.subjectId,
      subjectName: this.subjectName,
      timeLimit: this.timeLimit,
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
      this.createdAt
    );
  }
}

export default Exam;
