import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-contract-cancel',
    templateUrl: './ide-contract-cancel.component.html',
})
export class IdeContractCancelComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}