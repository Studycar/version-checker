/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-22 16:48:25
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { MoProcessMaintenanceService } from '../../../modules/generated_module/services/moprocess-maintenance-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { ProcessScheduleMoprocessMaintenanceViewComponent } from './view/view.component';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ProcessSchedulePoComVindicateComponent } from '../pocomvindicate/pocomvindicate.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { MoManagerService } from '../../../modules/generated_module/services/mo-manager-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-moprocess-maintenance',
  templateUrl: './moprocess-maintenance.component.html',
  providers: [QueryService],
})
export class ProcessScheduleMOProcessMaintenanceComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  context = this;
  plantoptions: any[] = [];
  groupoptions: any[] = [];
  resourceoptions: any[] = [];
  itemoptions: any[] = [];
  YesOrNo: any[] = [];
  isCheck = true;
  modifyPrivilege: string; // 当前用户的修改权限

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    public queryService: QueryService,
    private appconfig: AppConfigService,
    private querydata: MoProcessMaintenanceService,
    private commonquery: CommonQueryService,
    private msgSrv: NzMessageService,
    private apptranslate: AppTranslationService,
    private appGridStateService: AppGridStateService,
    private momanager: MoManagerService,
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } },
      {
        field: 'scheduleGroupCode',
        title: '计划组',
        ui: { type: UiType.select, options: this.groupoptions, eventNo: 2 },
      },
      { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.resourceoptions } },
      { field: 'sourceMakeOrderNum', title: '来源工单', ui: { type: UiType.text } },
      { field: 'projectNumber', title: '项目号', ui: { type: UiType.textarea } },
      { field: 'backlogFlag', title: '尾数标识', ui: { type: UiType.select, options: this.YesOrNo } },
      { field: 'processMakeOrderNum', title: '工序工单', ui: { type: UiType.textarea } },
      { field: 'processCode', title: '工序编码', ui: { type: UiType.text } },
      { field: 'timeRange', title: '工序时间范围', ui: { type: UiType.dateRange } },
      { field: 'itemCode', title: '物料编码', ui: { type: UiType.text } },
      { field: 'descriptionsCn', title: '物料描述', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      scheduleGroupCode: '',
      resourceCode: '',
      sourceMakeOrderNum: '',
      projectNumber: '',
      backlogFlag: '',
      processMakeOrderNum: '',
      processCode: '',
      timeRange: [],
      itemCode: '',
      descriptionsCn: '',
      pageIndex: 1,
      pageSize: 20,
    },
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: (dataItem) => {
        if (dataItem.data.scheduleFlag === '否') {
          return true;
        }
        return false;
      }, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processMakeOrderNum', headerName: '工序工单', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processCode', headerName: '工序编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processSeq', headerName: '工序号', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'descriptionsCn',
      headerName: '物料描述',
      tooltipField: 'descriptionsCn',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    { field: 'fpcTime', headerName: '计划开始时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'lpcTime', headerName: '计划完成时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'demandDate', headerName: '需求时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'earliestStartTime', headerName: '生产最早开始时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processMakeOrderType', headerName: '生产订单类型', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processMakeOrderStatus', headerName: '工序工单状态', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'mouldCode', headerName: '模具编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'projectNumber', headerName: '项目号', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'moQty', headerName: '任务数量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'completedQty', headerName: '完工数量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    // { field: 'LEFT_QTY', headerName: '剩余数量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },//未找到字段
    // { field: 'ISSUED_QTY', headerName: '发料数量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },//未找到字段
    { field: 'sourceMakeOrderNum', headerName: '来源工单', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentProcessMoNum', headerName: '上层工序工单号', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentFpcTime', headerName: '上层工序开始时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topProcessMoNum', headerName: '顶层工序工单号', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topFpsTime', headerName: '顶层工序开始时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentMoNum', headerName: '上层工单', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentFpsTime', headerName: '上层工单开始时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentMakeOrderStatus', headerName: '上层工单状态', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topMoNum', headerName: '顶层工单', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topFpsTime', headerName: '顶层工单开始时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topMakeOrderStatus', headerName: '顶层工单状态', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'scheduleFlag', headerName: '参与排产标识', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'backlogFlag', headerName: '尾单标识', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'backlogFlag', headerName: '尾单原因', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqNumber', headerName: '需求订单号', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqLineNum', headerName: '需求订单行号', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqComments', headerName: '备注', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'moWarnningFlag', headerName: '警告标识', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'comments', headerName: '例外信息', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'scheduleGroupCode', title: '计划组', width: 200, locked: true },
    { field: 'resourceCode', title: '资源', width: 200, locked: true },
    { field: 'processMakeOrderNum', title: '工序工单', width: 200, locked: true },
    { field: 'processCode', title: '工序编码', width: 200, locked: true },
    { field: 'processSeq', title: '工序号', width: 200, locked: true },
    { field: 'itemCode', title: '物料编码', width: 200, locked: true },
    { field: 'descriptionsCn', title: '物料描述', width: 200, locked: true },
    { field: 'fpcTime', title: '计划开始时间', width: 200, locked: true },
    { field: 'lpcTime', title: '计划完成时间', width: 200, locked: true },
    { field: 'demandDate', title: '需求时间', width: 200, locked: true },
    { field: 'earliestStartTime', title: '生产最早开始时间', width: 200, locked: true },
    { field: 'processMakeOrderType', title: '生产订单类型', width: 200, locked: true },
    { field: 'processMakeOrderStatusCh', title: '工序工单状态', width: 200, locked: true },
    { field: 'mouldCode', title: '模具编码', width: 200, locked: true },
    { field: 'projectNumber', title: '项目号', width: 200, locked: true },
    { field: 'moQty', title: '任务数量', width: 200, locked: true },
    { field: 'completedQty', title: '完工数量', width: 200, locked: true },
    // { field: 'LEFT_QTY', title: '剩余数量', width: 200, locked: true },//未找到字段
    // { field: 'ISSUED_QTY', title: '发料数量', width: 200, locked: true },//未找到字段
    { field: 'sourceMakeOrderNum', title: '来源工单', width: 200, locked: true },
    { field: 'parentProcessMoNum', title: '上层工序工单号', width: 200, locked: true },
    { field: 'parentFpcTime', title: '上层工序开始时间', width: 200, locked: true },
    { field: 'topProcessMoNum', title: '顶层工序工单号', width: 200, locked: true },
    { field: 'topFpsTime', title: '顶层工序开始时间', width: 200, locked: true },
    { field: 'parentMoNum', title: '上层工单', width: 200, locked: true },
    { field: 'parentFpsTime', title: '上层工单开始时间', width: 200, locked: true },
    { field: 'parentMakeOrderStatusCh', title: '上层工单状态', width: 200, locked: true },
    { field: 'topMoNum', title: '顶层工单', width: 200, locked: true },
    { field: 'topFpsTime', title: '顶层工单开始时间', width: 200, locked: true },
    { field: 'topMakeOrderStatusCh', title: '顶层工单状态', width: 200, locked: true },
    { field: 'scheduleFlagCh', title: '参与排产标识', width: 200, locked: true },
    { field: 'backlogFlagCh', title: '尾单标识', width: 200, locked: true },
    { field: 'backlogFlagCh', title: '尾单原因', width: 200, locked: true },
    { field: 'reqNumber', title: '需求订单号', width: 200, locked: true },
    { field: 'reqLineNum', title: '需求订单行号', width: 200, locked: true },
    { field: 'reqComments', title: '备注', width: 200, locked: true },
    { field: 'moWarnningFlagCh', title: '警告标识', width: 200, locked: true },
    { field: 'comments', title: '例外信息', width: 200, locked: true },
  ];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.momanager
      .GetPrivilege(
      this.appconfig.getUserId(),
      null,
      null,
      null,
    ).subscribe(res => {
      if(res.data){
        this.modifyPrivilege = 'Y';
      }else{
        this.modifyPrivilege = 'N';
      }
    });
    this.query();
    this.LoadData();
    
  }

  allColumnIds: any[] = [];

  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        /** 排除有自定义宽度的列*/
        if (!('width' in x.getColDef())) {
          this.allColumnIds.push(x.getColId());
        }
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  // 工序修改
  add(value: any) {
    if (this.modifyPrivilege === 'Y') {
      this.modal
        .static(
          ProcessScheduleMoprocessMaintenanceEditComponent,
          { j: { Id: (value !== undefined ? value.Id : null) } },
          'xl',
        ).subscribe(
          (value1) => {
            if (value1) {
              this.query();

            }
          },
        );
    } else {
      this.msgSrv.error('当前用户没有足够的权限，请与管理员联系');
    }
  }

  // 总结
  summary(item?: any) {
    this.modal
      .static(
        ProcessScheduleMoprocessMaintenanceViewComponent,
        {
          i: {
            plantCode: (item !== undefined ? item.plantCode : null),
            processMakeOrderNum: (item !== undefined ? item.processMakeOrderNum : null),
            FIXED: false,
          },
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  /**
   * showButton是否展示按钮
   * @param value
   */
  comdemand(value: any) {
    this.modal
      .static(
        ProcessSchedulePoComVindicateComponent,
        { j: { PROCESS_MO_NUMBER: (value !== undefined ? value.processMakeOrderNum : null), FIXED: false, HEIGHT: 308 } },
        'lg',
      ).subscribe(
        (value2) => {
          if (value2) {
            this.query();
          }
        },
      );
  }

  httpAction = {
    url: this.querydata.baseUrl,
    method: 'GET',
  };

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(), this.context);
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });

    this.plantChange(this.appconfig.getPlantCode());

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

  }
  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      scheduleGroupCode: '',
      resourceCode: '',
      sourceMakeOrderNum: '',
      projectNumber: '',
      backlogFlag: '',
      processMakeOrderNum: '',
      processCode: '',
      timeRange: [],
      itemCode: '',
      descriptionsCn: '',
      pageIndex: 1,
      pageSize: 20,
    };
  }

  GetQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
      sourceMakeOrderNum: this.queryParams.values.sourceMakeOrderNum,
      projectNumber: this.queryParams.values.projectNumber,
      processMakeOrderNum: this.queryParams.values.processMakeOrderNum,
      processCode: this.queryParams.values.processCode,
      itemCode: this.queryParams.values.itemCode,
      descriptionsCn: this.queryParams.values.descriptionsCn,
      backlogFlag: this.queryParams.values.backlogFlag,
      timeRange: this.queryParams.values.timeRange,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      fpcTime: this.queryParams.values.timeRange !== null && this.queryParams.values.timeRange.length > 0 ? this.commonquery.formatDate(this.queryParams.values.timeRange[0]) : null,
      lpcTime: this.queryParams.values.timeRange !== null && this.queryParams.values.timeRange.length > 0 ? this.commonquery.formatDate(this.queryParams.values.timeRange[1]) : null
    };
  }


  httpExportAction = {
    url: this.querydata.baseUrl,
    method: 'GET',
  };

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(), this.excelexport, this.context);
  }

  plantChange(value: any) {
    if (value === undefined) {
      value = '';
    }
    this.queryParams.values.scheduleGroupCode = '';
    this.groupoptions.length = 0;
    this.commonquery.GetUserPlantGroupOrderByCode(value || '', '', true).subscribe(res => {
      this.groupoptions.length = 0;
      res.data.forEach(element => {
        this.groupoptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode,
        });
      });
    });
  }

  groupChange(value: any) {
    this.queryParams.values.resourceCode = '';
    while (this.resourceoptions.length > 0) {
      this.resourceoptions.pop();
    }
    this.commonquery.GetUserPlantGroupLineOrderByCode(this.queryParams.values.plantCode, value, true).subscribe(res => {
      console.log("res  :",res);
      res.data.forEach(element => {
        this.resourceoptions.push({
          label: element.resourceCode,
          value: element.resourceCode,
        });
      });
    });
  }

  selectKeys = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
    let noNum = 0;
    const gridSelectRows = this.gridApi.getSelectedRows();
    gridSelectRows.forEach(element => {
      if (element.scheduleFlag === '否') {
        noNum++;
        this.isCheck = false;
      }
    });

    if (noNum === 0) {
      this.isCheck = true;
    }
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.query();
    } else {
      this.setLoading(false);
    }
  }

  // 参与排产
  takeSchedule() {
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要修改吗？'),
      nzOnOk: () => {
        this.querydata.ChangeSchedule(this.selectionKeys).subscribe(res => {
          if (res.Success === true) {
            this.msgSrv.success('修改成功');
            this.query();
            this.isCheck = false;
            this.selectionKeys = [];
          } else {
            this.msgSrv.error(res.Message);
          }
        });
      },
    });
  }
}
