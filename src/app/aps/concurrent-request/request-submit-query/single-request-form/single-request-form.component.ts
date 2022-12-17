import { Component, OnInit } from '@angular/core';
import {
  GridDataResult,
  RowArgs,
  SelectableSettings,
  RowClassArgs,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { ConcurrentRequestPlanFormComponent } from '../plan-form/plan-form.component';
import { EtyRequestPlan } from '../model/EtyRequestPlan';
import { ParameterEntity } from '../model/ParameterEntity';
import { CommonService } from '../model/CommonService';
import { ConcurrentRequestPreviousRequestFormComponent } from '../previous-request-form/previous-request-form.component';
import { ConcurrentRequestParameterFormComponent } from '../parameter-form/parameter-form.component';
import { compileTemplate } from '@progress/kendo-angular-pdf-export';
import { SelectControlValueAccessor } from '@angular/forms';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'single-request-form',
  templateUrl: './single-request-form.component.html',
  styleUrls: ['./single-request-form.component.css'],
  providers: [CommonService, AppConfigService],
})
export class ConcurrentRequestSingleRequestFormComponent implements OnInit {
  i: any;

  // 参数信息
  dicParaValue: { [key: string]: ParameterEntity; } = {};

  // 运行计划信息
  planEnty: EtyRequestPlan = {
    scheduleType: 'A',
    scheduleFlag: 'N',
    resubmitted: 'N',
    runningTime: '',
    resubmitEndDate: '',
    resubmitInterval: null,
    resubmitIntervalUnitCode: '',
    resubmitIntervalTypeCode: 'START',
    incrementDates: false,
  };

  programCode: string;
  argumentText: string;
  planText: string;
  argumnetNumber = 0;
  Disabled = false;

  listOfProgram: any = [];
  userId = this.appConfigService.getUserId(); // 当前用户,暂时写死
  respId = this.appConfigService.getRespCode(); // 当前职责，暂时写死

  constructor(private msgSrv: NzMessageService,
              private modal: NzModalRef,
              private openDiag: ModalHelper,
              private requestSubmitQueryService: RequestSubmitQueryService,
              private commonService: CommonService,
              private confirmationService: NzModalService,
              private appTranslationService: AppTranslationService,
              private appConfigService: AppConfigService) {
  }

  ngOnInit() {
    this.requestSubmitQueryService.getRespProgram(this.respId).subscribe(result => {
      result.data.forEach(d => {
        this.listOfProgram.push({
          label: d.userConcurrentProgramName,
          value: d.id,
        });
      });
    });
  }

  Copy() {
    this.Disabled = true;
    const CopyArgmentObj = {
      requestId: null,
      IsRefresh: false,
    };
    this.openDiag
      .static(ConcurrentRequestPreviousRequestFormComponent, { i: CopyArgmentObj }, 800, 400)
      .subscribe(() => {
        if (CopyArgmentObj.IsRefresh) {
          const requestId = CopyArgmentObj.requestId;
          this.requestSubmitQueryService.getBaseConcurrentRequest(requestId).subscribe(result => {
            if (result.data != null && result.data.length !== undefined && result.data.length > 0) {
              const requestTable = result.data[0];
              this.programCode = requestTable.concurrentProgramId;

              const callFun: (sender: any, requestObj: any) => void = function(sender: any, requestObj: any) {
                for (let i = 1; i <= Number(requestObj.numberOfArguments); i++) {
                  sender.dicParaValue['argument' + i.toString()].value = requestObj['argument' + i.toString()] || '';
                }

                sender.argumentText = requestObj.argumentText;
                sender.planEnty.scheduleType = requestObj.scheduleType;
                sender.planEnty.resubmitted = requestObj.resubmitted;

                // A，立即；O，一次；P，定期
                if (sender.planEnty.scheduleType === 'A') {
                  sender.planEnty.runningTime = sender.commonService.formatDateTime(new Date().getTime());
                  sender.planEnty.scheduleFlag = 'N';
                  sender.planEnty.resubmitted = 'N';
                  sender.planEnty.resubmitIntervalTypeCode = 'START';
                  sender.planEnty.incrementDates = false;
                  sender.planText = '立即';
                } else if (sender.planEnty.scheduleType === 'O') {
                  sender.planEnty.scheduleFlag = 'Y';
                  sender.planEnty.runningTime = sender.commonService.formatDateTime(requestObj.scheduleStartDate);
                  sender.planEnty.resubmitted = 'N';
                  sender.planEnty.resubmitIntervalTypeCode = 'START';
                  sender.planEnty.incrementDates = false;
                  if (sender.commonService.CompareDate(sender.planEnty.runningTime, (new Date()).toString()) < 0) {
                    sender.planEnty.runningTime = sender.commonService.formatDateTime(new Date().getTime());
                  }
                  sender.planText = '一次：' + sender.planEnty.runningTime;
                } else if (sender.planEnty.scheduleType === 'P') {
                  sender.planEnty.runningTime = sender.commonService.formatDateTime(requestObj.scheduleStartDate);
                  sender.planEnty.incrementDates = requestObj.incrementDates === 'Y' ? true : false;
                  sender.planEnty.resubmitInterval = requestObj.resubmitInterval;
                  sender.planEnty.resubmitIntervalTypeCode = requestObj.resubmitIntervalTypeCode;
                  sender.planEnty.resubmitIntervalUnitCode = requestObj.resubmitIntervalUnitCode;
                  sender.planEnty.scheduleFlag = 'Y';
                  sender.planEnty.resubmitted = 'N';

                  if (sender.commonService.CompareDate(sender.planEnty.runningTime, (new Date()).toString()) < 0) {
                    sender.planEnty.runningTime = sender.commonService.formatDateTime(new Date().getTime());
                  }
                  sender.planText = '定期：' + sender.planEnty.runningTime + '至';
                  if (requestObj.scheduleEndDate && sender.commonService.CompareDate(requestObj.scheduleEndDate, '2000-1-1') > 0) {
                    sender.planEnty.resubmitEndDate = sender.commonService.formatDateTime(requestObj.scheduleEndDate);
                    sender.planText += sender.planEnty.resubmitEndDate;
                  }
                }
              };
              /*const callFun: (sender: any, x: number, y: number) => void =
                function (sender: any, xx: number, yy: number) {
                  sender.argumentText = xx + yy;
                };*/

              this.SelectProgram(requestTable.concurrentProgramId, requestTable, { callFunObj: callFun });
            }
          });
        } else {
          this.Disabled = false;
        }
      });
  }

  Argument() {
    if (this.programCode !== undefined && this.programCode !== '') {
      const dicParamValue: { [key: string]: ParameterEntity; } = {};
      for (const dicParamKey in this.dicParaValue) {
        dicParamValue[dicParamKey] = {
          value: this.dicParaValue[dicParamKey].value,
          defaultValue: this.dicParaValue[dicParamKey].defaultValue,
          sharedParameterName: this.dicParaValue[dicParamKey].sharedParameterName,
          requiredFlag: this.dicParaValue[dicParamKey].requiredFlag,
          sharedValue: this.dicParaValue[dicParamKey].sharedValue,
          label: this.dicParaValue[dicParamKey].label,
        };
      }

      const ArgumentObj = {
        IsRead: false,
        IsRefresh: false,
        concurrentProgramId: this.programCode,
        dicParamValue: dicParamValue,
      };

      this.openDiag
        .static(ConcurrentRequestParameterFormComponent, { i: ArgumentObj }, 650, 450)
        .subscribe(() => {
          if (ArgumentObj.IsRefresh) {
            let paramText = '';
            const keys = Object.keys(ArgumentObj.dicParamValue);
            keys.sort((a, b) => {
              const a1: number = <number>(a.replace('argument', '') as unknown);
              const b1: number = <number>(b.replace('argument', '') as unknown);
              return a1 - b1;
            });
            keys.forEach(dicParamKey => {
              this.dicParaValue[dicParamKey] = {
                value: ArgumentObj.dicParamValue[dicParamKey].value,
                defaultValue: ArgumentObj.dicParamValue[dicParamKey].defaultValue,
                sharedParameterName: ArgumentObj.dicParamValue[dicParamKey].sharedParameterName,
                requiredFlag: ArgumentObj.dicParamValue[dicParamKey].requiredFlag,
                sharedValue: ArgumentObj.dicParamValue[dicParamKey].sharedValue,
                label: ArgumentObj.dicParamValue[dicParamKey].label,
              };
              paramText += ',' + ArgumentObj.dicParamValue[dicParamKey].value;
            });

            if (paramText.length > 0) {
              this.argumentText = paramText.substring(1);
            }
          }
        });
    } else {
      this.msgSrv.success('请先选择程序');
    }
  }

  Plan() {
    const PlanEntyArg: EtyRequestPlan = {
      scheduleType: this.planEnty.scheduleType,
      scheduleFlag: this.planEnty.scheduleFlag,
      resubmitted: this.planEnty.resubmitted,
      runningTime: this.planEnty.runningTime,
      resubmitEndDate: this.planEnty.resubmitEndDate,
      resubmitInterval: this.planEnty.resubmitInterval,
      resubmitIntervalUnitCode: this.planEnty.resubmitIntervalUnitCode,
      resubmitIntervalTypeCode: this.planEnty.resubmitIntervalTypeCode,
      incrementDates: this.planEnty.incrementDates,
    };

    const PlanArgmentObj = {
      IsFill: false,
      planEnty: PlanEntyArg,
    };

    this.openDiag
      .static(ConcurrentRequestPlanFormComponent, { i: PlanArgmentObj }, 600, 500)
      .subscribe(() => {
        if (PlanArgmentObj.IsFill) {
          if (PlanArgmentObj.planEnty.scheduleType === 'A') {
            this.planText = '立即';
          } else if (PlanArgmentObj.planEnty.scheduleType === 'O') {
            this.planText = '一次：' + PlanArgmentObj.planEnty.runningTime;
          } else if (PlanArgmentObj.planEnty.scheduleType === 'P') {
            this.planText = '定期：' + PlanArgmentObj.planEnty.runningTime + '至';
            if (PlanArgmentObj.planEnty.resubmitEndDate) {
              this.planText += PlanArgmentObj.planEnty.resubmitEndDate;
            }
          }

          for (const key in PlanEntyArg) {
            this.planEnty[key] = PlanEntyArg[key];
          }
        }
      });
  }

  onSelectProgram(e: any) {
    this.Disabled = true;
    this.argumentText = '';
    this.planEnty.scheduleType = 'A';
    this.planEnty.scheduleFlag = 'N';
    this.planEnty.runningTime = this.commonService.formatDateTime((new Date()).toString());
    this.planEnty.resubmitted = 'N';
    this.planEnty.resubmitIntervalTypeCode = 'START';
    this.planEnty.incrementDates = false;
    this.planText = '立即';

    this.SelectProgram(e);
  }

  SelectProgram(values: string, requestTable?: any, callFunParam?: any) {
    this.dicParaValue = {}; // 清空参数信息
    this.requestSubmitQueryService.getConcProgParam(values).subscribe(result => {
        if (result.data != null && result.data !== undefined) {
          this.argumentText = result.data.paramText;
          this.argumnetNumber = result.data.argumnetNumber;
          for (const dicKey in result.data.paramValue) {
            this.dicParaValue[dicKey] = {
              value: result.data.paramValue[dicKey].value,
              defaultValue: result.data.paramValue[dicKey].defaultValue,
              sharedParameterName: result.data.paramValue[dicKey].sharedParameterName,
              requiredFlag: result.data.paramValue[dicKey].requiredFlag,
              sharedValue: result.data.paramValue[dicKey].sharedValue,
              label: result.data.paramValue[dicKey].label,
            };
          }
        }
      },
      error => {
      },
      () => {
        if (callFunParam && callFunParam.callFunObj) {
          callFunParam.callFunObj(this, requestTable);
        }
        this.Disabled = false;
      },
    );
  }

  Confrim() {

    if (!this.programCode) {
      this.msgSrv.info('请选择并发程序');
      return;
    }

    for (const key in this.dicParaValue) {
      if (this.dicParaValue[key].requiredFlag && !this.dicParaValue[key].value) {
        this.msgSrv.info('【' + this.dicParaValue[key].label + '】为必填项');
        return;
      }
    }

    if (this.planEnty.scheduleType === 'P') {
      if (this.planEnty.resubmitEndDate && this.commonService.CompareDate(this.planEnty.runningTime, this.planEnty.resubmitEndDate) > 0) {
        this.msgSrv.info('起始日期不能大于终止日期');
        return;
      }
    }

    this.Disabled = true;

    const EtyRequest = {
      requestedBy: this.userId,
      scheduleType: this.planEnty.scheduleType,
      requestedStartDate: this.planEnty.runningTime,
      responsibilityId: this.respId,
      concurrentProgramId: this.programCode,
      requestId: '0',
      numberOfArguments: this.argumnetNumber,
      description: '',
      resubmitInterval: this.planEnty.resubmitInterval || null,
      resubmitIntervalUnitCode: this.planEnty.resubmitIntervalUnitCode || '',
      resubmitIntervalTypeCode: this.planEnty.scheduleType === 'P' ? this.planEnty.resubmitIntervalTypeCode : '',
      scheduleStartDate: this.planEnty.runningTime,
      scheduleEndDate: this.planEnty.resubmitEndDate || '',
      resubmitted: this.planEnty.resubmitted,
      scheduleFlag: this.planEnty.scheduleFlag,
      incrementDates: this.planEnty.incrementDates ? 'Y' : 'N',
      dicParaValue: this.dicParaValue,
    };

    this.requestSubmitQueryService.submitRequest(EtyRequest).subscribe(res => {
      if (res.code === 200) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('已经提交请求.(请求编号={0}).是否提交另一项请求?', res.msg),
          nzOnOk: () => {
            this.programCode = '';
            this.argumentText = '';
            this.dicParaValue = {};
            this.planText = '立即';
            this.planEnty = {
              scheduleType: 'A',
              scheduleFlag: 'N',
              resubmitted: 'N',
              runningTime: '',
              resubmitEndDate: '',
              resubmitInterval: null,
              resubmitIntervalUnitCode: '',
              resubmitIntervalTypeCode: 'START',
              incrementDates: false,
            };
          },
          nzOnCancel: () => {
            this.i.IsRefresh = true;
            this.modal.destroy();
          },
        });
      } else {
        this.msgSrv.error(res.msg);
      }
      this.Disabled = false;
    });
  }

  close() {
    this.modal.destroy();
  }
}
