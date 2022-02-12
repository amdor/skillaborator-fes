import { AuthAction } from './auth.action';
import { createRehydrateReducer } from '../../service';
import { AUTH_STORAGE_KEY } from '../../service/utils/storage.service';
import { on } from '@ngrx/store';
import { ElaboratorAction } from '..';

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
	{
		key: AUTH_STORAGE_KEY,
		excludedKeys: ['oneTimeCode', 'nextSkillaborationStart'],
	},
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
	on(
		AuthAction.getNewUserCodeSuccess,
		(state: AuthState, { oneTimeCode }) => {
			return {
				...state,
				oneTimeCode,
			};
		}
	),
	on(
		AuthAction.getNextStartSuccess,
		(state, { nextSkillaborationStart }) => ({
			...state,
			nextSkillaborationStart: new Date(nextSkillaborationStart),
		})
	),
	on(ElaboratorAction.reset, (state) => ({ ...state, oneTimeCode: '' })),
	on(AuthAction.logout, () => initialState)
);
