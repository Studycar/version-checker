import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { SopForeastSetService } from 'app/modules/generated_module/services/sopforeastset-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { toNumber } from '@delon/util';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforeastset-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopforeastsetEditComponent implements OnInit {
  record: any = {};
  i: any;
  plantoptions: any[] = [];
  itemoptions = [];
  readOnly: Boolean = false;
  title: String = '新增';
  typeoptions: any[] = [];
  plantCode: String;
  sourceoptions: any[] = [];
  value: number;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopForeastSetService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.Id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.GetById(this.i.Id).subscribe(res => {
        this.i = res.Extra;
      });
    } else {
      this.i.PLANT_CODE = this.appconfig.getPlantCode();
      this.plantChange(this.i.PLANT_CODE);
    }

    this.LoadData();

    this.getLimitMonth();
  }

  getLimitMonth() {
    this.commonquery.GetParameter('SOP_PERIOD', '1', '').subscribe(res => {
      this.value = Number.parseInt(res.data.PARAMETER_VALUE.toString(), 10);
    });
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantoptions.push({
          label: element1.PLANT_CODE,
          value: element1.PLANT_CODE
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_SALES_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.sourceoptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_FORECAST_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeoptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });
  }

  save() {
    if (this.i.Id === null) {
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  plantChange(value: any) {

  }

  monthChange(value: any) {
    if (value > this.value) {
      const k = '请输入不大于' + this.value.toString() + '的数字';
      this.msgSrv.warning(k);
      this.i.MONTHS = '';
    }
  }
}
