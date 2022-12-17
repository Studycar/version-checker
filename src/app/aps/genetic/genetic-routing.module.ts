import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneticBalanceScoringParaSetComponent } from './balance-scoring-para-set/balance-scoring-para-set.component';
import { GeneticPlanProductionComponent } from './plan-production/plan-production.component';

const routes: Routes = [

  { path: 'balance-scoring-para-set', component: GeneticBalanceScoringParaSetComponent },
  { path: 'plan-production', component: GeneticPlanProductionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneticRoutingModule { }
