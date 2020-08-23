import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ElaboratorAction } from './elaborator.action';
import { ElaboratorService } from '../service';
import { Question } from '../component/elaborator-question.model';
import { of } from 'rxjs';

@Injectable()
export class ElaboratorEffect {
  getQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ElaboratorAction.getQuestion),
      mergeMap(({ level }) =>
        this.service.getQuestion(level).pipe(
          map((question: Question) =>
            ElaboratorAction.getQuestionSuccess(question)
          ),
          catchError((err) => {
            console.error(JSON.stringify(err));
            return of(ElaboratorAction.getQuestionFail());
          })
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: ElaboratorService) {}
}
