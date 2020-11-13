import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, merge, combineLatest } from 'rxjs';
import { Question, SelectedAndRightAnswer } from '../elaborator-question.model';
import { AppState } from '../../app.module';
import {
  LocalStorageService,
  QUESTION_IDS_STORAGE_KEY,
  ANSWER_IDS_STORAGE_KEY,
  ConfigService,
} from '../../service';
import { tap, take, filter } from 'rxjs/operators';
import {
  ElaboratorAction,
  getCurrentQuestion,
  getLoadingCurrentQuestion,
  getQuestions,
} from '../..';
import { getSelectedAndRightAnswers } from '../../state/elaborator/elaborator.selector';
import { Router } from '@angular/router';

@Component({
  selector: 'sk-elaborator-review-lobby',
  templateUrl: './elaborator-review-lobby.container.component.html',
  styleUrls: ['./elaborator-review-lobby.container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorReviewLobbyComponent implements OnInit {
  @HostBinding('class.elaborator-review-lobby') hostCss = true;

  questions: Question[];
  selectedAndRightAnswers: Map<string, SelectedAndRightAnswer>;
  questionPreview: false;

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const sub = combineLatest([
      this.store.select(getSelectedAndRightAnswers),
      this.store.select(getQuestions),
    ])
      .pipe(
        tap(([, questions]) => {
          if (!questions?.length) {
            this.router.navigate(['']);
          }
        }),
        filter(
          ([selectedAndRightAnswers, questions]) =>
            !!selectedAndRightAnswers && !!questions
        ),
        take(1)
      )
      .subscribe(
        ([selectedAndRightAnswers, questions]: [
          SelectedAndRightAnswer[],
          Question[]
        ]) => {
          this.selectedAndRightAnswers = new Map();
          selectedAndRightAnswers.forEach((selectedAndRightAnswer) => {
            this.selectedAndRightAnswers.set(
              selectedAndRightAnswer.questionId,
              selectedAndRightAnswer
            );
          });
          this.questions = questions;
          this.cdRef.markForCheck();
        }
      );
  }

  rightAnswersSelected(question: Question): boolean {
    const rightAnswerIds =
      this.selectedAndRightAnswers?.get(question.id).rightAnswerIds ?? [];
    const selectedAnswerIds =
      [...this.selectedAndRightAnswers?.get(question.id).answerIds] ?? [];
    return (
      rightAnswerIds.length === selectedAnswerIds.length &&
      rightAnswerIds.every((rightAnswerId) => {
        const indexOfRightAnswer = selectedAnswerIds.indexOf(rightAnswerId);
        if (indexOfRightAnswer === -1) {
          return false;
        }
        selectedAnswerIds.splice(indexOfRightAnswer, 1);
        return true;
      })
    );
  }
}
