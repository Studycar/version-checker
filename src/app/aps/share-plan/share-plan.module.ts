import { sharePlanOrderComponent } from './share-issued-workbench/plan-order/plan-order.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SharePlanRoutingModule } from './share-plan-routing.module';
import { SharePlanShareMergeRuleComponent } from './share-merge-rule/share-merge-rule.component';
import { SharePlanShareMergeRuleEditComponent } from './share-merge-rule/edit/edit.component';
import { SharePlanShareMergeRuleViewComponent } from './share-merge-rule/view/view.component';
import { SharePlanShareIssuedWorkbenchComponent } from './share-issued-workbench/share-issued-workbench.component';
import { ViewDetailComponent } from './share-issued-workbench/view/viewDetail.component';
import { BaseModule as MyBaseModule } from '../base/base.module';
import { BaseModule } from 'app/modules/base_module/base.module';
import { ViewComponent } from './share-issued-workbench/view/view.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { DemandOrderManagementModule } from '../demand-order-management/demand-order-management.module';

const COMPONENTS = [
  SharePlanShareMergeRuleComponent,
  SharePlanShareIssuedWorkbenchComponent];
const COMPONENTS_NOROUNT = [
  SharePlanShareMergeRuleEditComponent,
  SharePlanShareMergeRuleViewComponent,
  ViewDetailComponent,
  ViewComponent,
  sharePlanOrderComponent];

@NgModule({
  imports: [
    SharedModule,
    BaseModule,
    MyBaseModule,
    SharePlanRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    DemandOrderManagementModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  exports: [...COMPONENTS],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SharePlanModule {
}
