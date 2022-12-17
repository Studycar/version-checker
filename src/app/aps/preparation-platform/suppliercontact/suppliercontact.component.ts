import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-suppliercontact',
  templateUrl: './suppliercontact.component.html',
})
export class PreparationPlatformSuppliercontactComponent extends CustomBaseContext implements OnInit {
  url = `/user`;
  context = this;
  mySelection: any[] = [];
  plantoptions: any[] = [];


  constructor(
    private http: _HttpClient,
    private modal: ModalHelper
  ) { super({ appTranslationSrv: null, msgSrv: null, appConfigSrv: null }); }

  public queryParams = {
    defines: [
      { field: 'txtPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } }
    ],
    values: {
      txtPlantCode: ''
    }
  };

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  plantchange(value: any) {

  }

  searchItems(value: any) {

  }

  RemoveBatch() {
    
  }

}
