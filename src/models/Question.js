class Question {
  constructor(id, content, optionA, optionB, optionC, optionD, correctAnswer, subjectId, subjectName, explanation = "") {
    this.id = id;
    this.content = content;
    this.optionA = optionA;
    this.optionB = optionB;
    this.optionC = optionC;
    this.optionD = optionD;
    this.correctAnswer = correctAnswer;
    this.subjectId = subjectId;
    this.subjectName = subjectName;
    this.explanation = explanation;
  }

  // Static method to create from API response
  static fromApiResponse(apiData) {
    // Map API format to our format
    // 0 -> optionA (A), 1 -> optionB (B), 2 -> optionC (C), 3 -> optionD (D)
    const correctAnswerMap = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
    const correctAnswer = correctAnswerMap[apiData.correctAnswer] || apiData.correctAnswer;

    // Extract subject info from subject object
    const subjectId = apiData.subject ? apiData.subject.id : apiData.subjectId;
    const subjectName = apiData.subject ? apiData.subject.nameSubject : (apiData.subjectName || '');

    return new Question(
      apiData.id,
      apiData.content,
      apiData.optionA,
      apiData.optionB,
      apiData.optionC,
      apiData.optionD,
      correctAnswer,
      subjectId,
      subjectName,
      apiData.explanation === null ? "" : (apiData.explanation || "")
    );
  }

  // Convert to API format
  toApiFormat() {
    // Map our format back to API format
    // A -> 0 (optionA), B -> 1 (optionB), C -> 2 (optionC), D -> 3 (optionD)
    const correctAnswerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const correctAnswer = correctAnswerMap[this.correctAnswer] !== undefined 
      ? correctAnswerMap[this.correctAnswer] 
      : this.correctAnswer;
    
    return {
      id: this.id,
      content: this.content,
      optionA: this.optionA,
      optionB: this.optionB,
      optionC: this.optionC,
      optionD: this.optionD,
      correctAnswer: correctAnswer,
      subjectId: this.subjectId,
      subjectName: this.subjectName,
      explanation: this.explanation
    };
  }

  // Validation
  isValid() {
    return this.content && 
           this.optionA && 
           this.optionB && 
           this.optionC && 
           this.optionD && 
           this.correctAnswer && 
           this.subjectId;
  }

  // Get correct answer text
  getCorrectAnswerText() {
    const options = { A: "A", B: "B", C: "C", D: "D" };
    return options[this.correctAnswer] || this.correctAnswer;
  }

  // Clone method
  clone() {
    return new Question(
      this.id,
      this.content,
      this.optionA,
      this.optionB,
      this.optionC,
      this.optionD,
      this.correctAnswer,
      this.subjectId,
      this.subjectName,
      this.explanation
    );
  }
}

export default Question;
