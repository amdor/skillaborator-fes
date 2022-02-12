import { AppState } from '../..';

export const getSelectedAndRightAnswers = (state: AppState) =>
	state.review.selectedAndRightAnswers;

export const getQuestions = (state: AppState) => state.review.questions;

export const getScore = (state: AppState) => state.review.score;

export const getOneTimeCode = (state: AppState) => state.review.oneTimeCode;
