import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpHeaders,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { TokenService, DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AppConfigService } from '../../modules/base_module/services/app-config-service';
import { format } from 'date-fns';
import { formatDate } from '@angular/common';

const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const URLCODEMESSAGE = {
  '/api/ps/customerHw/getU8Info': {
    504: '查询余额错误，无法连接U8服务器',  
  },
  '/api/ps/invoice/bill/examine': {
    504: '查询余额错误，无法连接U8服务器',  
  },
}
/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  get appConfig(): AppConfigService {
    return this.injector.get(AppConfigService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) return;

    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    this.injector
      .get(NzNotificationService)
      .error(`请求错误 ${ev.status}: ${ev.url}`, errortext, {
        nzDuration: 30000,
      });
  }

  private in401 = false

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    if (event.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    // this.checkStatus(event);
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          if (body && body.Success !== undefined) {
            if (body.Success) {
              // token维持
              const tokenHeader = event.headers.get('token');
              const tokenInfo = this.tokenService.get();
              if (tokenHeader && tokenInfo) {
                if (tokenHeader !== tokenInfo.token) {
                  // 设置Token信息
                  this.tokenService.set({
                    token: tokenHeader,
                    name: tokenInfo.name,
                  });
                }
              }
            }
          }
        }
        break;
      case 401: // 未登录状态码
        if (!this.in401) {
          // 防止未登录状态下重复执行
          this.in401 = true;
          (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
          // this.goTo('/passport/login');
          // 记录目标跳转页
          const redirectPath = location.href.split(location.origin)[1] || '/'
          localStorage.setItem('redirectPath', redirectPath)
          this.goTo(environment.login_url);
        } 
        break;
      case 403: // 未授权状态码
        this.goTo('403');
        break;
      case 400:
      case 404:
      case 500:
        if (event instanceof HttpErrorResponse) {
          const body: any = event;
          // jianl改善
          const messsage =
            body && body.error
              ? body.error.Message
              : 'error code:' + event.status;
          // console.log(body.message);
          this.notification.error('出错了', messsage, {
            nzDuration: 30000,
          });
        }
        break;
      case 504:
        if (event instanceof HttpErrorResponse) {
          const url = event.url.split('?')[0];
          if (URLCODEMESSAGE.hasOwnProperty(url)) {
            this.msg.error(URLCODEMESSAGE[url]['504']);
          } else {
            this.msg.error(CODEMESSAGE['504']);
          }
        }
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          );
          this.msg.error(event.message);
        }
        break;
    }
    return of(event);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }
    // 处理post参数日期格式
    if (req.body !== null) {
      this.formatDate(req.body);
    }

    const myHeader = this.PrepareRequestData();
    const newReq = req.clone({
      url: url,
      setHeaders: myHeader,
    });

    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200)
          return this.handleData(event);
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }

  // 处理post参数日期格式
  formatDate(params: any, historyObj = []) {
    for (const key in params) {
      if (params[key] || '' !== '') {
        if (params[key] instanceof Date) {
          params[key] = formatDate(params[key], 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
        } else if (typeof params[key] === 'object') {
          // 查询曾经遍历过的对象，看看是否会出现环
          const cycleArray = historyObj.find(it => {
            if (params === it) {
              console.log('formatDate方法出现死循环:');
              return true;
            }
            return false;
          });
          if (cycleArray) {
            return; // 出现环的时候，停止代码执行
          }
          historyObj.push(params);
          this.formatDate(params[key], historyObj);
        }
      }
    }
  }

  /**
   * 请求前header处理(jianl注释：这里已经被弃用了，全部改为拼在token上了)
   */
  PrepareRequestData(): any {
    // const map: { [key: string]: string } = {};
    // const token = this.tokenService.get().token || '';
    // const otherParamsStr = JSON.stringify(this.appConfig.getConfigDataObj());
    // map['token'] = token + '^^|^^' + otherParamsStr;
    // const access_token = localStorage.getItem('access_token');
    // if (access_token) {
    //   map['Authorization'] = 'Bearer ' + access_token;
    // }
    // return map;
    // const userId = this.appConfig.getUserId();
    // if (userId) {
    //   map[this.appConfig.getUserIdHeader()] = userId;
    // }
    // const plantCode = this.appConfig.getPlantCode();
    // if (plantCode) {
    //   map[this.appConfig.getPlantCodeHeader()] = plantCode;
    // }
    // const respCode = this.appConfig.getRespCode();
    // if (respCode) {
    //   map[this.appConfig.getRespCodeHeader()] = respCode;
    // }
    // const lng = this.appConfig.getLanguage();
    // if (lng) {
    //   map[this.appConfig.getLanguageHeader()] = lng;
    // }
    // const sessionId = this.appConfig.getSessionId();
    // if (sessionId) {
    //   map[this.appConfig.getSessionIdHeader()] = sessionId;
    // }
    // const timeStamp = format(new Date(), 'YYYYMMDD');
    // map[this.appConfig.getTimeStampHeader()] = timeStamp;
    // const hotName = location.hostname;
    // map[this.appConfig.getHostNameHeader()] = hotName;
    // map['router'] = this.injector.get(Router).url;
    // return map;
  }
}
