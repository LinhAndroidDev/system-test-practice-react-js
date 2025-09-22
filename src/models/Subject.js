class Subject {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  // Static method to create from API response
  static fromApiResponse(apiData) {
    return new Subject(apiData.id, apiData.nameSubject);
  }

  // Convert to API format
  toApiFormat() {
    return {
      id: this.id,
      nameSubject: this.name
    };
  }

  // Validation
  isValid() {
    return this.name && this.name.trim().length > 0;
  }

  // Clone method
  clone() {
    return new Subject(this.id, this.name);
  }
}

export default Subject;
