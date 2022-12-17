/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-07 11:26:09
 * @LastEditors: Zwh
 * @LastEditTime: 2020-09-29 19:40:50
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SopDimmainresrevVewService } from 'app/modules/generated_module/services/sopdimmainresreview-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopdimmainresreview-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopdimmainresreviewEditComponent implements OnInit {

  record: any = {};
  i: any;
  plantoptions: any[] = [];
  itemoptions = [];
  readOnly: Boolean = false;
  title: String = '新增';
  typeoptions: any[] = [];
  yesOrNo: any[] = [];
  plantCode: String;
  groupoptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopDimmainresrevVewService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.Id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.GetById(this.i.Id).subscribe(res => {
        this.plantChange(res.data.plantCode);
        this.i = res.data;
      });
    } else {
      this.i.enableFlag = 'Y';
      this.i.plantCode = this.appconfig.getPlantCode();
      this.plantChange(this.i.plantCode);
    }

    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantoptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_RESOURCE_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.yesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });
  }

  save() {
    if (this.i.Id === null) {
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  plantChange(value: any) {
    this.i.scheduleGroupCode = null;
    this.groupoptions.length = 0;
    this.dataservice.GetGroup(value).subscribe(res => {
      res.data.forEach(element => {
        this.groupoptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

}
