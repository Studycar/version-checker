/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2021-01-27 16:46:49
 * @LastEditors: Zwh
 * @LastEditTime: 2021-01-28 10:07:41
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { MixedResourceIssuedRoutingModule } from './mixed-resource-issued-routing.module';
import { MixedResourceIssuedResourceIssuedPlatformComponent } from './resource-issued-platform/resource-issued-platform.component';
import { MixedResourceIssuedResourceIssuedPlatformEditComponent } from './resource-issued-platform/edit/edit.component';
import { MixedResourceIssuedSearchRequestComponent } from './resource-issued-platform/search-request/search-request.component';
import { MixedResourceIssuedResourceIssuedPlatformEditColorComponent } from './resource-issued-platform/edit-color/edit-color.component';
import { MixedResourceIssuedColorManageComponent } from './color-manage/color-manage.component';
import { MixedResourceIssuedColorManageEditComponent } from './color-manage/edit/edit.component';
import { MixedResourceIssuedResourceIssuedPlatformAgComponent } from './resource-issued-platform/resource-issued-platform-ag.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { MixedResourceIssuedPlanOrderComponent } from './resource-issued-platform/plan-order/plan-order.component';
import { MixedResourceIssuedOrderBasePlatformComponent } from './order-base-platform/order-base-platform.component';
import { OrderBaseDetailComponent } from './order-base-platform/detail/detail.component';

const COMPONENTS = [
  MixedResourceIssuedResourceIssuedPlatformComponent,
  MixedResourceIssuedColorManageComponent,
  MixedResourceIssuedOrderBasePlatformComponent,
  MixedResourceIssuedResourceIssuedPlatformAgComponent];
const COMPONENTS_NOROUNT = [
  MixedResourceIssuedResourceIssuedPlatformEditComponent,
  MixedResourceIssuedSearchRequestComponent,
  MixedResourceIssuedResourceIssuedPlatformEditColorComponent,
  MixedResourceIssuedColorManageEditComponent,
  MixedResourceIssuedPlanOrderComponent,
  OrderBaseDetailComponent,
];

@NgModule({
  imports: [
    SharedModule,
    MixedResourceIssuedRoutingModule,
    BaseModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class MixedResourceIssuedModule { }
