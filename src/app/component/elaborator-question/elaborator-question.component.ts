import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import {
  Question,
  Answer,
  SelectedAndRightAnswer,
} from '../elaborator-question.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../service';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'sk-elaborator-question',
  templateUrl: './elaborator-question.component.html',
  styleUrls: ['./elaborator-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorQuestionComponent {
  @HostBinding('class.elaborator-question') hostCss = true;

  @Input()
  question: Question;

  @Input()
  currentQuestionNumber = 1;

  @Input() maxQuestionCount = 1;

  @Input()
  get readOnly(): boolean {
    return this._readOnly;
  }

  set readOnly(newVal: boolean) {
    this._readOnly = coerceBooleanProperty(newVal);
  }

  @Input() selectedAndRightAnswer: SelectedAndRightAnswer;

  @Output()
  nextQuestionClick = new EventEmitter<string[]>();

  @Output()
  elaborationFinished = new EventEmitter<string[]>();

  private selectedAnswerIds: string[] = [];
  private _readOnly: boolean;

  constructor() {}

  isRight(answerId: string) {
    return this.selectedAndRightAnswer?.rightAnswerIds.includes(answerId);
  }

  onRadioSelect({ value: selectedAnswerId }: MatRadioChange) {
    if (!this.question.multi) {
      this.selectedAnswerIds = [selectedAnswerId];
      return;
    }
  }

  onCheckboxSelect(event: MatCheckboxChange) {
    const selectedAnswerId = event.source.value;
    if (event.checked) {
      this.selectedAnswerIds.push(selectedAnswerId);
      return;
    }
    this.selectedAnswerIds.splice(
      this.selectedAnswerIds.indexOf(selectedAnswerId),
      1
    );
  }

  onNextClick() {
    this.nextQuestionClick.emit(this.selectedAnswerIds);
  }

  onEvaluate() {
    this.elaborationFinished.emit(this.selectedAnswerIds);
  }
}
