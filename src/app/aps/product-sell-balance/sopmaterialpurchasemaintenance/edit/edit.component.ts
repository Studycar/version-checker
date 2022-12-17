/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-08 09:02:35
 * @LastEditors: Zwh
 * @LastEditTime: 2019-02-14 14:47:02
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SopMaterialPurchaseMaintenanceService } from 'app/modules/generated_module/services/sopmaterialpurchasemaintenance-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialpurchasemaintenance-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent implements OnInit {
  record: any = {};
  i: any;
  plantoptions: any[] = [];
  itemoptions = [];
  readOnly: Boolean = false;
  title: String = '新增';
  typeoptions: any[] = [];
  yesOrNo: any[] = [];
  plantCode: String;


  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopMaterialPurchaseMaintenanceService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.getById(this.i.id).subscribe(res => {
        this.itemoptions.push(res.data.itemCode);
        this.i = res.data;
      });
    }

    this.LoadData();
  }


  LoadData() {

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element1 => {
        this.plantoptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });
  }

  save() {
    this.dataservice.update(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('修改成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

}
