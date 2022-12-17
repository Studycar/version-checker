import { NgModule } from '@angular/core';
import { GeneratedModule } from 'app/modules/generated_module/generated.module';
import { AgGridModule } from 'ag-grid-angular';

import { EnergyConstraintsRoutingModule } from './energy-constraints-routing.module';
import { SharedModule } from '@shared';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { BaseModule } from 'app/modules/base_module/base.module';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { EnergyConstraintsEnergyPriceComponent } from './energy-price/energy-price.component';
import { EnergyConstraintsEnergyPriceEditComponent } from './energy-price/edit/edit.component';
import { EnergyConstraintsItemResourceEnergyComponent } from './item-resource-energy/item-resource-energy.component';
import { EnergyConstraintsItemResourceEnergyEditComponent } from './item-resource-energy/edit/edit.component';
import { ItemResourceEnergyImportComponent } from './item-resource-energy/import/import.component';
import { EnergyPriceImportComponent } from './energy-price/import/import.component';
import { ItemResourceEnergyOptimizeComponent } from './item-resource-energy-optimize/item-resource-energy-optimize.component';
import { ItemResourceEnergyOptimizeDataRefreshComponent } from './item-resource-energy-optimize/data-refresh/data-refresh.component';

const COMPONENTS = [
  EnergyConstraintsEnergyPriceComponent,
  EnergyConstraintsItemResourceEnergyComponent,
  ItemResourceEnergyOptimizeComponent,
];

const COMPONENTS_NOROUNT = [
  EnergyConstraintsEnergyPriceEditComponent,
  EnergyConstraintsItemResourceEnergyEditComponent,
  ItemResourceEnergyImportComponent,
  EnergyPriceImportComponent,
  ItemResourceEnergyOptimizeDataRefreshComponent
];

@NgModule({
  imports: [
    SharedModule,
    EnergyConstraintsRoutingModule,
    ExcelExportModule,
    BaseModule,
    GeneratedModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class EnergyConstraintsModule { }
