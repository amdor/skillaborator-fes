import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sk-elabrator-result',
  templateUrl: './elabrator-result.component.html',
  styleUrls: ['./elabrator-result.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElabratorResultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
