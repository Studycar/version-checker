import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[debounceClick]',
})
export class DebounceClickDirective extends AbstractDebounceDirective {
  @Output() debounceClick = new EventEmitter<Event>();

  constructor() {
    super();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    this.emitEvent$.next(event);
  }

  emitValue(event: Event): void {
    this.debounceClick.emit(event);
  }
}
