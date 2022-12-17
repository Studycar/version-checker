/*
 * @Author:
 * @contact:
 * @LastEditors: Zwh
 * @Note: ...
 * @Date: 2018-08-01 17:49:16
 * @LastEditTime: 2019-05-09 08:45:11
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { BaseApplicationManageService } from '../../../../modules/generated_module/services/base-application-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-application-edit',
  templateUrl: './edit.component.html',
  // styleUrls: ['../../../../../assets/css/common.css']
})
export class BaseApplicationEditComponent implements OnInit {
  applications: any[] = [];
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  isModify: boolean;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private baseApplicationManageService: BaseApplicationManageService,
    public translateservice: AppTranslationService,
  ) {}

  ngOnInit(): void {
    if (this.i.id != null) {
      this.isModify = true;
    } else {
      this.isModify = false;
    }

    /** 初始化應用程序 */
    if (this.i.id !== null) {
      /** 初始化编辑数据 */
      this.baseApplicationManageService.Get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      });
    }
  }

  save() {
    this.baseApplicationManageService.Edit(this.i).subscribe(res => {
      // this.msgSrv.success(this.translateservice.translate('保存成功'));
      // this.modal.close(true);

      /**jianl修改 */
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
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
