/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 10:12:24
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { PurchaseRegionService } from '../../../../modules/generated_module/services/purchase-region-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-purchaseregion-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformPurchaseregionEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  readOnly: Boolean = false;
  plantoptions: any[] = [];
  suboptions: any[] = [];
  typeoptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private dataService: PurchaseRegionService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) {}

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.title = '编辑';
      this.dataService.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
      });
      this.readOnly = true;
    } else {
      this.readOnly = false;
      this.i.plantCode = this.appconfig.getPlantCode();
      this.i.enableFalg = 'Y';
    }

    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    /*this.dataService.GetSubInv().subscribe(res => {
      res.Extra.forEach(element => {
        this.suboptions.push({
          label: element.WAREHOUSE_CODE,
          value: element.WAREHOUSE_CODE
        });
      });
    });*/

    this.commonquery.GetLookupByTypeNew('FND_DEL_REGION_TYPE').subscribe(res => {
      res.data.forEach(element => {
        this.typeoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  save() {
    this.dataService.saveData(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    this.i = this.iClone;
    this.iClone = Object.assign({}, this.i);
  }

  /*subChange(value: any) {
    this.i.WAREHOUSE_TYPE = '';
    this.i.DEFAULT_WAREHOUSE_FLAG = '';
    this.dataService.GetType(this.i.WAREHOUSE_CODE).subscribe(res => {
      this.i.WAREHOUSE_TYPE = res.Extra.WAREHOUSE_TYPE === null ? '' : res.Extra.WAREHOUSE_TYPE;
      this.i.DEFAULT_WAREHOUSE_FLAG = res.Extra.DEFAULT_WAREHOUSE_FLAG === null ? '' : res.Extra.DEFAULT_WAREHOUSE_FLAG;
    });
  }*/
}
