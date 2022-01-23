import { AuthAction } from './auth.action';
import { createRehydrateReducer, LoginResponse } from '../../service';
import { AUTH_STORAGE_KEY } from '../../service/utils/storage.service';
import { on } from '@ngrx/store';

export interface AuthState {
	accessToken: string;
	email: string;
	oneTimeCode: string;
}

const initialState: AuthState = {
	accessToken: '',
	email: '',
	oneTimeCode: '',
};

export const authReducer = createRehydrateReducer(
	{ key: AUTH_STORAGE_KEY },
	initialState,
	on(AuthAction.authenticateSuccess, (state: AuthState, { email, token }) => {
		return {
			...state,
			email,
			accessToken: token,
		};
	})
);
