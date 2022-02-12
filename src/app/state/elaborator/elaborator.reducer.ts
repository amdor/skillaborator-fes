import {
	Question,
	SelectedAnswer,
} from '../../component/elaborator-question.model';
import { createReducer, on } from '@ngrx/store';
import { ElaboratorAction } from './elaborator.action';

export interface ElaboratorState {
	currentQuestion: Question | undefined;
	questions: Question[];
	busy: boolean;
	selectedAnswers?: SelectedAnswer[];
}

const initialState = {
	currentQuestion: undefined,
	questions: [],
	busy: false,
};

export const elaboratorReducer = createReducer<ElaboratorState>(
	initialState,
	on(
		ElaboratorAction.getQuestion,
		ElaboratorAction.getFirstQuestion,
		(state) => ({
			...state,
			busy: true,
		})
	),
	on(ElaboratorAction.getQuestionSuccess, (state, { question }) => ({
		...state,
		currentQuestion: { ...question },
		questions: [...state.questions, question],
		busy: false,
	})),
	on(ElaboratorAction.getQuestionFail, (state) => ({
		...state,
		busy: false,
	})),
	on(ElaboratorAction.saveSelectedAnswer, (state, { selectedAnswer }) => {
		const oldAnswers = state.selectedAnswers || [];
		return {
			...state,
			selectedAnswers: [...oldAnswers, selectedAnswer],
		};
	}),
	on(ElaboratorAction.reset, () => initialState)
);
