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
import { Subscription, merge, combineLatest } from 'rxjs';
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
import { Router } from '@angular/router';

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
  isLoadingQuestion = true;
  currentQuestionNumber = 1;
  readOnlyMode = false;
  readonly maxQuestionCount: number;

  private data$$: Subscription;

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    private router: Router,
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

  getNextQuestion(selectedAnswerIds: string[]) {
    this.currentQuestionNumber++;
    this.saveAnswer(selectedAnswerIds);

    if (this.currentQuestionNumber <= this.maxQuestionCount) {
      this.store.dispatch(ElaboratorAction.getQuestion());
      return;
    }
  }

  onElaborationFinished(selectedAnswerIds: string[]) {
    this.saveAnswer(selectedAnswerIds);
    this.store.dispatch(ElaboratorAction.evaluateAnswers());
    this.router.navigate(['/review']);
  }

  // TODO use this for sg....
  private saveAnswerToLocal(selectedAnswerIds: string[]) {
    const previousQuestionIds =
      LocalStorageService.getForKey(QUESTION_IDS_STORAGE_KEY) ?? [];
    const previousAnswerIds =
      LocalStorageService.getForKey(ANSWER_IDS_STORAGE_KEY) ?? [];

    previousQuestionIds.push(this.question.id);
    previousAnswerIds.push(selectedAnswerIds);

    LocalStorageService.setForKey(
      QUESTION_IDS_STORAGE_KEY,
      previousQuestionIds
    );
    LocalStorageService.setForKey(ANSWER_IDS_STORAGE_KEY, previousAnswerIds);
  }

  private saveAnswer(selectedAnswerIds: string[]) {
    this.saveAnswerToLocal(selectedAnswerIds);
    this.store.dispatch(
      ElaboratorAction.saveSelectedAnswer({
        questionId: this.question.id,
        answerIds: selectedAnswerIds,
      })
    );
  }
}
