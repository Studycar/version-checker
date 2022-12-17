import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-contract',
    templateUrl: './ide-contract.component.html',
})
export class IdeContractComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}