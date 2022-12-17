import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ag-span',
  template: `<span>{{value}}</span>`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AgInnerTextComponent),
    },
  ],
})
export class AgInnerTextComponent implements ControlValueAccessor {
  value: any;

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
