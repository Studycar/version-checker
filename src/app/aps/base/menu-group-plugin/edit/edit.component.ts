import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { BaseMenuGroupPluginEditService } from '../edit.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menu-group-plugin-edit',
  templateUrl: './edit.component.html',
  providers: [BaseMenuGroupPluginEditService],
})
export class BaseMenuGroupPluginEditComponent implements OnInit {
  optionListAppName: any[] = [];
  applicationLanguage: any[] = [];
  record: any = {};
  i: any = {};
  iClone: any = {};
  Istrue: boolean;
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: BaseMenuGroupPluginEditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.iClone = Object.assign({}, this.i);
  }

  loadData() {
    // 绑定页面应用程序下拉框AppName
    this.commonQueryService.GetApplication().subscribe(result => {
      this.optionListAppName = result.data;
    });

    // 绑定语言

    this.commonQueryService.GetLookupByTypeRef('FND_LANGUAGE', this.applicationLanguage);
    console.log('SDDS   ID '  + this.i.id);

    if (this.i.id != null) {
      this.Istrue = true;

      /** 初始化编辑数据 */
      this.editService.Get(this.i.id, this.i.language).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.Istrue = false;
      this.i.language = this.appConfigService.getLanguage();
      this.i.startDate = new Date();
    }
  }


  save() {
    this.editService.save(this.i).subscribe(res => {
      if (res.code === 200) {
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
  /**重置 */
  clear() {
    if (this.i.Id != null) {
      this.loadData();
    } else {
      this.i = {};
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
    console.log(open);
    this.endOpen1 = open;
  }

}
