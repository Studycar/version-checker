import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessScheduleOperationmanageComponent } from './operationmanage/operationmanage.component';
import { ProcessScheduleOperationLeadTimeComponent } from './operation-lead-time/operation-lead-time.component';
import { ProcessScheduleMOProcessMaintenanceComponent } from './moprocess-maintenance/moprocess-maintenance.component';
import { ProcessScheduleOpdigitalizationWorkbenchComponent } from './opdigitalization-workbench/opdigitalization-workbench.component';
import { ProcessSchedulePoComVindicateComponent } from './pocomvindicate/pocomvindicate.component';
import { OPPlantPlatformComponent } from './op-plant-platform/op-plant-platform.component';
import { ProcessScheduleOpShiftplanComponent } from './opshiftplan/opshiftplan.component';
import { OPGraphicalWorkbenchCanvasComponent } from './op-graphical-workbench-canvas/op-graphical-workbench-canvas.component';

const routes: Routes = [

  { path: 'operationmanage', component: ProcessScheduleOperationmanageComponent },
  { path: 'operation-lead-time', component: ProcessScheduleOperationLeadTimeComponent },
  { path: 'MOProcessMaintenance', component: ProcessScheduleMOProcessMaintenanceComponent },
  { path: 'opdigitalizationworkbench', component: ProcessScheduleOpdigitalizationWorkbenchComponent },
  { path: 'opshiftplan', component: ProcessScheduleOpShiftplanComponent },
  { path: 'pocomvindicate', component: ProcessSchedulePoComVindicateComponent },
  { path: 'opplantplatform', component: OPPlantPlatformComponent, data: { titleI18n: '图形化排产' } },
  { path: 'opgraphicalworkbenchcanvas', component: OPGraphicalWorkbenchCanvasComponent, data: { titleI18n: '图形化排产' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessScheduleRoutingModule { }
