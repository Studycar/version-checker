import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox-input-renderer',
  template: `<label nz-checkbox [(ngModel)]="value" (ngModelChange)="onModelChange($event)"></label>`,
})
export class CheckboxInputRendererComponent implements ICellRendererAngularComp {

  value: boolean;
  params: any;

  constructor() {
  }

  agInit(params: any): void {
    this.value = params.data[params.colDef.field] === 'Y';
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }

  onModelChange(value) {
    if (value) {
      this.params.setValue('Y');
    } else {
      this.params.setValue('N');
    }

  }
}
