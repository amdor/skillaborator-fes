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
import { Subscription, merge } from 'rxjs';
import { Question } from '../elaborator-question.model';
import { AppState } from './../../app.module';
import { ConfigService } from './../../service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.container.html',
  styleUrls: ['./elaborator-lobby.container.scss'],
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
    private activatedRoute: ActivatedRoute,
    configService: ConfigService
  ) {
    this.maxQuestionCount = configService.getMaxQuestionsCount();
  }

  ngOnInit() {
    // TODO redirect if store's empty
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

    this.store.dispatch(ElaboratorAction.getQuestion(selectedAnswerIds));
  }

  onElaborationFinished(selectedAnswerIds: string[]) {
    this.saveAnswer(selectedAnswerIds);
    this.store.dispatch(ElaboratorAction.evaluateAnswers(selectedAnswerIds));
    this.router.navigate([
      '/review',
      this.activatedRoute.snapshot.paramMap.get('oneTimeCode'),
    ]);
  }

  private saveAnswer(selectedAnswerIds: string[]) {
    this.store.dispatch(
      ElaboratorAction.saveSelectedAnswer({
        questionId: this.question.id,
        answerIds: selectedAnswerIds,
      })
    );
  }
}
