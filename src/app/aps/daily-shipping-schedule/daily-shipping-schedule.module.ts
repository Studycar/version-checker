import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { DailyShippingScheduleRoutingModule } from './daily-shipping-schedule-routing.module';
import { ProductReleaseByTimeComponent } from './product-release-by-time/product-release-by-time.component';
import { LoadShiftsComponent } from './load-shifts/load-shifts.component';
import { LoadShiftsEditComponent } from './load-shifts/edit/edit.component';
import { LoadShiftsImportComponent } from './load-shifts/import/import.component';
import { LoadCapacityRuleComponent } from './load-capacity-rule/load-capacity-rule.component';
import { LoadCapacityRuleEditComponent } from './load-capacity-rule/edit/edit.component';
import { LoadCapacityRuleImportComponent } from './load-capacity-rule/import/import.component';
import { ShipmentNoteDetailComponent } from './shipment-note/detail/detail.component';
import { ShipmentNoteComponent } from './shipment-note/shipment-note.component';
import { LoadCapacityComponent } from './load-capacity/load-capacity.component';
import { ProductReleaseByTimeNewComponent } from './product-release-by-time-new/product-release-by-time.component';

const COMPONENTS = [
  ProductReleaseByTimeComponent,
  ProductReleaseByTimeNewComponent,
  LoadShiftsComponent,
  LoadCapacityRuleComponent,
  ShipmentNoteComponent,
  LoadCapacityComponent];

const COMPONENTS_NOROUNT = [
  LoadShiftsEditComponent,
  LoadShiftsImportComponent,
  LoadCapacityRuleEditComponent,
  LoadCapacityRuleImportComponent,
  ShipmentNoteDetailComponent];

@NgModule({
  imports: [
    SharedModule,
    DailyShippingScheduleRoutingModule,
    BaseModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class DailyShippingScheduleModule { }
