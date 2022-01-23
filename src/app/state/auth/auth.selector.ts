import { AppState } from '../..';

export const getAccessToken = (state: AppState) => state.auth.accessToken;

export const getEmail = (state: AppState) => state.auth.email;
