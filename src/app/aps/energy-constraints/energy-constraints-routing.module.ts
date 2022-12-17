import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnergyConstraintsEnergyPriceComponent } from './energy-price/energy-price.component';
import { ItemResourceEnergyOptimizeComponent } from './item-resource-energy-optimize/item-resource-energy-optimize.component';
import { EnergyConstraintsItemResourceEnergyComponent } from './item-resource-energy/item-resource-energy.component';


const routes: Routes = [
  { path: 'energy-price', component: EnergyConstraintsEnergyPriceComponent },
  { path: 'item-resource-energy', component: EnergyConstraintsItemResourceEnergyComponent },
  { path: 'item-resource-energy-optimize', component: ItemResourceEnergyOptimizeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnergyConstraintsRoutingModule { }
