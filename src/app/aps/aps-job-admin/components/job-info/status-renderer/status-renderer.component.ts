import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'status-renderer',
  templateUrl: './status-renderer.component.html',
  styleUrls: ['./status-renderer.component.css'],
})
export class StatusRendererComponent implements ICellRendererAngularComp {
  status = 0;
  statusArr: { text: string, color: string }[] = [
    { text: 'STOP', color: '' },
    { text: 'START', color: 'green' },
  ];
  params: any;

  agInit(params: any): void {
    this.params = params;
    this.status = params.value;
  }

  refresh(): boolean {
    return false;
  }

}
