import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { ConcurrentRequestPlanFormComponent } from '../plan-form/plan-form.component';
import { EtyRequestPlan } from '../model/EtyRequestPlan';
import { CommonService } from '../model/CommonService';
import { ParameterEntity } from '../model/ParameterEntity';
import { ConcurrentRequestPreviousRequestSetFormComponent } from '../previous-request-set-form/previous-request-set-form.component';
import { ConcurrentRequestParameterFormComponent } from '../parameter-form/parameter-form.component';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'request-sets-form',
  templateUrl: './request-sets-form.component.html',
  styleUrls: ['./request-sets-form.component.css'],
  providers: [CommonService, AppConfigService]
})
export class ConcurrentRequestRequestSetsFormComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  columns: any[] = [
    {
      colId: 0, field: '', headerName: '操作', width: 90, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { headerName: '程序', field: 'userConcurrentProgramName' },
    { headerName: '阶段', field: 'stageName' },
    { headerName: '参数', field: 'argumentText' }
  ];
  public gridView: GridDataResult;
  gridHeight = 170;
  context = this;
  public gridData: any[] = [];
  public lastColumnName: string;
  i: any;
  planEnty: EtyRequestPlan = {
    scheduleType: 'A',
    scheduleFlag: 'N',
    resubmitted: 'N',
    runningTime: '',
    resubmitEndDate: '',
    resubmitInterval: null,
    resubmitIntervalUnitCode: '',
    resubmitIntervalTypeCode: 'START',
    incrementDates: false
  };

  programCode: string;
  planText: string;
  Disabled = false;

  listOfProgram: any = [];
  UserId = this.appConfigService.getUserId(); // 当前用户,暂时写死
  RespId = this.appConfigService.getRespCode(); // 当前职责，暂时写死

  constructor(
    private commonService: CommonService,
    private appTranslationService: AppTranslationService,
    public pro: BrandService,
    private modal: NzModalRef,
    private openDiag: ModalHelper,
    private confirmationService: NzModalService,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private appConfigService: AppConfigService,
    private apptrans: AppTranslationService,
    private appconfig: AppConfigService,
    private http: _HttpClient,
    private msgSrv: NzMessageService) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.requestSubmitQueryService.getRespRequestSet(this.RespId).subscribe(result => {
      result.data.forEach(d => {
        this.listOfProgram.push({
          label: d.userConcurrentProgramName,
          value: d.requestSetId,
          concurrentProgramId: d.concurrentProgramId
        });
      });
    });

    this.lastColumnName = this.columns[this.columns.length - 1].field;
  }

  Copy() {
    this.Disabled = true;
    const CopyArgmentObj = {
      Request_Id: null,
      IsRefresh: false
    };
    this.openDiag
      .static(ConcurrentRequestPreviousRequestSetFormComponent, { i: CopyArgmentObj }, 700, 400)
      .subscribe(() => {
        if (CopyArgmentObj.IsRefresh) {
          const requestId = CopyArgmentObj.Request_Id;
          this.requestSubmitQueryService.getBaseConcurrentRequest(requestId).subscribe(result => {
            if (result.data != null && result.data.length !== undefined && result.data.length > 0) {

              this.requestSubmitQueryService.getBaseRequestSetRunArgs(requestId).subscribe(resultArg => {
                if (resultArg.data != null && resultArg.data.length !== undefined && resultArg.data.length > 0) {

                  this.programCode = resultArg.data[0].requestSetId;
                  const callFun: (sender: any, requestObj: any, requestArgObj: any[]) => void = function (sender: any, requestObj: any, requestArgObj: any[]) {

                    // 重新设置参数信息
                    for (let i = 0; i < sender.gridData.length; i++) {
                      const request_set_stage_id = sender.gridData[i].requestSetStageId;
                      const request_set_program_id = sender.gridData[i].requestSetProgramId;
                      const concurrentProgramId = sender.gridData[i].concurrentProgramId;

                      const ArgsRow = requestArgObj.filter(x => x.requestSetStageId.toString() === request_set_stage_id.toString() && x.requestSetProgramId.toString() === request_set_program_id.toString() && x.concurrentProgramId.toString() === concurrentProgramId.toString());
                      if (ArgsRow && ArgsRow.length > 0) {
                        const number_of_arguments = ArgsRow[0].numberOfArguments;
                        let strs = '';
                        for (let j = 1; j <= Number(number_of_arguments); j++) {
                          sender.gridData[i].argumentValue['argument' + j.toString()].value = ArgsRow[0]['argument' + j.toString()] || '';
                          strs += ',' + (ArgsRow[0]['argument' + j.toString()] || '');
                        }
                        if (strs.length > 0) {
                          sender.gridData[i].argumentText = strs.substring(1);
                        }
                      }
                    }
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
                  this.SelectProgram(resultArg.data[0].requestSetId, result.data[0], resultArg.data, { callFunObj: callFun });
                }
              });
            }
          });
        } else {
          this.Disabled = false;
        }
      });
  }

  Argment(item: any) {
    if (item) {
      const concurrentProgramId = item.concurrentProgramId;
      const dicParamValue: { [key: string]: ParameterEntity; } = {};
      for (const dicParamKey in item.argumentValue) {
        dicParamValue[dicParamKey] = {
          value: item.argumentValue[dicParamKey].value,
          defaultValue: item.argumentValue[dicParamKey].defaultValue,
          sharedParameterName: item.argumentValue[dicParamKey].sharedParameterName,
          requiredFlag: item.argumentValue[dicParamKey].requiredFlag,
          sharedValue: item.argumentValue[dicParamKey].sharedValue,
          label: item.argumentValue[dicParamKey].label
        };
      }

      const ArgumentObj = {
        IsRead: false,
        IsRefresh: false,
        concurrentProgramId: concurrentProgramId,
        dicParamValue: dicParamValue
      };

      this.openDiag
        .static(ConcurrentRequestParameterFormComponent, { i: ArgumentObj }, 650, 450)
        .subscribe(() => {
          if (ArgumentObj.IsRefresh) {
            let paramText = '';
            for (const dicParamKey in ArgumentObj.dicParamValue) {
              item.argumentValue[dicParamKey] = {
                value: ArgumentObj.dicParamValue[dicParamKey].value,
                defaultValue: ArgumentObj.dicParamValue[dicParamKey].defaultValue,
                sharedParameterName: ArgumentObj.dicParamValue[dicParamKey].sharedParameterName,
                requiredFlag: ArgumentObj.dicParamValue[dicParamKey].requiredFlag,
                sharedValue: ArgumentObj.dicParamValue[dicParamKey].sharedValue,
                label: ArgumentObj.dicParamValue[dicParamKey].label
              };
              paramText += ',' + ArgumentObj.dicParamValue[dicParamKey].value;
            }

            if (paramText.length > 0) {
              item.argumentText = paramText.substring(1);
            }

            // 共享参数重新赋值
            for (let i = item.argumentIndex + 1; i < this.gridData.length; i++) {
              const dicParam = this.gridData.find(x => x.argumentIndex === i);
              if (dicParam && dicParam.argumentValue) {
                for (const keys in dicParam.argumentValue) {
                  if (dicParam.argumentValue[keys].sharedParameterName && !dicParam.argumentValue[keys].value) {
                    for (const ety in item.argumentValue) {
                      if (item.argumentValue[ety].sharedParameterName === dicParam.argumentValue[keys].sharedParameterName &&
                        !dicParam.argumentValue[keys].value) {
                        dicParam.argumentValue[keys].value = item.argumentValue[ety].value;
                      }
                    }
                  }
                }

                let strs = '';
                for (const ety in dicParam.argumentValue) {
                  strs += ',' + dicParam.argumentValue[ety].value;
                }
                dicParam.argumentText = strs.substring(1);
              }
            }
            this.gridData = [...this.gridData];
          }
        });
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
      incrementDates: this.planEnty.incrementDates
    };

    const PlanArgmentObj = {
      IsFill: false,
      planEnty: PlanEntyArg
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

  onSelectProgram(values: string) {
    this.Disabled = true;
    this.planEnty.scheduleType = 'A';
    this.planEnty.scheduleFlag = 'N';
    this.planEnty.runningTime = this.commonService.formatDateTime((new Date()).toString());
    this.planEnty.resubmitted = 'N';
    this.planEnty.resubmitIntervalTypeCode = 'START';
    this.planEnty.incrementDates = false;
    this.planText = '立即';
    this.SelectProgram(values);
  }

  SelectProgram(values: string, requestTable?: any, requestArgObj?: any[], callFunParam?: any) {
    this.gridData = [];
    let totalCount = 0;
    this.requestSubmitQueryService.getRequestSetArgument(values).subscribe(result => {
      if (result.data != null && result.data.length !== undefined && result.data.length > 0) {
        this.gridData = result.data;
        totalCount = result.data.length;
      }
      this.gridView = {
        data: this.gridData,
        total: totalCount
      };
    },
      error => { },
      () => {
        if (callFunParam && callFunParam.callFunObj) {
          callFunParam.callFunObj(this, requestTable, requestArgObj);
        }
        this.Disabled = false;
      }
    );
  }

  Confrim() {

    if (!this.programCode) {
      this.msgSrv.info('请选择并发程序');
      return;
    }

    if (this.gridData.length <= 0) {
      return;
    }

    for (let i = 0; i < this.gridData.length; i++) {
      for (const key in this.gridData[i].argumentValue) {
        if (this.gridData[i].argumentValue[key].requiredFlag && !this.gridData[i].argumentValue[key].value) {
          this.msgSrv.info('【' + this.gridData[i].argumentValue[key].label + '】为必填项');
          return;
        }
      }
    }

    if (this.planEnty.scheduleType === 'P') {
      if (this.planEnty.resubmitEndDate && this.commonService.CompareDate(this.planEnty.runningTime, this.planEnty.resubmitEndDate) > 0) {
        this.msgSrv.info('起始日期不能大于终止日期');
        return;
      }
    }

    let concurrentProgramId = '0';
    const RequestSet = this.listOfProgram.find(x => x.value.toString() === this.programCode.toString());
    if (RequestSet !== undefined) {
      concurrentProgramId = RequestSet.concurrentProgramId;
    } else {
      this.msgSrv.info('没有获取到程序信息');
      return;
    }

    this.Disabled = true;
    const dicParaValue: { [key: string]: any; } = {};
    for (let i = 0; i < this.gridData.length; i++) {

      const prequest_set_stage_id = this.gridData[i].requestSetStageId;
      const prequest_set_program_id = this.gridData[i].requestSetProgramId;
      const pconcurrentProgramId = this.gridData[i].concurrentProgramId;
      const key = prequest_set_stage_id + ',' + prequest_set_program_id + ',' + pconcurrentProgramId;
      dicParaValue[key] = this.gridData[i].argumentValue;
    }

    const EtyRequest = {
      requestedBy: this.UserId,
      scheduleType: this.planEnty.scheduleType,
      requestedStartDate: this.planEnty.runningTime,
      responsibilityId: this.RespId,
      concurrentProgramId: concurrentProgramId,
      requestId: '0',
      requestSetId: this.programCode,
      description: '',
      resubmitInterval: this.planEnty.resubmitInterval || null,
      resubmitIntervalUnitCode: this.planEnty.resubmitIntervalUnitCode || '',
      resubmitIntervalTypeCode: this.planEnty.scheduleType === 'P' ? this.planEnty.resubmitIntervalTypeCode : '',
      scheduleStartDate: this.planEnty.runningTime,
      scheduleEndDate: this.planEnty.resubmitEndDate || '',
      resubmitted: this.planEnty.resubmitted,
      scheduleFlag: this.planEnty.scheduleFlag,
      incrementDates: this.planEnty.incrementDates ? 'Y' : 'N',
      dicParaValue: dicParaValue
    };

    this.requestSubmitQueryService.submitRequestSet(EtyRequest).subscribe(res => {
      if (res.code === 200) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('已经提交请求.(请求编号={0}).是否提交另一项请求?', res.msg),
          nzOnOk: () => {
            this.programCode = '';

            this.gridData = [];
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
              incrementDates: false
            };
          },
          nzOnCancel: () => {
            this.i.IsRefresh = true;
            this.modal.destroy();
          }
        });
      } else {
        this.msgSrv.error(res.msg);
      }
      this.programCode = '';
      this.Disabled = false;
    });
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
  close() {
    this.modal.destroy();
  }
}
