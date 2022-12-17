import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreparationPlatformPurchaseregionComponent } from './purchaseregion/purchaseregion.component';
import { PreparationPlatformItemcategoryComponent } from './itemcategory/itemcategory.component';
import { PreparationPlatformSupplierComponent } from './supplier/supplier.component';
import { PreparationPlatformDlycalendarComponent } from './dlycalendar/dlycalendar.component';
import { PreparationPlatformDemandputComponent } from './demandput/demandput.component';
import { PreparationPlatformShippingNoticeHfComponent } from './shipping-notice-hf/shipping-notice-hf.component';
import { PreparationPlatformPcbuyerComponent } from './pcbuyer/pcbuyer.component';
import { PreparationPlatformUseritemcategoryComponent } from './user-item-category/useritemcategory.component';
import { PreparationPlatformNoticeQueryCancelComponent } from './notice-query-cancel/notice-query-cancel.component';
import { PreparationPlatformQueryKitStatusComponent } from './query-kit-status/query-kit-status.component';
import { PreparationPlatformSuppliercalendarComponent } from './suppliercalendar/suppliercalendar.component';
import { PreparationPlatformSuppliercontactComponent } from './suppliercontact/suppliercontact.component';
import { PreparationPlatformQueryPurchaseKitStatusComponent } from './query-purchasekitstatus/query-purchasekitstatus.component';
import { QueryKitModalRouteComponent } from './query-kit-modal-route/query-kit-modal-route.component';
import { PreparationPlatformItemcategoryView2Component } from './itemcategory/view2/view2.component';

const routes: Routes = [

  { path: 'purchaseregion', component: PreparationPlatformPurchaseregionComponent },
  { path: 'itemcategory', component: PreparationPlatformItemcategoryComponent },
  { path: 'itemcategorysource', component: PreparationPlatformItemcategoryView2Component },
  { path: 'supplier', component: PreparationPlatformSupplierComponent },
  { path: 'dlycalendar', component: PreparationPlatformDlycalendarComponent },
  { path: 'demandput', component: PreparationPlatformDemandputComponent },
  { path: 'shipping-notice-hf', component: PreparationPlatformShippingNoticeHfComponent },
  { path: 'pcbuyer', component: PreparationPlatformPcbuyerComponent },
  { path: 'useritemcategory', component: PreparationPlatformUseritemcategoryComponent },
  { path: 'querykitstatus', component: PreparationPlatformQueryKitStatusComponent },
  { path: 'notice-query-cancel', component: PreparationPlatformNoticeQueryCancelComponent },
  { path: 'suppliercalendar', component: PreparationPlatformSuppliercalendarComponent },
  { path: 'suppliercontact', component: PreparationPlatformSuppliercontactComponent },
  { path: 'query-purchasekitstatus', component: PreparationPlatformQueryPurchaseKitStatusComponent },
  { path: 'querykitstatus/query-kit-modal', component: QueryKitModalRouteComponent, data: { title: 'modal数据展示', reuse: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreparationPlatformRoutingModule { }
