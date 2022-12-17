/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:12
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-19 16:47:40
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryService } from './editservice';
import { MoManagerService } from '../../../modules/generated_module/services/mo-manager-service';
import { PlanscheduleMomanagerEditComponent } from './edit/edit.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { MobBatchReleaseEditComponent } from 'app/aps/plant-model/mobatchrelease/edit/edit.component';
import { PlanscheduleMomanagerOpenComponent } from './open/open.component';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-momanager',
  templateUrl: './momanager.component.html',
  providers: [QueryService],
})
export class PlanscheduleMomanagerComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  context = this;
  public selectth: String;
  Privilege: Boolean; // 用户修改权限变量
  itemtypes: any[] = [];
  makebuycodes: any[] = [];
  itemstatus: any[] = [];
  wipsupplytypes: any[] = [];
  yesnos: any[] = [];
  statusOptions: any[] = [];
  unitOfMeasureOptions: any[] = [];

  plantoptions: any[] = [];
  groupoptions: any[] = [];
  resourceoptions: any[] = [];
  numoptions: any[] = [];
  selectIndex = 1;

  gridOptions2: any = Object.assign(this.gridOptions, {
    isRowSelectable: function (node) {
      return node.data.modifyPrivilageFlag;
    },
  });

  // public cells: any = {
  //   border: '1px solid black',
  //   'font-family': 'Arial',
  //   textAlign: 'center',
  // };
  public changes: any = {};
  YesOrNo: any[] = [];
  typeoptions: any[] = [];
  isCheck = true;

  yesNum: number;
  noNum: number;
  updateSchedule: any[] = [];
  gridHeight = 342;

  /** 查询物料数据 */
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  /** 物料弹出框列显示字段*/
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];

  public queryParams = {
    defines: [
      {
        field: 'strPlantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 },
      },
      {
        field: 'strScheduleGroupCode',
        title: '计划组',
        ui: { type: UiType.select, options: this.groupoptions, eventNo: 2 },
      },
      {
        field: 'strResourceCode',
        title: '资源',
        ui: { type: UiType.select, options: this.resourceoptions },
      },
      {
        field: 'strMakeOrderNum',
        title: '工单号',
        ui: { type: UiType.textarea },
      },
      {
        field: 'strProjectNumber',
        title: '项目号',
        ui: { type: UiType.textarea },
      },
      {
        field: 'strMakeOrderStatus',
        title: '工单状态',
        ui: { type: UiType.select, options: this.statusOptions },
      },
      {
        field: 'strItemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 3,
          extraEvent: {
            RowSelectEventNo: 4,
          },
        },
      },
      { field: 'strDescription', title: '物料描述', ui: { type: UiType.text } },
      {
        field: 'strDerivedFlag',
        title: '拆分标识',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'startrange',
        title: '完工日期范围',
        ui: { type: UiType.dateRange },
      },
      {
        field: 'strMoWarnningFlag',
        title: '警告标识',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'scheduleFalg',
        title: '参与排产标识',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'backlogFlag',
        title: '尾数标识',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
    ],
    values: {
      strUserId: this.appconfig.getUserId(),
      strPlantCode: this.appconfig.getPlantCode(),
      strScheduleGroupCode: '',
      strResourceCode: '',
      strMakeOrderNum: '',
      strMakeOrderStatus: '',
      strProjectNumber: '',
      strItemCode: { value: '', text: '' },
      strDescription: '',
      strDerivedFlag: '',
      startrange: [],
      strMoWarnningFlag: '',
      scheduleFalg: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
      backlogFlag: ''
    },
  };

  GetqueryParams() {
    return {
      strUserId: this.appconfig.getUserId(),
      strPlantCode: this.queryParams.values.strPlantCode,
      strScheduleGroupCode: this.queryParams.values.strScheduleGroupCode,
      strResourceCode: this.queryParams.values.strResourceCode,
      strMakeOrderNum: this.queryParams.values.strMakeOrderNum,
      strMakeOrderStatus: this.queryParams.values.strMakeOrderStatus,
      strProjectNumber: this.queryParams.values.strProjectNumber,
      strItemCode: this.queryParams.values.strItemCode.text,
      strDescription: this.queryParams.values.strDescription,
      strDerivedFlag: this.queryParams.values.strDerivedFlag,
      startTime: this.queryParams.values.startrange[0] ? this.commonquery.formatDate(this.queryParams.values.startrange[0]) : null,
      endTime: this.queryParams.values.startrange[1] ? this.commonquery.formatDate(this.queryParams.values.startrange[1]) : null,
      strMoWarnningFlag: this.queryParams.values.strMoWarnningFlag,
      scheduleFlag: this.queryParams.values.scheduleFalg,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      backlogFlag: this.queryParams.values.backlogFlag
    };
  }

  constructor(
    public pro: BrandService,
    private formBuilder: FormBuilder,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    public editService: QueryService,
    private momanager: MoManagerService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTrans: AppTranslationService,
    private appGridStateService: AppGridStateService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTrans,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
    super.setTopMargin(209);
  }
  //#region   表格内容
  tabs = [
    {
      index: 1,
      active: true,
      name: '主要',
    },
    {
      index: 2,
      active: false,
      name: '需求',
    },
    {
      index: 3,
      active: false,
      name: '时间',
    },
    {
      index: 4,
      active: false,
      name: '其他',
    },
  ];
  hideObjs = [
    {
      tabIndex: 1,
      columns: [
        {
          field: 'creationDate',
        },
        {
          field: 'demandDate',
        },
        {
          field: 'alternateBomDesignator',
        },
        {
          field: 'earliestStartTime',
        },
        {
          field: 'fixScheduleTime',
        },
        {
          field: 'fpsTime',
        },
        {
          field: 'lpsTime',
        },
        {
          field: 'inspectionTime',
        },
        {
          field: 'fulfillTime',
        },
        {
          field: 'offsetLeadTime',
        },
        {
          field: 'switchTime',
        },

        {
          field: 'backlogFlag',
        },
        {
          field: 'backlogReason',
        },
        {
          field: 'bondedFlag',
        },
        {
          field: 'moudleCode',
        },
        {
          field: 'moWarnningFlag',
        },
        {
          field: 'releasedDate',
        },
        {
          field: 'releasedBy',
        },
        {
          field: 'completedDate',
        },
        {
          field: 'closedDate',
        },
        {
          field: 'closedBy',
        },
        {
          field: 'reqNumber',
        },
        {
          field: 'reqLineNum',
        },
        {
          field: 'reqType',
        },
        {
          field: 'customerName',
        },
        {
          field: 'derivedFlag',
        },
        {
          field: 'oriMoNumber',
        },
        {
          field: 'oriMoQty',
        },
      ],
    },
    {
      tabIndex: 2,
      columns: [
        {
          field: 'creationDate',
        },
        {
          field: 'scheduleGroupCode',
        },
        {
          field: 'resourceCode',
        },
        {
          field: 'scheduleGroupCodeDescriptions',
        },
        {
          field: 'resourceCodeDescriptions',
        },
        {
          field: 'techVersion',
        },
        {
          field: 'makeOrderType',
        },
        {
          field: 'makeOrderStatus',
        },
        {
          field: 'projectNumber',
        },
        {
          field: 'moQty',
        },
        {
          field: 'completeNum',
        },
        {
          field: 'residueNum',
        },
        {
          field: 'deliveryNum',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'alternateBomDesignator',
        },
        {
          field: 'earliestStartTime',
        },
        {
          field: 'fixScheduleTime',
        },
        {
          field: 'fpsTime',
        },
        {
          field: 'fpcTime',
        },
        {
          field: 'lpsTime',
        },
        {
          field: 'lpcTime',
        },
        {
          field: 'fulfillTime',
        },
        {
          field: 'offsetLeadTime',
        },
        {
          field: 'switchTime',
        },
        {
          field: 'scheduleFlag',
        },
        {
          field: 'backlogFlag',
        },
        {
          field: 'backlogReason',
        },
        {
          field: 'standardFlag',
        },
        {
          field: 'completionSubinventory',
        },
        {
          field: 'moudleCode',
        },
        {
          field: 'moWarnningFlag',
        },
        {
          field: 'remark',
        },
        {
          field: 'releasedDate',
        },
        {
          field: 'releasedBy',
        },
        {
          field: 'completedDate',
        },
        {
          field: 'closedDate',
        },
        {
          field: 'closedBy',
        },
        {
          field: 'topMoNum',
        },
        {
          field: 'topMoStartDate',
        },
        {
          field: 'topMoStatus',
        },
        {
          field: 'parentMoNum',
        },
        {
          field: 'parentMoStartDate',
        },
        {
          field: 'parentMoStatus',
        },
        {
          field: 'derivedFlag',
        },
        {
          field: 'oriMoNumber',
        },
        {
          field: 'oriMoQty',
        },
        {
          field: 'inspectionTime',
        },
      ],
    },
    {
      tabIndex: 3,
      columns: [
        {
          field: 'scheduleGroupCode',
        },
        {
          field: 'resourceCode',
        },
        {
          field: 'scheduleGroupCodeDescriptions',
        },
        {
          field: 'resourceCodeDescriptions',
        },
        {
          field: 'techVersion',
        },
        {
          field: 'makeOrderType',
        },
        {
          field: 'makeOrderStatus',
        },
        {
          field: 'projectNumber',
        },
        {
          field: 'moQty',
        },
        {
          field: 'completeNum',
        },
        {
          field: 'residueNum',
        },
        {
          field: 'deliveryNum',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'demandDate',
        },
        {
          field: 'alternateBomDesignator',
        },
        {
          field: 'earliestStartTime',
        },
        {
          field: 'scheduleFlag',
        },
        {
          field: 'backlogFlag',
        },
        {
          field: 'backlogReason',
        },
        {
          field: 'standardFlag',
        },
        {
          field: 'bondedFlag',
        },
        {
          field: 'completionSubinventory',
        },
        {
          field: 'moudleCode',
        },
        {
          field: 'moWarnningFlag',
        },
        {
          field: 'remark',
        },
        {
          field: 'reqNumber',
        },
        {
          field: 'reqLineNum',
        },
        {
          field: 'reqType',
        },
        {
          field: 'customerName',
        },
        {
          field: 'topMoNum',
        },
        {
          field: 'topMoStartDate',
        },
        {
          field: 'topMoStatus',
        },
        {
          field: 'parentMoNum',
        },
        {
          field: 'parentMoStartDate',
        },
        {
          field: 'parentMoStatus',
        },
        {
          field: 'derivedFlag',
        },
        {
          field: 'oriMoNumber',
        },
        {
          field: 'oriMoQty',
        },
        {
          field: 'exceptionMessage',
        },
        {
          field: 'comments',
        },
      ],
    },
    {
      tabIndex: 4,
      columns: [
        {
          field: 'scheduleGroupCode',
        },
        {
          field: 'resourceCode',
        },
        {
          field: 'scheduleGroupCodeDescriptions',
        },
        {
          field: 'resourceCodeDescriptions',
        },
        {
          field: 'techVersion',
        },
        {
          field: 'makeOrderType',
        },
        {
          field: 'makeOrderStatus',
        },
        {
          field: 'projectNumber',
        },
        {
          field: 'moQty',
        },
        {
          field: 'demandDate',
        },
        {
          field: 'earliestStartTime',
        },
        {
          field: 'fixScheduleTime',
        },
        {
          field: 'scheduleFlag',
        },
        {
          field: 'fpsTime',
        },
        {
          field: 'fpcTime',
        },
        {
          field: 'lpsTime',
        },
        {
          field: 'lpcTime',
        },
        {
          field: 'inspectionTime',
        },
        {
          field: 'fulfillTime',
        },
        {
          field: 'offsetLeadTime',
        },
        {
          field: 'switchTime',
        },
        {
          field: 'standardFlag',
        },
        {
          field: 'bondedFlag',
        },
        {
          field: 'completionSubinventory',
        },
        {
          field: 'remark',
        },
        {
          field: 'releasedDate',
        },
        {
          field: 'releasedBy',
        },
        {
          field: 'completedDate',
        },
        {
          field: 'closedDate',
        },
        {
          field: 'closedBy',
        },
        {
          field: 'reqNumber',
        },
        {
          field: 'reqLineNum',
        },
        {
          field: 'reqType',
        },
        {
          field: 'customerName',
        },
        {
          field: 'topMoNum',
        },
        {
          field: 'parentMoNum',
        },
        {
          field: 'creationDate',
        },
        {
          field: 'completeNum',
        },
        {
          field: 'residueNum',
        },
        {
          field: 'deliveryNum',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'exceptionMessage',
        },
        {
          field: 'topMoStartDate',
        },
        {
          field: 'topMoStatus',
        },
        {
          field: 'parentMoStartDate',
        },
        {
          field: 'parentMoStatus',
        },
        {
          field: 'oriMoNumber',
        },
      ],
    },
  ];

  prodTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  steelTypeOptions: any[] = [];
  productCategoryOptions: any[] = [];
  needSiteCutOptions: any[] = [
    { 'label': '切', 'value': '1' },
    { 'label': '不切', 'value': '0' }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.itemtypes;
        break;
      case 2:
        options = this.makebuycodes;
        break;
      case 3:
        options = this.YesOrNo;
        break;
      case 4:
        options = this.itemstatus;
        break;
      case 5:
        options = this.wipsupplytypes;
        break;
      case 6:
        options = this.typeoptions;
        break;
      case 7:
        options = this.statusOptions;
        break;

      case 8:
        options = this.prodTypeOptions;
        break;
      case 9:
        options = this.surfaceOptions;
        break;
      case 10:
        options = this.steelTypeOptions;
        break;
      case 11:
        options = this.productCategoryOptions;
        break;
      case 12:
        options = this.needSiteCutOptions;
        break;
      case 13:
        options = this.unitOfMeasureOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: dataItem => {
        // if (dataItem.data.SCHEDULE_FLAG === '否') {
        //   return true;
        // }
        // return false;
        return dataItem.data.modifyPrivilageFlag;
      },
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'creationDate',
      headerName: '创建时间',
      menuTabs: ['filterMenuTab'],
    },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCodeDescriptions', headerName: '计划组描述', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCodeDescriptions', headerName: '资源描述', menuTabs: ['filterMenuTab'] },
    // {
    //   field: 'techVersion',
    //   headerName: '工艺版本',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'makeOrderType',
      headerName: '工单类型',
      tooltipField: 'makeOrderType',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'makeOrderNum',
      headerName: '工单号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'makeOrderStatus',
      headerName: '工单状态',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'scheduleFlag',
      headerName: '参与排产标识',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'projectNumber',
      headerName: '项目号',
      tooltipField: 'PROJECT_NUMBER',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'stockCode', width: 100, headerName: '产品编码',

    },
    {
      field: 'stockName', width: 100, headerName: '产品描述',

    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'standards', width: 100, headerName: '规格',

    },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'routeId', width: 100, headerName: '路径标识',

    },
    {
      field: 'manufRoute', width: 100, headerName: '制造路径',
    },
    {
      field: 'productCategory', width: 100, headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'cusAbbreviation', width: 100, headerName: '客户简称',

    },
    {
      field: 'prodType', width: 100, headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'length', width: 100, headerName: '长度',
    },
    {
      field: 'width', width: 100, headerName: '宽度',
    },
    {
      field: 'itemCode',
      headerName: '物料编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moQty',
      headerName: '工单数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'completeNum',
      headerName: '完工数量',
      tooltipField: 'completeNum',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'residueNum',
      headerName: '剩余数量',
      tooltipField: 'residueNum',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'deliveryNum',
      headerName: '发料数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptionsCn',
      headerName: '物料描述',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'unitOfMeasure',
      headerName: '单位',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,13).label'
    },
    {
      field: 'demandDate',
      headerName: '需求日期',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'alternateBomDesignator',
      headerName: '替代BOM',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'earliestStartTime',
      headerName: '最早开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fixScheduleTime',
      headerName: '固定时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fpsTime',
      headerName: '首件开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fpcTime',
      headerName: '首件完成时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lpsTime',
      headerName: '末件开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lpcTime',
      headerName: '末件完成时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'inspectionTime',
      headerName: '验货时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fulfillTime',
      headerName: '最终完成时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'offsetLeadTime',
      headerName: '提前量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'switchTime',
      headerName: '切换时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'backlogFlag',
      headerName: '尾数标识',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'backlogReason',
      headerName: '尾数原因',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'standardFlag',
      headerName: '标准类型',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'bondedFlag',
      headerName: '是否保税',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'completionSubinventory',
      headerName: '完工子库',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'mouldCode',
      headerName: '模具编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moWarnningFlag',
      headerName: 'MO警告标识',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'exceptionMessage',
      headerName: '例外信息',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'comments',
      headerName: '备注',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'releasedDate',
      headerName: '发放日期',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'releasedBy',
      headerName: '发放人',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'completedDate',
      headerName: '完成日期',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'closedDate',
      headerName: '关闭日期',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'closedBy',
      headerName: '关闭者',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqNumber',
      headerName: '需求订单号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqLineNum',
      headerName: '需求订单行号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqType',
      headerName: '需求订单类型',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'customerName',
      headerName: '客户名称',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'topMoNum',
      headerName: '顶层工单',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'topMoStartDate',
      headerName: '顶层工单开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'topMoStatus',
      headerName: '顶层工单状态',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'parentMoNum',
      headerName: '父工单',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'parentMoStartDate',
      headerName: '父工单开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'parentMoStatus',
      headerName: '父工单状态',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'derivedFlag',
      headerName: '拆分标识',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'oriMoNumber',
      headerName: '原工单号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'oriMoQty',
      headerName: '原始MO数量',
      menuTabs: ['filterMenuTab'],
    },
  ];

  tabFirstFlag = Array(this.tabs.length).fill(true);
  stateKey = 'momanager';
  tabSubject = new Subject<{
    index: number;
    curColDef: any[];
    columnApi: any;
    gridApi: any;
    afterChangeFunction: Function;
  }>();
  curTabColumns: any[] = [];

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
    this.curTabColumns = this.columns.filter(
      c => !curDisabledColumns.find(cc => cc.field === c.field),
    );
    this.tabSubject.next({
      index: this.selectIndex,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
      afterChangeFunction: () => this.autoSizeColumns(false)
    });
    this.gridApi.redrawRows();
  }
  
  // 列自适应宽度
  autoSizeColumns(skipHeader: boolean) {
    // 计划组、资源自适应宽度
    const allColumnIds: string[] = ['scheduleGroupCode','resourceCode'];
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.gridData = [];
    this.loadItems();
    this.isCheck = !this.isCheck;
    this.yesNum = 0;
    this.noNum = 0;
  }
  async loadItems() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: `${element.plantCode}(${element.descriptions})`,
          value: element.plantCode,
        });
      });
    });

    await this.commonquery.GetLookupByTypeRefZip({
      'PS_MAKE_ORDER_STATUS': this.statusOptions,
      'PS_MAKE_ORDER_TYPE': this.typeoptions,
      'PS_ITEM_UNIT': this.unitOfMeasureOptions,
      'FND_YES_NO': this.YesOrNo,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
    });

    this.plantchange(this.appconfig.getPlantCode());
  }

  plantchange(value: any) {
    this.groupoptions.length = 0;
    this.commonquery.GetUserPlantGroup(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.groupoptions.push({
          label: `${element.scheduleGroupCode}(${element.descriptions})`,
          value: element.scheduleGroupCode,
        });
      });
    });
  }

  public groupchange(value: any) {
    this.resourceoptions.length = 0;
    this.momanager
      .GetResource(this.queryParams.values.strScheduleGroupCode)
      .subscribe(res => {
        res.data.forEach(element => {
          this.resourceoptions.push({
            label: `${element.resourceCode}(${element.descriptions})`,
            value: element.resourceCode,
          });
        });
      });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.editService.loadGridViewNew(
      this.httpAction,
      this.GetqueryParams(),
      this.context,
    );
  }

  public clear() {
    this.queryParams.values = {
      strUserId: this.appconfig.getUserId(),
      strPlantCode: this.appconfig.getPlantCode(),
      strScheduleGroupCode: null,
      strResourceCode: null,
      strMakeOrderNum: '',
      strMakeOrderStatus: null,
      strProjectNumber: null,
      strItemCode: { text: '', value: '' },
      strDescription: '',
      strDerivedFlag: null,
      startrange: [],
      strMoWarnningFlag: null,
      scheduleFalg: null,
      pageIndex: 1,
      pageSize: this.gridState.take,
      backlogFlag: ''
    };
  }

  public add(item?: any) {
    this.Privilege = false;
    this.momanager
      .GetPrivilege(
        this.appconfig.getUserId(),
        item.plantCode,
        item.scheduleGroupCode,
        item.resourceCode,
      )
      .subscribe(res => {
        if (res.data !== null) {
          this.Privilege = res.data;

          if (this.Privilege) {
            this.modal
              .static(
                PlanscheduleMomanagerEditComponent,
                {
                  i: {
                    id: item !== undefined ? item.id : null,
                    plantCode: item ? item.plantCode : '',
                  },
                },
                'xl',
              )
              .subscribe(value => {
                if (value) {
                  this.query();
                }
              });
          } else {
            this.msgSrv.error('当前用户没有该产线的工单修改权限，请联系管理员');
          }
        } else {
          this.msgSrv.error('当前用户没有该产线的工单修改权限，请联系管理员');
        }
      });
  }

  public OpenLevel(item?: any) {
    this.modal
      .static(
        PlanscheduleMomanagerOpenComponent,
        {
          orderId: item.makeOrderNum,
          plantCode: item.plantCode,
        },
        'lg',
      )
      .subscribe(res => {
        if (res) {
          this.query();
        }
      });
  }

  expColumnsOptions = [
    { field: 'makeOrderType', options: this.typeoptions },
    { field: 'makeOrderStatus', options: this.statusOptions },
    { field: 'scheduleFlag', options: this.YesOrNo },
    { field: 'needSideCut', options: this.needSiteCutOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'standardFlag', options: this.YesOrNo },
    { field: 'bondedFlag', options: this.YesOrNo },
    { field: 'topMoStatus', options: this.statusOptions },
    { field: 'parentMoStatus', options: this.statusOptions },
    { field: 'derivedFlag', options: this.YesOrNo },
  ]
  expColumns = this.columns;
  httpAction = { url: this.momanager.searchUrl, method: 'GET' };
  httpExportAction = { url: this.momanager.exportUrl, method: 'GET' };
  expData: any[] = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export(true);
    this.editService.exportAction(
      this.httpExportAction,
      this.GetqueryParams(),
      this.excelexport,
    );
  }

  // 定义查询条件的时间
  startBegin: Date = null;
  startEnd: Date = null;
  endBegin: Date = null;
  endEnd: Date = null;
  // tslint:disable-next-line:no-inferrable-types
  endOpen1: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  endOpen2: boolean = false;

  // 根据开始时间，定义不可选择的时间
  disabledStartDate1 = (startBegin: Date): boolean => {
    if (!startBegin || !this.startEnd) {
      return false;
    }
    return startBegin.getTime() > this.startEnd.getTime();
  }

  disabledEndDate1 = (startEnd: Date): boolean => {
    if (!startEnd || !this.startBegin) {
      return false;
    }
    return startEnd.getTime() <= this.startBegin.getTime();
  }

  // 选择时间后，返回选择时间的回调
  onStartChange1(date: Date): void {
    this.startBegin = date;
  }
  onEndChange1(date: Date): void {
    this.startEnd = date;
  }

  // 参与排产
  takeSchedule() {
    this.modalService.confirm({
      nzContent: this.appTrans.translate('确定要修改吗？'),
      nzOnOk: () => {
        this.momanager.changeSchedule(this.updateSchedule).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('修改成功');
            this.query();
            this.isCheck = true;
            this.noNum = 0;
            this.yesNum = 0;
            this.selectionKeys = [];
          } else {
            this.msgSrv.error(res.msg);
          }
        });
      },
    });
  }

  CheckedChange(value: any) {
    value.forEach(element => {
      // if (element.SCHEDULE_FLAG === '是') {
      //   this.yesNum++;
      //   this.isCheck = true;
      // } else {
      //   this.noNum++;
      //   this.updateSchedule.push(element.Id);
      //   this.isCheck = false;
      // }

      this.noNum++;
      this.updateSchedule.push(element.id);
      this.isCheck = false;
    });

    if (this.noNum > 0) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
    this.noNum = 0;
    this.yesNum = 0;
  }

  selectKeys = 'scheduleFlag';
  selectKeys_2 = 'scheduleFlag';
  // 行选中改变
  onSelectionChanged(event) {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.CheckedChange(gridSelectRows);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({
      index: 1,
      active: true,
      name: '主要',
    });
  }

  /**
   * 物料弹出查询
   * @param {any} e
   */
  public searchItems(e: any) {
    if (
      !this.queryParams.values.strPlantCode ||
      this.queryParams.values.strPlantCode === undefined
    ) {
      this.msgSrv.warning(this.appTrans.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.queryItems(
      this.queryParams.values.strPlantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载物料
   * @param {string} PLANT_CODE 工厂代码
   * @param {string} ITEM_CODE  物料代码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public queryItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.commonquery
      .getUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.content.length;
      });
  }

  /**
   * 物料弹窗行选中事件
   * @param Row 选中行详细信息对象（DESCRIPTIONS_CN，ITEM_CODE，ITEM_ID，ROWINDEX，UNIT_OF_MEASURE，WIP_SUPPLY_TYPE）
   * @param Text this.queryParams.values.strItemCodeFrom.text值
   * @param Value this.queryParams.values.strItemCodeFrom.value值
   * @param sender 弹出组件实例
   */
  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.strItemCode.text = Text;
    this.queryParams.values.strItemCode.value = Value;
  }

  // 重读组件
  readMoRequirement() {
    const gridSelectRows = this.gridApi.getSelectedRows();
    let plantCode = '';
    const listMos = [];
    // let errMo = '';
    gridSelectRows.forEach(d => {
      listMos.push(d.makeOrderNum);
      plantCode = d.plantCode;
      // if (d.MAKE_ORDER_STATUS !== 'S') {
      //   errMo += d.MAKE_ORDER_NUM + ',';
      // }
    });
    // if (errMo !== '') {
    //   this.msgSrv.info(this.appTrans.translate('工单[' + errMo + ']状态不是未发放，不能重读'));
    //   return;
    // }
    if (listMos.length === 0) {
      this.msgSrv.info(this.appTrans.translate('请选择要重读的工单'));
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTrans.translate('确定要重读组件吗？'),
      nzOnOk: () => {
        this.editService.ReLoadMoRequirement(plantCode, listMos).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('重读组件成功');
          } else {
            this.msgSrv.error(this.appTrans.translate(res.msg));
          }
        });
      },
    });
  }
}
