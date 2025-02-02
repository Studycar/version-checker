/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/ng-alain/ng-alain/issues/180
 */
import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
  InjectionToken,
  Injector,
} from '@angular/core';
import { throwIfAlreadyLoaded } from '@core/module-import-guard';

import { AlainThemeModule, AlainThemeConfig } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonChartModule } from '@delon/chart';
import { DelonAuthModule, TokenService } from '@delon/auth';
import { DelonACLModule } from '@delon/acl';
import { DelonCacheModule } from '@delon/cache';
import { DelonUtilModule } from '@delon/util';

// #region mock
import { DelonMockModule } from '@delon/mock';
import * as MOCKDATA from '../../_mock';
import { environment } from '@env/environment';
const MOCK_MODULES = [DelonMockModule.forRoot({ data: MOCKDATA })];
// #endregion

// #region reuse-tab
/**
 * 若需要[路由复用](https://ng-alain.com/components/reuse-tab)需要：
 * 1、增加 `REUSETAB_PROVIDES`
 * 2、在 `src/app/layout/default/default.component.html` 修改：
 *  ```html
 *  <section class="alain-default__content">
 *    <reuse-tab></reuse-tab>
 *    <router-outlet></router-outlet>
 *  </section>
 *  ```
 */
import { RouteReuseStrategy, Router } from '@angular/router';
import { ReuseTabService, ReuseTabStrategy } from '@delon/abc/reuse-tab';
const REUSETAB_PROVIDES = [
  {
    provide: RouteReuseStrategy,
    useClass: ReuseTabStrategy,
    deps: [ReuseTabService],
  },
];
// #endregion

// #region global config functions

import { PageHeaderConfig } from '@delon/abc';
export function fnPageHeaderConfig(): PageHeaderConfig {
  return Object.assign(new PageHeaderConfig(), { homeI18n: 'home' });
}

import { DelonAuthConfig } from '@delon/auth';
import { format } from 'date-fns';
export function fnDelonAuthConfig(injector: Injector): DelonAuthConfig {
  // const appConfig = injector.get(AppConfigService);
  // const otherParamsStr = JSON.stringify(appConfig.getConfigDataObj());
  // console.log('fnDelonAuthConfig:');
  // console.log(otherParamsStr);
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: environment.login_url,
    ignores: [
      /\/login/,
      /\/callback\/idm/,
      /assets\//,
      /\/loginweb/,
      /\/servermobileservice/,
      /passport\//,
      /\/auth\/form/,
    ],
    allow_anonymous_key: '_allow_anonymous', // jianl新增，url指定这个标志=true，就不会校验token了，可以直接发送http请求
    token_send_template: 'Bearer ${token}',
    token_send_key: 'Authorization'
  });
}

import { XlsxConfig } from '@delon/abc';
import { AppConfigService } from './modules/base_module/services/app-config-service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
export function fnDelonXlsxConfig(): XlsxConfig {
  return Object.assign(new XlsxConfig(), {
    url: './assets/js/xlsx.full.min.js',
  });
}

export function fnAlainThemeConfig(): AlainThemeConfig {
  return Object.assign(new AlainThemeConfig(), {
    http: {
      nullValueHandling: 'ignore',
    },
  });
}

const GLOBAL_CONFIG_PROVIDES = [
  // TIPS：@delon/abc 有大量的全局配置信息，例如设置所有 `st` 的页码默认为 `20` 行
  // { provide: STConfig, useFactory: fnSTConfig }
  { provide: PageHeaderConfig, useFactory: fnPageHeaderConfig },
  {
    provide: DelonAuthConfig,
    useFactory: fnDelonAuthConfig,
    deps: [Injector],
  },
  { provide: XlsxConfig, useFactory: fnDelonXlsxConfig },
  { provide: AlainThemeConfig, useFactory: fnAlainThemeConfig },
];

// #endregion

@NgModule({
  imports: [
    AlainThemeModule.forRoot(),
    DelonABCModule,
    DelonChartModule,
    DelonAuthModule,
    DelonACLModule.forRoot(),
    DelonCacheModule,
    DelonUtilModule,
    // mock
    ...MOCK_MODULES,
  ],
})
export class DelonModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: DelonModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'DelonModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [...REUSETAB_PROVIDES, ...GLOBAL_CONFIG_PROVIDES],
    };
  }
}
