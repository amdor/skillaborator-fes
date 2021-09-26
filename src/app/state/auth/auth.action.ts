import { createAction } from '@ngrx/store';

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
    (response: any) => ({
      response,
    })
  );

  export const authenticateFail = createAction(
    `${ACTION_PREFIX} Authenticate Fail`
  );
}
