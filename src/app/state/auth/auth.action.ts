import { createAction } from '@ngrx/store';
import { LoginResponse } from 'src/app';

const ACTION_PREFIX = 'Auth';

export namespace AuthAction {
	export const authenticate = createAction(
		`${ACTION_PREFIX} Authenticate`,
		(authorizationCode: string) => ({
			authorizationCode,
		})
	);

	export const getNewUserCode = createAction(
		`${ACTION_PREFIX} Get New User Code`,
		(accessToken: string, email: string) => ({
			accessToken,
			email,
		})
	);

	export const getNextStart = createAction(
		`${ACTION_PREFIX} Get Next Start`,
		(accessToken: string) => ({
			accessToken,
		})
	);

	export const authenticateSuccess = createAction(
		`${ACTION_PREFIX} Authenticate Success`,
		(response: LoginResponse) => ({
			...response,
		})
	);

	export const getNewUserCodeSuccess = createAction(
		`${ACTION_PREFIX} Get New User Code Success`,
		(oneTimeCode: string) => ({
			oneTimeCode,
		})
	);
	export const getNextStartSuccess = createAction(
		`${ACTION_PREFIX} Get Next Start Success`,
		(nextSkillaborationStart: string) => ({
			nextSkillaborationStart,
		})
	);

	export const authenticateFail = createAction(
		`${ACTION_PREFIX} Authenticate Fail`
	);

	export const getNewUserCodeFail = createAction(
		`${ACTION_PREFIX} Get New User Code Fail`
	);

	export const getNextStartFail = createAction(
		`${ACTION_PREFIX} Get Next Start Fail`
	);

	export const logout = createAction(`${ACTION_PREFIX} Logout`);
}
