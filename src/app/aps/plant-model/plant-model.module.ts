import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { PlantModelRoutingModule } from './plant-model-routing.module';
import { PlantModelScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { PlantModelScheduleManagerEditComponent } from './schedule-manager/edit/edit.component';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { BaseModule } from '../../modules/base_module/base.module';
import { PlantModelPlantmaintainComponent } from './plantmaintain/plantmaintain.component';
import { PlantModelPlantmaintainEditComponent } from './plantmaintain/edit/edit.component';
import { PlantModelProlinegroupmanagerComponent } from './prolinegroupmanager/prolinegroupmanager.component';
import { PlantModelProlinegroupmanagerEditComponent } from './prolinegroupmanager/edit/edit.component';
import { PlantModelItemRelationEditComponent } from './item-relation/edit/edit.component';
import { PlantModelProductlinemanagerComponent } from './productlinemanager/productlinemanager.component';
import { PlantModelProductlinemanagerEditComponent } from './productlinemanager/edit/edit.component';
import { ERPJobTypeComponent } from './erpjobtype/erpjobtype.component';
import { ERPJobTypeAgCodeComponent } from './erpjobtype/erpjobtype-ag.component';
import { ERPJobTypeEditComponent } from './erpjobtype/edit/edit.component';
import { PlantModelProlinegroupmaintainComponent } from './prolinegroupmaintain/prolinegroupmaintain.component';
import { PlantModelProlinegroupmaintainEditComponent } from './prolinegroupmaintain/edit/edit.component';
import { PlantModelCalendarComponent } from './calendar/calendar.component';
import { PlantModelCalendarMaintainComponent } from './calendar/maintain/maintain.component';
import { PlantModelCalendarMaintainEditComponent } from './calendar/maintain/edit/edit.component';
import { PlantModelCalendarShiftComponent } from './calendar/maintain/shift/shift.component';
import { PlantModelCalendarShiftEditComponent } from './calendar/maintain/shift/edit/edit.component';
import { PlantModelCalendarTimeComponent } from './calendar/maintain/time/time.component';
import { PlantModelCalendarTimeEditComponent } from './calendar/maintain/time/edit/edit.component';
import { PlantModelCalendarResourceShiftComponent } from './calendar/maintain/resourceshift/resourceshift.component';
import { PlantModelCalendarResourceShiftEditComponent } from './calendar/maintain/resourceshift/edit/edit.component';
import { PlantModelCalendarResourceTimeComponent } from './calendar/maintain/resourcetime/resourcetime.component';
import { CustomCalendarComponent } from './calendar/custom/custom-calendar.component';
import { PlantModelCalendarDateQueryComponent } from './calendar/datequery/datequery.component';
import { PlantModelCalendarDateQueryEditComponent } from './calendar/datequery/edit/edit.component';
import { PlantModelCalendarMaintainCopyDateComponent } from './calendar/maintain/copy/date.component';
import { ComVindicateComponent } from './comvindicate/comvindicate.component';
import { PlantModelCalendarMaintainCopyLineComponent } from './calendar/maintain/copy/line.component';
import { PlantModelCalendarMaintainCopyLineSelectComponent } from './calendar/maintain/copy/line-select.component';
import { PlantModelCalendarBatchModifyComponent } from './calendar/maintain/batchmodify/batchmodify.component';
import { MoBatchReleaseComponent } from './mobatchrelease/mobatchrelease.component';
import { MobBatchReleaseEditComponent } from './mobatchrelease/edit/edit.component';
import { ModelChangeTimeAgComponent } from './model-change-time/model-change-time-ag.component';
import { ModelChangeTimeEditComponent } from './model-change-time/edit/edit.component';
import { ModelChangeTimeImportComponent } from './model-change-time/import/import.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PlantModelScheduleManagerAgComponent } from './schedule-manager/schedule-manager-ag.component';
import { PlantModelItemRelationAgComponent } from './item-relation/item-relation-ag.component';
import { PlantModelCalendarShiftTimeComponent } from './calendar/maintain/shifttime/shifttime.component';
import { PlantModelCalendarShiftTimeEditComponent } from './calendar/maintain/shifttime/edit/edit.component';
import { ComvindicateEditComponent } from './comvindicate/edit/edit.component';
import { PlantModelCalendarResourceTimeNewComponent } from './calendar/maintain/resourceTimeNew/resource-time-new.component';
import { NumberInputRendererComponent } from './calendar/maintain/resourceTimeNew/number-input-renderer.component';
import { PsMantissaScaleComponent } from './mantissaScale/mantissaScale.component';
import { PsMantissaScaleEditComponent } from './mantissaScale/edit/edit.component';

const COMPONENTS = [
  PlantModelScheduleManagerComponent,
  PlantModelScheduleManagerAgComponent,
  PlantModelPlantmaintainComponent,
  PlantModelProlinegroupmanagerComponent,
  PlantModelItemRelationAgComponent,
  PlantModelProductlinemanagerComponent,
  ERPJobTypeComponent,
  ERPJobTypeAgCodeComponent,
  PlantModelProlinegroupmaintainComponent,
  PlantModelCalendarComponent,
  ComVindicateComponent,
  MoBatchReleaseComponent,
  ModelChangeTimeAgComponent,
  PsMantissaScaleComponent
];
const COMPONENTS_NOROUNT = [PlantModelScheduleManagerEditComponent,
  PlantModelPlantmaintainEditComponent,
  PlantModelProlinegroupmanagerEditComponent,
  PlantModelItemRelationEditComponent,
  PlantModelProductlinemanagerEditComponent,
  ERPJobTypeEditComponent,
  PlantModelProlinegroupmaintainEditComponent,
  PlantModelCalendarMaintainComponent,
  PlantModelCalendarMaintainEditComponent,
  PlantModelCalendarShiftComponent,
  PlantModelCalendarShiftEditComponent,
  PlantModelCalendarTimeComponent,
  PlantModelCalendarTimeEditComponent,
  PlantModelCalendarResourceShiftComponent,
  PlantModelCalendarResourceShiftEditComponent,
  PlantModelCalendarResourceTimeComponent,
  PlantModelCalendarShiftTimeComponent,
  PlantModelCalendarShiftTimeEditComponent,
  CustomCalendarComponent,
  PlantModelCalendarDateQueryComponent,
  PlantModelCalendarDateQueryEditComponent,
  PlantModelCalendarMaintainCopyDateComponent,
  PlantModelCalendarResourceTimeComponent,
  PlantModelCalendarMaintainCopyLineComponent,
  PlantModelCalendarMaintainCopyLineSelectComponent,
  PlantModelCalendarBatchModifyComponent,
  MobBatchReleaseEditComponent,
  ModelChangeTimeEditComponent,
  ModelChangeTimeImportComponent,
  PlantModelCalendarResourceTimeNewComponent,
  NumberInputRendererComponent,
  ComvindicateEditComponent,
  PsMantissaScaleEditComponent
];

@NgModule({
  imports: [SharedModule, PlantModelRoutingModule, ExcelExportModule, BaseModule, GeneratedModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class PlantModelModule { }
