import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const INTERCEPT_URL = ['aps-job-admin'];

@Injectable()
export class ApsJobAdminInterceptor implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let reqTmp = req;
    if (INTERCEPT_URL.some(path => req.url.match(path) !== null)) {
      reqTmp = req.clone({ setHeaders: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
    }
    return next.handle(reqTmp);
  }

}
