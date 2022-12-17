import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { BaseModule } from 'app/modules/base_module/base.module';
import { FormsModule } from '@angular/forms';
import { CustomOperateCellRenderComponent } from '../../modules/base_module/components/custom-operatecell-render.component';
import { AgGridModule } from 'ag-grid-angular';

import { WasteSaleRoutingModule } from './waste-sale-routing.module';
import { PlanscheduleHWContractWasteComponent } from './contract-hw/contract.component';
import { SalesOrderWasteComponent } from './sales-order/sales-order.component';
import { SalesOrderEditWasteComponent } from './sales-order/edit/edit.component';
import { SalesOrderDetailEditWasteComponent } from './sales-order/detail/edit/edit.component';
import { SalesOrderDetailWasteComponent } from './sales-order/detail/detail.component';
import { SalesOrderImportWasteComponent } from './sales-order/import/import.component';
import { SalesOrderDetailSpecialPriceWasteComponent } from './sales-order/detail/special-price/special-price.component';
import { InvoiceOrderDetailWasteComponent } from './invoice-order/detail/detail.component';
import { InvoiceOrderDetailedEditWasteComponent } from './invoice-order/detail/edit/edit.component';
import { InvoiceOrderEditWasteComponent } from './invoice-order/edit/edit.component';
import { InvoiceOrderImportWasteComponent } from './invoice-order/import/import.component';
import { InvoiceOrderWasteComponent } from './invoice-order/invoice-order.component';
import { WasteSaleService } from './waste-sale.service';

const COMPONENTS = [
  PlanscheduleHWContractWasteComponent,
  SalesOrderWasteComponent,
  InvoiceOrderWasteComponent,
];

const COMPONENTS_NOROUNT = [
  SalesOrderEditWasteComponent,
  SalesOrderDetailWasteComponent,
  SalesOrderDetailEditWasteComponent,
  SalesOrderImportWasteComponent,
  SalesOrderDetailSpecialPriceWasteComponent,
  InvoiceOrderEditWasteComponent,
  InvoiceOrderDetailWasteComponent,
  InvoiceOrderDetailedEditWasteComponent,
  InvoiceOrderImportWasteComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    FormsModule,
    WasteSaleRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  exports: [...COMPONENTS],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [WasteSaleService]
})
export class WasteSaleModule { }
