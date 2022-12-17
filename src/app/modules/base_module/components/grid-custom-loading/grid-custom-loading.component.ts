import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, INoRowsOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'grid-custom-loading',
  templateUrl: './grid-custom-loading.component.html',
  styleUrls: ['./grid-custom-loading.component.css']
})
export class GridCustomLoadingComponent implements INoRowsOverlayAngularComp  {

  constructor() { }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  agInit(params: INoRowsOverlayParams): void {
  }

}
