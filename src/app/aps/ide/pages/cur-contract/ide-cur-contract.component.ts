import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-cur-contract',
    templateUrl: './ide-cur-contract.component.html',
})
export class IdeCurContractComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}