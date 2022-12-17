import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from 'app/modules/base_module/base.module';
import { DemandOrderManagementRoutingModule } from './demand-order-management-routing.module';
import { DemandOrderManagementDemandclearupnoticeComponent } from './demandclearupnotice/demandclearupnotice.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomAgCellRenderComponent } from 'app/modules/base_module/components/custom-agcell-render.component';
import { DemandOrderManagementSafestockComponent } from './safestock/safestock.component';
import { DemandOrderManagementSafestockEditComponent } from './safestock/edit/edit.component';
import { DemandOrderManagementSafestockViewComponent } from './safestock/view/view.component';
import { DemandOrderManagementPpDemandDataInterfaceAgComponent } from './pp-demand-data-interface/pp-demand-data-interface-ag.component';
import { DemandOrderManagementPpDemandDataInterfaceImportComponent } from './pp-demand-data-interface/import/import.component';
import { DemandOrderManagementPpDemandDataInterfaceChildAgComponent } from './pp-demand-data-interface-child/pp-demand-data-interface-child-ag.component';
import { DemandOrderManagementPpDemandDataInterfaceEditComponent } from './pp-demand-data-interface/edit/edit.component';
import { DemandOrderManagementPpDemandDataInterfaceChildEditComponent } from './pp-demand-data-interface-child/edit/edit.component';
import { DemandOrderManagementDemandOrderSplitMergeComponent } from './demand-order-split-merge/demand-order-split-merge.component';
import { DemandOrderManagementDemandOrderSplitMergeEditComponent } from './demand-order-split-merge/edit/edit.component';
import { DemandOrderManagementMtsWorkbenchComponent } from './mts-workbench/mts-workbench.component';
import { DemandOrderManagementMtsWorkbenchViewComponent } from './mts-workbench/view/view.component';
import { SupplyDemandCheckComponent } from './supply-demand-check/supply-demand-check.component';
import { DemandViewDetailComponent } from './supply-demand-check/view/demand-view-detail.component';
import { SupplyViewDetailComponent } from './supply-demand-check/view/supply-view-detail.component';
import { InventoryCalculationComponent } from './inventory-calculation/inventory-calculation.component';
import { InventoryCalculationImportComponent } from './inventory-calculation/import/import.component';
import { InventoryCalculationEditComponent } from './inventory-calculation/edit/edit.component';
import { InventoryDetailComponent } from './inventory-calculation/detail/detail.component';
import { DemandOrderManagementMtsPlanOptionAgComponent } from './mts-plan-option/mts-plan-option-ag.component';
import { DemandOrderManagementMtsPlanOptionEditComponent } from './mts-plan-option/edit/edit.component';
import { DemandOrderManagementMtsPlanOptionViewComponent } from './mts-plan-option/view/view.component';
import { DemandOrderManagementMtsPlanOptionChildAgComponent } from './mts-plan-option-child/mts-plan-option-child-ag.component';
import { DemandOrderManagementMtsPlanOptionChildEditComponent } from './mts-plan-option-child/edit/edit.component';
import { DemandOrderManagementMtsPlanOptionChildViewComponent } from './mts-plan-option-child/view/view.component';
import {DemandOrderManagementReqlinetypedefaultsetComponent} from './reqlinetypedefaultset/reqlinetypedefaultset.component';
import { DemandOrderManagementReqlinetypedefaultsetEditComponent } from './reqlinetypedefaultset/edit/edit.component';
import { DemandOrderHisViewComponent } from './demand-order-his-view/demand-order-his-view.component';
import { DemandOrderManagementDemandclearupnoticesplitAgComponent } from './demandclearupnotice/demandclearupnoticesplitAg.component';
import { DemandOrderManagementDemandclearupnoticeEditComponent } from './demandclearupnotice/edit/edit.component';
import { BatchChooseRouteComponent } from './demandclearupnotice/batch-choose-route/batch-choose-route.component';
import { DemandOrderManagementDemandclearupnoticeViewComponent } from './demandclearupnotice/view/view.component';
import { PpReqOrderImportComponent } from './demandclearupnotice/import/import.component';
import { DemandOrderManagementDemandclearupnoticesplitComponent } from './demandclearupnoticesplit/demandclearupnoticesplit.component';
import { DemandOrderManagementDemandclearupnoticesplitEditComponent } from './demandclearupnoticesplit/edit/edit.component';
import { DemandOrderManagementDemandclearupnoticenonstdreqComponent } from './demandclearupnoticenonstdreq/demandclearupnoticenonstdreq.component';
import { InventoryClassificationComponent } from './inventory-classification/inventory-classification.component';
// import { UpdateOprDetailComponent } from './order-precedence-rule/detail/update/update-opr-detail.component';
import { OrderPrecedenceRuleDetailComponent } from './order-precedence-rule/detail/order-precedence-rule-detail.component';
import { UpdateDemandOrderManagementComponent } from './order-precedence-rule/update/update-demand-order-management.component';
import { OrderPrecedenceRuleComponent } from './order-precedence-rule/order-precedence-rule.component';
import { OrderPrecedenceRuleService } from './order-precedence-rule/order-precedence-rule.service';
import { AgGridModule } from 'ag-grid-angular';
import { InventoryClassificationEditComponent } from './inventory-classification/edit/edit.component';
import { InventoryDemandComponent } from './inventory-demand/inventory-demand.component';
import { DemandOrderManagementPlantAreaComponent } from './plant-area/plant-area.component';
import { DemandOrderManagementPlantAreaEditComponent } from './plant-area/edit/edit.component';
import { DemandOrderVisualization } from './demand-order-visualization/demand-order-visualization-view.component';
import { VisualView } from './demand-order-visualization/visual-view/visual-view.component';
import { OrderHistory } from './demand-order-visualization/order-history/order-history.component';
import { ShopScheduling } from './demand-order-visualization/shop-scheduling/shop-scheduling.coponent';
import { ProductionPreparation } from './demand-order-visualization/production-preparation/production-preparation.component';
import { CompletedSleeve } from './demand-order-visualization/completed-sleeve/completed-sleeve.component';

import { AtpAvailableComponent } from './atp-available/atp-available.component';
import { AtpAvailableDetailComponent } from './atp-available/detail/detail.component';
import { AtpIntransitComponent } from './atp-intransit/atp-intransit.component';
import { AtpIntransitDetailComponent } from './atp-intransit/detail/detail.component';
import { DemandOrderManagementOrderDistributeResultComponent } from './order-distribute-result/order-distribute-result.component';
import { PriorityCalculationResultsComponent } from './priority-calculation-results/priority-calculation-results.component';
import { PcrUpdateComponent } from './priority-calculation-results/update/pcr-update.component';
import { PcrDetailComponent } from './priority-calculation-results/detail/pcr-detail.component';
import { CapacityAvailableComponent } from './capacity-available/capacity-available.component';
import { CapacityAvailableDetailComponent } from './capacity-available/detail/detail.component';

import { OrderCommitmentComponent } from './order-commitment/order-commitment.component';
import { OrderCommitmentEditComponent } from './order-commitment/edit/edit.component';
import { DemandOrderManagementSalesPolicyComponent } from './sales-policy/sales-policy.component';
import { DemandOrderManagementSalesPolicyEditComponent } from './sales-policy/edit/edit.component';
import { DemandOrderManagementDemandclearupnoticeCopyComponent } from './demandclearupnotice/copy/copy.component';
import { DemandOrderManagementDemandclearupnoticeRawListComponent } from './demandclearupnotice/raw-list/raw-list.component';
import { DemandOrderManagementDemandclearupnoticeChooseRawComponent } from './demandclearupnotice/raw-list/choose-raw/choose-raw.component';
import { DemandOrderManagementDemandOrderRawListComponent } from './demand-order-raw-list/demand-order-raw-list.component';
import { ShortReportComponent } from './short-report/short-report.component';
const COMPONENTS = [
  DemandOrderVisualization,
  DemandOrderManagementDemandclearupnoticeComponent,
  DemandOrderManagementSafestockComponent,
  DemandOrderManagementPpDemandDataInterfaceAgComponent,
  DemandOrderManagementPpDemandDataInterfaceChildEditComponent,
  DemandOrderManagementDemandOrderSplitMergeComponent,
  DemandOrderManagementMtsWorkbenchComponent,
  SupplyDemandCheckComponent,
  InventoryCalculationComponent,
  DemandOrderManagementMtsPlanOptionAgComponent,
  DemandOrderManagementReqlinetypedefaultsetComponent,
  DemandOrderManagementDemandclearupnoticesplitComponent,
  DemandOrderManagementDemandclearupnoticenonstdreqComponent,
  InventoryClassificationComponent,
  OrderPrecedenceRuleComponent,
  AtpAvailableComponent,
  AtpIntransitComponent,
  DemandOrderManagementOrderDistributeResultComponent,
  PriorityCalculationResultsComponent,
  CapacityAvailableComponent,
  OrderCommitmentComponent,
  DemandOrderManagementSalesPolicyComponent,
  DemandOrderManagementDemandOrderRawListComponent,
  ShortReportComponent,
];
const COMPONENTS_NOROUNT = [
  DemandOrderManagementSafestockEditComponent,
  DemandOrderManagementSafestockViewComponent,
  DemandOrderManagementPpDemandDataInterfaceImportComponent,
  DemandOrderManagementPpDemandDataInterfaceChildAgComponent,
  DemandOrderManagementPpDemandDataInterfaceEditComponent,
  DemandOrderManagementDemandOrderSplitMergeEditComponent,
  DemandOrderManagementMtsWorkbenchViewComponent,
  DemandViewDetailComponent,
  SupplyViewDetailComponent,
  InventoryCalculationImportComponent,
  InventoryCalculationEditComponent,
  InventoryDetailComponent,
  DemandOrderManagementMtsPlanOptionEditComponent,
  DemandOrderManagementMtsPlanOptionViewComponent,
  DemandOrderManagementMtsPlanOptionChildAgComponent,
  DemandOrderManagementMtsPlanOptionChildEditComponent,
  DemandOrderManagementMtsPlanOptionChildViewComponent,
  DemandOrderManagementReqlinetypedefaultsetEditComponent,
  DemandOrderHisViewComponent,
  DemandOrderManagementDemandclearupnoticesplitAgComponent,
  DemandOrderManagementDemandclearupnoticeEditComponent,
  DemandOrderManagementDemandclearupnoticeViewComponent,
  PpReqOrderImportComponent,
  DemandOrderManagementDemandclearupnoticesplitEditComponent,
  InventoryClassificationEditComponent,
  InventoryDemandComponent,
  // UpdateOprDetailComponent,
  OrderPrecedenceRuleDetailComponent,
  UpdateDemandOrderManagementComponent,
  DemandOrderManagementPlantAreaComponent,
  DemandOrderManagementPlantAreaEditComponent,
  VisualView,
  OrderHistory,
  ShopScheduling,
  ProductionPreparation,
  CompletedSleeve,
  AtpAvailableDetailComponent,
  AtpIntransitDetailComponent,
  PcrUpdateComponent,
  PcrDetailComponent,
  CapacityAvailableDetailComponent,
  OrderCommitmentEditComponent,
  DemandOrderManagementSalesPolicyEditComponent,
  DemandOrderManagementDemandclearupnoticeCopyComponent,
  DemandOrderManagementDemandclearupnoticeRawListComponent,
  DemandOrderManagementDemandclearupnoticeChooseRawComponent,
  BatchChooseRouteComponent,
];

@NgModule({
  imports: [
    SharedModule,
    BaseModule,
    DemandOrderManagementRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent, CustomAgCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    PriorityCalculationResultsComponent,
    PcrUpdateComponent,
    PcrDetailComponent
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [OrderPrecedenceRuleService],
  exports: [...COMPONENTS_NOROUNT],
})
export class DemandOrderManagementModule {
}
