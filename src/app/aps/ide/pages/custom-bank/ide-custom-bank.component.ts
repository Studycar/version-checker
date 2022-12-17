import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-custom-bank',
    templateUrl: './ide-custom-bank.component.html',
})
export class IdeCustomBankComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}