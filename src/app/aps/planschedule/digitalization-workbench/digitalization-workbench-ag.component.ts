import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { EditService } from './edit.service';
import { PlanscheduleDigitalizationWorkbenchSearchComponent } from './search/search.component';
import { PlanscheduleDigitalizationWorkbenchSimulationComponent } from './simulation/simulation.component';
import { PlanscheduleDigitalizationWorkbenchRefreshComponent } from './refresh/refresh.component';
import { PlanscheduleDigitalizationWorkbenchPlanReleaseComponent } from './planrelease/planrelease.component';
import { PlantModelCalendarComponent } from '../../plant-model/calendar/calendar.component';
import { PlanscheduleDigitalizationWorkbenchBatchMoveComponent } from './batchMove/batchMove.component';
import { PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent } from './calculateWorking/calculateWorking.component';
import { ComVindicateComponent } from '../../plant-model/comvindicate/comvindicate.component';
import { PlanscheduleMomanagerEditComponent } from '../momanager/edit/edit.component';
import { PlanscheduleDigitalizationWorkbenchEndMoComponent } from './endMo/endMo.component';
import { PlanscheduleDigitalizationWorkbenchRemarkMoComponent } from './remarkMo/remarkMo.component';
import { PlanscheduleDigitalizationWorkbenchMoLevelComponent } from './moLevel/moLevel.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { PlanscheduleDigitalizationWorkbenchChooseLineComponent } from './chooseLine/chooseLine.component';
import { PlanscheduleShiftplanAgComponent } from '../shiftplan/shiftplan-ag.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PlanscheduleDigitalizationWorkbenchSplitMoComponent } from './splitMo/splitMo.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PlanscheduleDigitalizationWorkbenchDigitalizationComponent } from './digitalization/digitalization.component';
import { PlanscheduleShiftplanAnComponent } from './shiftPlanAn/shiftPlanAn.component';
import { PlanscheduleDigitalizationWorkbenchSetResourceAndRateComponent } from './setResourceAndRate/setResourceAndRate.component';
import { UpdateColorCellDirective } from '@shared/directive/update-color-cell/update-color-cell.directive';
import { ScheduleCheckReportComponent } from '../schedule-check-report/schedule-check-report.component';
import { PlanscheduleMoexceptionAgComponent } from '../moexception/moexception-ag.component';
import { MoUpdateAgComponent } from '../mo-update/mo-update-ag.component';
import { PlanscheduleDigitalizationWorkbenchMoSummary2Component } from './mo-summary/mo-summary2.component';
import { Router } from '@angular/router';
import { LOOKUP_CODE } from 'app/modules/generated_module/dtos/LOOKUP_CODE';
import { ResourceManuComponent } from './resource-manu/resource-manu.component';
import { DemandOrderManagementDemandclearupnoticeRawListComponent } from 'app/aps/demand-order-management/demandclearupnotice/raw-list/raw-list.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ICellRendererParams } from 'ag-grid-community';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-ag',
  templateUrl: './digitalization-workbench-ag.component.html',
  styles: [`
            .div_menu {
              position: relative;
              padding: 5px 0px;
              text-align:left;
            }

            .span_menu {
              display: inline-block;
              margin: 0px auto;
            }

            .dragging {
              -webkit-user-select: none; /* Safari */
              -ms-user-select: none; /* IE 10+ and Edge */
              user-select: none; /* Standard syntax */
            }

            ::ng-deep .ag-drag-handle {
              width: 100% !important;
            }

            .bindind_cls {
              display: block;
              width: 22px;
              height: 20px;
              font-size: 10px;
              line-height: 19px;
              background-color: #1890FF4D;
              text-align: center;
              color: #1890FF;
              border: solid 0.2px #1890FF80;
              border-radius: 4px;
              margin: auto;
              margin-right: 2px;
              flex-shrink: 0; /* 防止宽度被压缩 */
            }

          `],
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchAgComponent extends CustomBaseContext implements OnInit, AfterViewInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplateTime', { static: true }) customTemplateTime: TemplateRef<any>;
  @ViewChild('customTemplateTimeGd', { static: true }) customTemplateTimeGd: TemplateRef<any>;
  @ViewChild(UpdateColorCellDirective, { static: false }) ucc;

  defaultColDef = {
    ...this.defaultColDef,
    /** 配置列变更颜色逻辑,可按自身需求修改逻辑*/
    cellStyle: param => {
      let exist = false;
      let color = null;
      const cc = param.data.markColour;
      if (cc) {
        for (const c in cc) {
          if (cc[c].indexOf(param.column.colId) !== -1) {
            exist = true;
            color = c;
            break;
          }
        }
        if (exist) {
          return { backgroundColor: color };
        }
      }
    }
  };

  // 正在拖动时不能选中
  isDragging: boolean = false;

  yesOrNo: any[] = [];
  YesNoOptions: any[] = []; // PS_YES_NOT
  unitOptions: any[] = [];
  lockFlagOption: any[] = LOOKUP_CODE.LOCK_FLAG;
  gridOptions = {
    ...this.gridOptions,
    defaultColDef: this.defaultColDef,
  };
  // 选色卡
  pickerClose(color) {
    this.ucc.changeCellColor(color).subscribe(data => {
      // 传给服务的参数
      this.editService.MarkColour(data.data.id, JSON.stringify(data.record)).subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(this.appTranslationService.translate(this.Msg.SaveSuccess));
        }
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.search();
      this.onVirtualColumnsChanged(null);
    });
  }
  /* ------------------------------------------以下为参数定义---------------------------------------- */
  // headerTemplate
  private template =
    `<div class="ag-cell-label-container" role="presentation">
        <div ref="eLabel" class="ag-header-cell-label" role="presentation">
          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
        </div>
      </div>`;
  // grid资源下拉选项
  private lineSelects = [];
  background = '#90EE2C';
  backgroundYel = 'rgb(255,255,153)';
  // grid 设置行样式
  public getRowStyle = function (params) {
    /*if (params.node.data.childMakeOrderStatus === 'O' || params.node.data.lockFlag === 'L') {
      return { 'background-color': params.context.backgroundYel };
    } else {
      // return { 'background-color': '#fcfdfe', color: 'black' };
      return null;
    }*/
    if (params.node.data.pickingFlag === 'Y') {
      return { 'background-color': params.context.backgroundYel };
    } else {
      return null;
    }
  };

   /** 控制设置工作台呈现 */
   visible;

   /**
    * 关闭设置工作台
    */
   closePopUp() {
     this.visible = false;
     setTimeout(() => {
       this.visible = undefined;
     });
   }
  // 显示区列定义
  public columns = [
    {
      colId: 3, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 0, cellClass: '', field: 'drag', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      rowDrag: true,
      headerComponentParams: {
        template: this.template
      },
      cellStyle: param => {
        if (param.data.seqNoColor === 1) {
          return { backgroundColor: this.background };
        }
      },
      valueFormatter: 'ctx.optionsFind(value, 0)',
    },
    {
      colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.template
      },
      cellStyle: param => {
        if (param.data.seqNoColor === 1) {
          return { backgroundColor: this.background };
        }
      },
    },
    {
      field: 'seqNo', headerName: '顺序', width: 70, pinned: 'left', lockPinned: true,
      editable: true, cellEditor: 'agTextCellEditor'
    },
    { field: 'resourceDesc', headerName: '资源描述', width: 100 },
    { field: 'manufLineName', headerName: '产线描述', width: 100 },
    {
      field: 'standardsType', width: 100, headerName: '规格尺寸',
      // valueFormatter: 'ctx.formatSpec(value)',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'urgent', width: 100, headerName: '急要',
      valueFormatter: 'ctx.optionsFind1(value,8).label',
    },
    // { field: 'scheduleGroupCode', headerName: '计划组', width: 100 },
    { field: 'scheduleGroupCodeDescriptions', headerName: '计划组描述', width: 100 },
    // { field: 'resourceCode', headerName: '资源', width: 100 },
    // {
    //   field: 'resourceCode', headerName: '资源', width: 240, pinned: 'left', lockPinned: true,
    //   editable: true, cellEditor: 'agRichSelectCellEditor',
    //   cellEditorPopup: true,
    //   cellEditorParams: (params) => {
    //     if (params.colDef.field === 'resourceCode') {
    //       const dataItem = params.data;
    //       return this.loadLine(dataItem.plantCode, dataItem.itemId);
    //     }
    //   }
    // },
    // { field: 'manufLineCode', headerName: '产线编码', width: 100 },
    { field: 'stockName', headerName: '产品描述', width: 150, tooltipField: 'descriptionsCn' },
    {
      field: 'makeOrderNum', headerName: '工单号', width: 130,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    // { field: 'decalTechnology', headerName: '贴花工艺', width: 120, pinned: 'left', lockPinned: false },
    // { field: 'oilTechnology', headerName: '金油工艺', width: 120, pinned: 'left', lockPinned: false },
    // { field: 'cutColorTechnology', headerName: '截色工艺', width: 120, pinned: 'left', lockPinned: false },
    // {
    // field: 'stockCode', headerName: '产品编码', width: 120
    // },
    // {
    // field: 'itemId', headerName: '物料编码', width: 120
    // },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind1(value,5).label',
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind1(value,3).label',
    },
    // {
    //   field: 'standards', width: 100, headerName: '规格',

    // },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind1(value,6).label',
    },
    // {
    //   field: 'routeId', width: 100, headerName: '路径标识',

    // },
    {
      field: 'manufRoute', width: 100, headerName: '制造路径',
    },
    {
      field: 'productCategory', width: 100, headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind1(value,4).label',
    },
    // {
    //   field: 'length', width: 100, headerName: '长度',
    // },
    // {
    //   field: 'width', width: 100, headerName: '宽度',
    // },
    
    { field: 'fpcTime', headerName: '开始时间', width: 150 },
    { field: 'lpcTime', headerName: '完成时间', width: 150 },
    { field: 'unitOfMeasure', headerName: '单位', width: 80, valueFormatter: 'ctx.optionsFind1(value, 2).label' },
    { field: 'moQty', headerName: '工单数量', width: 100 },
    { field: 'planQty', headerName: '排产数量', width: 100 },
    { field: 'completedQtyTotal', headerName: '完工数量', width: 100 },
    { field: 'completedQty', headerName: '正常完工数量', width: 100 },
    { field: 'exCompletedQty', headerName: '异常完工数量', width: 100 },
    {
      field: 'residueNum',
      headerName: '剩余数量',
      tooltipField: 'residueNum',
    },
    // { field: 'standardFlagName', headerName: '标准工单类型', width: 120 },
    // { field: 'makeOrderTypeName', headerName: '工单类型', width: 100 },
    { field: 'makeOrderStatusName', headerName: '工单状态', width: 100 },
    { field: 'topMoNum', headerName: '顶层工单', width: 150 },
    { field: 'topFpcTime', headerName: '顶层工单开始时间', width: 150 },
    { field: 'topMakeOrderStatusName', headerName: '顶层工单状态', width: 120 },
    { field: 'parentMoNum', headerName: '父工单', width: 150 },
    { field: 'parentFpcTime', headerName: '父工单开始时间', width: 150 },
    { field: 'parentMakeOrderStatusName', headerName: '父工单状态', width: 120 },
    { field: 'childMoNum', headerName: '子工单', width: 150 },
    { field: 'childFpcTime', headerName: '子工单开始时间', width: 150 },
    { field: 'childMakeOrderStatusName', headerName: '子工单状态', width: 120 },
    { field: 'projectNumber', headerName: '项目号', width: 150 },
    // { field: 'completionSubinventory', headerName: '完工子库', width: 120 },
    // { field: 'exceptionMessage', headerName: '例外信息', width: 120, tooltipField: 'exceptionMessage' },
    {
      field: 'comments', headerName: '备注', width: 150,
      editable: true, cellEditor: 'agLargeTextCellEditor'
    },
    // { field: 'customerName', headerName: '客户名称', width: 120 },
    { field: 'reqNumber', headerName: '需求订单号', width: 120 },
    { field: 'reqLineNum', headerName: '需求订单行号', width: 120 },
    // { field: 'reqTypeName', headerName: '需求类型', width: 120 },
    { field: 'demandDate', headerName: '需求日期', width: 150 },
    // { field: 'inspectionTime', headerName: '验货时间', width: 150 },
    // { field: 'bondedFlag', headerName: '是否保税', width: 100 },
    { field: 'releasedDate', headerName: '发放时间', width: 150 },
    { field: 'releasedBy', headerName: '发放者', width: 100 },
    {
      field: 'fixScheduleTime', headerName: '固定时间', width: 150,
      // cellRendererFramework: CustomOperateCellRenderComponent,
      // cellRendererParams: {
      //   customTemplate: this.customTemplateTimeGd,
      // }
    },
    { field: 'completedDate', headerName: '完工时间', width: 150 },
    // { field: 'closedDate', headerName: '关闭时间', width: 150 },
    // { field: 'closedBy', headerName: '关闭者', width: 100 },
    // { field: 'fpsTime', headerName: '首件开始时间', width: 150 },
    // { field: 'fpcTime', headerName: '首件完成时间', width: 150 },
    // { field: 'lpsTime', headerName: '末件开始时间', width: 150 },
    // { field: 'lpcTime', headerName: '末件完成时间', width: 150 },
    // { field: 'fulfillTime', headerName: '最终完成时间', width: 150 },
    // { field: 'offsetLeadTime', headerName: '提前量（小时）', width: 150 },
    {
      field: 'earliestStartTime', headerName: '最早开始时间', width: 150,
      // cellRendererFramework: CustomOperateCellRenderComponent,
      // cellRendererParams: {
      //   customTemplate: this.customTemplateTime,
      // }
    },

    { field: 'creationDate', headerName: '创建时间', width: 170 },
    // { field: 'manfLeadTime', headerName: '生产时间(小时)', width: 150 },
    { field: 'switchTime', headerName: '换型时间（小时）', width: 150 },
    { field: 'bindindNum', headerName: '合并标识', width: 150 },
    // { field: 'oriMoNumber', headerName: '来源工单', width: 120 },
    // { field: 'derivedFlag', headerName: '拆分标识', width: 100 },
    // { field: 'oriMoQty', headerName: '来源MO数量', width: 120 },
    // { field: 'moWarnningFlag', headerName: '警告信息', width: 120 },
    // { field: 'scheduleFlag', headerName: '参与排产标识', width: 150, valueFormatter: 'ctx.optionsFind1(value, 1).label' },
    // { field: 'alternateBomDesignator', headerName: '替代BOM', width: 120 },
    // { field: 'mouldCode', headerName: '模具', width: 100 },
    { field: 'backlogFlag', headerName: '尾数标识', width: 100 },
    { field: 'backlogReason', headerName: '尾数原因', width: 150, tooltipField: 'backlogReason' },
    { field: 'kitFlag', headerName: '齐套类型', width: 150, valueFormatter: 'ctx.optionsFind1(value, 7).label' },
    { field: 'processingReq', headerName: '加工要求', width: 100 },
    { field: 'productStockName', headerName: '订单成品描述', width: 120 },
    { field: 'productSurface', headerName: '订单表面', width: 100 },
    { field: 'productCoatingUpName', headerName: '面膜存货描述', width: 120 },
    { field: 'rawBatchCode', headerName: '原料批号', width: 120 },
    { field: 'rawSpec', headerName: '原料规格尺寸', width: 120, filter: 'standardsTypeFilter' },
    // { field: 'rawWhName', headerName: '仓库名称', width: 120 },
    { field: 'rawWhPosCode', headerName: '库位编码', width: 120 },
    { field: 'rawCr', headerName: '化学成分Cr', width: 120 },
    { field: 'paper', headerName: '表面保护', width: 120, valueFormatter: 'ctx.optionsFind1(value, 9).label' },
    // { field: 'markColour', headerName: '颜色', hide: true }
  ];
  formatSpec(value) {
    const specs = value.split('*');
    if (specs.length > 1 && Number(specs[1]) === Math.floor(specs[1])) {
      specs[1] = Math.floor(specs[1]).toString();
    }
    if (specs.length > 2 && Number(specs[2]) === Math.floor(specs[2])) {
      specs[2] = Math.floor(specs[2]).toString();
    }
    return specs.join('*');
  }

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private router: Router,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public editService: EditService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService

  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.sumHeight = 40;
    this.setGridHeight({ topMargin: 120, bottomMargin: 45 });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);

    this.commonQueryService.GetColor('', 'MO_DATE_NO11', '').subscribe(result => {
      result.data.forEach(d => {
        this.background = d.colorValue;
      });
    });
  }

  ngOnInit() {
    this.defaultColDef.sortable = false;
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    const makeOrderNumIndex = this.columns.findIndex(col => col.field === 'makeOrderNum');
    if (makeOrderNumIndex > -1) {
      this.columns[makeOrderNumIndex].cellRendererParams.customTemplate = this.customTemplate1;
    }
    this.gridData = [];
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  async loadOptions() {
    await this.commonQueryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'FND_YES_NO': this.yesOrNo,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_SURFACE_PROTECT': this.surfaceProtectOptions,
    })
  }

  // 查询参数
  public queryValues = {
    regionCode: '',
    projectNumber: '',
    plantCode: this.appConfigService.getPlantCode(),
    groupCode: null,
    lineIdsStr: '',
    startTime: null,
    endTime: null,
    selection: [],
    expand: [],
    treeDataTable: []
  };
  // 刷新（计划发布/工单联动/上层联动）参数
  public refreshValues = {
    regionCode: '',
    plantCode: '',
    treeDataTable: [],
    selection: [],
    expand: [],
    treeDataTableAll: [],
    type: 1, // 类型：1刷新;2计划发布;3工单联动;4上层联动
    titleText: '刷新',
    setRefresh: function () {
      this.type = 1;
      this.titleText = '刷新';
    },
    setPlanRelease: function () {
      this.type = 2;
      this.titleText = '计划发布';
    },
    setMoLink: function () {
      this.type = 3;
      this.titleText = '工单联动';
    },
    setMoUpLink: function () {
      this.type = 4;
      this.titleText = '上层联动';
    },
    setSendMo2Mes: function () {
      this.type = 5;
      this.titleText = '下发工单到MES';
    },
  };
  // 物料工艺路线缓存 （查询时加载）
  public itemlines = [];
  // 是否已刷新
  public IsCompleterefresh = false;
  // grid当前选中行
  public gridSelectRow: any;
  // grid所有选中行
  public gridSelectRows: any[];
  // 提示语
  public Msg = {
    NeedQuery: '请先执行查询！',
    NeedRefresh: '请先执行排产刷新！',
    NeedSelect: '请先勾选记录!',
    ContrainSameResource: '请选择相同资源下的工单!',
    ConfirmFix: '确定要固定吗？',
    ConfirmCancelFix: '确定要取消固定吗？',
    SaveFail: '保存失败！',
    SaveSuccess: '保存成功！',
    SaveAGSuccess: '智能排产请求提交成功！',
    SaveAGError: '智能排产请求提交失败！',
    SubmitFail: '请求提交失败！',
    SubmitSuccess: '请求提交成功！',
    Fail: '操作失败！',
    Success: '操作成功！',
  };
  /* ------------------------------功能按钮事件----------------------------------- */
  // 查询
  public search() {
    this.modal
      .static(PlanscheduleDigitalizationWorkbenchSearchComponent, { i: this.queryValues }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }
  // 刷新(计划组选择 共用)
  private refreshCommon(resetSelection: Boolean) {
    if (this.queryValues.selection === null || this.queryValues.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    } else {
      this.generateTreeDataTable(this.refreshValues.treeDataTable);
      this.refreshValues.regionCode = this.queryValues.regionCode;
      this.refreshValues.plantCode = this.queryValues.plantCode;
      this.refreshValues.treeDataTableAll = this.queryValues.treeDataTable;
      if (resetSelection && this.gridApi.getSelectedRows().length > 0) {
        const lines = [];
        this.gridApi.getSelectedRows().forEach(row => {
          if (lines.findIndex(line => line === row.resourceCode) === -1) {
            lines.push(row.resourceCode);
          }
        });
        // 设置刷新的勾选项
        this.setRefreshSelection(lines);
      }
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchRefreshComponent, { i: this.refreshValues }, 'lg')
        .subscribe((val) => {
          if (val) {
            switch (this.refreshValues.type) {
              // 刷新
              case 1:
                this.refreshOperate();
                break;
              // 计划发布
              case 2:
                this.releaseOperate();
                break;
              // 工单联动
              case 3:
                this.moLinkOperate();
                break;
              // 上层联动
              case 4:
                this.upLinkOperate();
                break;
              // 下发工单到MES
              case 5:
                this.sendMO2Mes();
                break;
            }
          }
        });
    }
  }
  // 刷新
  public refresh(resetSelection: Boolean) {
    this.refreshValues.setRefresh();
    this.refreshCommon(resetSelection);
  }
  // 计划发布
  public PlanRelease() {
    /* 改为后台控制
    if (!this.IsCompleterefresh) {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedRefresh));
      return;
    }
    */
    if (this.queryValues.selection === null || this.queryValues.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    } else {
      // 设置为计划发布
      // this.refreshValues.setPlanRelease();
      this.refreshValues.setSendMo2Mes();
      this.refreshCommon(true);
    }
  }
  // 工单发放
  public moRelease() {
    if (this.selectionKeys.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请选择任意行!'),
      );
      return;
    }
    const selectionItems = [];
    this.gridData.forEach(d => {
      const key = d.id;
      if (this.selectionKeys.findIndex(k => k === key) > -1) {
        selectionItems.push(d.makeOrderNum);
      }
    });
    console.log('selectionItems', selectionItems);
    this.editService
      .moBacthRelease(
        selectionItems,
        0,
        '',
        this.queryValues.plantCode,
      )
      .subscribe(result => {
        if (result !== null && result.code === 200) {
          this.msgSrv.success(
            this.appTranslationService.translate(result.msg || '工单发放成功'),
          );
          this.query();
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(result.msg || '工单发放失败'),
          );
        }
      });
  }


  // 工单联动
  public moLink() {
    this.refreshValues.setMoLink();
    this.refreshCommon(true);
  }
  // 上层联动
  public moUpLink() {
    this.refreshValues.setMoUpLink();
    this.refreshCommon(true);
  }

  // 集约选线
  public chooseLine() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchChooseLineComponent, {
          i: {
            scheduleRegionCode: row.scheduleRegionCode,
            plantCode: row.plantCode,
            scheduleGroupCode: row.scheduleGroupCode,
            resourceCode: row.resourceCode
          },
          querySelection: this.queryValues.selection
        }, 'lg')
        .subscribe((value) => {
          if (value) {
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    }
  }
  // 顺序/资源 调整保存
  public save() {
    if (this.editService.hasChanges()) {
      const context = this;
      // 延时0.1秒执行获取最后一次调整的数据
      setTimeout(function () { context.adjustOperate(); }, 100);
    }
  }

  private batchSelection: any[] = []; // 按资源批量调整 资源勾选项
  private batchExpandtion: any[] = []; // 按资源批量调整 资源展开项
  // 按资源批量调整
  public batchMove() {
    if (this.selectionKeys.length > 0) {
      this.batchSelection = [];
      this.batchExpandtion = [];
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchBatchMoveComponent,
          {
            gridData: this.gridData,
            gridSelectionKeys: this.selectionKeys,
            selection: this.batchSelection,
            expandtion: this.batchExpandtion
          }, 1100)
        .subscribe((value) => {
          if (value) {
            const lines = [];
            this.gridApi.getSelectedRows().forEach(res => {
              if (lines.findIndex(l => l === res.resourceCode) === -1) {
                lines.push(res.resourceCode);
              }
            });
            const mo = this.batchSelection.find(x => x.level === 2); // level:0/1/2 代表 计划组/产线/MO
            lines.push(mo.parent.code);
            this.setRefreshSelection(lines); // 只允许批量调整一个计划组，所以此处取任取一计划组
            this.refresh(false);
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }
  // 智能排产
  public digitalization() {
    this.modal
      .static(PlanscheduleDigitalizationWorkbenchDigitalizationComponent, {
        i: {
          plantCode: this.appConfigService.getPlantCode()
        },
      }, 700, 500)
      .subscribe((value) => {

      });
  }

  // 产能平衡
  public calculateWorking() {
    if (this.selectionKeys.length > 0) {
      const gridSelectItems = this.gridSelectRows;
      const resourceCode = gridSelectItems[0].resourceCode;
      // 勾选了多个产线
      if (gridSelectItems.findIndex(x => x.resourceCode !== resourceCode) > -1) {
        this.msgSrv.warning(this.appTranslationService.translate(this.Msg.ContrainSameResource));
      } else {
        this.modal
          .static(PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent, { gridSelectItems: gridSelectItems }, 'lg')
          .subscribe((value) => {
            if (value) {
              this.query();
            }
          });
      }
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }
  // 置尾单
  public setEndMo() {
    if (this.selectionKeys.length > 0) {
      const moStatus = ['R', 'S']; // 只有已发放和未发放才允许置尾
      const notEndMos = this.gridData.filter(x => this.selectionKeys.findIndex(key => key === x.id) > -1 && moStatus.findIndex(s => s === x.makeOrderStatus) === -1);
      if (notEndMos !== undefined && notEndMos.length > 0) {
        let moList = '';
        notEndMos.forEach(x => { moList = moList + ',' + x.makeOrderNum; });
        this.msgSrv.warning(this.appTranslationService.translate('工单【' + moList.substr(1, moList.length - 1) + '】不允许置尾，只有已发放或者未发放的工单可以置尾！'));
      } else {
        this.modal
          .static(PlanscheduleDigitalizationWorkbenchEndMoComponent, { gridSelectKeys: this.selectionKeys }, 'lg')
          .subscribe((value) => {
            if (value) {
              this.query();
            }
          });
      }
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }
  // 固定
  public fixMo() {
    if (this.selectionKeys.length > 0) {
      // 弹出确认框
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(this.fixValues.fixType ? this.Msg.ConfirmFix : this.Msg.ConfirmCancelFix),
        nzOnOk: () => {
          const fixMoList = [];
          this.gridSelectRows.forEach(mo => { fixMoList.push({ id: mo.id, fixScheduleTime: mo.fpcTime }); });
          this.editService.FixMo(fixMoList, this.fixValues.fixType).subscribe(result => {
            if (result !== null && result.Success) {
              this.msgSrv.success(this.appTranslationService.translate(result.Message));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(result.Message || this.Msg.Fail));
            }
          });
        },
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }
  // 备注（选颜色）
  public remarkMo_color() {
    if (this.selectionKeys.length > 0) {
      const firstSelectItem = this.gridData.find(x => this.selectionKeys[0] === x.id);
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchRemarkMoComponent, { gridSelectKeys: this.selectionKeys, i: { comments: firstSelectItem.comments, color: firstSelectItem.attribute1 } }, 'md')
        .subscribe((value) => {
          if (value) {
            this.query();
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }
  // 备注
  public remarkMo() {
    if (this.editService.hasChanges()) {
      const that = this;
      // 延时0.1秒执行获取最后一次备注的数据
      setTimeout(function () {
        that.remarkOperate();
      }, 100);
    }
  }
  // 工单簇
  public openMoLevel() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      if (row && row.makeOrderNum) {
        const modal = this.confirmationService.create({
          // nzWrapClassName: 'modal-lg',
          nzTitle: this.appTranslationService.translate('工单簇'),
          nzContent: PlanscheduleDigitalizationWorkbenchMoLevelComponent,
          nzFooter: null,
          nzWidth: 1200,
          nzComponentParams: { i: { id: (row !== undefined ? row.id : null) } },
        });

        modal.afterOpen.subscribe(() => {
          const instance = modal.getContentComponent();
          instance.GetGraphicalMoLevel();
        });

        modal.afterClose.subscribe(() => {
          modal.destroy();
        });
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
      }
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    }
  }
  // 打开工单修改
  public openMoEdit() {
    if (this.selectionKeys.length > 0) {
      this.openMoEditCommon(this.selectionKeys[0]);
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }
  // 工单修改
  private openMoEditCommon(ID: string) {
    this.modal
      .static(PlanscheduleMomanagerEditComponent, { i: { id: ID } }, 'xl')
      .subscribe((value) => {
        this.hasEventTriggered = false;
        if (value) {
          this.query();
        }
      });
  }
  // 计划单拆分
  public splitMo(dataItem: any) {
    this.editService.splitMoCheck(dataItem).subscribe(result => {
      if (result.code === 200) {
        this.modal.static(PlanscheduleDigitalizationWorkbenchSplitMoComponent, { dataItem: dataItem }, 'lg').subscribe((value) => {
          if (value) {
            this.query();
          }
        });
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
    });
  }
  // 打开工单组件
  public openMoComponent() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      this.modal
        .static(ComVindicateComponent, { pShowTitle: true, pGridSelectRow: row }, 'lg')
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    }
  }
  // 打开排产表
  public openSchedule() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      let rows = this.gridApi.getSelectedRows();
      if (rows.length === 0) {
        rows = [row];
      }
      this.modal
        .static(PlanscheduleShiftplanAnComponent, { pShowTitle: true, pGridSelectRow: row, pGridSelectRows: rows }, 'xl')
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    }
  }
  // 打开排产检核报表
  public openCheckReport() {
    this.modal
      .static(ScheduleCheckReportComponent, {
        PLANT_CODE: this.queryValues.plantCode,
        dateTimeRange: [this.queryValues.startTime, this.queryValues.endTime],
        selection: this.queryValues.selection
      }, 'lg')
      .subscribe(() => { });
  }
  // 打开工作日历
  public openCalendar() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      this.modal
        .static(PlantModelCalendarComponent, { pShowTitle: true, pGridSelectRow: row }, 'xl')
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
    }
  }

  // 排产模拟
  public simulation() {
    this.router.navigate(['/planschedule/simulation'], { skipLocationChange: true, queryParams: { i: JSON.stringify(this.queryValues) } })
    // this.modal
    //   .static(PlanscheduleDigitalizationWorkbenchSimulationComponent, { i: this.queryValues, psAgComponent: this }, 'lg')
    //   .subscribe((value) => {
    //     if (value) {
    //       this.query();
    //     }
    //   });
  }

  /* -------------------------------服务请求调用-------------------------------- */
  // 查询，会重置过滤器
  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: '/api/ps/digitalizationworkbenchrs/queryAll', method: 'POST' };
  // 查询服务请求，不会重置过滤器
  private queryCommon() {
    const lineCodes = [];
    // 获取选中资源编码
    this.queryValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.code); } });
    const params = {
      scheduleRegionCode: this.queryValues.regionCode,
      plantCode: this.queryValues.plantCode,
      projectNumber: this.queryValues.projectNumber,
      productLineCodeList: lineCodes,
      startTime: this.editService.formatDate(this.queryValues.startTime),
      endTime: this.editService.formatDate(this.queryValues.endTime),
      isLoadRoutings: true,
      ids: []
    }
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      params,
      this.context,
      this.dataPreFilter,
      this.afterCallBack
    );
  }

  dataPreFilter = (result) => {
    result.data.forEach(d => { 
      d.markColour = JSON.parse(d.markColour); 
      d.demandDate = this.commonQueryService.formatDate(d.demandDate); 
    });
    // this.gridData = result.data;
    this.itemlines = result.extra; // 物料工艺路线
    // setTimeout(() => {
      // this.gridApi.redrawRows(); // 重绘，清除前一次查询的样式
      // this.gridApi.setFilterModel(null);
    // }, 300);
    return result;
  }

  afterCallBack = () => {
    this.editService.reset();
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 0);
  }
  // 刷新服务请求
  private refreshOperate() {
    const lineCodes = [];
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.code); } });
    const plantCode = this.refreshValues.plantCode;
    this.editService.Refresh(plantCode, lineCodes, this.editService.formatDate(this.queryValues.startTime), this.editService.formatDate(this.queryValues.endTime)).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(result.msg || this.Msg.Success));
        this.query();
        this.IsCompleterefresh = true;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg || this.Msg.Fail), this.msgOption);
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 设置刷新产线勾选项(queryValues.selection数据项结构 [{ ID: i.ID, CODE: i.RESOURCE_CODE, DESCRIPTION: i.DESCRIPTIONS }])
  private setRefreshSelection(lineCodes: string[]) {
    if (this.queryValues.selection !== undefined && this.queryValues.selection.length > 0) {
      this.refreshValues.selection.length = 0;
      // 遍历查询勾选项的产线
      this.queryValues.selection.forEach(x => {
        if (x.level === 1 && lineCodes.findIndex(z => z === x.code) > -1) {
          this.refreshValues.selection.push({ id: x.id, code: x.code, description: x.description });
        }
      });
    }
  }
  // 调整服务请求
  private adjustOperate() {
    // 开始加载
    this.setLoading(true);
    const updateResources = []; // 调整顺序/资源需要更新MO优先级的资源
    this.editService.getUpdateItems().forEach(x => {
      if (updateResources.findIndex(r => r === x.resourceCode) === -1) {
        updateResources.push(x.resourceCode);
      }
      if (x.resourceCode !== x.resourceCodeOld && updateResources.findIndex(r => r === x.resourceCodeOld) === -1) {
        updateResources.push(x.resourceCodeOld);
      }
    });
    const dtos = []; // 调整参数列表
    let RESOURCE_CODE = '';
    let index = 1;
    this.gridData.forEach(x => {
      // 只取与调整相关资源的MO传回中间件服务
      if (updateResources.findIndex(r => r === x.resourceCode || r === x.resourceCodeOld) > -1) {
        if (x.resourceCode !== RESOURCE_CODE) {
          index = 1;
          RESOURCE_CODE = x.resourceCode;
        }
        // 未编辑的按顺序更新序号,有编辑的以编辑为准
        if (x.seqNo === x.seqNoOld) {
          x.seqNo = index;
          x.seqNoOld = index;
        }
        // 传给服务的参数
        const dto = {
          id: x.id,
          seqNo: x.seqNo,
          plantCode: x.plantCode,
          resourceCode: x.resourceCode,
          resourceCodeOld: x.resourceCodeOld,
          fpcTime: x.fpcTime,
          bindindNum: x.bindindNum,
        };
        dtos.push(dto);
        index++;
      }
    });
    this.editService.Save(this.queryValues.regionCode, this.queryValues.plantCode, this.editService.formatDate(this.queryValues.startTime), this.editService.formatDate(this.queryValues.endTime), dtos).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(this.Msg.SaveSuccess + '<br/>' + result.msg));
        const lines = []; // 产线列表
        this.editService.getUpdateItems().forEach(x => {
          // 目标产线
          if (lines.findIndex(l => l === x.resourceCode) === -1) {
            lines.push(x.resourceCode);
          }
          // 原产线
          if (lines.findIndex(l => l === x.resourceCodeOld) === -1) {
            lines.push(x.resourceCodeOld);
          }
        });
        // 设置刷新的勾选项
        this.setRefreshSelection(lines);
        // 刷新
        this.refresh(false);
        // 重置修改信息
        this.editService.reset();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(this.Msg.SaveFail + '<br/>' + result.msg));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 备注服务请求
  private remarkOperate() {
    const dtos = []; // 备注参数列表
    this.editService.getUpdateItems().forEach(x => {
      // 传给服务的参数
      const dto = {
        id: x.id,
        comments: x.comments,
        attribute1: x.attribute1
      };
      dtos.push(dto);
    });
    // 开始加载
    this.setLoading(true);
    this.editService.RemarkMo(dtos).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(this.Msg.SaveSuccess));
        // 重置修改信息
        this.editService.reset();
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(this.Msg.SaveFail + '<br/>' + result.msg));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 计划发布服务请求
  private releaseOperate() {
    const lineCodes = [];
    let groupCode = '';
    this.refreshValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.code); groupCode = x.parent.code; } });
    this.modal
      .static(PlanscheduleDigitalizationWorkbenchPlanReleaseComponent,
        {
          i: {},
          regionCode: this.queryValues.regionCode,
          plantCode: this.queryValues.plantCode,
          lineCodes: lineCodes,
          startTime: this.queryValues.startTime,
          endTime: this.queryValues.endTime,
          schedule_group_code: groupCode,
          mainForm: this.context
        }, 'lg').subscribe((value) => {
          if (value) {
            this.query();
          }
        });
  }
  // 工单联动
  private moLinkOperate() {
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    console.log('--------------this.refreshValues.selection', this.refreshValues.selection);
    const plantCode = this.refreshValues.plantCode;
    const resourceInfos = this.getResourceInfos();

    this.editService.SubmitRequest_MoRecursive(plantCode, resourceInfos).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('数字化排产' + result.msg || this.Msg.SubmitSuccess));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('数字化排产' + result.msg || this.Msg.SubmitFail));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 上层联动
  private upLinkOperate() {

    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    console.log('this.refreshValues.selection', this.refreshValues.selection);
    const resourceInfos = this.getResourceInfos();

    const plantCode = this.refreshValues.plantCode;
    this.editService.SubmitRequest_UpperLevelLinkage(plantCode, resourceInfos).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('数字化排产' + result.msg || this.Msg.SubmitSuccess));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('数字化排产' + result.msg || this.Msg.SubmitFail));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 工单下发到MES
  private sendMO2Mes() {
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    console.log('this.refreshValues.selection', this.refreshValues.selection);
    const lineCodes = [];
    this.refreshValues.selection.forEach(x => { lineCodes.push(x.code); });


    const plantCode = this.refreshValues.plantCode;
    this.editService.SubmitRequest_SendMO2Mes(plantCode, lineCodes).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('工单下发到MES' + result.msg || this.Msg.SubmitSuccess));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('工单下发到MES失败!' + result.msg || this.Msg.SubmitFail));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  /* ----------------------------------其他方法------------------------------------- */
  // 固定按钮文本显示参数
  public fixValues = {
    buttonText: '固定时间', // 勾选的第一项已固定时显示'取消固定'，否则显示'固定时间'
    fixType: true, // 类型：true固定;false取消固定
    setFix: function () {
      this.buttonText = '固定时间';
      this.fixType = true;
    },
    setNotFix: function () {
      this.buttonText = '取消固定';
      this.fixType = false;
    }
  };
  // 固定文本变更
  private fixTypeChange() {
    if (this.selectionKeys.length > 0) {
      const firstSelectItem = this.gridData.find(x => this.selectionKeys[0] === x.id);
      if (firstSelectItem.fixScheduleTime !== null && firstSelectItem.fixScheduleTime !== '') {
        this.fixValues.setNotFix();
      } else {
        this.fixValues.setFix();
      }
    } else {
      this.fixValues.setFix();
    }
  }
  // 加载物料工艺路线（资源）
  private loadLine(plantCode: string, itemId: string): any {
    this.lineSelects.length = 0;
    if (this.itemlines.length > 0) {
      const lines = this.itemlines.filter(x => x.plantCode === plantCode && x.itemId === itemId);
      lines.forEach(x => {
        this.lineSelects.push({
          value: x.resourceCode,
          label: x.showDesc,
          manufLineName: x.manufLineName,
          resourceDescription: x.resourceDescription,
        });
      });
    }
    return {
      options: this.lineSelects,
      isShowTitle: true,
      title: 'resourceDescription',
      subTitle: 'manufLineName',
      titleKey: 'resourceDescription',
      subTitleKey: 'manufLineName',
    };
  }
  // 根据查询选中项生成资源选择树
  private generateTreeDataTable(treeDataTable: any[]) {
    treeDataTable.length = 0;
    const expand = true;
    const checked = false;
    // 添加计划组
    this.queryValues.selection.forEach(x => {
      if (x.level === 0) {
        treeDataTable.push({ id: x.id, code: x.code, description: x.description, children: [], expand: expand, checked: checked });
      } else if (x.parent !== undefined) { // 未勾选计划组时
        const item = treeDataTable.find(y => y.id === x.parent.id);
        if (item === undefined || item === null) {
          treeDataTable.push({ id: x.parent.id, code: x.parent.code, description: x.parent.description, children: [], expand: expand, checked: checked });
        }
      }
    });
    // 添加资源
    treeDataTable.forEach(x => {
      this.queryValues.selection.forEach(y => {
        if (y.parent !== undefined && y.parent.id === x.id) {
          x.children.push({ id: y.id, code: y.code, description: y.description, expand: expand, checked: checked });
        }
      });
    });
  }
  // 获取工单联动/上层联动的资源参数
  private getResourceInfos() {
    const resourceInfos = [];
    this.refreshValues.selection.forEach(ele => {
      console.log(ele);
      if (ele.level !== 1) {
        return;
      }
      let scheduleGroupCode = ele.parent.code;
      if (resourceInfos.length === 0) {
        resourceInfos.push({ scheduleGroupCode: scheduleGroupCode, resourceCodes: [ele.code] });
      } else {
        let exist = false;
        for (let i = 0; i < resourceInfos.length; i++) {
          if (resourceInfos[i].scheduleGroupCode === scheduleGroupCode) {
            resourceInfos[i].resourceCodes.push(ele.code);
            exist = true;
            break;
          }
        }
        if (!exist) {
          resourceInfos.push({ scheduleGroupCode: scheduleGroupCode, resourceCodes: [ele.code] });
        }
      }
    });
    console.log(resourceInfos);
    return resourceInfos;
  }

  /* ---------------------------------grid事件---------------------------------- */
  public getRowNodeId = function getRowNodeId(data) {
    return data.id;
  };

  onRowDragEnter(e) {
    console.log('onRowDragEnter');
    this.isDragging = true;
  }

  onRowDragMove(event) {
    // console.log('onRowDragMove');
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode !== overNode;
    // 确保 movingNode、overNode 是存在的数据
    if (rowNeedsToMove && !this.isNull(movingNode) && !this.isNull(overNode)) {
      const movingData = movingNode.data;
      const overData = overNode.data;
      const newStore = this.gridData.slice(); // []浅拷贝
      /* --------批量拖动start------ */
      const selectedRows = [movingData]; // 防止拖动行未选中
      // 1.获取需移动的行数据（选中行）
      this.gridApi.getSelectedRows().forEach(row => { if (selectedRows.indexOf(row) === -1) selectedRows.push(row); });
      // 2.调整gridData浅拷贝数据行的顺序
      // 当目标行是选中行时不调整数据行顺序
      if (selectedRows.indexOf(overData) === -1) {
        let movingDatas = [];
        if (selectedRows.length === 1) {
          movingDatas = selectedRows;
        } else {
          const movingIndex = this.gridData.indexOf(movingData);
          const overIndex = this.gridData.indexOf(overData);
          const dragDown = movingIndex < overIndex; // 向下拖动，确定鼠标拖动方向
          let index = 0;
          this.gridData.forEach(data => {
            const moveDown = index < overIndex; // 确定当前行在目标行的上下方向
            // 选中项与拖动方向一致才移动行
            if (selectedRows.indexOf(data) > -1) {
              if (dragDown === moveDown) {
                if (dragDown) {
                  movingDatas.unshift(data); // 向下移动，待移动行逆序排序
                } else {
                  movingDatas.push(data); // 向上移动，待移动行顺序排序
                }
              }
            }
            index++;
          });
        }
        movingDatas.forEach(data => {
          // 相同资源范围内拖动
          if (data.resourceCode === overData.resourceCode) {
            const fromIndex = newStore.indexOf(data);
            const toIndex = newStore.indexOf(overData);
            moveInArray(newStore, fromIndex, toIndex);
          }
        });
      }
      /* --------批量拖动end----- */
      newStore.forEach(data => {
        if (data) {
          data.seqNo = data.seqNoOld; // 移动后忽略之前对顺序号的更改
        } else {
          console.log('onRowDragMove, data, null');
        }
      });
      this.gridData = this.clone(newStore);
      this.gridApi.setRowData(this.gridData);
      this.gridApi.clearFocusedCell();
    }
    function moveInArray(arr: any[], fromIndex: number, toIndex: number) {
      const element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element); // 在目标后插入
    }
  }

  onRowDragEnd(e) {
    console.log('onRowDragEnd');
    const data = e.node.data;
    // 修改更新标记
    // this.editService.update(data);
    this.calculateFPC(data);

    this.gridData = this.clone(this.gridData);
    setTimeout(() => {
      this.isDragging = false;
    }, 0);
  }

  onRowDragLeave(e) {
    console.log('onRowDragLeave', e);
  }
  // 行选中
  onRowSelected(event) {
    // console.log(event);
    this.setCurrentSelectedRow(event.data);
  }
  // 单元格双击
  onCellDoubleClicked(event) {
    if (event.colDef.field === 'makeOrderNum') {
      if (this.checkEventTriggered()) return;
      this.openMoEditCommon(event.data.id);
    }
  }
  // 修改序号
  CHANGE_INDEX = 0;
  // 根据拖动位置计算FPC/LPC
  calculateFPC(item: any) {
    console.log('calculateFPC');
    const datas = [...this.gridApi.getSelectedRows()];
    if (datas.findIndex(data => data === item) === -1) {
      datas.push(item);
    }
    const dataSort = [];
    // 按顺序排列
    this.gridData.forEach(gdata => {
      if (datas.findIndex(data => data === gdata) > -1) {
        dataSort.push(gdata);
      }
    });
    dataSort.forEach(data => {
      data.changeIndex = ++this.CHANGE_INDEX;
      // 修改更新标记
      this.editService.update(data);
      const moList = this.gridData.filter(x => x.resourceCode === data.resourceCode); // 取同一生产线的MO
      if (moList.length > 1) {
        // 根据位置计算FPC_TIME/LPC_TIME
        const index = moList.indexOf(data);
        let fpc = new Date(data.fpcTime);
        let lpc = new Date(data.lpcTime);
        if (index === 0) {
          const targetMo = moList[dataSort.length]; // 取计算参考MO
          const timespan = lpc.getTime() - fpc.getTime(); // 毫秒数
          data.lpcTime = targetMo.fpcTime;
          lpc = new Date(data.lpcTime);
          data.fpcTime = this.editService.formatDateTime(new Date(lpc.getTime() - timespan));
        } else {
          const targetMo = moList[index - 1]; // 取计算参考MO
          const timespan = lpc.getTime() - fpc.getTime();
          // data.FPC_TIME = targetMo.LPC_TIME;
          const targetFpc = new Date(targetMo.fpcTime);
          data.fpcTime = this.editService.formatDateTime(new Date(targetFpc.getTime() + 1000));

          fpc = new Date(data.fpcTime);
          data.lpcTime = this.editService.formatDateTime(new Date(fpc.getTime() + timespan));
        }
      }
    });
  }
  // 根据序号计算FPC/LPC
  calculateFPC_SEQ(data: any) {
    data.changeIndex = ++this.CHANGE_INDEX;
    // 修改更新标记
    this.editService.update(data);
    const moList = this.gridData.filter(x => x.resourceCode === data.resourceCode); // 取同一生产线的MO
    if (moList.length > 1) {
      // 根据位置计算FPC_TIME/LPC_TIME
      const lgList = moList.filter(x => x.seqNo > data.seqNo).sort((a, b) => {
        return a.seqNo - b.seqNo;
      });
      const smList = moList.filter(x => x.seqNo < data.seqNo).sort((a, b) => {
        return b.seqNo - a.seqNo;
      });
      let fpc = new Date(data.fpcTime);
      let lpc = new Date(data.lpcTime);
      if (smList.length > 0) {
        const targetMo = smList[0]; // 取计算参考MO
        const timespan = lpc.getTime() - fpc.getTime();
        // data.FPC_TIME = targetMo.LPC_TIME;
        const targetFpc = new Date(targetMo.fpcTime);
        data.fpcTime = this.editService.formatDateTime(new Date(targetFpc.getTime() + 1000));

        fpc = new Date(data.fpcTime);
        data.lpcTime = this.editService.formatDateTime(new Date(fpc.getTime() + timespan));
      } else if (lgList.length > 0) {
        const targetMo = lgList[0]; // 取计算参考MO
        const timespan = lpc.getTime() - fpc.getTime(); // 毫秒数
        data.lpcTime = targetMo.fpcTime;
        lpc = new Date(data.lpcTime);
        data.fpcTime = this.editService.formatDateTime(new Date(lpc.getTime() - timespan));
      }
      this.gridData = this.clone(this.gridData);
    }
  }
  // 单元格内容改变
  onCellValueChanged(event) {
    // console.log(event);
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString() && this.editColumnHeaders.findIndex(x => x === event.colDef.headerName) > -1) {
      if (event.colDef.headerName === '顺序') {
        this.calculateFPC_SEQ(event.data);
      } else {
        // 修改更新标记
        this.editService.update(event.data);
      }
    }
  }
  // 行选中改变
  onSelectionChanged(event) {
    // console.log(event);
    this.gridSelectRows = this.gridApi.getSelectedRows();
    this.selectionKeys = [];
    if (!this.isNull(this.gridSelectRows) && this.gridSelectRows.length > 0) {
      this.gridSelectRows.forEach(d => { this.selectionKeys.push(d.id); });
      // 设置当前选中行
      this.setCurrentSelectedRow(this.gridSelectRows[this.gridSelectRows.length - 1]);
    } else {
      // 设置当前选中行
      this.setCurrentSelectedRow(this.gridData[0]);
    }
    this.fixTypeChange();
  }

  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }

  // 条件过滤，过滤后重新统计
  onFilterChanged(event) {
    const filterActive = this.gridApi.isAnyFilterPresent();
    this.gridApi.setSuppressRowDrag(filterActive);
    this.gridColumnApi.setColumnsVisible(['drag'], !filterActive);
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'seqNo';
    // 需要统计的列数组
    const fields = ['moQty', 'planQty', 'completedQtyTotal', 'completedQty', 'exCompletedQty', 'residueNum'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['顺序', '资源', '备注'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#digitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }
  // 设置当前选中行
  private setCurrentSelectedRow(rowData: any) {
    if (!this.isNull(rowData)) {
      // 保存当前选中行
      this.gridSelectRow = rowData;
      // 默认当前记录为刷新选中项
      this.refreshValues.selection.length = 0;
      this.queryValues.selection.forEach(x => {
        if (x.level === 1 && this.gridSelectRow.resourceCode === x.code) {
          this.refreshValues.selection.push({ id: x.id, code: x.code, description: x.description, level: 1 });
        }
      });
    }
  }
  // 工单指定
  public setResourceAndRate() {
    if (this.selectionKeys.length > 0) {
      const selectionKeys = [];
      this.gridData.forEach(d => {
        const key = d[this.selectBy];
        if (this.selectionKeys.findIndex(k => k === key) > -1) {
          selectionKeys.push(key);
        }
      });
      const linesReturn = [];
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchSetResourceAndRateComponent, {
          gridSelectKeys: selectionKeys,
          PLANT_CODE: this.queryValues.plantCode,
          linesReturn: linesReturn
        }, 'lg')
        .subscribe((value) => {
          if (value) {
            if (linesReturn.length > 0) {
              this.setRefreshSelection(linesReturn);
              this.refresh(false);
            }
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
    }
  }

  moException() {
    // 例外检查
    this.modal.static(PlanscheduleMoexceptionAgComponent, {}, 'xl').subscribe(() => { });
  }


  // 开始日期改变事件
  public changeStartDay(item: any) {

    item.MARK_COLOUR = '';
    this.editService.updateTime(item).subscribe(resultMes => {
    });
  }

  // 固定日期改变事件
  public changeStartDayGD(item: any) {

    item.MARK_COLOUR = '';
    this.editService.updateTimeGD(item).subscribe(resultMes => {
    });
  }

  /**更新工单最早开始时间 */
  public updateMoEarliestStartTime() {
    const gridSelectRows = this.gridApi.getSelectedRows();
    console.log('updateMoEarliestStartTime......', gridSelectRows);
    if (this.isNull(gridSelectRows) || gridSelectRows.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
      return;
    }
    const moNums = gridSelectRows.map(it => it.makeOrderNum);
    console.log('updateMoEarliestStartTime......', moNums);
    this.modal
      .static(
        MoUpdateAgComponent,
        {
          i: {},
          moNumbers: moNums,
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    // let options = [];
    let retStr = '';
    switch (optionsIndex) {
      case 0:
        // 拖动项
        retStr = '';
        break;
    }
    return retStr;
  }

  surfaceOptions: any[] = [];
  steelTypeOptions: any[] = [];
  productCategoryOptions: any[] = [];
  surfaceProtectOptions: any[] = [];
  needSiteCutOptions: any[] = [
    { 'label': '切', 'value': '1' },
    { 'label': '不切', 'value': '0' }
  ];
  public optionsFind1(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNo;
        break;
      case 2:
        options = this.unitOptions;
        break;
      case 3:
        options = this.steelTypeOptions;
        break;
      case 4:
        options = this.productCategoryOptions;
        break;
      case 5:
        options = this.needSiteCutOptions;
        break;
      case 6:
        options = this.surfaceOptions;
        break;
      case 7:
        options = this.lockFlagOption;
        break;
      case 8:
        options = this.YesNoOptions;
        break;
      case 9:
        options = this.surfaceProtectOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public moSummary() {
    if (!this.gridData || this.gridData.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
      return;
    }
    const gridSelectRows = this.gridApi.getSelectedRows();
    if (gridSelectRows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择一个工单'));
      return;
    }

    // if (gridSelectRows.length > 1) {
    //   this.msgSrv.warning(this.appTranslationService.translate('只能选择一个工单'));
    //   return;
    // }
    const row = gridSelectRows[0];
    const projectNumberList = [];
    this.gridSelectRows.forEach(ele => {
      projectNumberList.push(ele.projectNumber);
    });
    this.modal.static(PlanscheduleDigitalizationWorkbenchMoSummary2Component,
      { plantCode: row.plantCode, projectNumberList: projectNumberList },
      'xl').subscribe(() => { });
  }

  /**工单拆分校验 */
  moSplitCheck(dataItem: any): boolean {
    if (dataItem.standardFlag === 'N') {
      return false; // 非标不允许拆分
    }
    // dataItem.makeOrderStatus==='A' || dataItem.makeOrderStatus==='G' || dataItem.makeOrderStatus==='S'
    if (dataItem.makeOrderStatus === 'C' || dataItem.makeOrderStatus === 'D') {
      return false; // 取消关闭不允许拆分
    }
    return true;
  }

  selfmadeOutsourcing() {
    if (!this.gridData || this.gridData.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedQuery));
      return;
    }
    const row = this.gridSelectRow || this.gridData[0];
    if (!row || this.isNull(row.makeOrderNum)) {
      this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
      return;
    }

    this.editService.selfmadeOutsourcing(row.plantCode, row.itemCode).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(result.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
    });
  }

  // 调整产线
  showManu(dataItem) {
    this.modal.static(
      ResourceManuComponent,
      { dataItem: dataItem }
    ).subscribe(value => {
      if (value) {
        this.queryCommon();
      }
    })
  }

  cancelOrder(dataItem) {
    this.editService.cancelOrder([dataItem.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('工单取消成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // 查看原料
  showRaw(dataItem) {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticeRawListComponent,
        {
          demandOrder: dataItem,
          isEditValid: false,
        },
        1100
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  expData: any[] = [];
  expColumns = []
  expColumnsOptions: any[] = [
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'needSideCut', options: this.needSiteCutOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'kitFlag', options: this.lockFlagOption },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'paper', options: this.surfaceProtectOptions }
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    // let colums = this.columns.concat([])
    // colums.splice(0,3)
    // this.expColumns = this.excelexport.setExportColumn(colums)
    this.exportFile()
  }
  exportFile() {
    const lineCodes = [];
    // 获取选中资源编码
    this.queryValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.code); } });
    const params = {
      scheduleRegionCode: this.queryValues.regionCode,
      plantCode: this.queryValues.plantCode,
      projectNumber: this.queryValues.projectNumber,
      productLineCodeList: lineCodes,
      startTime: this.editService.formatDate(this.queryValues.startTime),
      endTime: this.editService.formatDate(this.queryValues.endTime),
      isLoadRoutings: true,
      export: true,
      ids: []
    }
    this.editService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context,
      this.expDataPreFilter
    );
  }
  expDataPreFilter = (result) => {
    result.data.forEach(d => {  
      d.demandDate = this.commonQueryService.formatDate(d.demandDate); 
    });
    return result.data;
  }
}

