import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { BaseModule } from 'app/modules/base_module/base.module';
import { FormsModule } from '@angular/forms';

import { MaterialPlanningRoutingModule } from './material-planning-routing.module';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PlanningParametersComponent } from './planning-parameters/planning-parameters.component';
import { PlantCalendarComponent } from './plant-calendar/plant-calendar.component';
import { PlanningParametersEditComponent } from './planning-parameters/edit/edit.component';
import { GlobalParametersComponent } from './planning-parameters/global-parameters/global-parameters.component';
import { NumberInputRendererComponent } from './planning-parameters/number-input-renderer.component';
import { SelectInputRendererComponent } from './planning-parameters/select-input-renderer.component';
import { CheckboxInputRendererComponent } from './planning-parameters/checkbox-input-renderer.component';
import { PlanningPlantComponent } from './planning-parameters/planning-plant/planning-plant.component';
import { PlanningPlantEditComponent } from './planning-parameters/planning-plant-edit/planning-plant-edit.component';
import { CheckboxModalComponent } from './planning-parameters/checkbox-modal/checkbox-modal.component';
import { MrpOperatorLibraryComponent } from './planning-parameters/mrp-operator-library/mrp-operator-library.component';
import { PlantCalendarEditComponent } from './plant-calendar/edit/edit.component';
import { PlantCalendarDetailComponent } from './plant-calendar/detail/detail.component';
import { PlantCalendarCopyComponent } from './plant-calendar/copy/copy.component';
import { AppCalendarComponent } from './plant-calendar/app-calendar/app-calendar.component';

import { MrpPlanningWorkbenchComponent } from './planning-workbench/planning-workbench.component';
import { MrpPlanningExceptionComponent } from './planning-workbench/view/planning-exception.component';
import { MrpPlanningOnhandComponent } from './planning-workbench/view/planning-onhand.component';
import { MrpPlanningPeggingComponent } from './planning-workbench/view/planning-pegging.component';
import { MrpPlanningWorkbenchExComponent } from './planning-workbench/planning-workbench-ex.component';
import { StockageAnalysisComponent } from './stockage-analysis/stockage-analysis.component';
import { StockageAnalysisDetailComponent } from './stockage-analysis/detail/detail.component';
import { DeliveryPlanMonitorComponent } from './delivery-plan-monitor/delivery-plan-monitor.component';
import { MaterialUsedRatioComponent } from './material-used-ratio/material-used-ratio.component';
import { KeyMaterialCheckComponent } from './key-material-check/key-material-check.component';
import { KeyMaterialDetailComponent } from './key-material-check/detail/detail.component';
import { VendorCategoriesPercentComponent } from './vendor-categories-percent/vendor-categories-percent.component';
import { VendorCategoriesPerentEditComponent } from './vendor-categories-percent/edit/edit.component';
import { DeliveryRatioReplaceComponent } from './delivery-ratio-replace/delivery-ratio-replace.component';
import { PCRequisitionWorkbenchComponent } from './pcrequisition-workbench/pcrequisition-workbench.component';
import { PcRequisitionManagementComponent } from './pcrequisition-management/pcrequisition-management.component';
import { PcRequisitionManagementEditComponent } from './pcrequisition-management/view/edit.component';
import { PcRequisitionManagementLineEditComponent } from './pcrequisition-management/view/line_edit.component';
import { PcRequisitionManagementCancelConfireComponent } from './pcrequisition-management/view/cancelconfirm.component';
import { PCPurchaseOrderManagementComponent } from './pcpurchaseorder-management/pcpurchaseorder-management.component';
import { PCPurchaseOrderManagementViewComponent } from  './pcpurchaseorder-management/view/view.component';
import { DesignateSupplierRulesComponent } from './designate-supplier-rules/designate-supplier-rules.component';
import { AgGridModule } from 'ag-grid-angular';
import { BomChangeRequestComponent } from './bom-change-request/bom-change-request.component';
import { ReplaceItemQuotaComponent } from './replace-item-quota/replace-item-quota.component';
import { ReplaceItemQuotaEditComponent } from './replace-item-quota/edit/edit.component';
import { ReplaceItemQuotaImportComponent } from './replace-item-quota/import/import.component';
import { BomChangeRequestEditComponent } from './bom-change-request/edit/edit.component';
import { DesignateSupplierRulesEditComponent } from './designate-supplier-rules/edit/edit.component';

const components = [
  PlanningParametersComponent,
  PlantCalendarComponent,
  AppCalendarComponent,
  MrpPlanningWorkbenchComponent,
  MrpPlanningWorkbenchExComponent,
  StockageAnalysisComponent,
  DeliveryPlanMonitorComponent,
  MaterialUsedRatioComponent,
  KeyMaterialCheckComponent,
  VendorCategoriesPercentComponent,
  DeliveryRatioReplaceComponent,
  PCRequisitionWorkbenchComponent,
  PcRequisitionManagementComponent,
  PCPurchaseOrderManagementComponent,
  DesignateSupplierRulesComponent,
  BomChangeRequestComponent,
  ReplaceItemQuotaComponent,

];
const componentsNoRoute = [
  PlanningParametersEditComponent,
  GlobalParametersComponent,
  NumberInputRendererComponent,
  SelectInputRendererComponent,
  CheckboxInputRendererComponent,
  PlanningPlantComponent,
  PlanningPlantEditComponent,
  CheckboxModalComponent,
  MrpOperatorLibraryComponent,
  PlantCalendarEditComponent,
  PlantCalendarDetailComponent,
  PlantCalendarCopyComponent,
  MrpPlanningExceptionComponent,
  MrpPlanningOnhandComponent,
  MrpPlanningPeggingComponent,
  StockageAnalysisDetailComponent,
  KeyMaterialDetailComponent,
  VendorCategoriesPerentEditComponent,
  PcRequisitionManagementEditComponent,
  PcRequisitionManagementLineEditComponent,
  PcRequisitionManagementCancelConfireComponent,
  PCPurchaseOrderManagementViewComponent,
  ReplaceItemQuotaEditComponent,
  ReplaceItemQuotaImportComponent,
  BomChangeRequestEditComponent,
  DesignateSupplierRulesEditComponent,
];


@NgModule({
  declarations: [
    ...components,
    ...componentsNoRoute,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    BaseModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    MaterialPlanningRoutingModule,
  ],
  entryComponents: componentsNoRoute
})
export class MaterialPlanningModule { }
