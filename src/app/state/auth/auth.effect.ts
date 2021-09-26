import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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

  constructor(private actions$: Actions, private service: AuthService) {}
}
