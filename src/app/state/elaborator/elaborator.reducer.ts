import {
  Question,
  SelectedAnswer,
} from '../../component/elaborator-question.model';
import { createReducer, INITIAL_STATE, on } from '@ngrx/store';
import { ElaboratorAction } from './elaborator.action';

export interface ElaboratorState {
  currentQuestion: Question;
  questions: Question[];
  busy: boolean;
  selectedAnswers?: SelectedAnswer[];
}

const initialState = {
  currentQuestion: undefined,
  questions: [],
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
    currentQuestion: question,
    questions: [...state.questions, question],
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
  on(ElaboratorAction.reset, () => initialState),
);
