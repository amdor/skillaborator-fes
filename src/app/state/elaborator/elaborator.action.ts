import { createAction } from '@ngrx/store';
import {
	Question,
	SelectedAnswer,
	SelectedAndRightAnswer,
} from '../../component/elaborator-question.model';

const ACTION_PREFIX = 'Elaborator';

export namespace ElaboratorAction {
	export const getQuestion = createAction(
		`${ACTION_PREFIX} Get Question`,
		(selectedAnswerIds: string[], timedOut: boolean = false) => ({
			selectedAnswerIds,
			timedOut,
		})
	);

	export const getFirstQuestion = createAction(
		`${ACTION_PREFIX} Get First Question`,
		(oneTimeCode?: string) => ({ oneTimeCode })
	);

	export const getQuestionSuccess = createAction(
		`${ACTION_PREFIX} Get Question Success`,
		(question: Question) => ({ question })
	);

	export const getQuestionFail = createAction(
		`${ACTION_PREFIX} Get Question Fail`
	);

	export const saveSelectedAnswer = createAction(
		`${ACTION_PREFIX} Save Selected Answer`,
		(selectedAnswer: SelectedAnswer) => ({ selectedAnswer })
	);

	export const evaluateAnswers = createAction(
		`${ACTION_PREFIX} Evaluate Answers`,
		(
			oneTimeCode: string,
			selectedAnswerIds: string[],
			timedOut: boolean = false
		) => ({
			oneTimeCode,
			selectedAnswerIds,
			timedOut,
		})
	);

	export const evaluateAnswersSuccess = createAction(
		`${ACTION_PREFIX} Evaluate Answers Success`,
		(evalutationResults: {
			selectedAndRightAnswers: SelectedAndRightAnswer[];
			score: number;
			questions: Question[];
			oneTimeCode: string;
		}) => evalutationResults
	);

	export const evaluateAnswersFail = createAction(
		`${ACTION_PREFIX} Evaluate Answers Fail`
	);

	export const reset = createAction(`${ACTION_PREFIX} Reset`);
}
