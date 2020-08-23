import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ElaboratorState,
  getCurrentQuestion,
  ElaboratorAction,
} from 'src/app/state';
import { Observable } from 'rxjs';
import { Question } from '../elaborator-question.model';

@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.component.html',
  styleUrls: ['./elaborator-lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElaboratorLobbyComponent implements OnInit {
  @HostBinding('class.elaborator-lobby') hostCss = true;

  question$: Observable<Question> | undefined;

  private readonly level = 1;

  constructor(private store: Store<ElaboratorState>) {}

  ngOnInit() {
    // TODO level
    this.store.dispatch(ElaboratorAction.getQuestion(this.level));
    this.question$ = this.store.select(getCurrentQuestion);
  }
}
