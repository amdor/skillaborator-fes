import { AppState } from '../..';

export const getAccessToken = (state: AppState) => state.auth.accessToken;

export const getAuth = (state: AppState) => state.auth;
