import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReviewAction } from './review.action';
import { ElaboratorService } from '../../service';
import { Store } from '@ngrx/store';
import { AppState, GetSelectedAnswersResponse } from 'src/app';
import { of } from 'rxjs';
import { EvaluationResult, SelectedAndRightAnswer } from '../../';
import { ElaboratorAction } from '../elaborator/elaborator.action';
import { SelectedAnswer } from 'src/app/component/elaborator-question.model';

@Injectable()
export class ReviewEffect {
  getEvaluationResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewAction.getEvaluationResults),
      mergeMap(({ oneTimeCode }) =>
        this.service.getSelectedAnswers$().pipe(
          map(
            ({
              questionsWithRightAnswers,
              score,
              selectedAnswers,
            }: GetSelectedAnswersResponse) => {
              // TODO question model should contain right answers, simplification needed everywhere, less mapping etc.
              const rightAnswersByQuestions = questionsWithRightAnswers.reduce(
                (acc, questionWithRightAnswers) => {
                  acc[questionWithRightAnswers.id] =
                    questionWithRightAnswers.rightAnswers;
                  return acc;
                },
                {}
              );
              const selectedAndRightAnswers = selectedAnswers.map(
                (selectedAnswer: SelectedAnswer) => ({
                  ...selectedAnswer,
                  rightAnswerIds:
                    rightAnswersByQuestions[selectedAnswer.questionId],
                })
              );
              const questions = questionsWithRightAnswers.map(
                ({ id, value, answers, multi, code }) => ({
                  id,
                  value,
                  answers,
                  multi,
                  code,
                })
              );
              return ReviewAction.getEvaluationResultsSuccess({
                selectedAndRightAnswers,
                score,
                questions,
                oneTimeCode,
              });
            }
          ),
          catchError((err) => {
            return of(ReviewAction.getEvaluationResultsFail());
          })
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: ElaboratorService) {}
}
