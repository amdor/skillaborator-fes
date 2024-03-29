import {
	Component,
	ChangeDetectionStrategy,
	HostBinding,
	OnInit,
	ChangeDetectorRef,
	ViewEncapsulation,
	OnDestroy,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { Question, SelectedAndRightAnswer } from '../elaborator-question.model';
import { AppState } from '../../app.module';
import { tap, filter, map } from 'rxjs/operators';
import {
	getQuestions,
	getSelectedAndRightAnswers,
	getScore,
	getOneTimeCode,
	ReviewAction,
} from '../../state';
import { ActivatedRoute, Router } from '@angular/router';
import type { Chart } from 'chart.js';
import { ProfessionalLevel } from './elaborator-review.model';

enum AnswerSummaryState {
	Right,
	PartialWrong,
	Wrong,
}

@Component({
	selector: 'sk-elaborator-review',
	templateUrl: './elaborator-review.container.html',
	styleUrls: ['./elaborator-review.container.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class ElaboratorReviewLobbyComponent implements OnInit, OnDestroy {
	@HostBinding('class.elaborator-review') hostCss = true;
	@HostBinding('class.elaborator-review-responsive') responsiveCss = true;

	@ViewChild('scoreChart') set scoreChart(scoreChart: ElementRef) {
		this._scoreChart = scoreChart;
		if (scoreChart && this.maxScore) {
			this.loadScoreChart(this.maxScore);
		}
	}

	questions: Question[];
	score: number;
	selectedAndRightAnswersMap: Map<
		string,
		SelectedAndRightAnswer & { answerSummaryState: AnswerSummaryState }
	>;
	questionPreview: false;
	isLoading = true;
	professionalLevel: ProfessionalLevel;
	professionalLevels = ProfessionalLevel;
	scoreMessage: string | undefined;

	answerSummaryState = AnswerSummaryState;

	private data$$: Subscription | undefined;
	private _scoreChart: ElementRef | undefined;
	private chart: Chart | undefined;
	private maxScore: number;
	private chartModule: Promise<typeof Chart> | undefined;
	private readonly scoreBase = 10;

	constructor(
		private store: Store<AppState>,
		private cdRef: ChangeDetectorRef,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.loadChartModule();
	}

	ngOnInit() {
		this.data$$ = combineLatest([
			this.store.select(getSelectedAndRightAnswers),
			this.store.select(getScore),
			this.store.select(getQuestions),
			this.store.select(getOneTimeCode),
		])
			.pipe(
				filter(
					([, , , oneTimeCode]) =>
						oneTimeCode ===
						this.activatedRoute.snapshot.paramMap.get('oneTimeCode')
				),
				tap(([, , questions]) => {
					if (!questions?.length) {
						this.router.navigate(['']);
					}
				}),
				filter(
					([selectedAndRightAnswers, , questions]) =>
						!!selectedAndRightAnswers?.length && !!questions?.length
				),
				map(
					([selectedAndRightAnswers, score, questions]: [
						SelectedAndRightAnswer[],
						number,
						Question[],
						string
					]) => [selectedAndRightAnswers, score, questions]
				)
			)
			.subscribe(
				([selectedAndRightAnswers, score, questions]: [
					SelectedAndRightAnswer[],
					number,
					Question[]
				]) => {
					this.createSelectedAndRightAnswersMap(
						selectedAndRightAnswers
					);
					this.questions = questions;
					this.score = score;
					this.isLoading = false;

					this.maxScore = this.getMaxScore(questions.length);

					this.professionalLevel =
						score < this.maxScore * 0.5
							? ProfessionalLevel.Beginner
							: score < this.maxScore * 0.8
							? ProfessionalLevel.Medior
							: ProfessionalLevel.Pro;

					this.scoreMessage =
						this.professionalLevel === ProfessionalLevel.Beginner
							? 'You are at beginner level, keep learning!'
							: this.professionalLevel ===
							  ProfessionalLevel.Medior
							? 'Congratulations, you are at a professional level'
							: 'Congratulations, you are a tech god emperor';

					this.cdRef.markForCheck();
				}
			);

		const oneTimeCode$$ = combineLatest([
			this.store.select(getOneTimeCode),
			this.activatedRoute.paramMap,
		]).subscribe({
			next: ([persistedOneTimeCode, activatedRouteParams]) => {
				const currentOneTimeCode =
					activatedRouteParams.get('oneTimeCode');
				if (
					currentOneTimeCode &&
					persistedOneTimeCode !== currentOneTimeCode
				) {
					this.store.dispatch(
						ReviewAction.getEvaluationResults(currentOneTimeCode)
					);
				}
			},
		});

		this.data$$.add(oneTimeCode$$);
	}

	ngOnDestroy() {
		this.data$$?.unsubscribe();
		this.chart?.destroy();
	}

	private intersect(arrA: string[], arrB: string[]): string[] {
		const intersection: string[] = [];
		const cloneB = [...arrB];

		arrA.forEach((elemA) => {
			const elemAIndexInCloneB = cloneB.indexOf(elemA);
			if (elemAIndexInCloneB === -1) {
				return;
			}
			cloneB.splice(elemAIndexInCloneB, 1);
			intersection.push(elemA);
		});
		return intersection;
	}

	private getMaxScore(numberOfQuestions: number, depth = 0) {
		const step = depth * 5;
		if (depth > 2) {
			return Math.max(numberOfQuestions - 15, 0) * 14;
		}
		return (
			this.getMaxScore(numberOfQuestions, depth + 1) +
			Math.max(Math.min(numberOfQuestions, step + 5) - step, 0) *
				(11 + depth)
		);
	}

	private createSelectedAndRightAnswersMap(
		selectedAndRightAnswers: SelectedAndRightAnswer[]
	) {
		this.selectedAndRightAnswersMap = new Map();

		selectedAndRightAnswers.forEach((selectedAndRightAnswer) => {
			let answerSummaryState;
			const numberOfRightAndSelectedAnswers = this.intersect(
				selectedAndRightAnswer.rightAnswerIds,
				selectedAndRightAnswer.answerIds
			).length;

			answerSummaryState =
				numberOfRightAndSelectedAnswers === 0
					? AnswerSummaryState.Wrong
					: numberOfRightAndSelectedAnswers ===
							selectedAndRightAnswer.rightAnswerIds.length &&
					  selectedAndRightAnswer.rightAnswerIds.length ===
							selectedAndRightAnswer.answerIds.length
					? AnswerSummaryState.Right
					: AnswerSummaryState.PartialWrong;

			this.selectedAndRightAnswersMap.set(
				selectedAndRightAnswer.questionId,
				{
					...selectedAndRightAnswer,
					answerSummaryState,
				}
			);
		});
	}

	private async loadScoreChart(maxScore: number) {
		// prettier-ignore
		const labels = ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180', '200', '220', '240', '260'];
		// prettier-ignore
		const data: Chart.ChartData = {
      labels,
      datasets: [
        {
          data: this.getData(maxScore),
          radius: (context) => {
            const index = context.dataIndex!;
            const xValue = Number(labels[index]);
            const distanceFromScore = this.score - xValue;
            // the first label that exeeds score should mark the score
            if (distanceFromScore <= 0 && distanceFromScore > -20) {
              return 4;
            }
            return 0;
          }
        },
      ],
    };
		// score chart
		const ctx = this._scoreChart!.nativeElement.getContext('2d');
		const chartModule = await this.chartModule!;
		this.chart = new chartModule.Chart(ctx, {
			type: 'line',
			data,
			options: {
				legend: { display: false },
				scales: {
					yAxes: [{ display: false }],
					xAxes: [
						{
							gridLines: { drawOnChartArea: false },
						},
					],
				},
				elements: {
					point: { backgroundColor: 'green' },
				},
				tooltips: { enabled: false },
				hover: { mode: undefined },
			},
		});
	}

	// 1/(20*sqrt(2*pi))*e^(-1/2*((x-180)/30)^2)*10^4
	// 1/(20*sqrt(2*pi))*e^(-1/2*((x-maxScore*0.6)/30)^2)*10^4
	private getData(maxScore: number) {
		const dataSetData: number[] = [];
		for (let x = 0; x < 280; x += 20) {
			// prettier-ignore
			const currentData = ( Math.E ** (-0.5 * ( (x-maxScore*0.6)/30) ** 2 ) ) / (20 * Math.sqrt(2*Math.PI) ) * 10**4;
			dataSetData.push(currentData);
		}
		return dataSetData;
	}

	private async loadChartModule() {
		this.chartModule = import('chart.js');
	}
}
