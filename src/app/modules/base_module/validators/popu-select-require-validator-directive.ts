import { Input, Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

/**
 * create by jianl
 * popu-select控件的验证器
 */
export function PopuSelectRequireValidator(propName: string): ValidatorFn {
  // const v = Validators.required;
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log('popuSelectRequireValidator');
    const val = control[propName];
    console.log('popuSelectRequireValidator', val);
    return val ? null : { required: true };
  };
}

/**
 * create by jianl
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[popuSelectRequire]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PopuSelectRequireValidatorDirective,
      multi: true,
    },
  ],
})
export class PopuSelectRequireValidatorDirective implements Validator {
  @Input('popuSelectRequire') propName: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    console.log('popuSelectRequireValidatorDirective', this.propName);
    const propMame = this.propName || 'SelectValue';
    return PopuSelectRequireValidator(propMame)(control);
  }
}
