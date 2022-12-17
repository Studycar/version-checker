import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { BaseModule } from '../../modules/base_module/base.module';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { DigitalOperationsUserPrivilageComponent } from './digital-operations-user-privilage/digital-operations-user-privilage.component';
import { DigitalOperationsFormDivisionComponent } from './digital-operations-form-division/digital-operations-form-division.component';
import { DigitalOperationsRoutingModule } from './digital-operations-routing.module';
import { DigitalOperationsService } from './digital-operations-service';

const COMPONENTS_NOROUNT = [
  DigitalOperationsFormDivisionComponent,
  DigitalOperationsUserPrivilageComponent,
];

@NgModule({
  imports: [
    SharedModule,
    BaseModule,
    DigitalOperationsRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [...COMPONENTS_NOROUNT],
  providers: [DigitalOperationsService],
  entryComponents: COMPONENTS_NOROUNT,
})
export class DigitalOperationsModule {}
