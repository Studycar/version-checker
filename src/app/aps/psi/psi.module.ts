import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { BaseModule } from 'app/modules/base_module/base.module';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { PsiRoutingModule } from './psi-routing.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { HeadquartersPsiComponent } from './headquarters-psi/headquarters-psi.component';
import { HeadquartersPsiChartDialogComponent } from './headquarters-psi/chart-dialog/chart-dialog.component';
import { CustomerPsiComponent } from './customer-psi/customer-psi.component';
import { CustomerPsiImportComponent } from './customer-psi/import/import.component';
import { CenterPsiComponent } from './center-psi/center-psi.component';
import { PlatformProgressReportComponent } from './platform-progress-report/platform-progress-report.component';
import { PlatformProgressReportChartDialogComponent } from './platform-progress-report/chart-dialog/chart-dialog.component'
import { ManufacturingPlantMonthComponent } from './manufacturing-plant-month/manufacturing-plant-month.component';
import { ManufacturingPlantDayComponent } from './manufacturing-plant-day/manufacturing-plant-day.component';
import { MonthlyWarehouseComponent } from './monthly-warehouse/monthly-warehouse.component';
import { MonthlyWarehouseEditComponent } from './monthly-warehouse/edit/edit.component';
import { MonthlyWarehouseCopyComponent } from './monthly-warehouse/copy/copy.component';
import { MonthlyDistributionComponent } from './monthly-distribution/monthly-distribution.component';
import { MonthlyDistributionEditComponent } from './monthly-distribution/edit/edit.component';
import { MonthlyDistributionCopyComponent } from './monthly-distribution/copy/copy.component';
import { MaintainAnnualParametersComponent } from './maintain-annual-parameters/maintain-annual-parameters.component';
import { MaintainAnnualParametersEditComponent } from './maintain-annual-parameters/edit/edit.component';
import { IntelligentSimulationComponent } from './intelligent-simulation/intelligent-simulation.component';
import { IntelligentSimulationSaveComponent } from './intelligent-simulation/save/save.component';
import { SimulationProcessComponent } from './simulation-process/simulation-process.component';
import { SimulationProcessLogDialogComponent } from './simulation-process/log-dialog/log-dialog.component';
import { PsiListComponent } from './psi-list/psi-list.component';
import { ShowPsiComponent } from './psi-list/show-psi/show-psi.component';
import { AdjustPsiComponent } from './psi-list/adjust-psi/adjust-psi.component';
import { AdjustPsiEditComponent } from './psi-list/adjust-psi/edit/edit.component';
import { AdjustPsiSaveComponent } from './psi-list/adjust-psi/save/save.component';
import { PsiKpiComponent } from './psi-list/psi-kpi/psi-kpi.component';
import { ActualOccurrenceDataComponent } from './actual-occurrence-data/actual-occurrence-data.component';
import { ActualOccurrenceDataEditComponent } from './actual-occurrence-data/edit/edit.component';
import { MoldExecutionComponent } from './mold-execution/mold-execution.component';
import { PsiMergeComponent } from './psi-merge/psi-merge.component';
import { PsiDataShowComponent } from './psi-data-show/psi-data-show.component';

import { NumberInputEditorComponent } from './number-input.component';
import { PsiService } from './psi.service';
import { PsiInventoryLevelComponent } from './psi-inventory-level/psi-inventory-level.component';
import { PsiInventoryLevelEditComponent } from './psi-inventory-level/edit/edit.component';
import { PSIDeliveryCapacityComponent } from './psi-delivery-capacity/psi-delivery-capacity.component';
import { PSIDeliveryCapacityEditComponent } from './psi-delivery-capacity/edit/edit.component';
import { OrderProgressWarningConfigComponent } from './order-progress-warning-config/order-progress-warning-config.component';
import { OrderProgressWarningConfigDetailComponent } from './order-progress-warning-config/warning-object-detail/detail.component';
import { OrderProgressWarningConfigEditComponent } from './order-progress-warning-config/edit/edit.component';
import { OrderProgressWarningConfigDetailEditComponent } from './order-progress-warning-config/warning-object-detail/edit/edit.component';
import { OrderProgressWarningComponent } from './order-progress-warning/order-progress-warning.component';
import { SummartBlockComponent } from './order-progress-warning/echart-components/summary-block.component';
import { MiddleBlockComponent } from './order-progress-warning/echart-components/middle-block.component';
import { GaugeChartsComponent } from './order-progress-warning/echart-components/gauge-charts.component';
import { BarChartsComponent } from './order-progress-warning/echart-components/bar-charts.component';
import { FactoryEchartComponent } from './psi-data-show/echarts-component/factory.component';
import { BaseEchartComponent } from './psi-data-show/echarts-component/base.component';
import { BookUpEchartComponent } from './psi-data-show/echarts-component/bookup.component';
import { QualifiedRateEchartComponent } from './psi-data-show/echarts-component/qualified-rate.component';
import { MaintainAnnualParametersImportComponent } from './maintain-annual-parameters/import/import.component';
import { MonthlyWarehouseImportComponent } from './monthly-warehouse/import/import.component';
import { MonthlyDistributionImportComponent } from './monthly-distribution/import/import.component';
import { CenterPsiImportComponent } from './center-psi/import/import.component';

const components = [
  HeadquartersPsiComponent,
  CustomerPsiComponent,
  CenterPsiComponent,
  PlatformProgressReportComponent,
  ManufacturingPlantMonthComponent,
  ManufacturingPlantDayComponent,
  MonthlyWarehouseComponent,
  MonthlyDistributionComponent,
  MaintainAnnualParametersComponent,
  IntelligentSimulationComponent,
  SimulationProcessComponent,
  PsiListComponent,
  ActualOccurrenceDataComponent,
  MoldExecutionComponent,
  PsiMergeComponent,
  PsiDataShowComponent,
  PsiInventoryLevelComponent,
  PSIDeliveryCapacityComponent,
  OrderProgressWarningConfigComponent,
  OrderProgressWarningComponent,
];

const psiDataShowEchartComponents = [
  FactoryEchartComponent,
  BaseEchartComponent,
  BookUpEchartComponent,
  QualifiedRateEchartComponent,
]

const componentsNoRoute = [
  NumberInputEditorComponent,
  HeadquartersPsiChartDialogComponent,
  PlatformProgressReportChartDialogComponent,
  MonthlyWarehouseEditComponent,
  MonthlyWarehouseCopyComponent,
  MonthlyDistributionEditComponent,
  MonthlyDistributionCopyComponent,
  MaintainAnnualParametersEditComponent,
  IntelligentSimulationSaveComponent,
  SimulationProcessLogDialogComponent,
  ShowPsiComponent,
  AdjustPsiComponent,
  PsiKpiComponent,
  ActualOccurrenceDataEditComponent,
  AdjustPsiEditComponent,
  AdjustPsiSaveComponent,
  CustomerPsiImportComponent,
  PsiInventoryLevelEditComponent,
  PSIDeliveryCapacityEditComponent,
  OrderProgressWarningConfigDetailComponent,
  OrderProgressWarningConfigEditComponent,
  OrderProgressWarningConfigDetailEditComponent,
  SummartBlockComponent,
  MiddleBlockComponent,
  GaugeChartsComponent,
  BarChartsComponent,
  MaintainAnnualParametersImportComponent,
  MonthlyWarehouseImportComponent,
  MonthlyDistributionImportComponent,
  CenterPsiImportComponent,
  ...psiDataShowEchartComponents,
];

@NgModule({
  declarations: [
    ...components,
    ...componentsNoRoute,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    FormsModule,
    NgScrollbarModule,
    PsiRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  entryComponents: componentsNoRoute,
  providers: [
    PsiService,
  ],
})
export class PsiModule {}

