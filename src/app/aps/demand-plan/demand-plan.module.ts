/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-22 14:12:16
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-02 14:51:20
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DemandPlanRoutingModule } from './demand-plan-routing.module';
// import { DemandPlanForeastParameterComponent } from './foreast-parameter/foreast-parameter.component';
// import { DemandPlanUserrolepermissionsComponent } from './user-role-permissions/user-role-permissions.component';
// import { DemandPlanUserDataPermissionsComponent } from './user-data-permissions/user-data-permissions.component';
// import { DemandPlanForeastParameterEditComponent } from './foreast-parameter/edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AgGridModule } from 'ag-grid-angular';
import { BaseModule } from 'app/modules/base_module/base.module';
// import { DemandPlanUserDataPermissionsEditComponent } from './user-data-permissions/edit/edit.component';
// import { DemandPlanUserRolePermissionsEditComponent } from './user-role-permissions/edit/edit.component';
// import { DemandPlanForeastParameterViewComponent } from './foreast-parameter/view/view.component';
import { DemandPlanCustomerDivisionComponent } from './customer-division/customer-division.component';
import { DemandPlanCustomerDivisionEditComponent } from './customer-division/edit/edit.component';
// import { DemandPlanForecastTreeComponent } from './forecast-tree/forecast-tree.component';
// import { DemandPlanForecastTreeEditComponent } from './forecast-tree/edit/edit.component';
// import { AgFormCellComponent } from './foreast-parameter/view/ag-form-cell.component';
import { DelonUtilModule } from '@delon/util';
import { FormsModule } from '@angular/forms';
import { GeneratedModule } from 'app/modules/generated_module/generated.module';
import { StockPlanParametersComponent } from './stock-plan-parameters/stock-plan-parameters.component';
import { StockPlanParametersDetailComponent } from './stock-plan-parameters/detail/stock-plan-parameters-detail.component';
import { UpdateStockPlanParametersComponent } from './stock-plan-parameters/update/update-stock-plan-parameters.component';
import { StockPlanComponent } from './stock-plan/stock-plan.component';
// import { AgInnerTextComponent } from './foreast-parameter/view/ag-inner-text.component';
// import { DemandPlanDpForecastCollaborationComponent } from './dp-forecast-collaboration/dp-forecast-collaboration.component';
// import { DemandPlanDpForecastCollaborationImportComponent } from './dp-forecast-collaboration/import/import.component';
// import { DemandPlanDpForecastCollaborationEditComponent } from './dp-forecast-collaboration/edit/edit.component';
// import { DemandPlanSalesForecastComponent } from './sales-forecast/sales-forecast.component';
// import { DemandPlanSalesForecastImportComponent } from './sales-forecast/import/import.component';
// import { DemandPlanForecastRawDataComponent } from './forecast-raw-data/forecast-raw-data.component';
// import { DemandPlanMachineForecastDataComponent } from './forecast-raw-data/machine-forecast-data.component';
// import { DemandPlanMachineForecastImportComponent } from './forecast-raw-data/import/import.component';
// import { DemandPlanMachineForecastLoadMoldComponent } from './forecast-raw-data/view/load-mold.component';
// import { DemandPlanMachineLearnMoldComponent } from './forecast-raw-data/machine-learn-mold.component';
// import { DemandPlanMachineMoldExcuteComponent } from './forecast-raw-data/machine-mold-excute.component';
// import { DemandPlanMachineForecastImportExcuteComponent } from './forecast-raw-data/import/import-excute.component';

const COMPONENTS = [
  // DemandPlanForeastParameterComponent,
  // DemandPlanForecastTreeComponent,
  // DemandPlanUserrolepermissionsComponent,
  // DemandPlanUserDataPermissionsComponent,
  DemandPlanCustomerDivisionComponent,
  // DemandPlanDpForecastCollaborationComponent,
  // DemandPlanSalesForecastComponent,
  // DemandPlanForecastRawDataComponent,
  // DemandPlanMachineForecastDataComponent,
  // DemandPlanMachineLearnMoldComponent,
  // DemandPlanMachineMoldExcuteComponent
  StockPlanParametersComponent,
  StockPlanComponent,
];
const COMPONENTS_NOROUNT = [
  // DemandPlanForeastParameterEditComponent,
  // DemandPlanUserDataPermissionsEditComponent,
  // DemandPlanUserRolePermissionsEditComponent,
  // DemandPlanForeastParameterViewComponent,
  // DemandPlanForeastParameterViewComponent,
  DemandPlanCustomerDivisionEditComponent,
  // DemandPlanForecastTreeEditComponent,
  // AgFormCellComponent,
  // AgInnerTextComponent,
  // DemandPlanDpForecastCollaborationImportComponent,
  // DemandPlanDpForecastCollaborationEditComponent,
  // DemandPlanSalesForecastImportComponent,
  // DemandPlanMachineForecastImportComponent,
  // DemandPlanMachineForecastLoadMoldComponent,
  // DemandPlanMachineForecastImportExcuteComponent
  StockPlanParametersDetailComponent,
  UpdateStockPlanParametersComponent,
];

@NgModule({
  imports: [
    SharedModule,
    BaseModule,
    DemandPlanRoutingModule,
    GeneratedModule,
    FormsModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    DelonUtilModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class DemandPlanModule { }
