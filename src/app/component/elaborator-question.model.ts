export interface Question {
	id: string;
	value: string;
	answers: Answer[];
	multi: boolean;
	code?: Code;
	oneTimeCode?: string;
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

export interface EvaluationResult {
	rightAnswersByQuestions: Record<string, string[]>;
	score: number;
}

export interface QuestionWithRightAnswer extends Question {
	rightAnswers: string[];
}

export interface GetSelectedAnswersResponse {
	questionsWithRightAnswers: QuestionWithRightAnswer[];
	score: number;
	selectedAnswers: SelectedAnswer[];
}
