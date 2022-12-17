import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharePlanShareMergeRuleComponent } from './share-merge-rule/share-merge-rule.component';
import { SharePlanShareIssuedWorkbenchComponent } from './share-issued-workbench/share-issued-workbench.component';

const routes: Routes = [

  { path: 'share-merge-rule', component: SharePlanShareMergeRuleComponent },
  { path: 'share-issued-workbench/:showAttribute', component: SharePlanShareIssuedWorkbenchComponent },
  { path: 'share-issued-workbench', component: SharePlanShareIssuedWorkbenchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharePlanRoutingModule { }
