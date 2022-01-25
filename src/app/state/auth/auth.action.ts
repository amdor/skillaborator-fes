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

	export const authenticateSuccess = createAction(
		`${ACTION_PREFIX} Authenticate Success`,
		(response: LoginResponse) => ({
			...response,
		})
	);

	export const authenticateFail = createAction(
		`${ACTION_PREFIX} Authenticate Fail`
	);

	export const logout = createAction(`${ACTION_PREFIX} Logout`);
}
