import { Directive, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { ResetPasswordService } from './resetPassword.service';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators';

@Directive({
  selector: '[checkPassword]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: CheckPassWordDirective, multi: true }],
})
export class CheckPassWordDirective implements AsyncValidator {
  constructor(private pwdService: ResetPasswordService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.pwdService.checkPassword(control.value).pipe(
      map(isRight => {
        return (isRight ?  null : { isRight: true })
      }),
      catchError(() => null),
    );
  }

}
