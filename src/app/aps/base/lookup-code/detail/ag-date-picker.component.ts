import { Component } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'layout-ag-date-picker',
  template: `
    <nz-date-picker nzShowTime [(ngModel)]="date" [nzSize]="'small'" [nzStyle]="{width:'100%'}"></nz-date-picker>
  `,
})
export class AgDatePickerComponent {
  date: Date;

  agInit(params) {
    this.date = params.value ? new Date(params.value) : new Date();
  }

  getValue(): any {
    return this.date ? formatDate(this.date, 'yyyy-MM-dd HH:mm:ss', 'zh-cn') : this.date;
  }
}
