import { Component } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-complaint-handle',
    templateUrl: './ide-complaint-handle.component.html',
})
export class IdeComplaintHandleComponent extends CommonFlowPageContext {
  constructor() {
    super();
  }
}