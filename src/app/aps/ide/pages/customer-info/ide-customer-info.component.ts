import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-customer-info',
    templateUrl: './ide-customer-info.component.html',
})
export class IdeCustomerInfoComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }

  initData(): void {
    super.initData();
    const formData = {
      ...this.formData,
      businessType: 'customerInfo'
    }
    this.setFormData(formData);
  }
}