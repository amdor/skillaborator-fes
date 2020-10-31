import {
  Question,
  SelectedAnswer,
  SelectedAndRightAnswer,
} from '../../component/elaborator-question.model';
import { createReducer, on, Action } from '@ngrx/store';
import { ElaboratorAction } from './elaborator.action';

export interface ElaboratorState {
  questions: Question[];
  currentQuestion: Question;
  busy: boolean;
  selectedAnswers?: SelectedAnswer[];
  selectedAndRightAnswers?: SelectedAndRightAnswer[];
}

const initialState = {
  questions: [],
  currentQuestion: undefined,
  busy: true,
};

export const elaboratorReducer = createReducer(
  initialState,
  on(ElaboratorAction.getQuestion, (state) => ({
    ...state,
    busy: true,
  })),
  on(ElaboratorAction.getQuestionSuccess, (state, { question }) => ({
    ...state,
    questions: [...state.questions, question],
    currentQuestion: question,
    busy: false,
  })),
  on(ElaboratorAction.getQuestionFail, (state) => ({
    ...state,
    busy: false,
  })),
  on(
    ElaboratorAction.saveSelectedAnswer,
    (state: ElaboratorState, { selectedAnswer }) => {
      const oldAnswers = state.selectedAnswers || [];
      return {
        ...state,
        selectedAnswers: [...oldAnswers, selectedAnswer],
      };
    }
  ),
  on(ElaboratorAction.evaluateAnswers, (state: ElaboratorState) => ({
    ...state,
    busy: true,
  })),
  on(
    ElaboratorAction.evaluateAnswersSuccess,
    (state: ElaboratorState, { selectedAndRightAnswers }) => {
      return {
        ...state,
        selectedAnswers: null,
        selectedAndRightAnswers,
        currentQuestion: state.questions[0],
        busy: false,
      };
    }
  ),
  on(ElaboratorAction.evaluateAnswersFail, (state: ElaboratorState) => ({
    ...state,
    busy: false,
  }))
);
