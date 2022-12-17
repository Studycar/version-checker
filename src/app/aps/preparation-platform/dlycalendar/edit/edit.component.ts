/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2019-02-19 16:10:43
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { DlyCalendarService } from '../../../../modules/generated_module/services/dly-calendar-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-dlycalendar-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformDlycalendarEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  plantoptions: any[] = [];
  calendaroptions: any[] = [];
  title: String = '新增';
  readOnly: Boolean = false;
  /**是否有效 */
  yesnoOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private querydata: DlyCalendarService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.querydata.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.plantCode = this.appconfig.getPlantCode();
      this.i.enableFlag = 'Y';
    }

    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonquery.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.yesnoOptions.length = 0;
      result.Extra.forEach(d => {
        this.yesnoOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('PC_DLY_CALENDAR_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.calendaroptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  // save() {
  //   if (this.i.id !== null) {
  //     this.querydata.EditData(this.i).subscribe(res => {
  //       if (res.Success) {
  //         this.msgSrv.success('保存成功');
  //         this.modal.close(true);
  //       } else {
  //         this.msgSrv.error(res.Message);
  //       }
  //     });
  //   } else {
  //     this.querydata.SaveForNew(this.i).subscribe(res => {
  //       if (res.Success) {
  //         this.msgSrv.success('保存成功');
  //         this.modal.close(true);
  //       } else {
  //         this.msgSrv.error(res.Message);
  //       }
  //     });
  //   }
  // }

  save() {
    this.querydata.EditData(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
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
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
