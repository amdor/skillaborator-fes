import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { ElaboratorAction } from './elaborator.action';
import { ElaboratorService } from '../../service';
import {
  Question,
  SelectedAndRightAnswer,
} from '../../component/elaborator-question.model';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { getQuestions, getSelectedAnswers } from './elaborator.selector';

@Injectable()
export class ElaboratorEffect {
  getQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ElaboratorAction.getQuestion),
      withLatestFrom(this.store.select(getQuestions)),
      map(([, questions]) => {
        // TODO some logic for levels
        if (!questions.length) {
          return 1;
        }
        return 2;
      }),
      mergeMap((level: number) =>
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

  evaluateAnswers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ElaboratorAction.evaluateAnswers),
      withLatestFrom(this.store.select(getSelectedAnswers)),
      mergeMap(([, selectedAnswers]) =>
        this.service.postSelectedAnswers(selectedAnswers).pipe(
          map((selectedAnswersResponse: SelectedAndRightAnswer[]) =>
            ElaboratorAction.evaluateAnswersSuccess(selectedAnswersResponse)
          ),
          catchError((err) => {
            console.error(JSON.stringify(err));
            return of(ElaboratorAction.evaluateAnswersFail());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private service: ElaboratorService,
    private store: Store<AppState>
  ) {}
}
