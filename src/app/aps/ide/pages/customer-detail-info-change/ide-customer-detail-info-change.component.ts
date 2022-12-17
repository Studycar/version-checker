import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-customer-detail-info-change',
    templateUrl: './ide-customer-detail-info-change.component.html',
})
export class IdeCustomerDetailInfoChangeComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }

  initData(): void {
    super.initData();
    const formData = {
      ...this.formData,
      businessType: 'customerDetailInfoChange'
    }
    this.setFormData(formData);
  }
}