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
  selectedAndRightAnswer: SelectedAndRightAnswer;
  questionPreview: false;

  private selectedAndRightAnswers: SelectedAndRightAnswer[];

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    combineLatest([
      this.store.select(getSelectedAndRightAnswers),
      this.store.select(getQuestions),
    ])
      .pipe(
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
          this.selectedAndRightAnswers = selectedAndRightAnswers;
          this.questions = questions;
          this.cdRef.markForCheck();
        }
      );
  }

  private getSelectedAndRightAnswer(question: Question): SelectedAndRightAnswer {
    return this.selectedAndRightAnswers.find(
      (answer: SelectedAndRightAnswer) => question.id === answer.questionId
    );
  }
}
