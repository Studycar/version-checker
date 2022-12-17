import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-calculateWorking',
  templateUrl: './calculateWorking.component.html',
  // styleUrls: ['../../../../../assets/css/common.css'],
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent implements OnInit {
  // grid 勾选项（传参）
  public gridSelectItems: any[];
  public gridSelectKeys: any[] = [];
  // 查询参数
  public i = {
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    startCalendarDay: null,
    startTime: '',
    endCalendarDay: null,
    endTime: ''
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
    this.i.plantCode = this.gridSelectItems[0].plantCode;
    this.i.scheduleGroupCode = this.gridSelectItems[0].scheduleGroupCode;
    this.i.resourceCode = this.gridSelectItems[0].resourceCode;
    this.gridSelectItems.forEach(x => { this.gridSelectKeys.push(x.ID); });
  }

  // 开始日期改变事件
  public changeStartDay($event) {
    // 加载日历开始时间
    this.editService.GetCalendarList({
      plantCode: this.i.plantCode,
      resourceCode: this.i.resourceCode,
      showCalendarDay: this.editService.formatDate($event)
    }).subscribe(result => {
      if (result === null || result.extra === null || result.extra.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('选择的日期没有有效的班次，请重新选择!'));
      } else {
        this.startTimeOptions = [];
        result.extra.forEach(x => {
          this.startTimeOptions.push({ value: x.startTime, label: x.startTime });
        });
        this.startTimeOptions.sort((a, b) => (new Date(a.value)).getTime() - (new Date(b.value)).getTime());
      }
    });
  }
  // 结束日期改变事件
  public changeEndDay($event) {
    // 加载日历开始时间
    this.editService.GetCalendarList({
      plantCode: this.i.plantCode,
      resourceCode: this.i.resourceCode,
      showCalendarDay: this.editService.formatDate($event)
    }).subscribe(result => {
      if (result === null || result.extra === null || result.extra.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('选择的日期没有有效的班次，请重新选择!'));
      } else {
        this.endTimeOptions = [];
        result.extra.forEach(x => {
          this.endTimeOptions.push({ value: x.endTime, label: x.endTime });
        });
        this.endTimeOptions.sort((a, b) => (new Date(a.value)).getTime() - (new Date(b.value)).getTime());
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  confirm() {

    if (this.i.startTime > this.i.endTime) {
      this.msgSrv.warning(this.appTranslationService.translate('开始时间不能大于结束时间!'));
    } else {
      this.editService.CaculateWorking(this.i.plantCode, this.i.resourceCode, this.i.startTime, this.i.endTime, this.gridSelectKeys)
        .subscribe(result => {
          if (result != null) {
            if (result.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('产能平衡调整成功!' + (result.msg || '')));
              this.modal.close(true);
            } else {
              this.msgSrv.error(this.appTranslationService.translate('产能平衡调整失败!<br/>' + result.msg));
            }
          }
        });
    }
  }
}
