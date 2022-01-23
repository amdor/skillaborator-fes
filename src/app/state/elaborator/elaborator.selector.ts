import { AppState } from '../..';

export const getCurrentQuestion = (state: AppState) =>
	state.elaborator.currentQuestion;

export const getLoadingCurrentQuestion = (state: AppState) =>
	state.elaborator.busy;

export const getSelectedAnswers = (state: AppState) =>
	state.elaborator.selectedAnswers;

export const getQuestions = (state: AppState) => state.elaborator.questions;
