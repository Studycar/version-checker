/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-22 14:12:16
 * @LastEditors: Zwh
 * @LastEditTime: 2019-08-22 15:08:40
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DemandPlanForeastParameterComponent } from './foreast-parameter/foreast-parameter.component';
// import { DemandPlanUserrolepermissionsComponent } from './user-role-permissions/user-role-permissions.component';
// import { DemandPlanUserDataPermissionsComponent } from './user-data-permissions/user-data-permissions.component';
import { DemandPlanCustomerDivisionComponent } from './customer-division/customer-division.component';
// import { DemandPlanForecastTreeComponent } from './forecast-tree/forecast-tree.component';
// import { DemandPlanDpForecastCollaborationComponent } from './dp-forecast-collaboration/dp-forecast-collaboration.component';
// import { DemandPlanSalesForecastComponent } from './sales-forecast/sales-forecast.component';
// import { DemandPlanForecastRawDataComponent } from './forecast-raw-data/forecast-raw-data.component';
// import { DemandPlanMachineForecastDataComponent } from './forecast-raw-data/machine-forecast-data.component';
// import { DemandPlanMachineLearnMoldComponent } from './forecast-raw-data/machine-learn-mold.component';
// import { DemandPlanMachineMoldExcuteComponent } from './forecast-raw-data/machine-mold-excute.component';
import { StockPlanParametersComponent } from './stock-plan-parameters/stock-plan-parameters.component';
import { StockPlanComponent } from './stock-plan/stock-plan.component';

const routes: Routes = [

  // { path: 'foreastParameter', component: DemandPlanForeastParameterComponent },
  // { path: 'forecastTree', component: DemandPlanForecastTreeComponent },
  // { path: 'userRolePermissions', component: DemandPlanUserrolepermissionsComponent },
  // { path: 'userDataPermissions', component: DemandPlanUserDataPermissionsComponent },
  { path: 'customerDivision', component: DemandPlanCustomerDivisionComponent },
  // { path: 'dpForecastCollaboration', component: DemandPlanDpForecastCollaborationComponent },
  // { path: 'salesForecast', component: DemandPlanSalesForecastComponent },
  // { path: 'forecastRawData', component: DemandPlanForecastRawDataComponent},
  // { path: 'machineForecastData', component: DemandPlanMachineForecastDataComponent},
  // { path: 'machineLearnMold', component: DemandPlanMachineLearnMoldComponent},
  // { path: 'machineMoldExcute', component: DemandPlanMachineMoldExcuteComponent},
  { path: 'stock-plan-parameters', component: StockPlanParametersComponent},
  { path: 'stock-plan', component: StockPlanComponent},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandPlanRoutingModule { }
