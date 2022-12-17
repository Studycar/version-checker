import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { RespmanagerService } from '../../../../modules/generated_module/services/respmanager-service';
import { FunctionmanagerService } from '../../../../modules/generated_module/services/functionmanager-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baserespmanager-edit',
  templateUrl: './edit.component.html',
})
export class BaseBaserespmanagerEditComponent implements OnInit {
  optionListAppName: any[] = [];
  applicationLanguage: any[] = [];
  record: any = {};
  i: any = {};
  iClone: any = {};
  Istrue: boolean;
  isLoading = false;

  applications: any[] = [];
  languages: any[] = [];
  isModify = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private respmanagerService: RespmanagerService,
    private functionmanagerService: FunctionmanagerService,
    private messageManageService: MessageManageService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    if (this.i.respId !== undefined) {
      this.isModify = true;
    }
    this.loadData();

  }
  loadData() {
    // 绑定页面应用程序下拉框AppName
    this.commonQueryService.GetApplication().subscribe(result => {
      this.optionListAppName = result.data;
    });

    // 绑定语言
    this.commonQueryService.GetLookupByTypeRef('FND_LANGUAGE', this.applicationLanguage);
    console.log('this.i');
    console.log(this.i);
    if (this.i.respId !== undefined) {
      this.Istrue = true;

      /** 初始化编辑数据 */
      this.respmanagerService.GetInfo(this.i.respId, this.i.language).subscribe(result => {
        this.i = result.data;
        console.log('this.i');
        console.log(this.i);
        this.iClone = Object.assign({}, this.i);
      }
      );

    } else {
      this.Istrue = false;
      this.i.language = this.appConfigService.getLanguage();
      var t = new Date();//你已知的时间
      var t_s = t.getTime();//转化为时间戳毫秒数 
      t.setTime(t_s - 1000 * 60 * 60 * 24);//设置新时间比旧时间多一天
      this.i.startDate = t;
    }
  }


  save() {
    // 判断起始时间this.commonQueryService.formatDate
    const startDate1 = this.i.startDate;
    if (this.i.endDate !== null && this.i.endDate !== undefined) {
      const endDate1 = this.i.endDate;
      if (endDate1 < startDate1) {
        this.msgSrv.success(this.appTranslationService.translate('失效日期不能小于生效日期'));
        return;
      }
    }
    this.respmanagerService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
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
    if (this.i.respId != null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      var t = new Date();//你已知的时间
      var t_s = t.getTime();//转化为时间戳毫秒数 
      t.setTime(t_s - 1000 * 60 * 60 * 24);//设置新时间比旧时间多一天
      this.i = {
        id: null,
        menuGroupCode: null,
        menuGroupName: null,
        applicationId: null,
        language: this.appConfigService.getLanguage(),
        startDate: t,
        endDate: null
      };
    }
  }

  // 定义查询条件的时间
  startBegin: Date = null;
  startEnd: Date = null;
  // tslint:disable-next-line:no-inferrable-types
  endOpen1: boolean = false;

  // 根据开始时间，定义不可选择的时间
  disabledStartDate1 = (startBegin: Date): boolean => {
    if (!startBegin || !this.startEnd) {
      return false;
    }
    return startBegin.getTime() > this.startEnd.getTime();
  }

  disabledEndDate1 = (startEnd: Date): boolean => {
    if (!startEnd || !this.startBegin) {
      return false;
    }
    return startEnd.getTime() <= this.startBegin.getTime();
  }

  // 选择时间后，返回选择时间的回调
  onStartChange1(date: Date): void {
    this.startBegin = date;
  }
  onEndChange1(date: Date): void {
    this.startEnd = date;
  }
  // 设定弹出日历和关闭日历的回调
  handleStartOpenChange1(open: boolean): void {
    if (!open) {
      this.endOpen1 = true;
    }
    console.log('handleStartOpenChange1', open, this.endOpen1);
  }

  handleEndOpenChange1(open: boolean): void {

    this.endOpen1 = open;
  }

}
