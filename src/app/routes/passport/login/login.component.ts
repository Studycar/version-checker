import { SettingsService, DatePipe, ALAIN_I18N_TOKEN } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { HttpClient } from '@angular/common/http';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService, DatePipe],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  langs: any[];

  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private datePipe: DatePipe,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
    this.langs = this.i18n.getLangs().map((v: any) => {
      v.abbr = '🇨🇳';
      switch (v.code) {
        case 'zh-TW':
          v.abbr = '🇭🇰';
          break;
        case 'en-US':
          v.abbr = '🇬🇧';
          break;
      }
      return v;
    });
  }

  change(lang: string) {
    this.i18n.use(lang);
    this.settingsService.setLayout('lang', lang);
  }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // region: get captcha

  count = 0;
  interval$: any;

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    this.loading = true;

    this.startupSrv
      .loginPlus(this.userName.value, window.btoa(this.password.value))
      .then(ress => {
        this.loading = false;
        if (ress.msg) {
          this.error = ress.msg;
          return;
        }
        const data = ress;
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置Token信息
        this.tokenService.set({
          token: data.access_token,
          name: this.userName.value,
          email: ``
        });
        this.startupSrv.loadDefaultInfo(data.user_id).then(res => {
          if (res.code === 200) {
            this.appConfigService.setActivePlantCode({
              plantCode: res.data.DefaultPlantCode,
              descriptions: res.data.DefaultPlantDesc,
            });
            this.appConfigService.setDefaultPlantCode(res.data.DefaultPlantCode);
            this.appConfigService.setActiveScheduleRegionCode(res.data.DefaultScheduleRegionCode);
            this.appConfigService.setDefaultScheduleRegionCode(res.data.DefaultScheduleRegionCode);
            this.appConfigService.setRespCode(res.data.RespCode);
            this.appConfigService.setPlantCodes(res.data.PlantCodes);
            this.appConfigService.setUserId(data.user_id);
            this.appConfigService.setSessionId(data.session_id);
            this.startupSrv.load().then(() => this.router.navigate(['/']));
            // this.startupSrv.loadMenu().then(m => {
            //   if (m.Success) {
            //     this.startupSrv.load().then(() => this.router.navigate(['/']));
            //   } else {
            //     this.error = m.Message;
            //     return;
            //   }
            // });
          } else {
            this.error = res.msg;
            return;
          }
        }).catch(err => {
          console.log(err);
          return;
        });
        // this.startupSrv.loadMenu().then();
        /* 初始化用户信息
        this.startupSrv.getuserinitinfo(ress.data.user_id, 'ZHS').then(initData => {
          // 初始化用户信息
          initData = null;
        });
        */

        // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
        // this.startupSrv.load().then(() => this.router.navigate(['/']));
        // 否则直接跳转
        // setTimeout(() => {
        //   this.router.navigate(['/']);
        // }, 1000);
      });
  }

  // region: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
    else callback = 'http://localhost:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
