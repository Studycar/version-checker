import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchCustomerOrderComponent } from './branch-customer-order/branch-customer-order.component';
import { CustomerChangeOrderComponent } from './change-order/change-order.component';
import { CustomerOrderMatchingComponent } from './customer-order-matching/customer-order-matching.component';
import { CustomerOrderReviewCoatingComponent } from './customer-order-review-coating/customer-order-review-coating.component';
import { CustomerOrderReviewEssentialComponent } from './customer-order-review-essential/customer-order-review-essential.component';
import { CustomerOrderReviewComponent } from './customer-order-review/customer-order-review.component';
import { CustomerOrderSplitComponent } from './customer-order-split/customer-order-split.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { CustomerDemandChangeOrderComponent } from './demand-change-order/demand-change-order.component';
import { OrderToleranceComponent } from './order-tolerance/order-tolerance.component';
import { ZdzCustomerOrderComponent } from './zdz-customer-order/zdz-customer-order.component';


const routes: Routes = [
  { path: 'customer-order', component: CustomerOrderComponent },
  { path: 'branch-customer-order', component: BranchCustomerOrderComponent },
  { path: 'customer-change-order', component: CustomerChangeOrderComponent },
  { path: 'customer-demand-change-order', component: CustomerDemandChangeOrderComponent },
  { path: 'customer-order-review', component: CustomerOrderReviewComponent },
  { path: 'customer-order-review-essential', component: CustomerOrderReviewEssentialComponent },
  { path: 'customer-order-review-coating', component: CustomerOrderReviewCoatingComponent },
  { path: 'customer-order-split', component: CustomerOrderSplitComponent },
  { path: 'customer-order-matching', component: CustomerOrderMatchingComponent },
  { path: 'order-tolerance', component: OrderToleranceComponent },
  { path: 'zdz-customer-order', component: ZdzCustomerOrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOrderHwRoutingModule { }
