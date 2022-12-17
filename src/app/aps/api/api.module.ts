import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ApiRoutingModule } from './api-routing.module';
import { ApiRegisterComponent } from './register/register.component';
import { ApiRegisterEditComponent } from './register/edit/edit.component';
import { ApiRegisterViewComponent } from './register/view/view.component';
import { BaseModule } from 'app/modules/base_module/base.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { FormsModule } from '@angular/forms';
import { GeneratedModule } from 'app/modules/generated_module/generated.module';
import { ApiReportReceiveComponent } from './report/receive.component';
import { ApiDisplayComponent } from './display/display.component';
import { ApiDisplayConfigComponent } from './displayconfig/displayconfig.component';
import { ApiRegisterViewImportComponent } from './register/view/import/import.component';
import { ApiRegisterSourceSysComponent } from './register/sourcesys/sourcesys.component';
import { ApiRegisterSourceSysEditComponent } from './register/sourcesys/edit/edit.component';
import { ApiReportReceiveDetailComponent } from './report/detail/detail.component';
const COMPONENTS = [
  ApiRegisterComponent,
  ApiReportReceiveComponent,
  ApiDisplayComponent,
  ApiDisplayConfigComponent
];
const COMPONENTS_NOROUNT = [
  ApiRegisterEditComponent,
  ApiRegisterViewComponent,
  ApiRegisterViewImportComponent,
  ApiRegisterSourceSysComponent,
  ApiRegisterSourceSysEditComponent,
  ApiReportReceiveDetailComponent];

@NgModule({
  imports: [
    BaseModule,
    SharedModule,
    GeneratedModule,
    FormsModule,
    ApiRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ApiModule { }
