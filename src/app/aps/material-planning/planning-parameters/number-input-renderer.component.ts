import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'number-input-renderer',
  template: `<input nz-input type="number" [(ngModel)]="value" (ngModelChange)="onModelChange($event)" style="width: 100%; height: 34px;">`,
})
export class NumberInputRendererComponent implements ICellRendererAngularComp {

  value: number;
  params: any;

  constructor() {
  }

  agInit(params: any): void {
    this.value = params.data[params.colDef.field];
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }

  onModelChange(value) {
    this.params.setValue(value);
  }
}
