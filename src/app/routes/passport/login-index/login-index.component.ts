import {
  SettingsService,
  DatePipe,
  ALAIN_I18N_TOKEN,
  _HttpClient,
} from '@delon/theme';
import {
  Component,
  OnDestroy,
  Inject,
  Optional,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  NzMessageService,
  NzModalService,
  NzCarouselComponent,
} from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { I18NService } from '@core/i18n/i18n.service';
import { guid } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'passport-login',
  templateUrl: './login-index.component.html',
  styleUrls: ['./login-index.component.less'],
  providers: [SocialService, DatePipe],
})
export class UserLoginIndexComponent
  implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild('loginVideo', { static: true })
  loginVideo: ElementRef;

  @ViewChild('fullyVideo', { static: false })
  fullyVideo: ElementRef;

  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  fullyVideoShow = false; // 全屏视频层呈现
  langs: any[];
  lang: string;
  clientCode = guid().replace(/-/gi, '');
  // clientCode = 'a421a309-a8a7-4afd-8c1e-d41cd634e339';
  hasDestroy = false; // 是否已经销毁此组件
  loginQrCodeUrl =
    '/afs/servermobileservice/qrcodeservice/getwebloginqrcode?clientCode=' +
    this.clientCode;
  tabRecord = {
    tabTitle: '账号登录',
    loginToggleImgSrc: 'ewm',
  };
  ewm = false;

  loginVideoImgInfo = {
    IsVideo: true,
    LoginVideoImgPartPath: '../../../../assets/videos/login_video.mp4',
    LoginVideoImgfullPath: '../../../../assets/videos/APSv3-0626.mp4',
  };

  hiddenWXQRCode = false; // 隐藏微信登录二维码

  constructor(
    fb: FormBuilder,
    public settingsService: SettingsService,
    public msg: NzMessageService,
    private router: Router,
    private modalSrv: NzModalService,
    private socialService: SocialService,
    private startupSrv: StartupService,
    private http: _HttpClient,
    private appConfigService: AppConfigService,
    private datePipe: DatePipe,
    private render: Renderer2,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService,
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
    this.lang = this.langs[0].text;
  }

  textArr = ['全流程可视', '计划可视', '过程可视', '结果可视'];
  productArr = [
    ['全流程可视', '计划可视', '过程可视', '结果可视'],
    ['约束计划', '能力约束', '资源约束', '交期约束'],
    ['价值流拉动', '计划拉动', '生产拉动', '备料拉动'],
    ['高效协同', '信息协同', '供需协同', '敏捷响应'],
    ['智能感知', '结果感知', '例外感知', '绩效感知'],
    ['精准指挥', '精确计划', '精细排产', '精准备料'],
  ];
  serviceArr = [
    '一体化解决方案',
    'S&OP体系支撑',
    '产销敏捷通道',
    '易用的能力约束',
    '供应链价值创造',
    '可视快捷的排程',
  ];

  /**
   * 控件初始化
   */
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const url = '/afs/serverschedulemanager/ScheduleService/GetVideoImg?id=1';
    // this.http.get<ActionResponseDto>(url).subscribe(
    //   res => {
    //     console.log(url);
    //     if (res.Success === true) {
    //       this.loginVideoImgInfo = res.Extra;
    //     }

    //     if (this.loginVideoImgInfo.IsVideo) {
    //       const loginVideo = this.loginVideo;
    //       const playPromise = loginVideo.nativeElement.play();
    //       if (playPromise !== undefined) {
    //         playPromise.catch(e => {
    //           loginVideo.nativeElement.muted = true;
    //           loginVideo.nativeElement.play();
    //         });
    //       }
    //     }
    //   },
    //   error => {
    //     console.log('error');
    //     console.log(error);
    //   },
    //   () => {
    //     console.log('GetVideoImg complete');
    //   },
    // );
    // this.loadWXQRCodeShowParam();
  }

  // 播放全屏视频
  playFullyVideo() {
    this.fullyVideoShow = true;
    const el = this.fullyVideo.nativeElement;
    const requestFullScreen =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen;
    el.play();
    if (requestFullScreen) requestFullScreen.call(el);
    this.render.setStyle(document.documentElement, 'overflow', 'hidden');
  }

  // 关闭全屏视频
  closeFullyVideo() {
    this.fullyVideoShow = false;
    this.fullyVideo.nativeElement.pause();
    this.render.setStyle(document.documentElement, 'overflow', 'auto');
  }

  change(lang: string, text: string) {
    this.i18n.use(lang);
    this.settingsService.setLayout('lang', lang);
    this.lang = text;
  }

  toggleTab() {
    const tabRecord = this.tabRecord;
    if (tabRecord.tabTitle === '账号登录') {
      tabRecord.tabTitle = '微信二维码登录';
      tabRecord.loginToggleImgSrc = 'computer';
    } else {
      tabRecord.tabTitle = '账号登录';
      tabRecord.loginToggleImgSrc = 'ewm';
    }
    this.ewm = !this.ewm;
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
      .loginPlus(this.userName.value, this.password.value)
      .then(data => {
        this.loading = false;
        // localStorage.setItem('access_token', data.access_token);
        this.loginCallback(data, true);
      });
  }

  loginCallback(ress: any, showErrorMsg: boolean = false) {
    if (ress.msg) {
      this.error = ress.msg;
      if (showErrorMsg) {
        this.msg.error(this.error);
      }
      return;
    }

    const data = ress;
    // 清空路由复用信息
    this.reuseTabService.clear();
    // 设置Token信息
    this.tokenService.set({
      token: data.access_token,
      name: ress.name,
      email: ``,
    });
    this.startupSrv
      .loadDefaultInfo(data.userId)
      .then(res => {
        if (res.data) {
          this.appConfigService.setActivePlantCode({
            plantCode: res.data.defaultPlantCode,
            descriptions: res.data.defaultPlantDesc,
          });
          this.appConfigService.setDefaultPlantCode(res.data.defaultPlantCode);
          this.appConfigService.setActiveScheduleRegionCode(res.data.defaultScheduleRegionCode);
          this.appConfigService.setDefaultScheduleRegionCode(res.data.defaultScheduleRegionCode);
          this.appConfigService.setRespCode(res.data.respCode);
          this.appConfigService.setPlantCodes(res.data.plantCodes);
          this.appConfigService.setUserName(res.data.userName);
          this.appConfigService.setUserDescription(res.data.description);
          this.appConfigService.setUserId(data.userId);
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
      })
      .catch(err => {
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
    this.hasDestroy = true;
  }

  /**
   * create by jianl
   * 校验微信登录状态
   */
  startCheckWXLoginStatus(): void {
    setTimeout(() => {
      this.doCheckWXLoginStatus();
    }, 1000);
  }

  doCheckWXLoginStatus() {
    const url =
      '/afs/servermobileservice/weixinservice/checkwxloginstatus?clientCode=' +
      this.clientCode;
    this.http.get<ActionResponseDto>(url).subscribe(
      it => {
        if (it.Extra !== undefined && it.Extra !== null) {
          if (it.Extra.user_name !== undefined && it.Extra.user_name !== null) {
            this.userName.setValue(it.Extra.user_name);
            this.password.setValue('');
          }
          // 登录失败时，继续调用获取登录状态的定时函数
          if (!it.Extra.login_result) {
            this.startCheckWXLoginStatus();
          }
          this.loginCallback(it, true);
        } else {
          if (!this.hasDestroy) {
            // 继续发请求
            this.startCheckWXLoginStatus();
          }
        }
      },
      error => {
        console.log(url + ' error:');
        console.log(error);
      },
    );
    // this.startCheckWXLoginStatus();
  }

  loadWXQRCodeShowParam() {
    this.startupSrv.loadWXQRCodeShowParam(it => {
      this.hiddenWXQRCode = !it;
      if (it) {
        this.startCheckWXLoginStatus();
      }
    }, true);
  }
}
