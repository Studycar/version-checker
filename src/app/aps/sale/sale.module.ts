import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { BaseModule } from 'app/modules/base_module/base.module';
import { FormsModule } from '@angular/forms';
import { CustomOperateCellRenderComponent } from '../../modules/base_module/components/custom-operatecell-render.component';
import { AgGridModule } from 'ag-grid-angular';

import {AttachInfoComponent} from './attachInfo/attachInfo.component';
import {SaleRoutingModule} from './sale.routing.module';
import {AttachInfoEditComponent} from './contract-template/edit/edit.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesOrderImportComponent } from './sales-order/import/import.component';
import { SalesOrderDetailComponent } from './sales-order/detail/detail.component';
import { SalesOrderDetailEditComponent } from './sales-order/detail/edit/edit.component';
import { SalesOrderDetailSpecialPriceComponent } from './sales-order/detail/special-price/special-price.component';
import { SalesOrderDetailHighPriceComponent } from './sales-order/detail/high-price/high-price.component';
import { InvoiceOrderComponent } from './invoice-order/invoice-order.component';
import { InvoiceOrderDetailComponent } from './invoice-order/detail/detail.component';
import { TransferOrderComponent } from './transfer-order/transfer-order.component';
import { TransferOrderEditComponent } from './transfer-order/edit/edit.component';
import { TransferOrderDetailComponent } from './transfer-order/detail/detail.component';
import { TransferOrderDetailEditComponent } from './transfer-order/detail/edit/edit.component';
import { SalesOrderEditComponent } from './sales-order/edit/edit.component';
import { InvoiceOrderEditComponent } from './invoice-order/edit/edit.component';
import { InvoiceOrderDetailedEditComponent } from './invoice-order/detail/edit/edit.component';
import { DistributionOrderRuleComponent } from './distribution-order-rule/distribution-order-rule.component';
import { DistributionOrderRuleEditComponent } from './distribution-order-rule/edit/edit.component';
import { RequisitionNoteComponent } from './requisition-note/requisition-note.component';
import { RequisitionNoteEditComponent } from './requisition-note/edit/edit.component';
import { RequisitionNoteDetailComponent } from './requisition-note/detail/detail.component';
import { RequisitionNoteDetailedEditComponent } from './requisition-note/detail/edit/edit.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { DeliveryOrderImportComponent } from './delivery-order/import/import.component';
import { DeliveryOrderEditComponent } from './delivery-order/edit/edit.component';
import { DeliveryOrderDetailComponent } from './delivery-order/detail/detail.component';
import { DeliveryOrderDetailEditComponent } from './delivery-order/detail/edit/edit.component';
import { DeliveryOrderDetailPageComponent } from './delivery-order-detail-page/delivery-order-detail-page.component';
import { DeliveredOrderComponent } from './delivered-order/delivered-order.component';
import { DeliveredOrderDetailPageComponent } from './delivered-order-detail-page/delivered-order-detail-page.component';
import { CustomerComplaintComponent } from './customer-complaint/customer-complaint.component';
import { CustomerComplaintEditComponent } from './customer-complaint/edit/edit.component';
import { CustomerComplaintDetailComponent } from './customer-complaint/detail/detail.component';
import { CustomerComplaintDetailEditComponent } from './customer-complaint/detail/edit/edit.component';
import { CustomerComplaintDetailRectifyComponent } from './customer-complaint/detail/rectify/rectify.component';
import { CustomerReturnComponent } from './customer-return/customer-return.component';
import { CustomerReturnEditComponent } from './customer-return/edit/edit.component';
import { CustomerReturnDetailComponent } from './customer-return/detail/detail.component';
import { CustomerReturnDetailEditComponent } from './customer-return/detail/edit/edit.component';
import { CustomerComplaintDetailAnnexComponent } from './customer-complaint/detail/fileList/fileList.component';
import { ContractTemplateComponent } from './contract-template/contract-template.component';
import { SalesDistDetailedComponent } from './sales-dist-detailed/sales-dist-detailed.component';
import { SalesDistDetailedEditComponent } from './sales-dist-detailed/edit/edit.component';
import { SalesDistDetailedImportComponent } from './sales-dist-detailed/import/import.component';
import { InvoiceOrderImportComponent } from './invoice-order/import/import.component';
import { CustomerComplaintImportComponent } from './customer-complaint/import/import.component';
import { DistributionOrderRuleImportComponent } from './distribution-order-rule/import/import.component';
import { UserProductCategoryComponent } from './user-product-category/user-product-category.component';
import { UserProductCategoryEditComponent } from './user-product-category/edit/edit.component';
import { RefundClaimComponent } from './refund-claim/refund-claim.component';
import { RefundClaimEditComponent } from './refund-claim/edit/edit.component';
import { SalesDistDetailedContractEditComponent } from './sales-dist-detailed/edit-contract/edit.component';
import { PendingDeliveryOrderComponent } from './pending-delivery-order/pending-delivery-order.component';
import { PendingDeliveryOrderEditComponent } from './pending-delivery-order/edit/edit.component';
import { AddContractComponent } from './sales-dist-detailed/add-contract/add-contract.component';
import { SalesCurContractComponent } from './sales-cur-contract/sales-cur-contract.component';
import { SalesCurContractDetailComponent } from './sales-cur-contract-detail/sales-cur-contract-detail.component';
import { baseToPdfComponent } from './base-to-pdf/base-to-pdf.component';
import { PricingSimulatorComponent } from './pricing-simulator/pricing-simulator.component';
import { PendingDeliveryOrderImportComponent } from './pending-delivery-order/import/import.component';

const COMPONENTS = [
  AttachInfoComponent,
  ContractTemplateComponent,
  SalesOrderComponent,
  InvoiceOrderComponent,
  TransferOrderComponent,
  DistributionOrderRuleComponent,
  RequisitionNoteComponent,
  DeliveryOrderComponent,
  DeliveredOrderComponent,
  DeliveryOrderDetailPageComponent,
  DeliveredOrderDetailPageComponent,
  CustomerComplaintComponent,
  CustomerReturnComponent,
  SalesDistDetailedComponent,
  UserProductCategoryComponent,
  PendingDeliveryOrderComponent,
  SalesCurContractComponent,
  SalesCurContractDetailComponent,
  baseToPdfComponent,
  PricingSimulatorComponent,
  RefundClaimComponent
];
const COMPONENTS_NOROUNT = [
  AttachInfoEditComponent,
  SalesOrderImportComponent,
  SalesOrderDetailComponent,
  SalesOrderEditComponent,
  SalesOrderDetailEditComponent,
  SalesOrderDetailSpecialPriceComponent,
  SalesOrderDetailHighPriceComponent,
  InvoiceOrderEditComponent,
  InvoiceOrderImportComponent,
  InvoiceOrderDetailComponent,
  InvoiceOrderDetailedEditComponent,
  TransferOrderEditComponent,
  TransferOrderDetailComponent,
  TransferOrderDetailEditComponent,
  DistributionOrderRuleEditComponent,
  RequisitionNoteEditComponent,
  RequisitionNoteDetailComponent,
  RequisitionNoteDetailedEditComponent,
  DeliveryOrderImportComponent,
  DeliveryOrderEditComponent,
  DeliveryOrderDetailComponent,
  DeliveryOrderDetailEditComponent,
  CustomerComplaintEditComponent,
  CustomerComplaintImportComponent,
  CustomerComplaintDetailComponent,
  CustomerComplaintDetailEditComponent,
  CustomerComplaintDetailRectifyComponent,
  CustomerReturnEditComponent,
  CustomerReturnDetailComponent,
  CustomerReturnDetailEditComponent,
  CustomerComplaintDetailAnnexComponent,
  SalesDistDetailedEditComponent,
  SalesDistDetailedImportComponent,
  DistributionOrderRuleImportComponent,
  UserProductCategoryEditComponent,
  SalesDistDetailedContractEditComponent,
  PendingDeliveryOrderEditComponent,
  PendingDeliveryOrderImportComponent,
  AddContractComponent,
  RefundClaimEditComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    FormsModule,
    SaleRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  exports: [...COMPONENTS],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SaleModule { }
