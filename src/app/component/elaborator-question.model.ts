export interface Question {
  id: string;
  value: string;
  answers: Answer[];
  level: number;
  code?: Code;
}

export interface Answer {
  id: string;
  value: string;
}

export interface SelectedAnswer {
  questionId: string;
  answerId: string;
}

export interface SelectedAndRightAnswer extends SelectedAnswer {
  rightAnswerId: string;
}

export interface Code {
  value: string;
  language: string;
}
