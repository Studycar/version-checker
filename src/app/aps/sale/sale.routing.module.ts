import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttachInfoComponent } from './attachInfo/attachInfo.component';
import { ContractTemplateComponent } from './contract-template/contract-template.component';
import { CustomerComplaintComponent } from './customer-complaint/customer-complaint.component';
import { CustomerReturnComponent } from './customer-return/customer-return.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { DeliveredOrderComponent } from './delivered-order/delivered-order.component';
import { DeliveryOrderDetailPageComponent } from './delivery-order-detail-page/delivery-order-detail-page.component';
import { DeliveredOrderDetailPageComponent } from './delivered-order-detail-page/delivered-order-detail-page.component';
import { DistributionOrderRuleComponent } from './distribution-order-rule/distribution-order-rule.component';
import { InvoiceOrderComponent } from './invoice-order/invoice-order.component';
import { RequisitionNoteComponent } from './requisition-note/requisition-note.component';
import { SalesDistDetailedComponent } from './sales-dist-detailed/sales-dist-detailed.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { TransferOrderDetailComponent } from './transfer-order/detail/detail.component';
import { TransferOrderComponent } from './transfer-order/transfer-order.component';
import { UserProductCategoryComponent } from './user-product-category/user-product-category.component';
import { RefundClaimComponent } from './refund-claim/refund-claim.component';
import { PendingDeliveryOrderComponent } from './pending-delivery-order/pending-delivery-order.component';
import { SalesCurContractComponent } from './sales-cur-contract/sales-cur-contract.component';
import { SalesCurContractDetailComponent } from './sales-cur-contract-detail/sales-cur-contract-detail.component';
import { baseToPdfComponent } from './base-to-pdf/base-to-pdf.component';
import { PricingSimulatorComponent } from './pricing-simulator/pricing-simulator.component';

const routes: Routes = [
  { path: 'attachInfo', component: AttachInfoComponent },
  { path: 'contractTemplate', component: ContractTemplateComponent },
  { path: 'salesOrder', component: SalesOrderComponent },
  { path: 'invoiceOrder', component: InvoiceOrderComponent },
  { path: 'transferOrder', component: TransferOrderComponent },
  { path: 'transferOrderDetail', component: TransferOrderDetailComponent },
  { path: 'distributionOrderRule', component: DistributionOrderRuleComponent },
  { path: 'requisitionNote', component: RequisitionNoteComponent },
  { path: 'deliveryOrder', component: DeliveryOrderComponent },
  { path: 'deliveredOrder', component: DeliveredOrderComponent },
  { path: 'deliveryOrderDetail', component: DeliveryOrderDetailPageComponent },
  { path: 'deliveredOrderDetail', component: DeliveredOrderDetailPageComponent },
  { path: 'customerComplaint', component: CustomerComplaintComponent },
  { path: 'customerComplaintResolve', component: CustomerComplaintComponent, data: { isResolve: true } },
  { path: 'customerReturn', component: CustomerReturnComponent },
  { path: 'salesDistDetailed', component: SalesDistDetailedComponent, data: { isNotDistributed: true } },
  { path: 'salesDistDetailedCurr', component: SalesDistDetailedComponent, data: { isCurrent: true } },
  { path: 'salesDistDetailedDist', component: SalesDistDetailedComponent, data: { isDistributed: true } },
  { path: 'salesDistDetailedBilled', component: SalesDistDetailedComponent, data: { isBilled: true } },
  { path: 'userProductCategory', component: UserProductCategoryComponent },
  { path: 'refundClaim', component: RefundClaimComponent },
  { path: 'salesCurContract', component: SalesCurContractComponent },
  { path: 'salesCurContractDetail', component: SalesCurContractDetailComponent },
  { path: 'pendingDeliveryOrder', component: PendingDeliveryOrderComponent },
  { path: 'baseToPdf', component: baseToPdfComponent },
  { path: 'pricingSimulator', component: PricingSimulatorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
