/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-09-10 11:15:19
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-23 14:53:22
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { AgGridModule } from 'ag-grid-angular';
import { BaseModule } from '../../modules/base_module/base.module';
import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { PlanscheduleRoutingModule } from './planschedule-routing.module';
import { PlanscheduleMomanagerComponent } from './momanager/momanager.component';
import { PlanscheduleMomanagerEditComponent } from './momanager/edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PlantModelModule } from '../plant-model/plant-model.module';
import { PlanscheduleMomanagerOpenComponent } from './momanager/open/open.component';
import { PlanschedulePsassemblyrelationEditComponent } from './psassemblyrelation/edit/edit.component';
import { PlanschedulePsassemblyrelationComponent } from './psassemblyrelation/psassemblyrelation.component';
import { ScheduleStopRecordComponent } from './schedule-stop-record/schedule-stop-record.component';
import { ScheduleStopProductioComponent } from './schedule-stop-production/schedule-stop-production.component';
import { ScheduleStopProductionImportComponent } from './schedule-stop-production/import/import.component';
import { ScheduleStopProductionEditComponent } from './schedule-stop-production/edit/edit.component';
import { ScheduleStopProductionDetailComponent } from './schedule-stop-production/detail/detail.component';
import { ScheduleStopProductionDetailEditComponent } from './schedule-stop-production/detail/edit/edit.component';
import { PlanscheduleMoComVindicateComponent } from './mo-comvindicate/mo-comvindicate.component';
import { PlanscheduleShiftplanComponent } from './shiftplan/shiftplan.component';
import { PlanscheduleShiftplanAgComponent } from './shiftplan/shiftplan-ag.component';
import { PlanscheduleMoexceptionAgComponent } from './moexception/moexception-ag.component';
import { PlanschedulePsTechnicalModifyComponent } from './technical-modify/technical-modify.component';

import { PlanscheduleMoexceptionSubmitExceptionComponent } from './moexception/view/submitException.component';
import { MoUpdateAgComponent } from './mo-update/mo-update-ag.component';
import { PlanscheduleDigitalizationWorkbenchSearchComponent } from './digitalization-workbench/search/search.component';
import { PlanscheduleDigitalizationWorkbenchSimulationComponent } from './digitalization-workbench/simulation/simulation.component';
import { PlanscheduleDigitalizationWorkbenchRefreshComponent } from './digitalization-workbench/refresh/refresh.component';
import { PlanscheduleDigitalizationWorkbenchPlanReleaseComponent } from './digitalization-workbench/planrelease/planrelease.component';
import { PlanscheduleDigitalizationWorkbenchBatchMoveComponent } from './digitalization-workbench/batchMove/batchMove.component';
import { ScheduleCheckReportComponent } from './schedule-check-report/schedule-check-report.component';
import { PlanscheduleDigitalizationWorkbenchAgComponent } from './digitalization-workbench/digitalization-workbench-ag.component';
import { PlanscheduleDigitalizationWorkbenchComponent } from './digitalization-workbench/digitalization-workbench.component';
import { PlantPlatformComponent } from './plant-platform/plant-platform.component';
import { PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent } from './digitalization-workbench/calculateWorking/calculateWorking.component';
import { PlanscheduleDigitalizationWorkbenchEndMoComponent } from './digitalization-workbench/endMo/endMo.component';
import { PlantPlatformSearchComponent } from './plant-platform/search/search.component';
import { PlanscheduleDigitalizationWorkbenchMoLevelComponent } from './digitalization-workbench/moLevel/moLevel.component';
import { PlanscheduleDigitalizationWorkbenchSplitMoComponent } from './digitalization-workbench/splitMo/splitMo.component';
import { PlanscheduleDigitalizationWorkbenchSetResourceAndRateComponent } from './digitalization-workbench/setResourceAndRate/setResourceAndRate.component';
import { PlanscheduleDigitalizationWorkbenchDigitalizationComponent } from './digitalization-workbench/digitalization/digitalization.component';
import { PlanscheduleDigitalizationWorkbenchRemarkMoComponent } from './digitalization-workbench/remarkMo/remarkMo.component';
import { PlanscheduleDigitalizationWorkbenchChooseLineComponent } from './digitalization-workbench/chooseLine/chooseLine.component';
import { PlanscheduleShiftplanAnComponent } from './digitalization-workbench/shiftPlanAn/shiftPlanAn.component';
import { SearchEndMoComponent } from './digitalization-workbench/searchEndMo/searchEndMo.component';
import { PlanscheduleDigitalizationWorkbenchMoSummaryComponent } from './digitalization-workbench/mo-summary/mo-summary.component';
import { PlanscheduleDigitalizationWorkbenchMoSummary2Component } from './digitalization-workbench/mo-summary/mo-summary2.component';
import { PlantPlatformNewComponent } from './plant-platform-new/plant-platform-new.component';
import { PlanschedulePsSupplyStcokComponent } from './pssupplystcok/pssupplystcok.component';
import { PlanschedulePsSupplyStcokEditComponent } from './pssupplystcok/edit/edit.component';
import { InjectionMoldingChangeoverTimeComponent } from './changeover-time/changeover-time.component';
import { InjectionMoldingChangeoverTimeEditComponent } from './changeover-time/edit/edit.component';
import { InjectionMoldingChangeoverTimeImportComponent } from './changeover-time/import/import.component';
import { PlanschedulePsTechnicalModifyAddComponent } from './technical-modify/edit/technical-modify-add.component';
import { PlanschedulePsTechnicalModifyAddDetailComponent } from './technical-modify/edit/technical-modify-add-detail.component';
import { PlanschedulePsTechnicalModifyItemCategorySelectComponent } from './technical-modify/edit/item-category-select.component';
import { SelfmadeoutsourcingpercentmManageComponent } from './selfmade-outsourcing-percent/selfmadeoutsourcingpercent.component';
import { SelfmadeoutsourcingpercentEditComponent } from './selfmade-outsourcing-percent/edit/edit.component';
import { MoMultimouldManageComponent } from './momultimould/momultimould.component';
import { MoMultiMouldEditComponent } from './momultimould/edit/edit.component';
import { PlanscheduleCustomerComponent } from './customer/customer.component';
import { PlanscheduleCustomerEditComponent } from './customer/edit/edit.component';
import { PlanscheduleHWCustomerComponent } from './customer-hw/customer.component';
import { PlanscheduleHWCustomerEditComponent } from './customer-hw/edit/edit.component';
import { PlanscheduleHWContractComponent } from './contract-hw/contract.component';
import { PlanscheduleHWContractEditComponent } from './contract-hw/edit/edit.component';
import { PlanscheduleHWContractCancelComponent } from './contract-hw/cancel/cancel.component';
import { PlanscheduleHWCustomerImportComponent } from './customer-hw/import/import.component';
import { PlanscheduleHWCustomerDetailImportComponent } from './customer-hw/detail/import/import.component';
import { PlanscheduleHWContractSplitComponent } from './contract-hw/split/split.component';
import { PlanscheduleHWContractModifyComponent } from './contract-hw/modify/modify.component';
import { PlanscheduleHWContractSplitChildComponent } from './contract-hw/split/child-contract/child.component';
import { PlanscheduleHWCustomerStateModifyDetailComponent } from './customer-hw/state-modify-detail/modify-detail.component';
import { PlanscheduleHWCustomerStateChangeComponent } from './customer-hw/state-change/change.component';
import { PlanscheduleHWCustomerInfoChangeComponent } from './customer-hw/info-change/info-change.component';
import { PlanscheduleHWCustomerTempCreditComponent } from './customer-hw/detail/temp-credit/temp-credit.component';
import { PlanscheduleHWCustomerAnnualTempCreditComponent } from './customer-hw/detail/annual-temp-credit/annual-temp-credit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PSMoRequirementComponent } from './mo-requirement/mo-requirement.component';
import { PSMoRequirementEditComponent } from './mo-requirement/edit/edit.component';
import { PlanscheduleHWCustomerNewEditComponent } from './customer-hw/edit-new/edit.component';
import { PlanscheduleHWCustomerDetailedComponent } from './customer-hw/detail/detail.component';
import { PlanscheduleHWCustomerDetailInfoChangeComponent } from './customer-hw/detail/detail-info-change/detail-info-change.component';
import { CustomerBankListComponent } from './customer-hw/bank-list/bank-list.component';
import { CustomerBankListEditComponent } from './customer-hw/bank-list/edit/edit.component';
import { PSMoRequirementCoatingComponent } from './mo-requirement/mo-requirement-coating.component';
import { PSMoRequirementCoatingEditComponent } from './mo-requirement/edit/edit-coating.component';
import { PSMoRequirementCoatingImportComponent } from './mo-requirement/import/importCoating.component';
import { PSMoRequirementImportComponent } from './mo-requirement/import/import.component';
import { AgCascaderEditorComponent } from './digitalization-workbench/cell-editor/ag-cascader-editor.component';
import { ResourceManuComponent } from './digitalization-workbench/resource-manu/resource-manu.component';
import { DemandOrderManagementModule } from '../demand-order-management/demand-order-management.module';
import { PSRealPurchaseDemandComponent } from './real-purchase-demand/real-purchase-demand.component';
import { RealPurchaseDemandCountEditComponent } from './real-purchase-demand-count/edit/edit.component';
import { RealPurchaseDemandCountComponent } from './real-purchase-demand-count/real-purchase-demand-count.component';
import { UnmatchedRawInventoryComponent } from './unmatched-raw-inventory/unmatched-raw-inventory.component';


const HW_COMPONENTS = [
  PlanscheduleHWCustomerComponent,
  PlanscheduleHWContractComponent,
  PlanscheduleHWCustomerStateModifyDetailComponent,
  PSRealPurchaseDemandComponent,
  RealPurchaseDemandCountComponent,
];

const HW_COMPONENTS_NOROUNT = [
  PlanscheduleHWCustomerEditComponent,
  PlanscheduleHWCustomerNewEditComponent,
  PlanscheduleHWContractEditComponent,
  PlanscheduleHWContractCancelComponent,
  PlanscheduleHWCustomerImportComponent,
  PlanscheduleHWContractSplitComponent,
  PlanscheduleHWContractModifyComponent,
  PlanscheduleHWContractSplitChildComponent,
  PlanscheduleHWCustomerStateChangeComponent,
  PlanscheduleHWCustomerInfoChangeComponent,
  PlanscheduleHWCustomerDetailedComponent,
  AgCascaderEditorComponent,
  ResourceManuComponent,
  RealPurchaseDemandCountEditComponent,
  PlanscheduleHWCustomerDetailInfoChangeComponent
];

const COMPONENTS = [
  PlanscheduleMomanagerComponent,
  PlanschedulePsassemblyrelationComponent,
  ScheduleStopRecordComponent,
  ScheduleStopProductioComponent,
  PlanscheduleMoComVindicateComponent,
  PlanscheduleShiftplanAgComponent,
  PlanscheduleMoexceptionAgComponent,
  MoUpdateAgComponent,
  ScheduleCheckReportComponent,
  PlanscheduleDigitalizationWorkbenchAgComponent,
  PlanscheduleDigitalizationWorkbenchComponent,
  PlantPlatformComponent,
  PlantPlatformNewComponent,
  PlanschedulePsSupplyStcokComponent,
  InjectionMoldingChangeoverTimeComponent,
  SelfmadeoutsourcingpercentmManageComponent,
  MoMultimouldManageComponent,
  PlanschedulePsTechnicalModifyComponent,
  PlanscheduleCustomerComponent,
  PurchaseComponent,
  PSMoRequirementComponent,
  PSMoRequirementCoatingComponent,
  UnmatchedRawInventoryComponent,
];

const COMPONENTS_NOROUNT = [
  PlanscheduleMomanagerEditComponent,
  PlanscheduleMomanagerOpenComponent,
  PlanschedulePsassemblyrelationEditComponent,
  ScheduleStopProductionImportComponent,
  ScheduleStopProductionEditComponent,
  ScheduleStopProductionDetailComponent,
  ScheduleStopProductionDetailEditComponent,
  PlanscheduleShiftplanComponent,
  PlanscheduleMoexceptionSubmitExceptionComponent,
  PlanscheduleDigitalizationWorkbenchSearchComponent,
  PlanscheduleDigitalizationWorkbenchSimulationComponent,
  PlanscheduleDigitalizationWorkbenchRefreshComponent,
  PlanscheduleDigitalizationWorkbenchPlanReleaseComponent,
  PlanscheduleDigitalizationWorkbenchBatchMoveComponent,
  PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent,
  PlanscheduleDigitalizationWorkbenchEndMoComponent,
  PlanscheduleDigitalizationWorkbenchRemarkMoComponent,
  PlanscheduleDigitalizationWorkbenchMoLevelComponent,
  PlanscheduleDigitalizationWorkbenchChooseLineComponent,
  PlanscheduleDigitalizationWorkbenchSplitMoComponent,
  PlanscheduleDigitalizationWorkbenchDigitalizationComponent,
  PlanscheduleShiftplanAnComponent,
  PlanscheduleDigitalizationWorkbenchSetResourceAndRateComponent,
  MoUpdateAgComponent,
  PlantPlatformSearchComponent,
  SearchEndMoComponent,
  PlanscheduleDigitalizationWorkbenchMoSummaryComponent,
  PlanscheduleDigitalizationWorkbenchMoSummary2Component,
  PlanschedulePsSupplyStcokEditComponent,
  InjectionMoldingChangeoverTimeEditComponent,
  InjectionMoldingChangeoverTimeImportComponent,
  PlanschedulePsTechnicalModifyAddComponent,
  PlanschedulePsTechnicalModifyAddDetailComponent,
  PlanschedulePsTechnicalModifyItemCategorySelectComponent,
  SelfmadeoutsourcingpercentEditComponent,
  MoMultiMouldEditComponent,
  PlanscheduleCustomerEditComponent,
  PlanscheduleHWCustomerTempCreditComponent,
  PSMoRequirementEditComponent,
  CustomerBankListComponent,
  CustomerBankListEditComponent,
  PSMoRequirementCoatingEditComponent,
  PSMoRequirementCoatingImportComponent,
  PSMoRequirementImportComponent,
  PlanscheduleHWCustomerAnnualTempCreditComponent,
  PlanscheduleHWCustomerDetailImportComponent,
];

@NgModule({
  imports: [
    BaseModule,
    SharedModule,
    PlanscheduleRoutingModule,
    ExcelExportModule,
    DemandOrderManagementModule,
    AgGridModule.withComponents([
      CustomOperateCellRenderComponent,
      AgCascaderEditorComponent,
    ]),
    GeneratedModule,
    PlantModelModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...HW_COMPONENTS,
    ...HW_COMPONENTS_NOROUNT,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: [...COMPONENTS_NOROUNT, ...HW_COMPONENTS_NOROUNT]
})
export class PlanscheduleModule { }
