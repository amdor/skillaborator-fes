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
import {
  getCurrentQuestion,
  ElaboratorAction,
  getLoadingCurrentQuestion,
} from 'src/app/state';
import { Subscription, Observable, merge, combineLatest } from 'rxjs';
import { Question, SelectedAndRightAnswer } from '../elaborator-question.model';
import { AppState } from './../../app.module';
import {
  LocalStorageService,
  QUESTION_IDS_STORAGE_KEY,
  ANSWER_IDS_STORAGE_KEY,
  ConfigService,
} from './../../service';
import { tap, take, filter } from 'rxjs/operators';
import {
  getSelectedAndRightAnswers,
  getQuestions,
} from 'src/app/state/elaborator/elaborator.selector';

@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.container.component.html',
  styleUrls: ['./elaborator-lobby.container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorLobbyComponent implements OnInit, OnDestroy {
  @HostBinding('class.elaborator-lobby') hostCss = true;

  question: Question | undefined;
  selectedAndRightAnswer: SelectedAndRightAnswer;
  isLoadingQuestion = true;
  currentQuestionNumber = 1;
  readOnlyMode = false;
  readonly maxQuestionCount: number;

  private data$$: Subscription;
  private selectedAndRightAnswers: SelectedAndRightAnswer[];
  private questions: Question[];

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    configService: ConfigService
  ) {
    this.maxQuestionCount = configService.getMaxQuestionsCount();
  }

  ngOnInit() {
    LocalStorageService.setForKey(QUESTION_IDS_STORAGE_KEY, []);
    LocalStorageService.setForKey(ANSWER_IDS_STORAGE_KEY, []);

    this.store.dispatch(ElaboratorAction.getQuestion());

    const getCurrentQuestion$ = this.store.select(getCurrentQuestion).pipe(
      tap((question: Question) => {
        this.question = question;
      })
    );

    const isLoading$ = this.store.select(getLoadingCurrentQuestion).pipe(
      tap((isLoading: boolean) => {
        this.isLoadingQuestion = isLoading;
      })
    );

    this.data$$ = merge(getCurrentQuestion$, isLoading$).subscribe(() => {
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.data$$?.unsubscribe();
  }

  getNextQuestion(selectedAnswerId: string) {
    this.currentQuestionNumber++;

    if (this.readOnlyMode) {
      this.question = this.questions[this.currentQuestionNumber - 1];
      this.selectedAndRightAnswer = this.getCurrentSelectedAndRightAnswer();
      // TODO this.cdRef.markForCheck();?
      return;
    }

    this.saveAnswer(selectedAnswerId);

    if (this.currentQuestionNumber <= this.maxQuestionCount) {
      this.store.dispatch(ElaboratorAction.getQuestion());
      return;
    }
  }

  onElaborationFinished(selectedAnswerId: string) {
    if (this.readOnlyMode) {
      // TODO what happens after review has finished?
      return;
    }
    this.saveAnswer(selectedAnswerId);
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

          this.currentQuestionNumber = 1;
          this.question = questions[0];
          this.selectedAndRightAnswer = this.getCurrentSelectedAndRightAnswer();
          this.cdRef.markForCheck();
        }
      );
    this.store.dispatch(ElaboratorAction.evaluateAnswers());
    this.readOnlyMode = !this.readOnlyMode;
  }

  // TODO use this for sg....
  private saveAnswerToLocal(selectedAnswerId: string) {
    const previousQuestionIds =
      LocalStorageService.getForKey(QUESTION_IDS_STORAGE_KEY) ?? [];
    const previousAnswerIds =
      LocalStorageService.getForKey(ANSWER_IDS_STORAGE_KEY) ?? [];

    previousQuestionIds.push(this.question.id);
    previousAnswerIds.push(selectedAnswerId);

    LocalStorageService.setForKey(
      QUESTION_IDS_STORAGE_KEY,
      previousQuestionIds
    );
    LocalStorageService.setForKey(ANSWER_IDS_STORAGE_KEY, previousAnswerIds);
  }

  private getCurrentSelectedAndRightAnswer(): SelectedAndRightAnswer {
    return this.selectedAndRightAnswers.find(
      (answer: SelectedAndRightAnswer) => this.question.id === answer.questionId
    );
  }

  private saveAnswer(selectedAnswerId: string) {
    this.saveAnswerToLocal(selectedAnswerId);
    this.store.dispatch(
      ElaboratorAction.saveSelectedAnswer({
        questionId: this.question.id,
        answerId: selectedAnswerId,
      })
    );
  }
}
