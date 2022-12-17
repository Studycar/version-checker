import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-complaint-rectify',
    templateUrl: './ide-complaint-rectify.component.html',
})
export class IdeComplaintRectifyComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}