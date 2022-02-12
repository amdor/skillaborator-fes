import {
	Component,
	ChangeDetectionStrategy,
	HostBinding,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	ViewEncapsulation,
	Input,
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
import { coerceBooleanProperty } from '@angular/cdk/coercion';

// TODO stop unintended back navigation, navigation elsewhere
@Component({
	selector: 'sk-elaborator-lobby',
	templateUrl: './elaborator-lobby.container.html',
	styleUrls: ['./elaborator-lobby.container.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class ElaboratorLobbyComponent implements OnInit, OnDestroy {
	@HostBinding('class.elaborator-lobby') hostCss = true;

	@Input()
	get demo(): boolean {
		return this.#demo;
	}
	set demo(val: boolean) {
		this.#demo = coerceBooleanProperty(val);
	}

	question: Question | undefined;
	isLoadingQuestion = true;
	currentQuestionNumber = 0;
	readOnlyMode = false;
	readonly maxQuestionCount: number;

	private data$$: Subscription;
	#demo: boolean = false;

	constructor(
		private store: Store<AppState>,
		private cdRef: ChangeDetectorRef,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		configService: ConfigService
	) {
		this.maxQuestionCount = this.#demo
			? configService.getMaxDemoQuestionsCount()
			: configService.getMaxQuestionsCount();
	}

	ngOnInit() {
		const getCurrentQuestion$ = this.store.select(getCurrentQuestion).pipe(
			tap((question: Question) => {
				if (!question) {
					this.router.navigate(['/']);
				}
				this.question = question;
				this.currentQuestionNumber++;
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

	onQuestionTimeout() {
		if (this.currentQuestionNumber === this.maxQuestionCount) {
			this.onElaborationFinished([]);
			return;
		}
		this.getNextQuestion([]);
	}

	getNextQuestion(selectedAnswerIds: string[]) {
		this.saveAnswer(selectedAnswerIds);

		this.store.dispatch(
			ElaboratorAction.getQuestion(
				selectedAnswerIds,
				selectedAnswerIds.length === 0
			)
		);
	}

	onElaborationFinished(selectedAnswerIds: string[]) {
		this.saveAnswer(selectedAnswerIds);

		const oneTimeCode =
			this.activatedRoute.snapshot.paramMap.get('oneTimeCode');
		this.store.dispatch(
			ElaboratorAction.evaluateAnswers(
				oneTimeCode!,
				selectedAnswerIds,
				selectedAnswerIds.length === 0
			)
		);
		this.router.navigate(['/review', oneTimeCode]);
	}

	private saveAnswer(selectedAnswerIds: string[]) {
		this.store.dispatch(
			ElaboratorAction.saveSelectedAnswer({
				questionId: this.question!.id,
				answerIds: selectedAnswerIds,
			})
		);
	}
}
