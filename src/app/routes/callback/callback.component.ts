import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialService, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { StartupService } from '@core/startup/startup.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';

@Component({
  selector: 'app-callback',
  template: `
    <nz-result
      nzTitle="{{erryMsg}}"
      nzStatus="error"
      *ngIf="isShow"
    >
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="redirectTo()">回到首页</button>
      </div>
    </nz-result>
  `,
  providers: [SocialService],
})
export class CallbackComponent implements OnInit {
  token: string;
  code: string;
  erryMsg: string;
  isShow = false;

  constructor(
    private socialService: SocialService,
    private route: ActivatedRoute,
    private startupSrv: StartupService,
    private appConfigService: AppConfigService,
    private router: Router,
    public msg: NzMessageService,
    private notify: NzNotificationService,
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.isShow = false;
    this.erryMsg = '';
    this.route.queryParams.subscribe(v => {
      console.log('queryParams：', JSON.stringify(v));
      this.startupSrv.loginCallback(v.code).then(val => {
        console.log('loginCallback：', JSON.stringify(val));
        if (val.code === 200) {
          this.mockModel(val.data);
        } else {
          console.log('用户登录出错：' + val.msg);
          location.href = environment.login_url;
          // this.isShow = true;
          // this.erryMsg = val.msg;
        }
      });
    });
  }

  private mockModel(data: any) {
    console.log(data.access_token);
    // 清空路由复用信息
    this.reuseTabService.clear();
    // 设置Token信息
    this.tokenService.set({
      token: data.access_token,
      name: data.name,
      email: ``,
    });
    this.appConfigService.setUserId(data.userId);
    this.startupSrv.load().then(() => {
      // 若记录了目标跳转页，则跳转到目标跳转页，否则跳到首页
      const redirectPath = localStorage.getItem('redirectPath')
      localStorage.removeItem('redirectPath')
      if (redirectPath) {
        location.href = redirectPath
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  redirectTo() {
    location.href = environment.logout_url;
  }
}
