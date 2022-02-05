import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { AuthAction } from './auth.action';

@Injectable()
export class AuthEffect {
	authenticate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthAction.authenticate),
			switchMap(({ authorizationCode }) =>
				this.service.accessToken$(authorizationCode).pipe(
					map((response) => AuthAction.authenticateSuccess(response)),
					catchError(() => of(AuthAction.authenticateFail()))
				)
			)
		)
	);

	getNewUserCode$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthAction.getNewUserCode),
			switchMap(({ accessToken, email }) =>
				this.service.getOneTimeCodeForUser$(accessToken, email).pipe(
					map((response) =>
						AuthAction.getNewUserCodeSuccess(response.oneTimeCode)
					),
					catchError(() => of(AuthAction.getNewUserCodeFail()))
				)
			)
		)
	);

	getNextStart$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthAction.getNextStart),
			switchMap(({ accessToken }) =>
				this.service.getNextStart$(accessToken).pipe(
					map((response) =>
						AuthAction.getNextStartSuccess(
							response.nextSkillaborationStart!
						)
					),
					catchError(() => of(AuthAction.getNextStartFail()))
				)
			)
		)
	);

	constructor(private actions$: Actions, private service: AuthService) {}
}
