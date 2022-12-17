import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardV2Component } from './dashboard/v2/v2.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { UserLockComponent } from './passport/lock/lock.component';
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { UserLoginIndexComponent } from './passport/login-index/login-index.component';
import { AuditLogViewComponent } from './dashboard/workplace/view.component';
import { EditorComponent } from './dashboard/editor/editor-flow.component';
import { EchartsTestComponent } from './exception/echarts.component';
import { MarkdownModule } from 'ngx-markdown';
import { _HttpClient } from '@delon/theme';
import { ChangeLogComponent } from './doc/changelog.component';
import { ExtrasComponent } from './dashboard/extras/extras.component';
import { DashboardService } from './dashboard/v2/dashboard-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ReadmeComponent } from './doc/readme.component';
import { NewHomepageComponent } from './dashboard/new-homepage/new-homepage.component';
import { HwHomepageComponent } from './dashboard/hw-homepage/hw-homepage.component';

const COMPONENTS = [
  DashboardV1Component,
  DashboardV2Component,
  DashboardAnalysisComponent,
  DashboardMonitorComponent,
  DashboardWorkplaceComponent,
  AuditLogViewComponent,
  EditorComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  UserLoginIndexComponent,
  // single pages
  UserLockComponent,
  CallbackComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  EchartsTestComponent,
  ChangeLogComponent,
  ExtrasComponent,
  ReadmeComponent,
  NewHomepageComponent,
  HwHomepageComponent,
];
const COMPONENTS_NOROUNT = [AuditLogViewComponent];

@NgModule({
  imports: [
    SharedModule,
    RouteRoutingModule,
    MarkdownModule.forRoot({ loader: _HttpClient }),
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  providers: [AppTranslationService, DashboardService],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
