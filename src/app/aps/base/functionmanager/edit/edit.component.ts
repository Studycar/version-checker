/*
 * @Author:
 * @contact:
 * @LastEditors: Zwh
 * @Note:
 *  修改表格（很久之前就让修改的但是本功能没修改，因为保存问题我自行修改，
 * 有问题请联系我）
 * @Date: 2018-08-01 17:49:15
 * @LastEditTime: 2019-05-17 15:06:41
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { FunctionmanagerService } from '../../../../modules/generated_module/services/functionmanager-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-functionmanager-edit',
  templateUrl: './edit.component.html',
})
export class BaseFunctionmanagerEditComponent implements OnInit {

  isModify = false;
  applications: any[] = [];
  functiontypes: any[] = [];
  enabledflags: any[] = [];
  languages: any[] = [];
  readOnly;
  record: any = {};
  i: any;
  iClone: any;


  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService,
    private functionmanagerService: FunctionmanagerService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.readOnly = true;
    } else {
      this.i.enabledflag = 'Y';
      this.i.language = this.appConfigService.getLanguage();
    }

    this.loadData();
  }

  loadData() {
    const that = this;

    /** 初始化應用程序 */
    this.commonquery.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applications.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });;
    // this.messageManageService.GetAppliaction().subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.applications.push({
    //       label: d.applicationName,
    //       value: d.applicationCode,
    //     });
    //   });
    // });

    /* 初始化语言 */
    this.commonquery.GetLookupByTypeRef('FND_LANGUAGE', this.languages);
    // this.messageManageService.GetLanguages().subscribe(resultLng => {
    //   resultLng.Extra.forEach(d => {
    //     this.languages.push({
    //       label: d.lookupName,
    //       value: d.lookupCode,
    //     });
    //   });
    // });

    /** 初始化功能类型  下拉框*/
    this.commonquery.GetLookupByTypeRef('FND_FUNCTION_TYPE', this.functiontypes);
    // this.functionmanagerService.GetFunctionType().subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.functiontypes.push({
    //       label: d.LOOKUPNAME,
    //       value: d.LOOKUPCODE,
    //     });
    //   });
    // });

    /** 初始化有效  下拉框*/
    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.enabledflags.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    if (this.i.id != null) {
      /** 初始化编辑数据 */
      this.functionmanagerService.GetInfo(this.i.id, this.i.language).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }
  }

  save() {
    console.log(this.i);
    this.functionmanagerService.Edit(this.i).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
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
