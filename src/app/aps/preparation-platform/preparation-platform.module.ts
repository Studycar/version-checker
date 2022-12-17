///<reference path="notice-query-cancel/view/delivery-view.component.ts"/>
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { PreparationPlatformRoutingModule } from './preparation-platform-routing.module';
import { PreparationPlatformPurchaseregionComponent } from './purchaseregion/purchaseregion.component';
import { PreparationPlatformPurchaseregionEditComponent } from './purchaseregion/edit/edit.component';
import { PreparationPlatformItemcategoryComponent } from './itemcategory/itemcategory.component';
import { PreparationPlatformItemcategoryEditComponent } from './itemcategory/edit/edit.component';
import { PreparationPlatformSupplierComponent } from './supplier/supplier.component';
import { PreparationPlatformSupplierEditComponent } from './supplier/edit/edit.component';
import { PreparationPlatformPurchaseregionViewComponent } from './purchaseregion/view/view.component';
import { PreparationPlatformPurchaseregionViewEditComponent } from './purchaseregion/view-edit/view-edit.component';
import { PreparationPlatformDlycalendarComponent } from './dlycalendar/dlycalendar.component';
import { PreparationPlatformDlycalendarEditComponent } from './dlycalendar/edit/edit.component';
import { PreparationPlatformDlycalendarViewComponent } from './dlycalendar/view/view.component';
import { PreparationPlatformDemandputComponent } from './demandput/demandput.component';
import { PreparationPlatformDemandputEditComponent } from './demandput/edit/edit.component';
import { PreparationPlatformDlycalendarViewEditComponent } from './dlycalendar/view-edit/view-edit.component';
import { PreparationPlatformShippingNoticeHfComponent } from './shipping-notice-hf/shipping-notice-hf.component';
import { PreparationPlatformShippingNoticeHfPlanReleaseComponent } from './shipping-notice-hf/edit/plan-release.component';
import { PreparationPlatformShippingNoticeHfViewComponent } from './shipping-notice-hf/view/view.component';
import { PreparationPlatformShippingNoticeHfQueryComponent } from './shipping-notice-hf/view/query.component';
import { PreparationPlatformShippingNoticeHfPoLackMaterialComponent } from './shipping-notice-hf/view/po-lack-material.component';
import { PreparationPlatformPcbuyerComponent } from './pcbuyer/pcbuyer.component';
import { PreparationPlatformUseritemcategoryComponent } from './user-item-category/useritemcategory.component';
import { PreparationPlatformPcbuyerEditComponent } from './pcbuyer/edit/edit.component';
import { PreparationPlatformUserItemCategoryEditComponent } from './user-item-category/edit/edit.component';
import { PreparationPlatformNoticeQueryCancelComponent } from './notice-query-cancel/notice-query-cancel.component';
import { PreparationPlatformQueryKitStatusComponent } from './query-kit-status/query-kit-status.component';
import { PreparationPlatformWorkingMaterialComponent } from './query-kit-status/working-material/working-material.component';
import { PreparationPlatformItemDetailedComponent } from './query-kit-status/item-detailed/item-detailed.component';
import { PreparationPlatformSuppliercalendarComponent } from './suppliercalendar/suppliercalendar.component';
import { PreparationPlatformSuppliercalendarEditComponent } from './suppliercalendar/edit/edit.component';
import { PreparationPlatformSuppliercontactComponent } from './suppliercontact/suppliercontact.component';
import { PreparationPlatformSuppliercontactEditComponent } from './suppliercontact/edit/edit.component';
import { PreparationPlatformQueryPurchaseKitStatusComponent } from './query-purchasekitstatus/query-purchasekitstatus.component';
import { PreparationPlatformPurItemDetailedComponent } from './query-purchasekitstatus/item-detailed/item-detailed.component';
import { PreparationPlatformItemcategoryViewComponent } from './itemcategory/view/view.component';
import { PreparationPlatformItemcategoryViewEditComponent } from './itemcategory/view-edit/view-edit.component';
import { DemandputImportComponent } from './demandput/import/import.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PreparationPlatformItemcategoryView2Component } from './itemcategory/view2/view2.component';
import { PreparationPlatformItemcategoryView2EditComponent } from './itemcategory/view2-edit/view2-edit.component';
import { PreparationPlatformNoticeQueryCancelAnComponent } from './notice-query-cancel-an/notice-query-cancel-an.component';
import { PreparationPlatformShippingNoticeHfDataCheckComponent } from './shipping-notice-hf/view/data-check.component';
import { PreparationPlatformDeliveryViewComponent as PreparationPlatformDeliveryViewComponent2 } from './notice-query-cancel-an/view/delivery-view.component';
import { PreparationPlatformDeliveryViewComponent } from './notice-query-cancel/view/delivery-view.component';
import { QueryKitModalRouteComponent } from './query-kit-modal-route/query-kit-modal-route.component';
import { PopuSelectRequireValidatorDirective } from 'app/modules/base_module/validators/popu-select-require-validator-directive';
// import { PreparationPlatformItemcategoryView2ImportComponent } from './itemcategory/view2-import/import.component';
import { PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent } from './shipping-notice-hf/view/auto-calculate-choose.component';

const COMPONENTS = [
  PreparationPlatformPurchaseregionComponent,
  PreparationPlatformItemcategoryComponent,
  PreparationPlatformSupplierComponent,
  PreparationPlatformDlycalendarComponent,
  PreparationPlatformDemandputComponent,
  PreparationPlatformSupplierComponent,
  PreparationPlatformShippingNoticeHfComponent,
  PreparationPlatformPcbuyerComponent,
  PreparationPlatformUseritemcategoryComponent,
  PreparationPlatformNoticeQueryCancelComponent,
  PreparationPlatformQueryKitStatusComponent,
  PreparationPlatformSuppliercalendarComponent,
  PreparationPlatformSuppliercontactComponent,
  PreparationPlatformQueryPurchaseKitStatusComponent,
  PreparationPlatformDeliveryViewComponent,
  PreparationPlatformDeliveryViewComponent2,
  QueryKitModalRouteComponent,
];
const COMPONENTS_NOROUNT = [
  PreparationPlatformPurchaseregionEditComponent,
  PreparationPlatformItemcategoryEditComponent,
  PreparationPlatformSupplierEditComponent,
  PreparationPlatformPurchaseregionViewComponent,
  PreparationPlatformPurchaseregionViewEditComponent,
  PreparationPlatformDlycalendarEditComponent,
  PreparationPlatformDlycalendarViewComponent,
  PreparationPlatformDemandputEditComponent,
  PreparationPlatformDlycalendarViewEditComponent,
  PreparationPlatformShippingNoticeHfPlanReleaseComponent,
  PreparationPlatformShippingNoticeHfViewComponent,
  PreparationPlatformShippingNoticeHfQueryComponent,
  PreparationPlatformShippingNoticeHfPoLackMaterialComponent,
  PreparationPlatformPcbuyerEditComponent,
  PreparationPlatformUserItemCategoryEditComponent,
  PreparationPlatformWorkingMaterialComponent,
  PreparationPlatformItemDetailedComponent,
  PreparationPlatformSuppliercalendarEditComponent,
  PreparationPlatformSuppliercontactEditComponent,
  PreparationPlatformPurItemDetailedComponent,
  PreparationPlatformItemcategoryViewComponent,
  PreparationPlatformItemcategoryViewEditComponent,
  DemandputImportComponent,
  PreparationPlatformItemcategoryView2Component,
  PreparationPlatformItemcategoryView2EditComponent,
  PreparationPlatformNoticeQueryCancelAnComponent,
  PreparationPlatformShippingNoticeHfDataCheckComponent,
  PreparationPlatformDeliveryViewComponent,
  PreparationPlatformDeliveryViewComponent2,
  // PreparationPlatformItemcategoryView2ImportComponent,
  PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent
];

@NgModule({
  imports: [
    SharedModule,
    BaseModule,
    PreparationPlatformRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    PopuSelectRequireValidatorDirective,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PreparationPlatformModule { }
