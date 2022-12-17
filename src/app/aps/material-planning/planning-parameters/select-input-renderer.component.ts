import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-input-renderer',
  template: `
      <nz-select [(ngModel)]="value" (ngModelChange)="onModelChange($event)" nzShowSearch style="width: 100%;">
          <nz-option *ngFor="let option of options" [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
      </nz-select>
  `,
})
export class SelectInputRendererComponent implements ICellRendererAngularComp {

  value: any;
  params: any;
  options: Array<{label: string, value: any}>;

  constructor() {
  }

  agInit(params: any): void {
    this.value = params.data[params.colDef.field];
    this.options = params.options;
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }

  onModelChange(value) {
    this.params.setValue(value);
  }
}
