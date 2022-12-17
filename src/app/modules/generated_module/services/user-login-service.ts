import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppApiService } from '../../base_module/services/app-api-service';

@Injectable()
/** 用户登录服务 */
export class UserLoginService {
    constructor(private appApiService: AppApiService) { }

    /** 登录管理员 */
    LoginAdmin(UserName: string, Password: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/sys/authenication/LoginAdmin',
            {
                UserName,
                Password
            });
    }

    /** 登录 */
    Login(username: string, pwd: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/sys/authenication/login',
            {
                username,
                pwd
            });
    }

    /** Web登录 */
    LoginWeb(username: string, password: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/sys/authenication/loginweb',
            {
                username,
                password
            });
    }
}
