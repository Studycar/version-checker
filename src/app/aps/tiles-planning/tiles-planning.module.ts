import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { BaseModule } from '../../modules/base_module/base.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { TilesPlanningRoutingModule } from './tiles-planning-routing.module';
import { TilesPlanningPlantAreaComponent } from './plant-area/plant-area.component';
import { TilesPlanningPlantAreaEditComponent } from './plant-area/edit/edit.component';
import { TilesProductDemandWorkbenchComponent } from './product-demand-workbanch/product-demand-workbanch.component';
import { PlanscheduleTilesMomanagerComponent } from './momanager/momanager.component';
import { TilesShowDetailComponent } from './product-demand-workbanch/show-detail/show-detail.component';
import { TilesPlanscheduleMomanagerEditComponent } from './momanager/edit/edit.component';
import { TilesPlanscheduleMomanagerOpenComponent } from './momanager/open/open.component';
import { TilesDetailComponent } from './momanager/detail/detail.component';
const COMPONENTS = [
  TilesPlanningPlantAreaComponent
];
const COMPONENTS_NOROUNT = [
  TilesPlanningPlantAreaEditComponent,
  TilesProductDemandWorkbenchComponent,
  PlanscheduleTilesMomanagerComponent,
  TilesShowDetailComponent,
  TilesPlanscheduleMomanagerEditComponent,
  TilesPlanscheduleMomanagerOpenComponent,
  TilesDetailComponent,
];

@NgModule({
  imports: [SharedModule, TilesPlanningRoutingModule, ExcelExportModule, BaseModule, GeneratedModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class TilesPlanningModule {
}

