import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[passwordTwiceSame]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordTwiceSameDirective, multi: true }],
})
export class PasswordTwiceSameDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword) {
      return password.value !== confirmPassword.value ? { passwordTwiceSame: true } : null;
    } else {
      return null;
    }
  }
}
