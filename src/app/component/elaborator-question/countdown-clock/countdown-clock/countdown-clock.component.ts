import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sk-countdown-clock',
  templateUrl: './countdown-clock.component.html',
  styleUrls: ['./countdown-clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownClockComponent implements OnInit, OnDestroy {
  @Output()
  timeOut = new EventEmitter<void>();

  timeLeft: number;

  private counter$$: Subscription;
  private counterTimeout = new Subject<void>();
  private readonly TIMEOUT = 30;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.timeLeft = this.TIMEOUT;
    this.restart();
  }

  ngOnDestroy() {
    this.counter$$?.unsubscribe();
  }

  private restart() {
    this.timeLeft = this.TIMEOUT;
    this.counter$$?.unsubscribe();
    this.counter$$ = timer(1000, 1000)
      .pipe(takeUntil(this.counterTimeout))
      .subscribe((elapsed: number) => {
        this.timeLeft = this.TIMEOUT - elapsed;
        if (this.timeLeft < 1) {
          this.counterTimeout.next();
          this.timeOut.emit();
        }
        this.cdRef.markForCheck();
      });
  }
}
