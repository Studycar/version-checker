import { NgModule } from '@angular/core';

import { CustomerOrderHwRoutingModule } from './customer-order-hw-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GeneratedModule } from 'app/modules/generated_module/generated.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { PlantModelModule } from '../plant-model/plant-model.module';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { CustomerOrderEditComponent } from './customer-order/edit/edit.component';
import { CustomerOrderImportComponent } from './customer-order/import/import.component';
import { BranchCustomerOrderComponent } from './branch-customer-order/branch-customer-order.component';
import { CustomerChangeOrderComponent } from './change-order/change-order.component';
import { CustomerChangeOrderApproveComponent } from './change-order/approve/approve.component';
import { CustomerChangeOrderEditComponent } from './change-order/edit/edit.component';
import { CustomerChangeOrderImportComponent } from './change-order/import/import.component';
import { BranchCustomerOrderSortComponent } from './branch-customer-order/order-sort/order-sort.component';
import { CustomerOrderReviewComponent } from './customer-order-review/customer-order-review.component';
import { CustomerOrderReviewEditComponent } from './customer-order-review/edit/edit.component';
import { CustomerOrderReviewImportComponent } from './customer-order-review/import/import.component';
import { CustomerOrderReviewEssentialComponent } from './customer-order-review-essential/customer-order-review-essential.component';
import { CustomerOrderReviewEssentialEditComponent } from './customer-order-review-essential/edit/edit.component';
import { CustomerOrderReviewCoatingComponent } from './customer-order-review-coating/customer-order-review-coating.component';
import { CustomerOrderReviewCoatingEditComponent } from './customer-order-review-coating/edit/edit.component';
import { CustomerOrderSplitComponent } from './customer-order-split/customer-order-split.component';
import { CustomerOrderSplitEditComponent } from './customer-order-split/edit/edit.component';
import { CustomerOrderMatchingComponent } from './customer-order-matching/customer-order-matching.component';
import { CustomerOrderMatchingEditComponent } from './customer-order-matching/edit/edit.component';
import { CustomerOrderReviewCoatingImportComponent } from './customer-order-review-coating/import/import.component';
import { CustomerDemandChangeOrderComponent } from './demand-change-order/demand-change-order.component';
import { OrderToleranceEditComponent } from './order-tolerance/edit/edit.component';
import { OrderToleranceImportComponent } from './order-tolerance/import/import.component';
import { OrderToleranceComponent } from './order-tolerance/order-tolerance.component';
import { ZdzCustomerOrderEditComponent } from './zdz-customer-order/edit/edit.component';
import { ZdzCustomerOrderComponent } from './zdz-customer-order/zdz-customer-order.component';

const COMPONENTS = [
  CustomerOrderComponent,
  BranchCustomerOrderComponent,
  CustomerChangeOrderComponent,
  CustomerOrderReviewComponent,
  CustomerOrderReviewEssentialComponent,
  CustomerOrderReviewCoatingComponent,
  CustomerOrderSplitComponent,
  CustomerOrderMatchingComponent,
  CustomerDemandChangeOrderComponent,
  OrderToleranceComponent,
  ZdzCustomerOrderComponent,
];

const COMPONENTS_NOROUNT = [
  CustomerOrderEditComponent,
  CustomerOrderImportComponent,
  CustomerChangeOrderApproveComponent,
  CustomerChangeOrderEditComponent,
  CustomerChangeOrderImportComponent,
  BranchCustomerOrderSortComponent,
  CustomerOrderReviewEditComponent,
  CustomerOrderReviewImportComponent,
  CustomerOrderReviewEssentialEditComponent,
  CustomerOrderReviewCoatingEditComponent,
  CustomerOrderSplitEditComponent,
  CustomerOrderMatchingEditComponent,
  CustomerOrderReviewCoatingImportComponent,
  OrderToleranceEditComponent,
  ZdzCustomerOrderEditComponent,
  OrderToleranceImportComponent,
];

@NgModule({
  imports: [
    BaseModule,
    SharedModule,
    ExcelExportModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    GeneratedModule,
    PlantModelModule,
    CustomerOrderHwRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: [...COMPONENTS_NOROUNT]
})
export class CustomerOrderHwModule { }
