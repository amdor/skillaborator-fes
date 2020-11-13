export interface Question {
  id: string;
  value: string;
  answers: Answer[];
  level: number;
  multi: boolean;
  code?: Code;
}

export interface Answer {
  id: string;
  value: string;
}

export interface SelectedAnswer {
  questionId: string;
  answerIds: string[];
}

export interface SelectedAndRightAnswer extends SelectedAnswer {
  rightAnswerIds: string[];
}

export interface Code {
  value: string;
  language: string;
}
