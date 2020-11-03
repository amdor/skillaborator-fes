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
  nextQuestionClick = new EventEmitter<string>();

  @Output()
  elaborationFinished = new EventEmitter<string>();

  private selectedAnswerId: string | undefined;
  private _readOnly: boolean;

  constructor(private snackBar: MatSnackBar, configService: ConfigService) {}

  isRight(id: string) {
    return id === this.selectedAndRightAnswer?.rightAnswerId;
  }

  onSelect(change: MatRadioChange) {
    this.selectedAnswerId = change.value;
  }

  onNextClick() {
    this.nextQuestionClick.emit(this.selectedAnswerId);
  }

  onEvaluate() {
    this.elaborationFinished.emit(this.selectedAnswerId);
  }
}
