import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-refund-claim',
    templateUrl: './ide-refund-claim.component.html',
})
export class IdeRefundClaimComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}