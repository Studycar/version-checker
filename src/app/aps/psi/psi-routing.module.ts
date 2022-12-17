import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeadquartersPsiComponent } from './headquarters-psi/headquarters-psi.component';
import { CustomerPsiComponent } from './customer-psi/customer-psi.component';
import { CenterPsiComponent } from './center-psi/center-psi.component';
import { PlatformProgressReportComponent } from './platform-progress-report/platform-progress-report.component';
import { ManufacturingPlantMonthComponent } from './manufacturing-plant-month/manufacturing-plant-month.component';
import { ManufacturingPlantDayComponent } from './manufacturing-plant-day/manufacturing-plant-day.component';
import { MonthlyWarehouseComponent } from './monthly-warehouse/monthly-warehouse.component';
import { MonthlyDistributionComponent } from './monthly-distribution/monthly-distribution.component';
import { MaintainAnnualParametersComponent } from './maintain-annual-parameters/maintain-annual-parameters.component';
import { IntelligentSimulationComponent } from './intelligent-simulation/intelligent-simulation.component';
import { SimulationProcessComponent } from './simulation-process/simulation-process.component';
import { PsiListComponent } from './psi-list/psi-list.component';
import { ActualOccurrenceDataComponent } from './actual-occurrence-data/actual-occurrence-data.component';
import { MoldExecutionComponent } from './mold-execution/mold-execution.component';
import { PsiMergeComponent } from './psi-merge/psi-merge.component';
import { PsiDataShowComponent } from './psi-data-show/psi-data-show.component';
import { PsiInventoryLevelComponent } from './psi-inventory-level/psi-inventory-level.component';
import { PSIDeliveryCapacityComponent } from './psi-delivery-capacity/psi-delivery-capacity.component';
import { OrderProgressWarningConfigComponent } from './order-progress-warning-config/order-progress-warning-config.component';
import { OrderProgressWarningComponent } from './order-progress-warning/order-progress-warning.component';

const routes: Routes = [
  { path: 'headquarters-psi', component: HeadquartersPsiComponent, },
  { path: 'customer-psi', component: CustomerPsiComponent, },
  { path: 'center-psi', component: CenterPsiComponent, },
  { path: 'platform-progress-report', component: PlatformProgressReportComponent },
  { path: 'manufacturing-plant-month', component: ManufacturingPlantMonthComponent },
  { path: 'manufacturing-plant-day', component: ManufacturingPlantDayComponent },
  { path: 'monthly-warehouse', component: MonthlyWarehouseComponent },
  { path: 'monthly-distribution', component: MonthlyDistributionComponent },
  { path: 'maintain-annual-parameters', component: MaintainAnnualParametersComponent },
  { path: 'intelligent-simulation', component: IntelligentSimulationComponent },
  { path: 'simulation-process', component: SimulationProcessComponent },
  { path: 'psi-list', component: PsiListComponent },
  { path: 'actual-occurrence-data', component: ActualOccurrenceDataComponent },
  { path: 'mold-execution', component: MoldExecutionComponent },
  { path: 'psi-merge', component: PsiMergeComponent },
  { path: 'psi-data-show', component: PsiDataShowComponent },
  { path: 'psi-inventory-level', component: PsiInventoryLevelComponent }, 
  { path: 'psi-delivery-capacity', component: PSIDeliveryCapacityComponent },
  { path: 'order-progress-warning-config', component: OrderProgressWarningConfigComponent },
  { path: 'order-progress-warning', component: OrderProgressWarningComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsiRoutingModule { }
