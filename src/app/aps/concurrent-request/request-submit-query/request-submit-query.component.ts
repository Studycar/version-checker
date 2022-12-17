/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-08-01 17:49:16
 * @LastEditors: Zwh
 * @LastEditTime: 2019-10-15 10:44:21
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { RequestSubmitQueryService } from '../../../modules/generated_module/services/request-submit-query-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DomSanitizer } from '@angular/platform-browser';
import { ConcurrentRequestSearchRequestComponent } from './search-request/search-request.component';
import { ConcurrentRequestDiagnosisFormComponent } from './diagnosis-form/diagnosis-form.component';
import { ConcurrentRequestSessionFormComponent } from './session-form/session-form.component';
import { ConcurrentRequestViewrequestFormComponent } from './viewrequest-form/viewrequest-form.component';
import { ConcurrentRequestSubmitNewRequestFormComponent } from './submit-new-request-form/submit-new-request-form.component';
import { ConcurrentRequestRequestSetsFormComponent } from './request-sets-form/request-sets-form.component';
import { ConcurrentRequestSingleRequestFormComponent } from './single-request-form/single-request-form.component';
import { ConcurrentRequestPlanFormComponent } from './plan-form/plan-form.component';
import { EtyRequestPlan } from './model/EtyRequestPlan';
import { ParameterEntity } from './model/ParameterEntity';
import { ConcurrentRequestParameterFormComponent } from './parameter-form/parameter-form.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ConcurrentRequestLogFormComponent } from './log-form/log-form.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { RequestSubmitQueryStatusComponent } from './request-submit-query-status.component';
import { AppHubMessageService } from 'app/modules/base_module/services/app-hubmessage-service';
import { Subject } from 'rxjs';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { MyAgGridStateDirective } from '../../../modules/base_module/components/custom-aggrid-state.directive';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-submit-query',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './request-submit-query.component.html',
  providers: [AppConfigService],
  // styleUrls: ['./kk.css']
  styles: [`.k-grid .no-padding{padding:0}
          .whole-cell{display:block;padding:0;margin:0;}
          .ag-theme-balham .redColumn {background-color:#FF6666;}
          .ag-theme-balham .greenColumn {background-color:#90EE2C;}
          .ag-theme-balham .yellowColumn {background-color:#FFFF66;}`]
})
export class ConcurrentRequestRequestSubmitQueryComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;
  @ViewChild(MyAgGridStateDirective, { static: true }) agGridStateDirective;
  allColumns = [];
  PendingDisabled: boolean;
  DiagnosisDisabled: boolean;
  OutputDisabled: boolean;
  ArgDisabled: boolean;
  ManagerDisabled: boolean;
  CancelDisabled: boolean;
  SaveDisabled: boolean;
  LogDisabled: boolean;
  SessionDisabled: boolean;
  applicationYesNo: any[] = [];
  PendingText = '暂挂请求';

  scroll = { x: '1500px', y: '600px' };
  kendoHeight = document.body.clientHeight - 200;
  Params: any = {};
  i: any = {};
  sort: SortDescriptor[] = [];

  PlanArgmentObj: any = {};
  planEnty: EtyRequestPlan;

  public selectableSettings: SelectableSettings;
  public mySelection: any[] = [];
  public ColHidden = false;
  public gridView: GridDataResult;
  public gridData = [];
  public pageSize = 10;
  public skip = 0;
  public totalCount = 0;
  public IsSingleRequest = true;
  public IsSubmitRequest = true;
  public rowClassRules;
  public frameworkComponents;

  tabs = [
    {
      index: 1,
      active: true,
      name: '基本信息',
    },
    {
      index: 2,
      active: false,
      name: '计划选项',
    }
  ];
  /** 当前页签(tab) */
  selectIndex = 1;

  tabSubject = new Subject<{
    index: number;
    curColDef: any[];
    columnApi: any;
    gridApi: any;
  }>();

  stateKey = 'newrequest';

  get curTabKey() {
    return 'newrequest' + this.selectIndex;
  }

  tabFirstFlag = Array(this.tabs.length).fill(true);

  // 页签选择 & 个性化加载
  showColumns: any[] = [];
  /** 页签对应的agGrid需要隐藏的列 */
  hideObjs = [
    {
      tabIndex: 1,
      columns: [
        {
          field: 'scheduleTypeName',
        },
        {
          field: 'scheduleStartDate',
        },
        {
          field: 'scheduleEndDate',
        },
        {
          field: 'resubmitInterval',
        },
        {
          field: 'resubmitIntervalUnitName',
        },
        {
          field: 'resubmitIntervalTypeName',
        },
        {
          field: 'incrementDates',
        },

      ],
    },
    {
      tabIndex: 2,
      columns: [
        {
          field: 'parentRequestId',
        },
        {
          field: 'phaseName',
        },

        {
          field: 'statusName',
        },
        {
          field: 'argumentText',
        },
        {
          field: 'requestedStartDate',
        },

        {
          field: 'actualStartDate',
        },
        {
          field: 'actualCompletionDate',
        },
        {
          field: 'requestedBy',
        },
        {
          field: 'userConcurrentManangerName',
        },

      ],
    },

  ];

  /***/
  hiddenColumns = [];

  curTabColumns = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private sanitizer: DomSanitizer,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appHubMessageService: AppHubMessageService) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    /** 列头国际化i18n */
    this.headerNameTranslate(this.columns);
    super.setTopMargin(209);
    // 接收进度推送
    this.appHubMessageService.requestProgress().subscribe((data) => {
      console.log('接收进度推送:' + JSON.stringify(data));
      if (data.progress === 100) {
        this.Query();
      } else {
        this.RefreshStatus(data);
      }
    });

  }


  ngOnInit() {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    /** agGrid列 */
    this.allColumns = [
      {
        colId: 0,
        field: '',
        headerName: '操作',
        width: 130,
        pinned: this.pinnedAlign,
        lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
        suppressSizeToFit: true,
      },
      {
        field: 'requestId',
        headerName: '请求编号',
        width: 100,
        locked: true,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'userConcurrentProgramName',
        headerName: '名称',
        width: 200,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'statusName',
        width: 100,
        headerName: '状态',
        cellStyle: { 'text-align': 'center' },
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        cellRenderer: 'statusRenderer',
      },
      {
        field: 'phaseName',
        width: 80,
        headerName: '阶段',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'requestedStartDate',
        width: 130,
        headerName: '请求开始时间',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'actualStartDate',
        width: 120,
        headerName: '实际开始时间',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'actualCompletionDate',
        headerName: '实际结束时间',
        width: 120,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'requestedBy',
        width: 110,
        headerName: '申请人',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'priority',
        width: 120,
        headerName: '优先级',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'parentRequestId',
        width: 120,
        headerName: '父请求',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'userConcurrentManangerName',
        width: 120,
        headerName: '管理器',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'scheduleTypeName',
        width: 150,
        headerName: '计划类型',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'scheduleStartDate',
        width: 120,
        headerName: '调度开始时间',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'scheduleEndDate',
        width: 120,
        headerName: '调度结束时间',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'resubmitInterval',
        width: 120,
        headerName: '运行间隔时间',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'resubmitIntervalUnitName',
        width: 120,
        headerName: '单位',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'resubmitIntervalTypeName',
        width: 120,
        headerName: '间隔时间计算方法',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'incrementDates',
        width: 120,
        headerName: '日期参数增量',
        valueFormatter: 'ctx.optionsFind(value,1).label',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'argumentText',
        width: 120,
        headerName: '参数',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },

    ];
    this.loadOptions();
    this.Params.radioValue = 'A'; // 默认当前用户所有
    this.Params.currentUserId = this.appConfigService.getUserId(); // 当前用户<暂时写死>
    this.Params.requestId = '';
    this.Params.parentRequestId = '';
    this.Params.programId = '';
    this.Params.requestDate = '';
    this.Params.actualCompDate = '';
    this.Params.statusCode = '';
    this.Params.phaseCode = '';
    this.Params.userId = '';
    this.Params.days = '7'; // 默认查询7天

    this.i.Params = this.Params;
    this.i.daysDisable = false;
    this.i.othersDisable = true;

    this.selectableSettings = {
      checkboxOnly: false,
      mode: 'single'
    };

    this.SetButtonEnable();
    this.Query();
    this.rowClassRules = {
      'redColumn': function (params) {
        if (params.data.statusCode === 'E') {
          return true;
        }
      },
      'greenColumn': function (params) {
        if (params.data.statusCode === 'R') {
          return true;
        }
        if (params.data.statusCode === 'I' || params.data.statusCode === 'P') {
          if (params.data.holdFlag === 'Y') {
            return true;
          }
        }
      },
      'yellowColumn': function (params) {
        if (params.data.statusCode === 'W') {
          return true;
        }
        if (params.data.statusCode === 'I' || params.data.statusCode === 'P') {
          if (params.data.holdFlag !== 'Y') {
            return true;
          }
        }
      }
    };
    this.frameworkComponents = {
      ...this.gridOptions.frameworkComponents,
      statusRenderer: RequestSubmitQueryStatusComponent
    };

    this.gridOptions = {
      ...this.gridOptions,
      frameworkComponents: this.frameworkComponents,
    };
  }



  tabSelect(arg: any): void {
    if (arg.index == null) {
      this.selectIndex = 1;
    } else {
      this.selectIndex = arg.index;
    }

    /** 切换 stateKey */
    const curDisabledColumns = this.hideObjs.find(
      h => h.tabIndex === this.selectIndex,
    ).columns;
    this.curTabColumns = this.allColumns.filter(
      c => !curDisabledColumns.find(cc => cc.field === c.field),
    );
    this.tabSubject.next({
      index: this.selectIndex,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
    });
  }
  showloading() {
    this.gridApi.showLoadingOverlay();
  }
  /**
   * grid初始化加载
   * @param params aggrid回调参数
   */
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }

  private loadOptions() {
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.applicationYesNo);
  }
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationYesNo;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  // public columns = [
  //   {
  //     colId: 0, field: '', headerName: '操作', width: 150, pinned: this.pinnedAlign, lockPinned: true,
  //     headerComponentParams: {
  //       template: this.headerTemplate
  //     },
  //     cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
  //     cellRendererParams: {
  //       customTemplate: null,         // Complementing the Cell Renderer parameters
  //     }
  //   },
  //   { field: 'REQUEST_ID', headerName: '请求编号', pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab'], width: 100 },
  //   { field: 'USER_CONCURRENT_PROGRAM_NAME', headerName: '名称', tooltipField: 'USER_CONCURRENT_PROGRAM_NAME', pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'ARGUMENT10', headerName: '状态', pinned: 'left', tooltipField: 'ARGUMENT10', menuTabs: ['filterMenuTab', 'columnsMenuTab'], cellRenderer: 'statusRenderer', cellStyle: { 'text-align': 'center' }, width: 100 },

  //   { field: 'PHASE_NAME', headerName: '阶段', tooltipField: 'PHASE_NAME', menuTabs: ['filterMenuTab', 'columnsMenuTab'], width: 80 },
  //   { field: 'REQUESTED_START_DATE', headerName: '请求开始时间', tooltipField: 'REQUESTED_START_DATE', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'ACTUAL_START_DATE', headerName: '实际开始时间', tooltipField: 'ACTUAL_START_DATE', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'ACTUAL_COMPLETION_DATE', headerName: '实际结束时间', tooltipField: 'ACTUAL_COMPLETION_DATE', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'REQUESTED_BY', headerName: '申请人', tooltipField: 'REQUESTED_BY', menuTabs: ['filterMenuTab', 'columnsMenuTab'], width: 120 },
  //   { field: 'PRIORITY', headerName: '优先级', tooltipField: 'PRIORITY', menuTabs: ['filterMenuTab', 'columnsMenuTab'], width: 80 },
  //   { field: 'PARENT_REQUEST_ID', headerName: '父请求', tooltipField: 'PARENT_REQUEST_ID', menuTabs: ['filterMenuTab', 'columnsMenuTab'], width: 80 },
  //   { field: 'USER_CONCURRENT_MANANGER_NAME', headerName: '管理器', width: '120', tooltipField: 'USER_CONCURRENT_MANANGER_NAME', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'SCHEDULE_TYPE_NAME', headerName: '计划类型', width: '120', tooltipField: 'SCHEDULE_TYPE_NAME', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'SCHEDULE_START_DATE', headerName: '调度开始时间', tooltipField: 'SCHEDULE_START_DATE', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'SCHEDULE_END_DATE', headerName: '调度结束时间', tooltipField: 'SCHEDULE_END_DATE', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'RESUBMIT_INTERVAL', headerName: '运行间隔时间', tooltipField: 'RESUBMIT_INTERVAL', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'RESUBMIT_INTERVAL_UNIT_NAME', headerName: '单位', tooltipField: 'RESUBMIT_INTERVAL_UNIT_NAME', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'RESUBMIT_INTERVAL_TYPE_NAME', headerName: '间隔时间计算方法', tooltipField: 'RESUBMIT_INTERVAL_TYPE_NAME', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'INCREMENT_DATES', headerName: '日期参数增量', valueFormatter: 'ctx.optionsFind(value,1).label', tooltipField: 'INCREMENT_DATES', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  //   { field: 'ARGUMENT_TEXT', headerName: '参数', tooltipField: 'ARGUMENT_TEXT', menuTabs: ['filterMenuTab', 'columnsMenuTab'] }
  // ];

  resizeKendoHeight() {
    const clientHeight = document.body.clientHeight;
    const innerHeight = window.innerHeight;
    const screenHeight = window.screen.height;
    const availHeight = window.screen.availHeight;
    this.msgSrv.success(clientHeight + ' ' + innerHeight + ' ' + screenHeight + ' ' + availHeight);
  }

  // tabChange(ret: any) {
  //   if (ret.index === 0) {
  //     this.gridColumnApi.resetColumnState();
  //     this.gridColumnApi.setColumnVisible('SCHEDULE_TYPE_NAME', false);
  //     this.gridColumnApi.setColumnVisible('SCHEDULE_START_DATE', false);
  //     this.gridColumnApi.setColumnVisible('SCHEDULE_END_DATE', false);
  //     this.gridColumnApi.setColumnVisible('RESUBMIT_INTERVAL', false);
  //     this.gridColumnApi.setColumnVisible('RESUBMIT_INTERVAL_UNIT_NAME', false);
  //     this.gridColumnApi.setColumnVisible('RESUBMIT_INTERVAL_TYPE_NAME', false);
  //     this.gridColumnApi.setColumnVisible('INCREMENT_DATES', false);
  //     return;
  //   } else if (ret.index === 1) {
  //     this.gridColumnApi.resetColumnState();
  //     this.gridColumnApi.setColumnVisible('PARENT_REQUEST_ID', false);
  //     this.gridColumnApi.setColumnVisible('PHASE_NAME', false);
  //     this.gridColumnApi.setColumnVisible('STATUS_NAME', false);
  //     this.gridColumnApi.setColumnVisible('ARGUMENT_TEXT', false);
  //     this.gridColumnApi.setColumnVisible('REQUESTED_START_DATE', false);
  //     this.gridColumnApi.setColumnVisible('ACTUAL_START_DATE', false);
  //     this.gridColumnApi.setColumnVisible('ACTUAL_COMPLETION_DATE', false);
  //     this.gridColumnApi.setColumnVisible('REQUESTED_BY', false);
  //     this.gridColumnApi.setColumnVisible('USER_CONCURRENT_MANANGER_NAME', false);
  //     return;
  //   }
  // }

  // 查找请求
  FindRequest() {
    this.gridData.length = 0;
    this.i.IsRefresh = false;
    this.modal
      .static(ConcurrentRequestSearchRequestComponent, { i: this.i }, 450, 520)
      .subscribe(() => {
        if (this.i.IsRefresh) { this.Query(); }
      });
    // .subscribe((value) => {
    //   if (value) {
    //     this.Query();
    //   }
    // });
  }

  // 刷新数据
  Refresh() {
    this._pageNo = 1;
    this.Query();
  }

  // 提交请求
  SubRequest() {
    const ArgmentObj = {
      IsSingleRequest: true,
      IsSubmitRequest: false
    };
    this.modal
      .static(ConcurrentRequestSubmitNewRequestFormComponent, { i: ArgmentObj }, 450, 450)
      .subscribe(() => {
        if (ArgmentObj.IsSubmitRequest) {
          const IsRefreshObj = {
            IsRefresh: false
          };
          if (ArgmentObj.IsSingleRequest) {
            this.modal
              .static(ConcurrentRequestSingleRequestFormComponent, { i: IsRefreshObj }, 650, 250)
              .subscribe(() => { if (IsRefreshObj.IsRefresh) { this.Query(); } });
          } else {
            this.modal
              .static(ConcurrentRequestRequestSetsFormComponent, { i: IsRefreshObj }, 800, 400)
              .subscribe(() => { if (IsRefreshObj.IsRefresh) { this.Query(); } });
          }
        }
      });
  }

  // 暂挂请求
  PendingRequest(requestId: string) {
    // const requestId = this.mySelection[0];
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined && rowObj != null) {
      let holdFlag = rowObj.holdFlag;
      if (holdFlag === 'Y') {
        holdFlag = 'N';
      } else {
        holdFlag = 'Y';
      }
      // 将暂挂状态更新到数据库
      this.requestSubmitQueryService.updateHoldFlag(requestId, holdFlag).subscribe(res => {
        if (res.code === 200) {
          rowObj.holdFlag = holdFlag;
          this.SetButtonEnable();
          this.msgSrv.success(res.msg);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.msgSrv.info('请选择请求记录');
    }
  }

  // 取消请求
  CancelRequest(requestId: string) {
    // const requestId = this.mySelection[0];
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined && rowObj != null) {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('确定取消该请求？'),
        nzOnOk: () => {
          this.requestSubmitQueryService.cancelRequest(requestId).subscribe(res => {
            if (res.code === 200) {
              rowObj.phaseCode = 'C';
              rowObj.statusCode = 'X';
              rowObj.phaseName = '完成';
              rowObj.statusName = '已终止';
              this.msgSrv.success(res.msg);
              this.SetButtonEnable();
            } else {
              this.msgSrv.error(res.msg);
            }
          });
        }
      });
    } else {
      this.msgSrv.info('请选择请求记录');
    }
  }

  // 诊断
  Diagnosis(requestId: string) {
    // const requestId = this.mySelection[0];
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined && rowObj != null) {
      const ArgmentObj = {
        requestId: rowObj.requestId,
        userConcurrentProgramName: rowObj.userConcurrentProgramName,
        statusName: rowObj.statusName,
        phaseName: rowObj.phaseName
      };

      this.modal
        .static(ConcurrentRequestDiagnosisFormComponent, { i: ArgmentObj }, 450, 450)
        .subscribe();
    } else {
      this.msgSrv.info('请选择请求记录');
    }
  }

  // 参数信息
  Argument(requestId: string) {
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined) {
      const requestTable = rowObj;
      const number_of_arguments = requestTable.numberOfArguments;
      const hold_flag = requestTable.holdFlag;
      const concurrent_program_id = requestTable.concurrentProgramId;
      const dicParaValue: { [key: string]: ParameterEntity; } = {};

      for (let i = 1; i <= number_of_arguments; i++) {
        dicParaValue['argument' + i.toString()] = {
          value: requestTable['argument' + i.toString()] || '',
          defaultValue: '',
          sharedParameterName: '',
          requiredFlag: null,
          sharedValue: '',
          label: ''
        };
      }

      const ArgumentObj = {
        IsRead: hold_flag !== 'Y',
        IsRefresh: false,
        concurrentProgramId: concurrent_program_id,
        dicParamValue: dicParaValue
      };

      this.modal
        .static(ConcurrentRequestParameterFormComponent, { i: ArgumentObj }, 650, 450)
        .subscribe(() => {
          if (ArgumentObj.IsRefresh) {
            if (hold_flag === 'Y' && ArgumentObj.dicParamValue) {
              let paramText = '';
              for (const dicParamKey in ArgumentObj.dicParamValue) {
                dicParaValue[dicParamKey] = {
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
                paramText = paramText.substring(1);
              } else {
                return;
              }

              this.requestSubmitQueryService.updateParameters(requestId, paramText, dicParaValue).subscribe(res => {
                if (res.code === 200) {
                  for (const dicParamKey in ArgumentObj.dicParamValue) {
                    rowObj[dicParamKey] = ArgumentObj.dicParamValue[dicParamKey].value;
                  }
                  rowObj.argumentText = paramText;
                  this.msgSrv.success(res.msg);
                } else {
                  this.msgSrv.error(res.msg);
                }
              });
            }
          }
        });
    }
  }

  // 查看管理器请求
  ManagerRequest(requestId: string) {
    // const requestId = this.mySelection[0];
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined && rowObj != null) {
      const ArgmentObj = {
        requestId: rowObj.requestId,
        controllingManager: rowObj.controllingManager
      };

      this.modal
        .static(ConcurrentRequestViewrequestFormComponent, { Params: ArgmentObj })
        .subscribe();
    } else {
      this.msgSrv.info('请选择请求记录');
    }
  }

  // 修改
  Eidt(requestId: string) {
    // const requestId = this.mySelection[0];
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined && rowObj != null) {
      this.planEnty = {
        scheduleType: rowObj.scheduleType,
        scheduleFlag: rowObj.scheduleType === 'A' ? 'N' : 'Y',
        resubmitted: rowObj.scheduleType === 'P' ? 'Y' : 'N',
        runningTime: rowObj.scheduleStartDate,
        resubmitEndDate: rowObj.scheduleEndDate,
        resubmitInterval: rowObj.resubmitInterval,
        resubmitIntervalUnitCode: rowObj.resubmitIntervalUnitCode,
        resubmitIntervalTypeCode: rowObj.scheduleType === 'A' ? 'start' : rowObj.resubmitIntervalTypeCode,
        incrementDates: rowObj.incrementDates === 'Y' ? true : false
      };
      this.PlanArgmentObj.IsFill = false;
      this.PlanArgmentObj.planEnty = this.planEnty;
      this.modal
        .static(ConcurrentRequestPlanFormComponent, { i: this.PlanArgmentObj }, 600, 500)
        .subscribe(() => {
          if (this.PlanArgmentObj.IsFill) {

            // 将修改信息保存到数据库
            this.requestSubmitQueryService.updateRequestPlan(rowObj.requestId, rowObj.priority, rowObj.requestedStartDate, this.PlanArgmentObj.planEnty).subscribe(res => {
              if (res.code === 200) {
                rowObj.scheduleType = this.PlanArgmentObj.planEnty.scheduleType;
                if (this.PlanArgmentObj.planEnty.scheduleType === 'A') {
                  rowObj.requestedStartDate = this.PlanArgmentObj.planEnty.runningTime;
                  rowObj.scheduleStartDate = '';
                  rowObj.scheduleEndDate = '';
                  rowObj.resubmitInterval = '';
                  rowObj.resubmitIntervalUnitCode = '';
                  rowObj.resubmitIntervalTypeCode = '';
                  rowObj.incrementDates = 'N';
                  rowObj.scheduleTypeName = '立即';
                  rowObj.resubmitIntervalTypeName = '';
                  rowObj.resubmitIntervalUnitName = '';
                } else if (this.PlanArgmentObj.planEnty.scheduleType === 'O') {
                  rowObj.requestedStartDate = this.PlanArgmentObj.planEnty.runningTime;
                  rowObj.scheduleStartDate = this.PlanArgmentObj.planEnty.runningTime;
                  rowObj.scheduleEndDate = '';
                  rowObj.resubmitInterval = '';
                  rowObj.resubmitIntervalUnitCode = '';
                  rowObj.resubmitIntervalTypeCode = '';
                  rowObj.incrementDates = 'N';
                  rowObj.scheduleTypeName = '一次';
                  rowObj.resubmitIntervalTypeName = '';
                  rowObj.resubmitIntervalUnitName = '';
                } else if (this.PlanArgmentObj.planEnty.scheduleType === 'P') {
                  rowObj.requestedStartDate = this.PlanArgmentObj.planEnty.runningTime;
                  rowObj.scheduleStartDate = this.PlanArgmentObj.planEnty.runningTime;
                  rowObj.scheduleEndDate = this.PlanArgmentObj.planEnty.resubmitEndDate;
                  rowObj.resubmitInterval = this.PlanArgmentObj.planEnty.resubmitInterval;
                  rowObj.resubmitIntervalUnitCode = this.PlanArgmentObj.planEnty.resubmitIntervalUnitCode;
                  rowObj.resubmitIntervalTypeCode = this.PlanArgmentObj.planEnty.resubmitIntervalTypeCode;
                  rowObj.incrementDates = this.PlanArgmentObj.planEnty.incrementDates ? 'Y' : 'N';
                  rowObj.resubmitIntervalTypeName = this.PlanArgmentObj.planEnty.resubmitIntervalTypeCode === 'start' ? '从前一请求开始时间' : '从前一请求结束时间';
                  rowObj.scheduleTypeName = '定期';
                  this.commonQueryService.GetLookupByType('fndConcTimeUnitCode').subscribe(result => {
                    result.Extra.forEach(d => {
                      if (this.PlanArgmentObj.planEnty.resubmitIntervalUnitCode === d.lookupCode) {
                        rowObj.resubmitIntervalUnitName = d.meaning;
                      }
                    });
                  });
                }
                this.msgSrv.success(res.msg);
              } else {
                this.msgSrv.error(res.msg);
              }
            });
          } else {
            rowObj.resubmitIntervalUnitName = '';
          }
        });
    } else {
      this.msgSrv.info('请选择请求记录');
    }
  }

  // 查看输出
  Output(requestId: string) {
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined) {
      const outputFileName = rowObj.logfileName;
      const outputFileType = rowObj.outputFileType;
      this.requestSubmitQueryService.downloadOutPut(requestId, outputFileName, outputFileType).subscribe(result => {
        if (result.data && result.data.fileExists) {
          const OutPutContext = result.data.outPutContext;
          const fileType = result.data.fileType;
          const contentType = result.data.contentType;

          const a = document.createElement('a');
          const blob = new Blob([OutPutContext], { 'type': contentType });
          a.href = URL.createObjectURL(blob);
          a.download = rowObj.userConcurrentProgramName + '—' + requestId + fileType;
          a.click();
        } else {
          this.msgSrv.info('输出文件存放时间超出限定天数，已清除.');
        }
      });
    }
  }

  // 查看日志
  Log(requestId: string) {
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined) {
      const logFileName = rowObj.logfileName;
      this.requestSubmitQueryService.getLogText(requestId, logFileName).subscribe(result => {
        if (result.data && result.data.fileExists) {
          const LogText = result.data.logText;
          this.modal
            .static(ConcurrentRequestLogFormComponent, { requestId: requestId, LogText: LogText }, 'xl')
            .subscribe();
        } else {
          this.msgSrv.info('日志文件存放时间超出限定天数，已清除.');
        }
      });
    }
  }

  // 会话信息
  Session(requestId: string) {
    //  const requestId = this.mySelection[0];
    const rowObj = this.gridView.data.find(x => x.requestId === Number(requestId));
    if (rowObj !== undefined && rowObj != null) {
      if (rowObj.sid == null || rowObj.sid === '' || rowObj.instId == null || rowObj.instId === '') {
        this.msgSrv.info('没有可用的会话信息');
        return;
      }
      const ArgmentObj = {
        sid: rowObj.sid,
        instId: rowObj.instId
      };
      this.modal
        .static(ConcurrentRequestSessionFormComponent, { i: ArgmentObj }, 750, 650)
        .subscribe();
    } else {
      this.msgSrv.info('请选择请求记录');
    }
  }

  SetButtonEnable() {
    /*    const len = this.mySelection.length;
        if (len === 0) {
          this.PendingDisabled = true;
          this.DiagnosisDisabled = true;
          this.OutputDisabled = true;
          this.ArgDisabled = true;
          this.ManagerDisabled = true;
          this.CancelDisabled = true;
          this.SaveDisabled = true;
          this.LogDisabled = true;
          this.SessionDisabled = true;
          return;
        } else {
          const requestId = this.mySelection[0];
          const rowObj = this.gridView.data.find(x => x.REQUEST_ID === Number(requestId));
          this.DiagnosisDisabled = false;
          this.ArgDisabled = false;
  
          // 暂挂请求 / 取消暂挂
          const phase_code = rowObj.PHASE_CODE;
          if (phase_code === 'P') {
            this.PendingDisabled = false;
          } else {
            this.PendingDisabled = true;
          }
  
          const hold_flag = rowObj.HOLD_FLAG;
          if (hold_flag === 'N') {
            this.PendingText = '暂挂请求';
            this.SaveDisabled = true;
          } else {
            this.PendingText = '取消暂挂';
            this.SaveDisabled = false;
          }
  
          // Phase_code非P,R时取消请求按钮为灰色，不可选择
          if (phase_code === 'P' || phase_code === 'R') {
            this.ManagerDisabled = false;
            this.CancelDisabled = false;
          } else {
            this.ManagerDisabled = true;
            this.CancelDisabled = true;
          }
  
          // 会话 只有当phase_code为R时，才可点击
          this.SessionDisabled = phase_code !== 'R';
  
          // “查看输出”和“查看日志”按钮只有当phase_code为C时，才可点击，即其它状态，是灰色。
          if (phase_code === 'C') {
            this.LogDisabled = false;
            this.OutputDisabled = false;
          } else {
            this.LogDisabled = true;
            this.OutputDisabled = true;
          }
        }*/
  }

  /* public colorCode(unitPrice: number): SafeStyle {
     let result;
     if (unitPrice >= 10 && unitPrice < 20) {
       result = 'red';
     } else if (unitPrice >= 20) {
       result = 'yellow';
     }
     return this.sanitizer.bypassSecurityTrustStyle(result);
   }*/

  public rowCallback = (params) => {
    const status_code = params.value.statusCode;
    if (status_code === 'E') {
      return { red: true };
    } else if (status_code === 'W') {
      return { yellow: true };
    } else if (status_code === 'R') {
      return { green: true };
    } else if (status_code === 'I' || status_code === 'P') {
      const hold_flag = params.value.holdFlag;
      if (hold_flag !== 'Y') {
        return { green: true };
      } else {
        return { yellow: true };
      }
    } else {
      return {};
    }
  }

  // 返回选中行对象
  public mySelectionKey(context: RowArgs): string {
    // return this.getSelectString(String(context.index), context.dataItem.REQUEST_ID, context.dataItem.PHASE_CODE, context.dataItem.STATUS_CODE, context.dataItem.HOLD_FLAG);
    return context.dataItem.requestId;
  }

  // 选中行事件
  public onSelectedKeysChange(e) {
    this.SetButtonEnable();
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.loadItems();
    } else {
      this.setLoading(false);
    }
  }

  // 排序事件
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridView = {
      data: orderBy(this.gridData, sort),
      total: this.totalCount
    };
  }

  Query() {
    this.lastPageNo = 1;
    this.setLoading(true);
    this.loadItems();
  }

  // 根据页码获取对应的记录
  private loadItems(): void {
    this.mySelection = []; // 清空选中行
    this.requestSubmitQueryService.getRequest(this.Params, this.lastPageNo, this.lastPageSize).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = 0;
      if (result.data != null && result.data.content != null && result.data.content !== undefined) {
        result.data.content.forEach(t => {
          t.parentRequestId = t.parentRequestIdString;
          t.requestDate = t.requestDateString;
          t.sid = t.sidString;
          t.serial = t.serialString;
          t.instId = t.instIdString;
          t.actualStartDate = t.actualStartDateString;
          t.actualCompletionDate = t.actualCompletionDateString;
          t.priority = t.priorityString;
          t.scheduleStartDate = t.scheduleStartDateString;
          t.scheduleEndDate = t.scheduleEndDateString;
          t.resubmitInterval = t.resubmitIntervalString;
          t.requestedStartDate = t.requestedStartDateString;
          t.creationDate = t.creationDateString;
          t.lastUpdateDate = t.lastUpdateDateString;
        });
        this.gridData = result.data.content;
        this.totalCount = result.data.totalElements;
      }
      this.gridView = {
        data: this.gridData,
        total: this.totalCount
      };
      this.setLoading(false);
    },
      errMsg => { },
      () => { }
    );
  }

  RefreshStatus(data) {
    this.gridApi.forEachNode(function (rowNode) {
      if (rowNode.data.requestId === data.id) {
        if (data.status === 'C') {
          rowNode.data.statusName = '正常';
        } else if (data.status === 'E') {
          rowNode.data.statusName = '错误';
        } else if (data.status === 'W') {
          rowNode.data.statusName = '警告';
        }
        rowNode.data.statusCode = data.status;
        rowNode.data.argument10 = data.progress;
        rowNode.setDataValue('argument10', rowNode.data.argument10);
      }
    });
    console.log(data);
    this.gridApi.refreshCells({ columns: ['argument10'] });
  }
}
