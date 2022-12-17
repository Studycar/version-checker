import { Component, OnInit } from '@angular/core';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { CommonService } from '../model/CommonService';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css'],
  providers: [CommonService]
})
export class ConcurrentRequestPlanFormComponent implements OnInit {
  i: any;
  beginTime: string;
  runningTime: string;
  plDisposable: boolean;
  plRegular: boolean;
  listOfTimeInter: any = [];

  radStyle = {
    display: 'block',
    height: '35px',
    lineHeight: '35px'
  };

  constructor(private msgSrv: NzMessageService,
    private modal: NzModalRef,
    private openDiag: ModalHelper,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private commonQueryService: CommonQueryService,
    private commonService: CommonService) { }

  ngOnInit() {
    // this.commonQueryService.GetLookupByType('FND_CONC_TIME_UNIT_CODE').subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.listOfTimeInter.push({
    //       label: d.MEANING,
    //       value: d.LOOKUP_CODE,
    //     });
    //   });
    // });
    this.commonQueryService.GetLookupByTypeRef('FND_CONC_TIME_UNIT_CODE', this.listOfTimeInter);
    this.plDisposable = false;
    this.plRegular = false;
    this.beginTime = this.commonService.formatDateTime(new Date().getTime());
    this.runningTime = this.commonService.formatDateTime(new Date().getTime()); // 当前时间

    if (this.i.planEnty.scheduleType === 'O' && this.i.planEnty.runningTime !== '' && this.i.planEnty.runningTime != null) {
      this.runningTime = this.i.planEnty.runningTime;
    } else if (this.i.planEnty.scheduleType === 'P' && this.i.planEnty.runningTime !== '' && this.i.planEnty.runningTime != null) {
      this.beginTime = this.i.planEnty.runningTime;
    }
    this.radChange(this.i.planEnty.scheduleType);
  }

  radChange(values: any) {
    if (values === 'A') {
      this.plDisposable = false;
      this.plRegular = false;
    } else if (values === 'O') {
      this.plDisposable = true;
      this.plRegular = false;
    } else if (values === 'P') {
      this.plDisposable = false;
      this.plRegular = true;
    }
  }

  Confrim() {
    if (this.i.planEnty.scheduleType === 'A') {
      this.i.planEnty.scheduleFlag = 'N';
      this.i.planEnty.resubmitted = 'N';
      this.i.planEnty.runningTime = this.commonService.formatDateTime(new Date());
      this.i.planEnty.resubmitEndDate = '';
      this.i.planEnty.resubmitInterval = null;
      this.i.planEnty.resubmitIntervalUnitCode = '';
      this.i.planEnty.resubmitIntervalTypeCode = 'START';
      this.i.planEnty.incrementDates = false;
    } else if (this.i.planEnty.scheduleType === 'O') {
      if (this.runningTime === '' || this.runningTime == null) {
        this.msgSrv.info('运行时间不能为空');
        return;
      }
      if (this.commonService.CompareDate((new Date()).toString(), this.runningTime) > 0) {
        this.msgSrv.info('运行时间不能小于系统当前时间');
        return;
      }
      this.i.planEnty.scheduleFlag = 'Y';
      this.i.planEnty.resubmitted = 'N';
      this.i.planEnty.runningTime = this.commonService.formatDateTime(this.runningTime);
      this.i.planEnty.resubmitEndDate = '';
      this.i.planEnty.resubmitInterval = null;
      this.i.planEnty.resubmitIntervalUnitCode = '';
      this.i.planEnty.resubmitIntervalTypeCode = 'START';
      this.i.planEnty.incrementDates = false;
    } else if (this.i.planEnty.scheduleType === 'P') {
      if (this.beginTime === '' || this.beginTime == null) {
        this.msgSrv.info('起始时间不能为空');
        return;
      }
      if (this.i.planEnty.resubmitInterval === '' || this.i.planEnty.resubmitInterval == null) {
        this.msgSrv.info('重新提交时间间隔不能为空');
        return;
      }
      if (this.i.planEnty.resubmitIntervalUnitCode === '' || this.i.planEnty.resubmitIntervalUnitCode == null) {
        this.msgSrv.info('重新提交时间间隔单位不能为空');
        return;
      }
      if (this.i.planEnty.resubmitEndDate !== '' && this.i.planEnty.resubmitEndDate !== null && this.commonService.CompareDate(this.beginTime, this.i.planEnty.resubmitEndDate) > 0) {
        this.msgSrv.info('起始日期不能大于终止日期');
        return;
      }
      this.i.planEnty.scheduleFlag = 'Y';
      this.i.planEnty.resubmitted = 'Y';
      this.i.planEnty.runningTime = this.commonService.formatDateTime(this.beginTime);
      this.i.planEnty.resubmitEndDate = this.commonService.formatDateTime(this.i.planEnty.resubmitEndDate);
    }
    this.i.IsFill = true;
    this.modal.destroy();
  }

  close() {
    this.modal.destroy();
  }
}
