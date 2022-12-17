import { NgModule } from '@angular/core';
// import 'ag-grid-enterprise';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { PlantModelModule } from '../plant-model/plant-model.module';
import { ProcessScheduleRoutingModule } from './process-schedule-routing.module';
import { ProcessScheduleOperationmanageComponent } from './operationmanage/operationmanage.component';
import { ProcessScheduleOperationmanageEditComponent } from './operationmanage/edit/edit.component';
import { ProcessScheduleOperationLeadTimeComponent } from './operation-lead-time/operation-lead-time.component';
import { ProcessScheduleOperationLeadTimeEditComponent } from './operation-lead-time/edit/edit.component';
import { ProcessScheduleMOProcessMaintenanceComponent } from './moprocess-maintenance/moprocess-maintenance.component';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from './moprocess-maintenance/edit/edit.component';
import { ProcessScheduleMoprocessMaintenanceViewComponent } from './moprocess-maintenance/view/view.component';
import { ProcessScheduleMoprocessMaintenanceReqviewComponent } from './moprocess-maintenance/reqview/reqview.component';
import { ProcessSchedulePoComVindicateComponent } from './pocomvindicate/pocomvindicate.component';
import { ProcessScheduleOpdigitalizationWorkbenchComponent } from './opdigitalization-workbench/opdigitalization-workbench.component';
import { ProcessScheduleOpdigitalizationWorkbenchSearchComponent } from './opdigitalization-workbench/search/search.component';
import { ProcessScheduleOpdigitalizationWorkbenchRefreshComponent } from './opdigitalization-workbench/refresh/refresh.component';
import { ProcessScheduleOpdigitalizationWorkbenchEndMoComponent } from './opdigitalization-workbench/endMo/endMo.component';
import { ProcessScheduleOpdigitalizationWorkbenchBatchMoveComponent } from './opdigitalization-workbench/batchMove/batchMove.component';
import { ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent } from './opdigitalization-workbench/calculateWorking/calculateWorking.component';
import { ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent } from './opdigitalization-workbench/moLevel/moLevel.component';
import { OPPlantPlatformComponent } from './op-plant-platform/op-plant-platform.component';
import { OPPlantPlatformSearchComponent } from './op-plant-platform/search/op-search.component';
import { ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent } from './opdigitalization-workbench/planrelease/planrelease.component';
import { ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent } from './opdigitalization-workbench/chooseLine/chooseLine.component';
import { ProcessScheduleOpShiftplanComponent } from './opshiftplan/opshiftplan.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { OPGraphicalWorkbenchSearchComponent } from './op-graphical-workbench-canvas/search/op-graphical-workbench-search.component';
import { OPGraphicalWorkbenchCanvasComponent } from './op-graphical-workbench-canvas/op-graphical-workbench-canvas.component';
import { ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent } from './opdigitalization-workbench/setResourceAndRate/setResourceAndRate.component';
import { ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent } from './opdigitalization-workbench/splitMo/splitMo.component';
import { PlanscheduleModule } from '../planschedule/planschedule.module';

const COMPONENTS = [
  ProcessScheduleOperationmanageComponent,
  ProcessScheduleOperationLeadTimeComponent,
  ProcessScheduleMOProcessMaintenanceComponent,
  ProcessScheduleOpdigitalizationWorkbenchComponent,
  ProcessSchedulePoComVindicateComponent,
  OPPlantPlatformComponent,
  ProcessScheduleOpShiftplanComponent,
  OPGraphicalWorkbenchCanvasComponent
];
const COMPONENTS_NOROUNT = [
  ProcessScheduleOperationmanageEditComponent,
  ProcessScheduleOperationLeadTimeEditComponent,
  ProcessScheduleMoprocessMaintenanceEditComponent,
  ProcessScheduleMoprocessMaintenanceViewComponent,
  ProcessScheduleMoprocessMaintenanceReqviewComponent,
  ProcessScheduleOpdigitalizationWorkbenchSearchComponent,
  ProcessScheduleOpdigitalizationWorkbenchRefreshComponent,
  ProcessScheduleOpdigitalizationWorkbenchEndMoComponent,
  ProcessScheduleOpdigitalizationWorkbenchBatchMoveComponent,
  ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent,
  ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent,
  OPPlantPlatformSearchComponent,
  ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent,
  ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent,
  OPGraphicalWorkbenchSearchComponent,
  ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent,
  ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent
];

@NgModule({
  imports: [
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    SharedModule,
    BaseModule,
    ProcessScheduleRoutingModule,
    PlantModelModule,
    PlanscheduleModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ProcessScheduleModule { }
