import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MixedResourceIssuedResourceIssuedPlatformComponent } from './resource-issued-platform/resource-issued-platform.component';
import { MixedResourceIssuedColorManageComponent } from './color-manage/color-manage.component';
import { MixedResourceIssuedResourceIssuedPlatformAgComponent } from './resource-issued-platform/resource-issued-platform-ag.component';
import { MixedResourceIssuedOrderBasePlatformComponent } from './order-base-platform/order-base-platform.component';

const routes: Routes = [

  { path: 'resource-issued-platform', component: MixedResourceIssuedResourceIssuedPlatformComponent },
  { path: 'resource-issued-platform-ag/:showAttribute', component: MixedResourceIssuedResourceIssuedPlatformAgComponent },
  { path: 'resource-issued-platform-ag', component: MixedResourceIssuedResourceIssuedPlatformAgComponent },
  { path: 'color-manage', component: MixedResourceIssuedColorManageComponent },
  { path: 'order-base-platform', component: MixedResourceIssuedOrderBasePlatformComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MixedResourceIssuedRoutingModule { }
