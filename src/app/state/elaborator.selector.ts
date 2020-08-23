// import { ElaboratorState } from './elaborator.reducer';

// TODO wtf is happening here, infers ElaboratorState, yet it's not ElaboratorState
export const getCurrentQuestion = (state: any) =>
  state.elaborator.currentQuestion;
