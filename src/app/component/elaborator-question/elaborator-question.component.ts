import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  Input,
} from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Question } from '../elaborator-question.model';

@Component({
  selector: 'sk-elaborator-question',
  templateUrl: './elaborator-question.component.html',
  styleUrls: ['./elaborator-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElaboratorQuestionComponent {
  @HostBinding('class.elaborator-question') hostCss = true;

  @Input()
  question: Question;

  constructor() {}

  onSelect(change: MatRadioChange) {}
}
