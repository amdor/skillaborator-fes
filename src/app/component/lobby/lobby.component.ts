import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	OnDestroy,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { AuthState } from '../../state/auth/auth.reducer';
import {
	AuthAction,
	ElaboratorAction,
	getCurrentQuestion,
	getLoadingCurrentQuestion,
	getAccessToken,
	getAuth,
} from '../../state';
import { Question } from '../elaborator-question.model';

@Component({
	selector: 'sk-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class LobbyComponent implements OnInit, OnDestroy {
	@HostBinding('class.sk-lobby') hostCss = true;

	signInLink: string;
	oneTimeCode = new FormControl('', [Validators.required]);
	loading = false;
	canStart = false;
	auth: AuthState | undefined;

	private mainSubscription$$: Subscription;
	private getCurrentQuestion$$: Subscription | undefined;

	constructor(
		private store: Store,
		private router: Router,
		private cdRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute
	) {
		let ref = window.location.origin;
		ref = encodeURIComponent(ref);
		this.signInLink = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=779gcyc5z2xwnu&redirect_uri=${ref}&scope=r_emailaddress`;
	}

	ngOnInit() {
		this.store.dispatch(ElaboratorAction.reset());
		this.mainSubscription$$ = this.store
			.select(getLoadingCurrentQuestion)
			.subscribe({
				next: (loading) => {
					this.loading = loading;
					this.cdRef.markForCheck();
				},
			});
		const accessToken$ = this.store.select(getAccessToken);

		this.mainSubscription$$.add(
			this.activatedRoute.queryParams
				.pipe(withLatestFrom(accessToken$))
				.subscribe(([params, accessToken]) => {
					const authorizationCode = params['code'];
					if (authorizationCode && accessToken) {
						this.router.navigate([], {
							queryParams: {
								code: null,
							},
							queryParamsHandling: 'merge',
						});
                        return;
					}
					if (!authorizationCode) {
						if (accessToken) {
							this.store.dispatch(
								AuthAction.getNextStart(accessToken)
							);
						}
						return;
					}
					this.store.dispatch(
						AuthAction.authenticate(authorizationCode)
					);
				})
		);
		this.mainSubscription$$.add(
			this.store.select(getAuth).subscribe({
				next: (auth) => {
					this.auth = auth;
					const nextSkillaborationStart =
						auth.nextSkillaborationStart;
					// TODO fix Date rehydration
					this.canStart = nextSkillaborationStart
						? new Date(nextSkillaborationStart).getTime() <
						  Date.now()
						: false;
					if (auth.oneTimeCode) {
						this.startSkillaboration(auth.oneTimeCode);
					}
					this.cdRef.markForCheck();
				},
			})
		);
	}

	ngOnDestroy() {
		this.getCurrentQuestion$$?.unsubscribe();
		this.mainSubscription$$?.unsubscribe();
	}

	getErrorMessage() {
		if (this.oneTimeCode.hasError('required')) {
			return 'You must enter a value';
		}

		return '';
	}

	startSkillaboration(oneTimeCode?: string) {
		if (!this.oneTimeCode.value && !oneTimeCode) {
			if (this.auth?.accessToken && this.auth?.email) {
				this.store.dispatch(
					AuthAction.getNewUserCode(
						this.auth.accessToken,
						this.auth.email
					)
				);
			}
			return;
		}
		this.getCurrentQuestion$$?.unsubscribe();

		const lastRequestedOneTimeCode = oneTimeCode ?? this.oneTimeCode.value;
		this.loading = true;
		this.store.dispatch(
			ElaboratorAction.getFirstQuestion(lastRequestedOneTimeCode)
		);
		this.getCurrentQuestion$$ = this.store
			.pipe(select(getCurrentQuestion), filter(Boolean))
			.subscribe({
				next: () => {
					this.router.navigate([
						'elaborator',
						lastRequestedOneTimeCode,
					]);
				},
			});
	}

	startDemo() {
		this.getCurrentQuestion$$?.unsubscribe();
		this.loading = true;
		this.store.dispatch(ElaboratorAction.getFirstQuestion());
		this.getCurrentQuestion$$ = this.store
			.pipe(select(getCurrentQuestion), filter(Boolean))
			.subscribe({
				next: (question: Question) => {
					this.router.navigate(['demo', question.oneTimeCode]);
				},
			});
	}

	logout() {
		this.store.dispatch(AuthAction.logout());
	}
}
