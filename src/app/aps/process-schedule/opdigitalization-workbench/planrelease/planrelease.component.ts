import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '.././edit.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-planrelease',
  templateUrl: './planrelease.component.html',
  // styleUrls: ['../../../../../assets/css/common.css'],
  providers: [EditService],
})
export class ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent implements OnInit {

  // 查询参数
  public i: any;
  /* 数字化工作台Component */
  public mainForm: CustomBaseContext;
  public regionCode: string;
  public plantCode: string;
  public schedule_group_code: string;
  public lineCodes: any;
  public startTime: any;
  public endTime: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {
    // super();
  }

  ngOnInit(): void {
    this.i.version = this.schedule_group_code + '-' + this.getNowFormatDate();
  }

  public query() {
    // super.query();
  }

  getNowFormatDate() {
    const Dates = new Date();
    const year: number = Dates.getFullYear();
    const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
    const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    const Hours: any = Dates.getHours();
    const Minutes: any = Dates.getMinutes();
    const Seconds: any = Dates.getSeconds();
    return year + '' + month + '' + day + '' + Hours + '' + Minutes + '' + Seconds;
  }

  public clear() {
    this.i = {
      version: this.schedule_group_code + '-' + this.getNowFormatDate(),
      confirm_flag: false,
      remark: ''
    };
  }


  close() {
    this.modal.destroy();
  }

  confirm() {
    // 数字化工作台loading
    if (this.mainForm) {
      this.mainForm.setLoading(true);
    }
    // 事业部、计划组、工厂、生产线、开始时间、结束时间、版本号、确认标识
    this.editService.PlanRelease(
      this.regionCode,
      this.schedule_group_code,
      this.plantCode,
      this.lineCodes,
      this.startTime,
      this.endTime,
      this.i.version,
      this.i.confirm_flag ? 'Y' : 'N',
      this.i.remark || ''
    ).subscribe(result => {
      if (result !== null && result.Success) {
        this.msgSrv.success(this.appTranslationService.translate(result.Message || '计划发布成功'));
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(result.Message || '计划发布失败'));
      }
      // 完成loading
      this.mainForm.setLoading(false);
    }
    );
    this.modal.close();
  }
}
