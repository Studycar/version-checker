import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-customer-info-change',
    templateUrl: './ide-customer-info-change.component.html',
})
export class IdeCustomerInfoChangeComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }

  initData(): void {
    super.initData();
    const formData = {
      ...this.formData,
      businessType: 'customerInfoChange'
    }
    this.setFormData(formData);
  }
}