import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'request-submit-query- status',
  template: `
    <nz-tag *ngIf="!isRuning" [nzColor]="sColor">{{sText}}</nz-tag>
    <nz-progress *ngIf="isRuning" [nzPercent]="value" nzStatus="active"></nz-progress>
    `,
  styles: [
    ``
  ]
})
export class RequestSubmitQueryStatusComponent implements ICellRendererAngularComp {
  sColor = 'green';
  sText = '正常';
  isRuning = false;
  value = 0;
  data = null;

  agInit(params: any): void {
    this.update(params);
  }

  refresh(params: any): boolean {
    this.update(params);
    console.log('refresh');
    return true;
  }

  update(params: any) {
    this.data = params.data;
    const code = params.data.statusCode;
    this.sText = params.data.statusName;
    if (code === 'R') {
      this.sColor = '#108ee9';
      this.value = params.value;
      if (this.value > 0) {
        this.isRuning = true;
      } else {
        this.isRuning = false;
      }
    } else if (code === 'I' || code === 'P') {
      if (code === 'Y') {
        this.sColor = 'green';
        this.isRuning = false;
      } else {
        this.sColor = 'orange';
        this.isRuning = false;
      }
    } else if (code === 'E') {
      this.sColor = 'red';
      this.isRuning = false;
    } else if (code === 'W') {
      this.sColor = 'orange';
      this.isRuning = false;
    } else if (code === 'D') {
      this.sColor = 'gray';
      this.isRuning = false;
    } else if (code === 'C') {
      this.sColor = 'green';
      this.isRuning = false;
    }
  }
}
