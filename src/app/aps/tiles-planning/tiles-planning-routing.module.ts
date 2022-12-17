

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TilesPlanningPlantAreaComponent } from './plant-area/plant-area.component';
import { TilesProductDemandWorkbenchComponent } from './product-demand-workbanch/product-demand-workbanch.component';
import { PlanscheduleTilesMomanagerComponent } from './momanager/momanager.component';


const routes: Routes = [
  { path: 'plant-area', component: TilesPlanningPlantAreaComponent },
  { path: 'product-demand-workbanch', component:TilesProductDemandWorkbenchComponent},
  { path: 'tilesMomanager' ,component:PlanscheduleTilesMomanagerComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TilesPlanningRoutingModule { }

