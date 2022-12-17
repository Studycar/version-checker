import { Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export abstract class AbstractDebounceDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 1000;

  protected emitEvent$ = new Subject<Event>();

  protected destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.emitEvent$
      .pipe(debounceTime(this.debounceTime), takeUntil(this.destroyed$))
      .subscribe((value) => this.emitValue(value));
  }

  abstract emitValue(event: Event): void;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
