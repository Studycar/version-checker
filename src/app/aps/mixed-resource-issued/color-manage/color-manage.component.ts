import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { ColorManageService } from './edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mixed-resource-issued-color-manage',
  templateUrl: './color-manage.component.html',
  providers: [ColorManageService],
})
export class MixedResourceIssuedColorManageComponent implements OnInit {

  // 测试是否能绑定数据，绑定控件， 返回控件设置的颜色等
  public kendoHeight = document.body.clientHeight - 295;

  expandForm = false;

  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50,
  };

  public mySelection: any[] = [];
  applications: any[] = [];

  dataSet = [];

  constructor(
    public http: _HttpClient,
    private formBuilder: FormBuilder,
    public editService: ColorManageService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  i: any = [];

  public query() {

    this.editService.read(this.i);
  }


  removeBath() {

  }

  // 列头排序
  public onStateChange(state: State) {
    this.gridState = state;
    console.log(state);
    this.editService.read();
  }

  ngOnInit() {
    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
  }

  public loadType(): void {
    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      this.dataSet = result.Extra;
    });
  }

  save() {
    // 整体获取  修改后的GRIDLVIEW  
    this.view.forEach(d => {
      d.data.forEach(O => {
         //  可以获取到修改后的值，  。。。。
        const type1 = O.LOOKUP_CODE;
      });
    });

    
  }

  close() {
    this.modal.destroy();
  }


}
