import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductReleaseByTimeComponent } from './product-release-by-time/product-release-by-time.component';
import { LoadShiftsComponent } from './load-shifts/load-shifts.component';
import { LoadCapacityRuleComponent } from './load-capacity-rule/load-capacity-rule.component';
import { ShipmentNoteComponent } from './shipment-note/shipment-note.component';
import { LoadCapacityComponent } from './load-capacity/load-capacity.component';
import { ProductReleaseByTimeNewComponent } from './product-release-by-time-new/product-release-by-time.component';

const routes: Routes = [
  // { path: 'product-release-by-time', component: ProductReleaseByTimeComponent },
  { path: 'product-release-by-time', component: ProductReleaseByTimeNewComponent },
  { path: 'load-shifts', component: LoadShiftsComponent },
  { path: 'load-capacity-rule', component: LoadCapacityRuleComponent },
  { path: 'shipment-node', component: ShipmentNoteComponent },
  { path: 'load-capacity', component: LoadCapacityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyShippingScheduleRoutingModule { }
