import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

const REG = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z\d])[^!<>%&_+\s]{6,16}$/;

@Directive({
  selector: '[passwordFormat]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordFormatDirective, multi: true }],
})
export class PasswordFormatDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    if (password) {
      return !REG.test(password.value) ? { pwdFormat: true } : null;
    } else {
      return null;
    }
  }
}
