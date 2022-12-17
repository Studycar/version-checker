import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { GeneticRoutingModule } from './genetic-routing.module';
import { GeneticBalanceScoringParaSetComponent } from './balance-scoring-para-set/balance-scoring-para-set.component';
import { GeneticBalanceScoringParaSetEditComponent } from './balance-scoring-para-set/edit/edit.component';
import { GeneticBalanceScoringParaSetViewComponent } from './balance-scoring-para-set/view/view.component';
import { BaseModule as MyBaseModule } from '../base/base.module';
import { BaseModule } from 'app/modules/base_module/base.module';
import { SharePlanRoutingModule } from 'app/aps/share-plan/share-plan-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
// import { SharePlanShareIssuedWorkbenchComponent } from 'app/aps/share-plan/share-issued-workbench/share-issued-workbench.component';
// import { SharePlanShareMergeRuleComponent } from 'app/aps/share-plan/share-merge-rule/share-merge-rule.component';
import { GeneticPlanProductionComponent } from './plan-production/plan-production.component';
import { GeneticPlanProductionEditComponent } from './plan-production/edit/edit.component';
import { GeneticPlanProductionViewComponent } from './plan-production/view/view.component';
import { SharePlanModule } from '../share-plan/share-plan.module';

const COMPONENTS = [
  GeneticBalanceScoringParaSetComponent,
  /*SharePlanShareMergeRuleComponent,
  SharePlanShareIssuedWorkbenchComponent,*/
  GeneticPlanProductionComponent];
const COMPONENTS_NOROUNT = [
  GeneticBalanceScoringParaSetEditComponent,
  GeneticBalanceScoringParaSetViewComponent,
  GeneticPlanProductionEditComponent,
  GeneticPlanProductionViewComponent];

@NgModule({
  imports: [
    SharePlanModule,
    SharedModule,
    GeneticRoutingModule,
    BaseModule,
    MyBaseModule,
    SharePlanRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class GeneticModule { }
