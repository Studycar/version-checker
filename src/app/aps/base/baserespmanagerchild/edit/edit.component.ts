import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RespmanagerService } from '../../../../modules/generated_module/services/respmanager-service';
import { FunctionmanagerService } from '../../../../modules/generated_module/services/functionmanager-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baserespmanagerchild-edit',
  templateUrl: './edit.component.html',
})
export class BaseBaserespmanagerchildEditComponent implements OnInit {

  isModify = false;
  Istrue: boolean;
  menugroupids: any[] = [];
  record: any = {};
  i: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private respmanagerService: RespmanagerService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.menugroupids = this.i.menugroupids;
    // menugroupids.loadOptions();
    if (this.i.id === undefined) {
      this.i.startDate = new Date();
      this.Istrue = false;
    } else {
      this.isModify = true;
      this.Istrue = true;
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
    this.respmanagerService.EditChild(this.i).subscribe(res => {
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
