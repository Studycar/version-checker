/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:05
 * @LastEditors: Zwh
 * @LastEditTime: 2020-08-27 20:26:35
 */
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { BaseParameterService } from '../../../../modules/generated_module/services/base-parameter-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baseparameter-edit',
  templateUrl: './edit.component.html',
})
export class BaseBaseparameterEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  applicationoptions: any[] = [];
  languageoptions: any[] = [];
  readOnly: boolean;
  yesOrNo: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public baseparameterservice: BaseParameterService,
    public appservice: AppConfigService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit(): void {
    if (this.i.Id !== null) {
      this.title = '编辑';
      this.readOnly = true;
    } else {
      this.readOnly = false;
    }
    this.loadData();
  }

  private loadData() {
    const that = this;
    this.commonquery
    .GetLookupByTypeLang('FND_LANGUAGE', this.appservice.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.languageoptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
      this.i.LANGUAGE = this.appservice.getLanguage();   // 设置语言默认为当前使用语言
    });
    this.commonquery.GetApplication().subscribe(res => {
      res.data.forEach(element => {
        this.applicationoptions.push({
          label: element.applicationName,
          value: element.applicationCode
        });
      });
    });
    if (this.i.Id !== null) {
      this.baseparameterservice.GetById(this.i.Id, this.i.Language).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.startDate = new Date();  // 设置生效时间默认为当前时间
    }

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  save() {
    if (this.i.Id !== null) {
      this.baseparameterservice.Edit1(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.baseparameterservice.SaveforNew(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close();
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  parseTime(d: any) {
    const newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' '
      + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return newDate;
  }

  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
