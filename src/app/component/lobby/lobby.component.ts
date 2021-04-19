import {
  ChangeDetectionStrategy,
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

@Component({
  selector: 'sk-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LobbyComponent implements OnInit, OnDestroy {
  @HostBinding('class.sk-lobby') hostCss = true;

  oneTimeCode = new FormControl('', [Validators.required]);
  loading$: Observable<boolean>;

  private getCurrentQuestion$$: Subscription;
  private lastRequestedOneTimeCode: string;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.loading$ = this.store.select(getLoadingCurrentQuestion);
    this.getCurrentQuestion$$ = this.store
      .select(getCurrentQuestion)
      .subscribe({
        next: (question: Question) => {
          if (question) {
            this.router.navigate(['elaborator', this.lastRequestedOneTimeCode]);
          }
        },
      });
  }

  ngOnDestroy() {
    this.getCurrentQuestion$$?.unsubscribe();
  }

  getErrorMessage() {
    if (this.oneTimeCode.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }

  startSkillaboration() {
    this.lastRequestedOneTimeCode = this.oneTimeCode.value;
    this.store.dispatch(
      ElaboratorAction.getFirstQuestion(this.oneTimeCode.value)
    );
  }
}
