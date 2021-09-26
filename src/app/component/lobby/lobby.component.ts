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
import { filter } from 'rxjs/operators';
import {
  AuthAction,
  ElaboratorAction,
  getCurrentQuestion,
  getLoadingCurrentQuestion,
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

  oneTimeCode = new FormControl('', [Validators.required]);
  loading = false;

  private mainSubscription$$: Subscription;
  private getCurrentQuestion$$: Subscription | undefined;
  private lastRequestedOneTimeCode: string;

  constructor(
    private store: Store,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

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
    this.mainSubscription$$.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        const authorizationCode = params['code'];
        if (!authorizationCode) {
          return;
        }
        this.store.dispatch(AuthAction.authenticate(authorizationCode));
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

  startSkillaboration() {
    if (!this.oneTimeCode.value) {
      return;
    }
    this.getCurrentQuestion$$?.unsubscribe();

    this.lastRequestedOneTimeCode = this.oneTimeCode.value;
    this.loading = true;
    this.store.dispatch(
      ElaboratorAction.getFirstQuestion(this.oneTimeCode.value)
    );
    this.getCurrentQuestion$$ = this.store
      .pipe(select(getCurrentQuestion), filter(Boolean))
      .subscribe({
        next: () => {
          this.router.navigate(['elaborator', this.lastRequestedOneTimeCode]);
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
}
