import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-credit-line',
    templateUrl: './ide-credit-line.component.html',
})
export class IdeCreditLineComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}