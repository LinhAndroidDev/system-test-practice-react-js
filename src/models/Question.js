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
    // 0 -> option_a (A), 1 -> option_b (B), 2 -> option_c (C), 3 -> option_d (D)
    const correctAnswerMap = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
    const correctAnswer = correctAnswerMap[apiData.correct_answer] || apiData.correct_answer;

    // Extract subject info from subject object
    const subjectId = apiData.subject ? apiData.subject.id : apiData.subject_id;
    const subjectName = apiData.subject ? apiData.subject.nameSubject : (apiData.subject_name || '');

    return new Question(
      apiData.id,
      apiData.content,
      apiData.option_a,
      apiData.option_b,
      apiData.option_c,
      apiData.option_d,
      correctAnswer,
      subjectId,
      subjectName,
      apiData.explanation || ""
    );
  }

  // Convert to API format
  toApiFormat() {
    // Map our format back to API format
    // A -> 0 (option_a), B -> 1 (option_b), C -> 2 (option_c), D -> 3 (option_d)
    const correctAnswerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const correctAnswer = correctAnswerMap[this.correctAnswer] !== undefined 
      ? correctAnswerMap[this.correctAnswer] 
      : this.correctAnswer;
    
    return {
      id: this.id,
      content: this.content,
      option_a: this.optionA,
      option_b: this.optionB,
      option_c: this.optionC,
      option_d: this.optionD,
      correct_answer: correctAnswer,
      subject_id: this.subjectId,
      subject_name: this.subjectName,
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
