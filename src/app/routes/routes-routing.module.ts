/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-08-01 17:49:17
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-24 08:53:17
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
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
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { ACLGuard } from '@delon/acl';
import { LayoutProComponent } from 'app/layout/pro/pro.component';
import { UserLoginIndexComponent } from './passport/login-index/login-index.component';
import { EditorComponent } from './dashboard/editor/editor-flow.component';
import { EchartsTestComponent } from './exception/echarts.component';
import { ChangeLogComponent } from './doc/changelog.component';
import { ExtrasComponent } from './dashboard/extras/extras.component';
import { ReadmeComponent } from './doc/readme.component';
import { NewHomepageComponent } from './dashboard/new-homepage/new-homepage.component';
import { HwHomepageComponent } from './dashboard/hw-homepage/hw-homepage.component';

// aps pages

const routes: Routes = [
  {
    path: '',
    component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'dashboard/v2', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'dashboard/v2', pathMatch: 'full' },
      { path: 'dashboard/v1', component: DashboardV1Component, canActivate: [ACLGuard], data: { titleI18n: '首页' } },
      { path: 'dashboard/v2', component: HwHomepageComponent, canActivate: [ACLGuard], data: { titleI18n: '首页' } },
      { path: 'dashboard/analysis', component: DashboardAnalysisComponent, canActivate: [ACLGuard], data: { titleI18n: '首页' } },
      // { path: 'dashboard/monitor', component: DashboardMonitorComponent },
      // { path: 'dashboard/workplace', component: DashboardWorkplaceComponent, canActivate: [ACLGuard], data: { titleI18n: '系统监控台' } },
      { path: 'base', loadChildren: '../aps/base/base.module#BaseModule' },
      { path: 'materialmanagement', loadChildren: '../aps/materialmanagement/materialmanagement.module#MaterialmanagementModule' },
      { path: 'concurrent-request', loadChildren: '../aps/concurrent-request/concurrent-request.module#ConcurrentRequestModule' },
      // { path: 'forecast', loadChildren: '../aps/forecast/forecast.module#ForecastModule' },
      { path: 'plant-model', loadChildren: '../aps/plant-model/plant-model.module#PlantModelModule' },
      { path: 'demand-order-management', loadChildren: '../aps/demand-order-management/demand-order-management.module#DemandOrderManagementModule' },
      { path: 'mixed-resource-issued', loadChildren: '../aps/mixed-resource-issued/mixed-resource-issued.module#MixedResourceIssuedModule' },
      { path: 'planschedule', loadChildren: '../aps/planschedule/planschedule.module#PlanscheduleModule' },
      { path: 'preparation-platform', loadChildren: '../aps/preparation-platform/preparation-platform.module#PreparationPlatformModule' },
      { path: 'share-plan', loadChildren: '../aps/share-plan/share-plan.module#SharePlanModule' },
      // { path: 'shrinkage-plan', loadChildren: '../aps/shrinkage-plan/shrinkage-plan.module#ShrinkagePlanModule' },
      // { path: 'process-schedule', loadChildren: '../aps/process-schedule/process-schedule.module#ProcessScheduleModule' },
      // { path: 'report', loadChildren: '../aps/report/report.module#ReportModule' },
      // { path: 'editor', component: EditorComponent },
      // { path: 'echart', component: EchartsTestComponent },
       { path: 'product-sell-balance', loadChildren: '../aps/product-sell-balance/product-sell-balance.module#ProductSellBalanceModule' },
       { path: 'genetic', loadChildren: '../aps/genetic/genetic.module#GeneticModule' },
      // { path: 'injection-molding', loadChildren: '../aps/injection-molding/injection-molding.module#InjectionMoldingModule' },
      // { path: 'changelog', component: ChangeLogComponent, data: { titleI18n: '升级日志' } },
      // { path: 'code', component: ExtrasComponent, data: { titleI18n: '代码生成器' } },
      { path: 'demand-plan', loadChildren: '../aps/demand-plan/demand-plan.module#DemandPlanModule' },
      // { path: 'injection-molding', loadChildren: '../aps/injection-molding/injection-molding.module#InjectionMoldingModule' },
      // { path: 'daily-shipping-schedule', loadChildren: '../aps/daily-shipping-schedule/daily-shipping-schedule.module#DailyShippingScheduleModule' },
      { path: 'api', loadChildren: '../aps/api/api.module#ApiModule' },
      { path: 'digital-operations', loadChildren: '../aps/digital-operations/digital-operations.module#DigitalOperationsModule' },
      { path: 'material-planning', loadChildren: '../aps/material-planning/material-planning.module#MaterialPlanningModule' },
      // { path: 'worker-management', loadChildren: '../aps/worker-management/worker-management.module#WorkerManagementModule' },
      { path: 'aps-job-admin', loadChildren: '../aps/aps-job-admin/aps-job-admin.module#ApsJobAdminModule' },
      // { path: 'aps-job-admin', loadChildren: () => import('../aps/aps-job-admin/aps-job-admin.module').then(m => m.ApsJobAdminModule)},
      { path: 'poc', loadChildren: '../aps/poc/poc.module#PocModule' },
      { path: 'daily-shipping-schedule', loadChildren: '../aps/daily-shipping-schedule/daily-shipping-schedule.module#DailyShippingScheduleModule' },
      { path: 'energy-constraints', loadChildren: '../aps/energy-constraints/energy-constraints.module#EnergyConstraintsModule' },
      { path: 'worker-management', loadChildren: '../aps/worker-management/worker-management.module#WorkerManagementModule' },
      { path: 'algorithm-engine', loadChildren: '../aps/algorithm-engine/algorithm-engine.module#AlgorithmEngineModule' },
      { path: 'psi', loadChildren: '../aps/psi/psi.module#PsiModule' },
      { path: 'genetic', loadChildren: '../aps/genetic/genetic.module#GeneticModule' },
      { path: 'process-schedule', loadChildren: '../aps/process-schedule/process-schedule.module#ProcessScheduleModule' },
      { path: 'tiles-planning', loadChildren: '../aps/tiles-planning/tiles-planning.module#TilesPlanningModule' },
      { path: 'sale', loadChildren: '../aps/sale/sale.module#SaleModule' },
      { path: 'waste-sale', loadChildren: '../aps/waste-sale/waste-sale.module#WasteSaleModule' },
      { path: 'markup-rule', loadChildren: '../aps/markup-rule/markup-rule.module#MarkupRuleModule' },
      { path: 'ide', loadChildren: '../aps/ide/ide.module#IdeModule' },
      { path: 'customer-order-manage-hw', loadChildren: '../aps/customer-order-hw/customer-order-hw.module#CustomerOrderHwModule' },
    ],
  },
  // 全屏布局
  {
    path: 'fullscreen',
    component: LayoutFullScreenComponent,
    children: [
      { path: 'planschedule', loadChildren: '../aps/planschedule/planschedule.module#PlanscheduleModule' },
      { path: 'digital-operations', loadChildren: '../aps/digital-operations/digital-operations.module#DigitalOperationsModule' },
      // { path: 'process-schedule', loadChildren: '../aps/process-schedule/process-schedule.module#ProcessScheduleModule' },
      { path: 'readme', component: ReadmeComponent, data: { titleI18n: '自述文件' } },
    ],
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  {
    path: 'lock',
    component: UserLockComponent,
    data: { title: '锁屏', titleI18n: 'lock' },
  },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录', titleI18n: 'pro-login' } },
    ],
  },
  { path: 'login', component: UserLoginIndexComponent, data: { title: '登录', titleI18n: 'pro-login' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
