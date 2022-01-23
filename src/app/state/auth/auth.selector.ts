import { AppState } from '../..';

export const getAccessToken = (state: AppState) =>
  state.auth.accessToken;
