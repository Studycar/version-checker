import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-sales-order',
    templateUrl: './ide-sales-order.component.html',
})
export class IdeSalesOrderComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}