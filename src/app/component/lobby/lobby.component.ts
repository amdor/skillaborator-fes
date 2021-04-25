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
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { skip, tap } from 'rxjs/operators';
import {
  ElaboratorAction,
  getCurrentQuestion,
  getLoadingCurrentQuestion,
} from '../../state';
import { Question } from '../elaborator-question.model';
import { TempService } from './temp.service';

@Component({
  selector: 'sk-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [TempService],
})
export class LobbyComponent implements OnInit, OnDestroy {
  @HostBinding('class.sk-lobby') hostCss = true;

  oneTimeCode = new FormControl('', [Validators.required]);
  loading = false;
  codes: string[];

  private loading$$: Subscription;
  private getCurrentQuestion$$: Subscription;
  private lastRequestedOneTimeCode: string;
  private codes$$: Subscription;

  constructor(
    private store: Store,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private tempService: TempService
  ) {}

  ngOnInit() {
    this.loading$$ = this.store
      .select(getLoadingCurrentQuestion)
      .pipe(
        tap((loading) => {
          this.loading = loading;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
    this.getCurrentQuestion$$ = this.store
      .select(getCurrentQuestion)
      .subscribe({
        next: (question: Question) => {
          if (question) {
            this.router.navigate(['elaborator', this.lastRequestedOneTimeCode]);
          }
        },
      });

    // TODO remove
    this.codes$$ = this.tempService.getAvailableCodes().subscribe((codes) => {
      this.codes = codes;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.getCurrentQuestion$$?.unsubscribe();
    this.loading$$?.unsubscribe();
    this.codes$$?.unsubscribe();
  }

  getErrorMessage() {
    if (this.oneTimeCode.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }

  startSkillaboration() {
    this.lastRequestedOneTimeCode = this.oneTimeCode.value;
    this.loading = true;
    this.store.dispatch(
      ElaboratorAction.getFirstQuestion(this.oneTimeCode.value)
    );
  }
}
