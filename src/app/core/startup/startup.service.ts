import {Inject, Injectable, Injector} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Observable, zip} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {_HttpClient, ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService} from '@delon/theme';
import {ACLService} from '@delon/acl';
import {TranslateService} from '@ngx-translate/core';
import {I18NService} from '../i18n/i18n.service';
import {ActionResponseDto} from '../../modules/generated_module/dtos/action-response-dto';
import {AppConfigService} from '../../modules/base_module/services/app-config-service';
import {NzIconService} from 'ng-zorro-antd';
import {ICONS_AUTO} from '../../../style-icons-auto';
import {ICONS} from '../../../style-icons';
import {ReuseTabService} from '@delon/abc';
import {ResponseDto} from 'app/modules/generated_module/dtos/response-dto';
import {CUSTOM_ICONS} from '../../../assets/icons/custom-icons';
// import {LicenseManager} from 'ag-grid-enterprise';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingsService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: _HttpClient,
    private injector: Injector,
    private appConfigService: AppConfigService,
    private reuseTabSrv: ReuseTabService,
  ) {
    // LicenseManager.setLicenseKey('CompanyName=Guangdong Meicloud Technology Co.,Ltd.,LicensedGroup=mideaCloud aps,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-013963,ExpiryDate=2_March_2022_[v2]_MTY0NjE3OTIwMDAwMA==5df19f9b595635a913c5f818eb0c0071');
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    CUSTOM_ICONS.forEach(namespaces =>
      namespaces.icons.forEach(icon =>
        iconSrv.addIconLiteral(
          `${icon.type}:${namespaces.namespace}`,
          icon.value,
        ),
      ),
    );
  }

  login(userName: string, pwd: string): Promise<ActionResponseDto> {
    const url = '/afs/sys/authenication/loginweb';
    const headers = new HttpHeaders().set(
      'X-CustomHeader',
      'custom header value',
    );
    return this.httpClient
      .post<ActionResponseDto>(
        url,
        {username: userName, password: pwd},
        {headers: headers},
      )
      .toPromise();
  }

  loginPlus(userName: string, pwd: string): Promise<any> {
    const url = '/api/auth/auth/form';
    const headers = new HttpHeaders().set(
      'X-CustomHeader',
      'custom header value',
    );
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('password', pwd);
    formData.append('grant_type', 'password');
    return this.httpClient.post<any>(url, formData).toPromise();
  }

  loginLongi(): Promise<any> {
    const url = '/api/auth/social/login';
    return this.httpClient.get<any>(url).toPromise();
  }

  loginCallback(code: string): Promise<ResponseDto> {
    const url = '/api/auth/social/aps/callback?code=' + code + '&_allow_anonymous=true';
    return this.httpClient.get<ResponseDto>(url).toPromise();
  }

  loadDefaultInfo(userId: string): Promise<ResponseDto> {
    const url = '/api/admin/workbench/getUserInfo';
    return this.httpClient
      .get<ResponseDto>(url, {
        userId: userId,
        lng: this.i18n.currentLang,
      })
      .pipe(
        tap(res => {
          if (res.code === 200) {
            this.settingsService.setUser({name: res.data.userName});
          }
        }),
      )
      .toPromise();
  }

  loadMenuObservable(): Observable<ResponseDto> {
    const url = '/api/admin/workbench/getMenus';

    function setKey(items) {
      items.forEach(item => {
        if (item.link) item.key = item.link;
        if (item.children && item.children.length > 0) setKey(item.children);
      });
    }

    return this.httpClient
      .get<ResponseDto>(url, {
        respId: this.appConfigService.getRespCode(),
        userId: this.appConfigService.getUserId(),
      })
      .map(res => {
        if (res.code === 200) {
          // 初始化菜单
          setKey(res.data);
          this.refreshTopic(0, res.data);
          const menus = res.data[0].children;
          localStorage.setItem('menus', JSON.stringify(menus));
          const menusLinks = [];
          if(menus && menus.length > 0) {
            menus.forEach(m => {
              if(m && m.children) {
                menusLinks.push(...m.children.map(c => c.link));
              }
            })
          }
          localStorage.setItem('menusLinks', JSON.stringify(menusLinks));
          // this.InitSignalHug();
        }
        return res;
      });
  }

  loadMenu(): Promise<ResponseDto> {
    return this.loadMenuObservable().toPromise();
  }

  refreshTopic(type: any, data: any) {
    const url =
      '/api/admin/workbench/getResp/' + this.appConfigService.getRespCode();
    const plantCode = '(' + this.appConfigService.getPlantCode() + ')';
    return this.httpClient.get<ResponseDto>(url).subscribe(res => {
      if (res.code === 200) {
        const topic = res.data.respsName + plantCode;
        if (type === 0) {
          data[0].i18n = topic;
          data[0].text = topic;
          this.menuService.add(data);
        } else {
          this.menuService.menus[0].i18n = topic;
          this.menuService.menus[0].text = topic;
          this.menuService.resume();
        }
        this.reuseTabSrv.refresh();
      }
    });
  }

  public getUserResponsibility(): Promise<ResponseDto> {
    return this.httpClient
      .get<ResponseDto>('/api/admin/workbench/getUserResp')
      .toPromise();
  }

  public getDataUserFactory(): Promise<any> {
    return this.httpClient
      .get<any>('/api/admin/workbench/getUserPlant')
      .toPromise();
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      zip(
        this.httpClient.get(`/assets/tmp/i18n/${this.i18n.defaultLang}.json`),
        this.httpClient.get('/assets/tmp/app-data.json'),
        // this.loadMenuObservable(),
      )
        .pipe(
          // 接收其他拦截器后产生的异常消息
          catchError(([langData, appData, menuData]) => {
            resolve(null);
            return [langData, appData, menuData];
          }),
        )
        .subscribe(
          ([langData, appData, menuData]) => {
            // setting language data
            this.translate.setTranslation(this.i18n.defaultLang, langData);
            this.translate.setDefaultLang(this.i18n.defaultLang);

            // application data
            const res: any = appData;
            // 应用信息：包括站点名、描述、年份
            // this.settingsService.setApp(res.app);
            // 用户信息：包括姓名、头像、邮箱地址
            this.settingsService.setUser(res.user);
            // ACL：设置权限为全量
            this.aclService.setFull(true);
            // // 初始化菜单
            // const menus = JSON.parse(localStorage.getItem('menus'));
            // this.menuService.add(menus ? menus : []);
            // 设置页面标题的后缀
            // this.titleService.suffix = res.app.name;
          },
          () => {
          },
          () => {
            resolve(null);
          },
        );
    }).then(res => {
      // this.loadMenu();
    });
  }

  showWXQRCodeCache = false; // 全局缓存变量
  /**
   * add by jianl 加载是否显示微信QRcode的参数
   * fnCallBack: 处理完毕后，回调此方法
   * refreshCache：是否刷新缓存，默认直接读缓存
   */
  loadWXQRCodeShowParam(fnCallBack: Function, refreshCache = false) {
    const fn = (callBack, result) => {
      if (
        callBack !== undefined &&
        callBack !== null &&
        typeof callBack === 'function'
      ) {
        callBack.call(this, result);
      }
    };
    if (!refreshCache) {
      fn.call(this, fnCallBack, this.showWXQRCodeCache);
    }
    const url = '/api/admin/baseparameters/getParametersByCode';
    const data = {
      parameterCode: 'SYS_INDEXPAGE_WXQRCODE',
    };
    this.httpClient.get(url, data).subscribe((res: any) => {
      if (
        res === undefined ||
        res === null ||
        res.data === undefined ||
        res.data === null ||
        res.data.length === 0
      ) {
        return;
      }

      let showWXQRCode = true;
      /**系统参数=Y的时候才显示 */
      for (const item in res.data) {
        if (res.data.hasOwnProperty(item)) {
          // 系统级
          if (res.data[item].levelValue.toString() === '1') {
            // this.hiddenWXQRCode = res.Extra[item].PARAMETER_VALUE !== 'Y';
            showWXQRCode = res.data[item].parameterValue === 'Y';
            break;
          }
        }
      }
      this.showWXQRCodeCache = showWXQRCode; // 把值缓存起来
      fn.call(this, fnCallBack, showWXQRCode);
    });
  }

  public InitSignalHug() {
    this.httpClient.get('/Home/InitHub').subscribe(response => {
      console.log('InitHub:' + response);
    });
  }

  logout() {
    this.httpClient.delete('/api/auth/token/logout').subscribe(response => {
      console.log('InitHub:' + response);
    });
  }
}
