import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-calculateWorking',
  templateUrl: './calculateWorking.component.html',
  // styleUrls: ['../../../../../assets/css/common.css'],
  providers: [EditService]
})
export class ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent implements OnInit {
  // grid 勾选项（传参）
  public gridSelectItems: any[];
  public gridSelectKeys: any[] = [];
  // 查询参数
  public i = {
    PLANT_CODE: '',
    SCHEDULE_GROUP_CODE: '',
    RESOURCE_CODE: '',
    START_CALENDAR_DAY: null,
    START_TIME: '',
    END_CALENDAR_DAY: null,
    END_TIME: ''
  };
  // 开始时间
  public startTimeOptions = [];
  // 结束时间
  public endTimeOptions = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {

  }

  ngOnInit(): void {
    this.i.PLANT_CODE = this.gridSelectItems[0].PLANT_CODE;
    this.i.SCHEDULE_GROUP_CODE = this.gridSelectItems[0].SCHEDULE_GROUP_CODE;
    this.i.RESOURCE_CODE = this.gridSelectItems[0].RESOURCE_CODE;
    this.gridSelectItems.forEach(x => { this.gridSelectKeys.push(x.ID); });
  }

  // 开始日期改变事件
  public changeStartDay($event) {
    // 加载日历开始时间
    this.editService.GetCalendarList({
      PLANT_CODE: this.i.PLANT_CODE,
      RESOURCE_CODE: this.i.RESOURCE_CODE,
      SHOW_CALENDAR_DAY: this.editService.formatDate($event)
    }).subscribe(result => {
      if (result === null || result.Extra === null || result.Extra.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('选择的日期没有有效的班次，请重新选择!'));
      } else {
        this.startTimeOptions = [];
        result.Extra.forEach(x => {
          this.startTimeOptions.push({ value: x.START_TIME, label: x.START_TIME });
        });
        this.startTimeOptions.sort((a, b) => (new Date(a.value)).getTime() - (new Date(b.value)).getTime());
      }
    });
  }
  // 结束日期改变事件
  public changeEndDay($event) {
    // 加载日历开始时间
    this.editService.GetCalendarList({
      PLANT_CODE: this.i.PLANT_CODE,
      RESOURCE_CODE: this.i.RESOURCE_CODE,
      SHOW_CALENDAR_DAY: this.editService.formatDate($event)
    }).subscribe(result => {
      if (result === null || result.Extra === null || result.Extra.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('选择的日期没有有效的班次，请重新选择!'));
      } else {
        this.endTimeOptions = [];
        result.Extra.forEach(x => {
          this.endTimeOptions.push({ value: x.END_TIME, label: x.END_TIME });
        });
        this.endTimeOptions.sort((a, b) => (new Date(a.value)).getTime() - (new Date(b.value)).getTime());
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  confirm() {

    if (this.i.START_TIME > this.i.END_TIME) {
      this.msgSrv.warning(this.appTranslationService.translate('开始时间不能大于结束时间!'));
    } else {
      this.editService.CaculateWorking(this.i.PLANT_CODE, this.i.RESOURCE_CODE, this.i.START_TIME, this.i.END_TIME, this.gridSelectKeys)
        .subscribe(result => {
          if (result != null) {
            if (result.Success) {
              this.msgSrv.success(this.appTranslationService.translate('产能平衡调整成功!' + (result.Message || '')));
              this.modal.close(true);
            } else {
              this.msgSrv.error(this.appTranslationService.translate('产能平衡调整失败!<br/>' + result.Message));
            }
          }
        });
    }
  }
}
