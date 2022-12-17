/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-09-10 11:15:19
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-23 16:03:27
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanscheduleMoComVindicateComponent } from './mo-comvindicate/mo-comvindicate.component';
import { PlanscheduleMomanagerComponent } from './momanager/momanager.component';
import { PlanschedulePsassemblyrelationComponent } from './psassemblyrelation/psassemblyrelation.component';
import { ScheduleStopRecordComponent } from './schedule-stop-record/schedule-stop-record.component';
import { ScheduleStopProductioComponent } from './schedule-stop-production/schedule-stop-production.component';
import { PlanscheduleShiftplanAgComponent } from './shiftplan/shiftplan-ag.component';
import { PlanscheduleMoexceptionAgComponent } from './moexception/moexception-ag.component';
import { PlantPlatformComponent } from './plant-platform/plant-platform.component';
import { ScheduleCheckReportComponent } from './schedule-check-report/schedule-check-report.component';
import { PlanscheduleDigitalizationWorkbenchAgComponent } from './digitalization-workbench/digitalization-workbench-ag.component';
import { PlantPlatformNewComponent } from './plant-platform-new/plant-platform-new.component';
import { PlanschedulePsSupplyStcokComponent } from './pssupplystcok/pssupplystcok.component';
import { InjectionMoldingChangeoverTimeComponent } from './changeover-time/changeover-time.component';
import { PlanschedulePsTechnicalModifyComponent } from './technical-modify/technical-modify.component';
import { SelfmadeoutsourcingpercentmManageComponent } from './selfmade-outsourcing-percent/selfmadeoutsourcingpercent.component';
import { MoMultimouldManageComponent } from './momultimould/momultimould.component';
import { PlanscheduleCustomerComponent } from './customer/customer.component';
import { PlanscheduleDigitalizationWorkbenchSimulationComponent } from './digitalization-workbench/simulation/simulation.component';
import { PlanscheduleHWCustomerComponent } from './customer-hw/customer.component';
import { PlanscheduleHWContractComponent } from './contract-hw/contract.component';
import { PlanscheduleHWCustomerStateModifyDetailComponent } from './customer-hw/state-modify-detail/modify-detail.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PSMoRequirementComponent } from './mo-requirement/mo-requirement.component';
import { PSMoRequirementCoatingComponent } from './mo-requirement/mo-requirement-coating.component';
import { PSRealPurchaseDemandComponent } from './real-purchase-demand/real-purchase-demand.component';
import { RealPurchaseDemandCountComponent } from './real-purchase-demand-count/real-purchase-demand-count.component';
import { UnmatchedRawInventoryComponent } from './unmatched-raw-inventory/unmatched-raw-inventory.component';

const routes: Routes = [
  { path: 'momanager', component: PlanscheduleMomanagerComponent },
  { path: 'psassemblyrelation', component: PlanschedulePsassemblyrelationComponent },
  { path: 'schedule-stop-record', component: ScheduleStopRecordComponent },
  { path: 'schedule-stop-production', component: ScheduleStopProductioComponent },
  { path: 'mo-comvindicate', component: PlanscheduleMoComVindicateComponent },
  { path: 'shiftplan', component: PlanscheduleShiftplanAgComponent },
  { path: 'moexception', component: PlanscheduleMoexceptionAgComponent },
  { path: 'PlantPlatform', component: PlantPlatformComponent, data: { titleI18n: '图形化排产' } },
  { path: 'PlantPlatformNew', component: PlantPlatformNewComponent, data: { titleI18n: '图形化排产' } },
  { path: 'schedule-check-report', component: ScheduleCheckReportComponent },
  { path: 'digitalizationworkbench', component: PlanscheduleDigitalizationWorkbenchAgComponent },
  { path: 'pssupplystcok', component: PlanschedulePsSupplyStcokComponent },
  { path: 'changeover-time', component: InjectionMoldingChangeoverTimeComponent },
  { path: 'technicalModify', component: PlanschedulePsTechnicalModifyComponent },
  { path: 'selfmade-outsourcing-percent', component: SelfmadeoutsourcingpercentmManageComponent },
  { path: 'momultimould', component: MoMultimouldManageComponent },
  { path: 'customer', component: PlanscheduleCustomerComponent },
  { path: 'simulation', component: PlanscheduleDigitalizationWorkbenchSimulationComponent },
  { path: 'customer-hw', component: PlanscheduleHWCustomerComponent},
  { path: 'contract-hw', component: PlanscheduleHWContractComponent}, 
  { path: 'purchase', component: PurchaseComponent}, 
  { path: 'PSMoRequirementManual', component: PSMoRequirementComponent}, 
  { path: 'PSMoRequirementManualCoating', component: PSMoRequirementCoatingComponent}, 
  { path: 'customer-state-modify-detail-hw', component: PlanscheduleHWCustomerStateModifyDetailComponent}, 
  { path: 'real-purchase-demand', component: PSRealPurchaseDemandComponent},
  { path: 'unmatched-raw-inventory', component: UnmatchedRawInventoryComponent },
  { path: 'real-purchase-demand-count', component: RealPurchaseDemandCountComponent, data: { type: 'count' } },
  { path: 'real-purchase-demand-coating', component: RealPurchaseDemandCountComponent, data: { type: 'coating' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanscheduleRoutingModule { }
