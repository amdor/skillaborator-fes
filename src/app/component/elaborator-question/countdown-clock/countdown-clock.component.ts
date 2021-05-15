import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'sk-countdown-clock',
  templateUrl: './countdown-clock.component.html',
  styleUrls: ['./countdown-clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CountdownClockComponent implements OnInit, OnDestroy {
  @HostBinding('class.sk-countdown-clock') hostCss = true;
  @HostBinding('class.sk-countdown-clock-timeout-soon')
  timeoutSoonAnimationClass = false;

  @Output()
  clockTimeout = new EventEmitter<void>();

  timeLeft: number;

  private counter$$: Subscription;
  private counterTimeout = new Subject<void>();

  readonly #timeout = environment.questionTimeout;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.restart();
  }

  ngOnDestroy() {
    this.counter$$?.unsubscribe();
  }

  private restart() {
    this.timeLeft = this.#timeout;
    this.counter$$?.unsubscribe();
    this.counter$$ = timer(1000, 1000)
      .pipe(takeUntil(this.counterTimeout))
      .subscribe((elapsed: number) => {
        this.timeLeft = this.#timeout - elapsed;
        this.timeoutSoonAnimationClass = this.timeLeft < 10;
        if (this.timeLeft < 1) {
          this.counterTimeout.next();
          this.clockTimeout.emit();
        }
        this.cdRef.markForCheck();
      });
  }
}
