import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { QueryService } from './queryService';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-suppliercalendar',
  templateUrl: './suppliercalendar.component.html',
  providers: [QueryService]
})
export class PreparationPlatformSuppliercalendarComponent extends CustomBaseContext implements OnInit {

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper
  ) { super({ appTranslationSrv: null, msgSrv: null, appConfigSrv: null }); }

  plantoptions: any[] = [];
  vendoroptions: any[] = [];
  mySelection: any[] = [];

  public queryParams = {
    defines: [
      { field: 'txtPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } },
      { field: 'txtVendorNumber', title: '供应商名', ui: { type: UiType.select, options: this.vendoroptions } }
    ],
    values: {
      txtPlantCode: '',
      txtVendorNumber: ''
    }
  };
  ngOnInit() { }

  add() {

  }

  clear() {
    this.queryParams.values = {
      txtPlantCode: '',
      txtVendorNumber: ''
    };
  }

  plantchange(value: any) {

  }

  searchItems(value: any) {
    
  }

}
