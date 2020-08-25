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
  ElaboratorState,
  getCurrentQuestion,
  ElaboratorAction,
} from 'src/app/state';
import { Observable, Subscription } from 'rxjs';
import { Question } from '../elaborator-question.model';

@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.component.html',
  styleUrls: ['./elaborator-lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorLobbyComponent implements OnInit, OnDestroy {
  @HostBinding('class.elaborator-lobby') hostCss = true;

  question: Question | undefined;
  question$$ = new Subscription();

  private readonly level = 1;

  constructor(
    private store: Store<ElaboratorState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODO level
    this.store.dispatch(ElaboratorAction.getQuestion(this.level));
    this.question$$.add(
      this.store.select(getCurrentQuestion).subscribe((question: Question) => {
        this.question = question;
        this.cdRef.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.question$$.unsubscribe();
  }
}
