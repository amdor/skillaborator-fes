import {
  SelectedAndRightAnswer,
  Question,
  GetSelectedAnswersResponse,
} from '../../component/elaborator-question.model';
import { ElaboratorAction } from '../elaborator/elaborator.action';
import { on } from '@ngrx/store';
import { createRehydrateReducer } from '../../service';
import { SELECTED_ANSWERS_STORAGE_KEY } from '../../service/utils/storage.service';
import { ReviewAction } from './review.action';

export interface ReviewState {
  selectedAndRightAnswers: SelectedAndRightAnswer[];
  score: number;
  questions: Question[];
  oneTimeCode: string;
}

const initialState: ReviewState = {
  selectedAndRightAnswers: [],
  score: 0,
  questions: [],
  oneTimeCode: '',
};

export const reviewReducer = createRehydrateReducer(
  { key: SELECTED_ANSWERS_STORAGE_KEY },
  initialState,
  on(
    ElaboratorAction.evaluateAnswersSuccess,
    (
      state: ReviewState,
      { selectedAndRightAnswers, score, questions, oneTimeCode }
    ) => {
      return {
        ...state,
        selectedAndRightAnswers,
        score,
        questions,
        oneTimeCode,
      };
    }
  ),
  on(
    ReviewAction.getEvaluationResultsSuccess,
    (state: ReviewState, newState: ReviewState) => {
      return {
        ...state,
        ...newState,
      };
    }
  ),
  // TODO: show some message, stop spinner
  on(
    ElaboratorAction.evaluateAnswersFail,
    ReviewAction.getEvaluationResultsFail,
    (state: ReviewState) => ({
      ...state,
    })
  )
);
