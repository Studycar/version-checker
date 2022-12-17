/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-09-20 10:05:21
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-20 16:20:51
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsMouldManageService } from 'app/modules/generated_module/services/psmould.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-psmould-manager-edit',
  templateUrl: './edit.component.html',
})

export class SopPsMouldManagerEditComponent implements OnInit {
  i: any;
  iClone: any;
  isLoading = false;
  readOnly: Boolean = false;
  title: String = '新增';
  yesOrNo: any[] = [];
  plantOptions: any[] = [];
  groupOptions: any[] = [];
  resourceOptions: any[] = [];
  statusOptions: any[] = [];
  mouldGroupOptions: any[] = []; // 模具组

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private dataservice: PsMouldManageService
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.LoadData();

    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.Get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.plantCode = this.appconfig.getPlantCode();
      this.i.enableFlag = 'Y';
    }
    this.isLoading = false;
  }

  LoadData() {

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.yesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('PS_MOULD_STATUS', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.statusOptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(result => {
      console.log("-----------------------",result);
      this.plantOptions = result.Extra;
    });

  }

  save() {
    this.dataservice.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  plantChange(event){}

  close() {
    this.modal.destroy();
  }
   /**重置 */
   clear() {
    if (this.i.Id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
      this.plantChange(this.i.plantCode);
    } else {
      this.i = {};
    }
  }
}
