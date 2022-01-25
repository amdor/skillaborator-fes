import { AuthAction } from './auth.action';
import { createRehydrateReducer } from '../../service';
import { AUTH_STORAGE_KEY } from '../../service/utils/storage.service';
import { on } from '@ngrx/store';

export interface AuthState {
	accessToken: string;
	email: string;
	oneTimeCode: string;
	nextSkillaborationStart?: Date;
}

const initialState: AuthState = {
	accessToken: '',
	email: '',
	oneTimeCode: '',
};

export const authReducer = createRehydrateReducer(
	{ key: AUTH_STORAGE_KEY },
	initialState,
	on(
		AuthAction.authenticateSuccess,
		(state: AuthState, { email, token, nextSkillaborationStart }) => {
			return {
				...state,
				email,
				accessToken: token,
				nextSkillaborationStart: new Date(nextSkillaborationStart),
			};
		}
	),
	on(AuthAction.logout, () => initialState)
);
