import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'registry-list-renderer',
  templateUrl: './registry-list-renderer.component.html',
  styleUrls: ['./registry-list-renderer.component.css'],
})
export class RegistryListRendererComponent implements ICellRendererAngularComp {
  params: any;
  registryList: any[] | null;

  agInit(params: any): void {
    this.params = params;
    if (params.data.registryList && params.data.registryList.length) {
      this.registryList = params.data.registryList;
    } else {
      this.registryList = null;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

}
