import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanscheduleHWContractWasteComponent } from './contract-hw/contract.component';
import { InvoiceOrderWasteComponent } from './invoice-order/invoice-order.component';
import { SalesOrderWasteComponent } from './sales-order/sales-order.component';

const routes: Routes = [
  { path: 'contract', component: PlanscheduleHWContractWasteComponent },
  { path: 'salesOrder', component: SalesOrderWasteComponent },
  { path: 'invoiceOrder', component: InvoiceOrderWasteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WasteSaleRoutingModule { }
