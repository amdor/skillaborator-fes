import {
  Question,
  SelectedAnswer,
} from '../component/elaborator-question.model';
import { createReducer, on, Action } from '@ngrx/store';
import { ElaboratorAction } from './elaborator.action';

export interface ElaboratorState {
  questions: Question[];
  currentQuestion: Question;
  selectedAnswers: SelectedAnswer[];
  busy: boolean;
}

const initialState = {
  questions: [],
  currentQuestion: undefined,
  selectedAnswers: [],
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
  }))
);
