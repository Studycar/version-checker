import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-contract-split',
    templateUrl: './ide-contract-split.component.html',
})
export class IdeContractSplitComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}