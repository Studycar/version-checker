import { Inject, Injectable } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators';

const CHECK_PASSWORD = '/api/admin/baseusers/checkpassword';
const UPDATE_PASSWORD = '/api/admin/baseusers/passwordUpdateByUserName';
const RULE_CHECK_PASSWORD = '/api/admin/baseusers/ruleCheckpassword';
@Injectable()
export class ResetPasswordService {
  userName: string;

  constructor(
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private http: _HttpClient,
  ) {
    this.userName = this.tokenService.get().name;
  }

  checkPassword(password: string): Observable<boolean> {
    return this.http.post(CHECK_PASSWORD, {
      userName: this.userName,
      userPassword:password,
    }).pipe(
      map(res => res.code === 200),
      catchError(() => of(false)),
    );
  }

  ruleCheckpassword(password: string): Observable<any> {
    return this.http.post(RULE_CHECK_PASSWORD, {
      userName: this.userName,
      userPassword:password,
    });
  }


  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(UPDATE_PASSWORD, {
      userName: this.userName,
      userPassword:newPassword,
    });
  }
}
