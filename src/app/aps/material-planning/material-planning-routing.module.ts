import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanningParametersComponent } from './planning-parameters/planning-parameters.component';
import { PlantCalendarComponent } from './plant-calendar/plant-calendar.component';
import { MrpPlanningWorkbenchComponent } from './planning-workbench/planning-workbench.component';
import { MrpPlanningWorkbenchExComponent } from './planning-workbench/planning-workbench-ex.component';
import { StockageAnalysisComponent } from './stockage-analysis/stockage-analysis.component';
import { DeliveryPlanMonitorComponent } from './delivery-plan-monitor/delivery-plan-monitor.component';
import { MaterialUsedRatioComponent } from './material-used-ratio/material-used-ratio.component';
import { KeyMaterialCheckComponent } from './key-material-check/key-material-check.component';
import { VendorCategoriesPercentComponent } from './vendor-categories-percent/vendor-categories-percent.component';
import { DeliveryRatioReplaceComponent } from './delivery-ratio-replace/delivery-ratio-replace.component';
import { PCRequisitionWorkbenchComponent } from './pcrequisition-workbench/pcrequisition-workbench.component';
import { PcRequisitionManagementComponent } from './pcrequisition-management/pcrequisition-management.component';
import { PCPurchaseOrderManagementComponent } from './pcpurchaseorder-management/pcpurchaseorder-management.component';
import { DesignateSupplierRulesComponent } from './designate-supplier-rules/designate-supplier-rules.component';
import { BomChangeRequestComponent } from './bom-change-request/bom-change-request.component';
import { ReplaceItemQuotaComponent } from './replace-item-quota/replace-item-quota.component';
const routes: Routes = [
  { path: 'planning-parameters', component: PlanningParametersComponent },
  { path: 'plant-calendar', component: PlantCalendarComponent },
  { path: 'MrpPlanningWorkbench', component: MrpPlanningWorkbenchComponent },
  { path: 'MrpPlanningWorkbenchEx', component: MrpPlanningWorkbenchExComponent },
  { path: 'StockageAnalysis', component: StockageAnalysisComponent },
  { path: 'DeliveryPlanMonitor', component: DeliveryPlanMonitorComponent },
  { path: 'MaterialUsedRatio', component: MaterialUsedRatioComponent },
  { path: 'KeyMaterialCheck', component: KeyMaterialCheckComponent },
  { path: 'VendorCategoriesPercent', component: VendorCategoriesPercentComponent },
  { path: 'DeliveryRatioReplace', component: DeliveryRatioReplaceComponent },
  { path: 'PCRequisitionWorkbench', component: PCRequisitionWorkbenchComponent },
  { path: 'PCRequisitionManagement', component: PcRequisitionManagementComponent },
  { path: 'PCPurchaseOrderManagement', component: PCPurchaseOrderManagementComponent },
  { path: 'designate-supplier-rules', component: DesignateSupplierRulesComponent },
  { path: 'bom-change-request', component: BomChangeRequestComponent },
  { path: 'replace-item-quota', component: ReplaceItemQuotaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialPlanningRoutingModule { }
