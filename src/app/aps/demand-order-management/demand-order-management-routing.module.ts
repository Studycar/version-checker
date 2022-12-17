import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandOrderManagementDemandclearupnoticeComponent } from './demandclearupnotice/demandclearupnotice.component';
import { DemandOrderManagementPpDemandDataInterfaceAgComponent } from './pp-demand-data-interface/pp-demand-data-interface-ag.component';
import { DemandOrderManagementSafestockComponent } from './safestock/safestock.component';
import { DemandOrderManagementDemandOrderSplitMergeComponent } from './demand-order-split-merge/demand-order-split-merge.component';
import { DemandOrderManagementMtsWorkbenchComponent } from './mts-workbench/mts-workbench.component';
import { SupplyDemandCheckComponent } from './supply-demand-check/supply-demand-check.component';
import { InventoryCalculationComponent } from './inventory-calculation/inventory-calculation.component';
import { DemandOrderManagementMtsPlanOptionAgComponent } from './mts-plan-option/mts-plan-option-ag.component';
import { DemandOrderManagementReqlinetypedefaultsetComponent } from './reqlinetypedefaultset/reqlinetypedefaultset.component';
import { DemandOrderManagementDemandclearupnoticesplitComponent } from './demandclearupnoticesplit/demandclearupnoticesplit.component';
import { DemandOrderManagementDemandclearupnoticenonstdreqComponent } from './demandclearupnoticenonstdreq/demandclearupnoticenonstdreq.component';
import { InventoryClassificationComponent } from './inventory-classification/inventory-classification.component';
import { InventoryDemandComponent } from './inventory-demand/inventory-demand.component';
import { OrderPrecedenceRuleComponent } from './order-precedence-rule/order-precedence-rule.component';
import { DemandOrderManagementPlantAreaComponent } from './plant-area/plant-area.component';
import { DemandOrderVisualization } from './demand-order-visualization/demand-order-visualization-view.component';

import { AtpAvailableComponent } from './atp-available/atp-available.component';
import { AtpIntransitComponent } from './atp-intransit/atp-intransit.component';

import { DemandOrderManagementOrderDistributeResultComponent } from './order-distribute-result/order-distribute-result.component';
import { PriorityCalculationResultsComponent } from './priority-calculation-results/priority-calculation-results.component';
import { CapacityAvailableComponent } from './capacity-available/capacity-available.component';
import { ShortReportComponent } from './short-report/short-report.component';

import { OrderCommitmentComponent } from './order-commitment/order-commitment.component';
import { DemandOrderManagementSalesPolicyComponent } from './sales-policy/sales-policy.component';
import { DemandOrderManagementDemandOrderRawListComponent } from './demand-order-raw-list/demand-order-raw-list.component';
const routes: Routes = [
  { path: 'demand-order-visualization', component: DemandOrderVisualization },
  { path: 'demandclearupnotice', component: DemandOrderManagementDemandclearupnoticeComponent },
  { path: 'safestock', component: DemandOrderManagementSafestockComponent },
  { path: 'pp-demand-data-interface', component: DemandOrderManagementPpDemandDataInterfaceAgComponent },
  { path: 'demand-order-split-merge', component: DemandOrderManagementDemandOrderSplitMergeComponent },
  { path: 'mts-workbench', component: DemandOrderManagementMtsWorkbenchComponent },
  { path: 'demand-order-split-merge', component: DemandOrderManagementDemandOrderSplitMergeComponent },
  { path: 'supply-demand-check', component: SupplyDemandCheckComponent },
  { path: 'inventory-calculation', component: InventoryCalculationComponent },
  { path: 'mts-plan-option', component: DemandOrderManagementMtsPlanOptionAgComponent },
  { path: 'reqlinetypedefaultset', component: DemandOrderManagementReqlinetypedefaultsetComponent },
  { path: 'demandclearupnoticesplit', component: DemandOrderManagementDemandclearupnoticesplitComponent },
  { path: 'demandclearupnoticenonstdreq', component: DemandOrderManagementDemandclearupnoticenonstdreqComponent },
  { path: 'inventory-classification', component: InventoryClassificationComponent },
  { path: 'inventory-demand', component: InventoryDemandComponent },
  { path: 'order-precedence-rule', component: OrderPrecedenceRuleComponent },
  { path: 'plant-area', component: DemandOrderManagementPlantAreaComponent },
  { path: 'atp-available', component: AtpAvailableComponent },
  { path: 'atp-intransit', component: AtpIntransitComponent },
  { path: 'order-distribute-result', component: DemandOrderManagementOrderDistributeResultComponent },
  { path: 'priority-calculation-results', component: PriorityCalculationResultsComponent },
  { path: 'capacity-available', component: CapacityAvailableComponent },
  { path: 'order-commitment', component: OrderCommitmentComponent },
  { path: 'sales-policy', component: DemandOrderManagementSalesPolicyComponent },
  { path: 'lock-order-raw', component: DemandOrderManagementDemandOrderRawListComponent },
  { path: 'demand-short-report', component: ShortReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemandOrderManagementRoutingModule {
}
