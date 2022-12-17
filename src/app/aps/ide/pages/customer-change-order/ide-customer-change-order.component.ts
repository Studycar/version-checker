import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-customer-change-order',
    templateUrl: './ide-customer-change-order.component.html',
})
export class IdeCustomerChangeOrderComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}