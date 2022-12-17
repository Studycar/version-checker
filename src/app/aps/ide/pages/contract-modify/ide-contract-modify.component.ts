import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-contract-modify',
    templateUrl: './ide-contract-modify.component.html',
})
export class IdeContractModifyComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}