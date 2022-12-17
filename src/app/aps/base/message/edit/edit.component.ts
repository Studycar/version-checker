/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:30
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-01 14:02:46
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-message-edit',
  templateUrl: './edit.component.html',
  // styleUrls: ['../../../../../assets/css/common.css']
  providers: [QueryService]
})
export class BaseMessageEditComponent implements OnInit {
  languageOptions: any[] = [];
  applicationOptions: any[] = [];
  isModify = false;
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    /* 初始化语言 */
    this.languageOptions.length = 0;
    
        this.commonQueryService.GetLookupByTypeLang('FND_LANGUAGE', this.appConfigService.getLanguage()).subscribe(result => {
      result.Extra.forEach(d => {
        this.languageOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    /** 初始化應用程序 */
    this.applicationOptions.length = 0;
    this.messageManageService.GetAppliaction(this.i.language).subscribe(result => {
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });
    if (this.i.messageId != null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.messageManageService.Get(this.i.messageId, this.i.language).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.LANGUAGE = this.appConfigService.getLanguage();
    }
  }

  save(value: any) {
    /*if (this.i.MESSAGEID != null) {
      value.MESSAGEID = this.i.MESSAGEID;
      value.MESSAGECODE = this.i.MESSAGECODE;
    } else {
      value.MESSAGEID = null;
    }*/
    this.messageManageService.Edit(this.i).subscribe(res => {
      if (res.code === 200) { // if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
