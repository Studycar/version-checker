import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlantModelScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { PlantModelPlantmaintainComponent } from './plantmaintain/plantmaintain.component';
import { PlantModelProlinegroupmanagerComponent } from './prolinegroupmanager/prolinegroupmanager.component';
import { ERPJobTypeComponent } from './erpjobtype/erpjobtype.component';
import { ERPJobTypeAgCodeComponent } from './erpjobtype/erpjobtype-ag.component';
import { PlantModelProductlinemanagerComponent } from './productlinemanager/productlinemanager.component';
import { PlantModelProlinegroupmaintainComponent } from './prolinegroupmaintain/prolinegroupmaintain.component';
import { PlantModelCalendarComponent } from './calendar/calendar.component';
import { ComVindicateComponent } from './comvindicate/comvindicate.component';
import { MoBatchReleaseComponent } from './mobatchrelease/mobatchrelease.component';
import { ModelChangeTimeAgComponent } from './model-change-time/model-change-time-ag.component';
import { PlantModelScheduleManagerAgComponent } from './schedule-manager/schedule-manager-ag.component';
import { PlantModelItemRelationAgComponent } from './item-relation/item-relation-ag.component';
import { PsMantissaScaleComponent } from './mantissaScale/mantissaScale.component';
const routes: Routes = [
  { path: 'scheduleManager', component: PlantModelScheduleManagerAgComponent },
  { path: 'plantmaintain', component: PlantModelPlantmaintainComponent },
  { path: 'prolinegroupmanager', component: PlantModelProlinegroupmanagerComponent },
  { path: 'itemRelation', component: PlantModelItemRelationAgComponent },
  { path: 'erpjobtype', component: ERPJobTypeAgCodeComponent },
  { path: 'productlinemanager', component: PlantModelProductlinemanagerComponent },
  { path: 'prolinegroupmaintain', component: PlantModelProlinegroupmaintainComponent },
  { path: 'calendar', component: PlantModelCalendarComponent },
  { path: 'comvindicate', component: ComVindicateComponent },
  { path: 'mobatchrelease', component: MoBatchReleaseComponent },
  { path: 'model-change-time', component: ModelChangeTimeAgComponent },
  { path: 'mantissaScale', component: PsMantissaScaleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantModelRoutingModule { }
