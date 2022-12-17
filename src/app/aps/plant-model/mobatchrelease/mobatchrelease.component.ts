import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EditService } from './edit.service';
import { MOBatchReleaseService } from '../../../modules/generated_module/services/mobatchrelease-service';
import { MobBatchReleaseEditComponent } from './edit/edit.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mobatchrelease',
  templateUrl: './mobatchrelease.component.html',
  providers: [EditService],
})
export class MoBatchReleaseComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  selectKeys = 'makeOrderNum';
  expandForm = false;
  public gridData: any[] = [];
  public pageSize = 10;
  public skip = 0;
  UserPlantOptions: any[] = []; // 组织
  SCHGroupOptions: any[] = []; // 事业部
  gongchaOptions: any[] = [];
  packTypeOptions: any[] = [];
  lookuptype: any[] = [];
  optionListItem2: any[] = [];
  itemStyle = { width: '180px' };
  Plantcodes: string;
  production_line_group: any;
  make: any[] = [];
  makeordertype: any[] = [];
  makeorderstatus: any[] = [];
  linegroupoptions: any[] = []; // 计划组绑定源
  PlantGroupLineoptions: any[] = []; // 生产线绑定源
  MOSTATUS: any[] = []; // MO状态绑定源
  standardfalgoptions: any[] = []; // 工单标准类型
  key: string;
  PlantCodes: string;
  itemtypes: any[] = [];
  makebuycodes: any[] = [];
  itemstatus: any[] = [];
  wipsupplytypes: any[] = [];
  yesnos: any[] = [];
  public enableOptions: any[] = [];
  organizationids: any[] = [{ label: '  ', value: '' }];
  itemcodes: any[] = [{ label: '  ', value: '' }];
  Istrue = false;
  httpAction = { url: this.editService.queryUrl, method: 'POST', data: false };
  selectIndex = 1;
  surfaceOptions: any[] = [];
  steelTypeOptions: any[] = [];
  productCategoryOptions: any[] = [];
  YesNoOptions: any[] = [];
  unitOptions: any[] = [];
  subsectionStateOptions: any[] = [];
  needSiteCutOptions: any[] = [
    { 'label': '切', 'value': '1' },
    { 'label': '不切', 'value': '0' }
  ];
  refreshFlagOptions: any[] = [
    { 'label': '是', 'value': 'Y' },
    { 'label': '否', 'value': 'N' },
  ]
  gridOptions2: any = Object.assign(this.gridOptions, {
    isRowSelectable: function (node) {
      return node.data.modifyPrivilageFlag;
    },
  });

  public queryParams = {
    defines: [
      {
        field: 'strPlantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.UserPlantOptions, eventNo: 3 },
        required: true,
      },
      {
        field: 'strScheduleGroupCode',
        title: '计划组',
        ui: { type: UiType.select, options: this.linegroupoptions, eventNo: 1 },
      },
      {
        field: 'strResourceCode',
        title: '资源',
        ui: { type: UiType.select, options: this.PlantGroupLineoptions },
      },
      {
        field: 'strItemCode',
        title: '产品编码',
        ui: { type: UiType.string, eventNo: 2 },
      },
      // {
      //   field: 'strDescription',
      //   readonly: 'readonly',
      //   title: '物料描述',
      //   ui: { type: UiType.string },
      // },
      // {
      //   field: 'derivedProcessFlag',
      //   title: '拆分标识',
      //   ui: { type: UiType.select, options: this.enableOptions },
      // },
      { field: 'strMakeOrderNum', title: '工单号', ui: { type: UiType.text } },
      {
        field: 'moStatusList',
        title: '工单状态',
        ui: { type: UiType.selectMultiple, options: this.MOSTATUS },
      },
      {
        field: 'startRange',
        title: '工单开始时间',
        ui: { type: UiType.dateRange },
      },
      { field: 'strProjectNumber', title: '项目号', ui: { type: UiType.text } },
      {
        field: 'rotorFlag',
        title: '转定子工单',
        ui: { type: UiType.select, options: this.enableOptions },
      },
      // { field: 'makeOrderNumNew', title: '新工单号', ui: { type: UiType.text } }
      // {
      //   field: 'moQuantityFrom',
      //   title: '需求数量从',
      //   ui: { type: UiType.string },
      // },
      // { field: 'moQuantityTo', title: '至', ui: { type: UiType.string } },
      // {
      //   field: 'strMoWarnningFlag',
      //   title: '警告标识',
      //   ui: { type: UiType.select, options: this.enableOptions },
      // },
    ],
    values: {
      strUserId: this.appConfigService.getUserId(),
      strPlantCode: this.appConfigService.getPlantCode(),
      strScheduleGroupCode: '',
      strResourceCode: '',
      strItemCode: '',
      strMakeOrderNum: '',
      // strMakeOrderStatus: null,
      moStatusList: [],
      startRange: '',
      strProjectNumber: '',
      rotorFlag: ''
      // makeOrderNumNew: ''
    },
  };

  public changes: any = {};
  public mySelection: any[] = [];
  queryParamstemp: any;
  queryObj: any = {};

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private moBatchReleaseService: MOBatchReleaseService,
    public QueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    public editService: EditService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
    // this.setGridHeight({ topMargin: 243, bottomMargin: this.pagerHeight });
    super.setTopMargin(209);
  }
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
        // {
        //   field: 'alternateBomDesignator',
        // },
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
        // {
        //   field: 'inspectionTime',
        // },

        {
          field: 'fulfillTime',
        },
        // {
        //   field: 'offsetLeadTime',
        // },
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
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'moudleCode',
        // },
        // {
        //   field: 'moWarnningFlag',
        // },
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
        { field: 'tranBatchNo', },
        { field: 'urgent', },
        { field: 'processCode', },
        { field: 'bindindNum', },
        { field: 'customerNumber', },
        { field: 'processingReq', },
        { field: 'packType', },
        { field: 'hardness', },
        { field: 'tolerance', },
        { field: 'coatingDownCode', },
        { field: 'coatingUpCode', },
        { field: 'subsectionState', },
        { field: 'slittingQuantity', },
        { field: 'paper', },
        // {
        //   field: 'derivedFlag',
        // },
        // {
        //   field: 'oriMoNumber',
        // },
        // {
        //   field: 'oriMoQty',
        // },

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
        // {
        //   field: 'scheduleGroupCodeDescriptions',
        // },
        {
          field: 'resourceDesc',
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
          field: 'exCompletedQty',
        },
        {
          field: 'residueNum',
        },
        {
          field: 'deliveryNum',
        },
        {
          field: 'stockName',
        },
        {
          field: 'unitOfMeasure',
        },
        // {
        //   field: 'alternateBomDesignator',
        // },
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
        // {
        //   field: 'offsetLeadTime',
        // },
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
        // {
        //   field: 'completionSubinventory',
        // },
        // {
        //   field: 'moudleCode',
        // },
        // {
        //   field: 'moWarnningFlag',
        // },
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
        // {
        //   field: 'makeOrderNumNew',
        // },
        {
          field: 'manufSpecCode',
        },
        // {
        //   field: 'derivedFlag',
        // },
        // {
        //   field: 'oriMoNumber',
        // },
        // {
        //   field: 'oriMoQty',
        // },
        // {
        //   field: 'inspectionTime',
        // },
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
        // {
        //   field: 'scheduleGroupCodeDescriptions',
        // },
        {
          field: 'resourceDesc',
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
          field: 'exCompletedQty',
        },
        {
          field: 'residueNum',
        },
        {
          field: 'deliveryNum',
        },
        {
          field: 'stockName',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'demandDate',
        },
        // {
        //   field: 'alternateBomDesignator',
        // },
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
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'completionSubinventory',
        // },
        // {
        //   field: 'moudleCode',
        // },
        // {
        //   field: 'moWarnningFlag',
        // },
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
        // {
        //   field: 'derivedFlag',
        // },
        // {
        //   field: 'oriMoNumber',
        // },
        // {
        //   field: 'oriMoQty',
        // },
        {
          field: 'exceptionMessage',
        },
        {
          field: 'comments',
        },
        // {
        //   field: 'makeOrderNumNew',
        // },
        {
          field: 'manufSpecCode',
        },
        { field: 'tranBatchNo', },
        { field: 'urgent', },
        { field: 'processCode', },
        { field: 'bindindNum', },
        { field: 'customerNumber', },
        { field: 'processingReq', },
        { field: 'packType', },
        { field: 'hardness', },
        { field: 'tolerance', },
        { field: 'coatingDownCode', },
        { field: 'coatingUpCode', },
        { field: 'subsectionState', },
        { field: 'slittingQuantity', },
        { field: 'paper', },
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
        // {
        //   field: 'scheduleGroupCodeDescriptions',
        // },
        {
          field: 'resourceDesc',
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
          field: 'residueNum',
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
        // {
        //   field: 'inspectionTime',
        // },

        {
          field: 'fulfillTime',
        },
        // {
        //   field: 'offsetLeadTime',
        // },
        {
          field: 'switchTime',
        },
        {
          field: 'standardFlag',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'completionSubinventory',
        // },
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
          field: 'exCompletedQty',
        },
        {
          field: 'deliveryNum',
        },
        {
          field: 'stockName',
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
        {
          field: 'levelNum',
        },
        { field: 'tranBatchNo', },
        { field: 'urgent', },
        { field: 'processCode', },
        { field: 'bindindNum', },
        { field: 'customerNumber', },
        { field: 'processingReq', },
        { field: 'packType', },
        { field: 'hardness', },
        { field: 'tolerance', },
        { field: 'coatingDownCode', },
        { field: 'coatingUpCode', },
        // { field: 'makeOrderNumNew', },
        { field: 'manufSpecCode', },
        { field: 'subsectionState', },
        { field: 'slittingQuantity', },
        { field: 'paper', },
      ],
    },
  ];




  public optionsFind(value: any, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.makeordertype;
        break;
      case 2:
        options = this.makeorderstatus;
        break;
      case 3:
        options = this.standardfalgoptions;
        break;
      case 4:
        options = this.enableOptions;
        break;
      case 5:
        options = this.wipsupplytypes;
        break;
      case 6:
        if (value === 0 || value === '0') {
          return {
            label: '<i class="anticon anticon-plus"></i>',
            value: '<i class="anticon anticon-plus"></i>',
          };
        } else
          return {
            label: '',
          };
      case 7:
        options = this.steelTypeOptions;
        break;
      case 8:
        options = this.productCategoryOptions;
        break;
      case 9:
        options = this.needSiteCutOptions;
        break;
      case 10:
        options = this.surfaceOptions;
        break;
      case 11:
        options = this.unitOptions;
        break;
      case 12:
        options = this.YesNoOptions;
        break;
      case 13:
        options = this.subsectionStateOptions;
        break;
      case 14:
        options = this.packTypeOptions;
        break;
      case 15:
        options = this.gongchaOptions;
        break;
      case 16:
        options = this.refreshFlagOptions
    }
    return options.find(x => x.value === value) || { label: value };
  }
  // 规格尺寸形式：规格*宽度*长度
  generateStandardsType(params) {
    const standards = params.data.standards || 0;
    const width = params.data.width || 0;
    const prodLength = params.data.length || 'C';
    return `${standards}*${width}*${prodLength}`;
  }

  public columns = [
    // {
    //   colId: 0,
    //   field: '',
    //   headerName: '展开',
    //   width: 100,
    //   pinned: this.pinnedAlign,
    //   lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: null, // Complementing the Cell Renderer parameters
    //   },
    // },
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'makeOrderNum',
      headerName: '工单号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'stockCode',
      headerName: '产品编码',
      menuTabs: ['filterMenuTab'],
    },
    /* {
       field: 'itemCode',
       headerName: '物料编码',
       menuTabs: ['filterMenuTab'],
     },*/
    {
      field: 'stockName',
      headerName: '产品描述',
      tooltipField: 'stockName',
      menuTabs: ['filterMenuTab'],
    },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupDesc', headerName: '计划组描述', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'resourceDesc', headerName: '资源描述', menuTabs: ['filterMenuTab'] },
    { field: 'manufLineCode', headerName: '产线', menuTabs: ['filterMenuTab'] },
    { field: 'manufLineName', headerName: '产线描述', menuTabs: ['filterMenuTab'] },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'standards', width: 100, headerName: '规格',
    },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'routeId', width: 100, headerName: '路径标识',

    },
    {
      field: 'manufRoute', width: 100, headerName: '制造路径',
    },
    {
      field: 'productCategory', width: 100, headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'length', width: 100, headerName: '长度',
    },
    {
      field: 'width', width: 100, headerName: '宽度',
    },
    {
      field: 'boxQuantity', width: 100, headerName: '箱数',
    },
    {
      field: 'packingQuantity', width: 100, headerName: '装箱张数',
    },
    {
      field: 'standardsType', width: 100, headerName: '规格尺寸',
      valueGetter: (params) => this.generateStandardsType(params), filter: 'standardsTypeFilter'
    },
    {
      field: 'creationDate',
      headerName: '创建时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'makeOrderType',
      headerName: '工单类型',
      tooltipField: 'makeOrderType',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'makeOrderStatus',
      headerName: '工单状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'projectNumber',
      headerName: '项目号',
      tooltipField: 'projectNumber',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moQty',
      headerName: '工单数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'completedQtyTotal',
      headerName: '完工数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'completeNum',
      headerName: '正常完工数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'exCompletedQty',
      headerName: '异常完工数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'residueNum',
      headerName: '剩余数量',
      tooltipField: 'residueNum',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'deliveryNum',
    //   headerName: '发料数量',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'unitOfMeasure',
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,11).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'demandDate',
      headerName: '需求日期',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'alternateBomDesignator',
    //   headerName: '替代BOM',
    //   menuTabs: ['filterMenuTab'],
    // },
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
    // {
    //   field: 'inspectionTime',
    //   headerName: '验货时间',
    //   menuTabs: ['filterMenuTab'],
    // },

    {
      field: 'fulfillTime',
      headerName: '最终完成时间',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'offsetLeadTime',
    //   headerName: '提前量',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'switchTime',
      headerName: '切换时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'scheduleFlag',
      headerName: '参与排产标识',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'backlogFlag',
      headerName: '尾数标识',
      valueFormatter: 'ctx.optionsFind(value,4).label',
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
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'bondedFlag',
    //   headerName: '是否保税',
    //   valueFormatter: 'ctx.optionsFind(value,4).label',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'completionSubinventory',
    //   headerName: '完工子库',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'moudleCode',
    //   headerName: '模具编码',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'moWarnningFlag',
    //   headerName: 'MO警告标识',
    //   valueFormatter: 'ctx.optionsFind(value,4).label',
    //   menuTabs: ['filterMenuTab'],
    // },
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
      headerName: '完工时间',
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
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
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
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'derivedFlag',
    //   headerName: '拆分标识',
    //   valueFormatter: 'ctx.optionsFind(value,4).label',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'oriMoNumber',
    //   headerName: '原工单号',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'oriMoQty',
    //   headerName: '原始MO数量',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'levelNum',
      headerName: '跟单层级',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rotorFlag',
      headerName: '转定子工单',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'tranBatchNo',
      headerName: '完工批次号',
      menuTabs: ['filterMenuTab'],
    },
    // { field: 'makeOrderNumNew', headerName: '新工单号', menuTabs: ['filterMenuTab'], },
    //{ field: 'manufSpecCode', headerName: '制造规范编码', menuTabs: ['filterMenuTab'], },
    //{ field: 'processCode', headerName: '工序', menuTabs: ['filterMenuTab'], },
    { field: 'bindindNum', headerName: '合并标识', menuTabs: ['filterMenuTab'], },
    { field: 'customerNumber', headerName: '客户编码', menuTabs: ['filterMenuTab'], },
    { field: 'processingReq', headerName: '加工要求', menuTabs: ['filterMenuTab'], },
    { field: 'packType', headerName: '包装方式', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,14).label' },
    { field: 'subsectionState', headerName: '分卷状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,13).label', },
    { field: 'slittingQuantity', headerName: '分条数量', menuTabs: ['filterMenuTab'], },
    { field: 'hardness', headerName: '硬度', menuTabs: ['filterMenuTab'], },
    { field: 'tolerance', headerName: '公差', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,15).label' },
    { field: 'urgent', headerName: '急要', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,12).label', },
    { field: 'coatingDownCode', headerName: '底膜存货编码', menuTabs: ['filterMenuTab'], },
    { field: 'coatingUpCode', headerName: '面膜存货编码', menuTabs: ['filterMenuTab'], },
    { field: 'paper', headerName: '表面保护', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,12).label', },
    { field: 'refreshFlag', headerName: '是否排产刷新', menuTabs: ['filterMenuTab'],  valueFormatter: 'ctx.optionsFind(value,16).label',  },
  ];

  tabFirstFlag = Array(this.tabs.length).fill(true);
  stateKey = 'mobatchrelease';
  tabSubject = new Subject<{
    index: number;
    curColDef: any[];
    columnApi: any;
    gridApi: any;
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
    });
    this.gridApi.redrawRows();
    this.initGridWidth();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();

    /** 初始化 用户权限下的计划组  下拉框*/
    this.QueryService.GetUserPlantGroup(
      this.appConfigService.getPlantCode() || '',
    ).subscribe(result => {
      result.Extra.forEach(d => {
        this.linegroupoptions.push({
          label: `${d.scheduleGroupCode}(${d.descriptions})`,
          value: d.scheduleGroupCode,
        });
      });
    });
    /** 初始化 MO状态  下拉框  只获取 S R O H D*/
    const tempMoStatus = ['S', 'R', 'O', 'H', 'D'];
    this.QueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(
      result => {
        result.Extra.forEach(d => {
          tempMoStatus.forEach(ele => {
            if (d.lookupCode === ele) {
              this.MOSTATUS.push({
                label: d.meaning,
                value: d.lookupCode,
              });

              this.makeorderstatus.push({
                label: d.meaning,
                value: d.lookupCode,
              });
            }
          });

        });
      },
    );

    // 获取事业部
    this.QueryService.GetAllScheduleRegion().subscribe(result => {
      result.data.forEach(d => {
        this.SCHGroupOptions.push({
          label: `${d.scheduleGroupCode}(${d.descriptions})`,
          value: d.scheduleRegionCode,
        });
      });
    });

    this.Plantcodes = '';
    /** 初始化 用户权限下的组织  下拉框*/
    this.QueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.UserPlantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });
        if (this.Plantcodes === '') this.Plantcodes = '\'' + d.plantCode + '\'';
        else this.Plantcodes = this.Plantcodes + ',' + '\'' + d.plantCode + '\'';
      });
    });

    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  async loadOptions() {
    await this.QueryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_MAKE_ORDER_TYPE': this.makeordertype,
      'STANDARD_FALG': this.standardfalgoptions,
      'SUPPLY_TYPE': this.lookuptype,
      'FND_YES_NO': this.enableOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
    })
  }

  query() {
    if (
      this.queryParams.values.strPlantCode === null ||
      this.queryParams.values.strPlantCode === ''
    ) {
      this.msgSrv.warning(this.appTranslationService.translate('请输入工厂'));
      return;
    }
    const re = /^[0-9]+?[0-9]*$/;
    super.query();
    this.queryCommon();
    this.mySelection.length = 0;
  }
  queryCommon() {
    const queryValues = this.getQueryParamsValue();
    queryValues.pageIndex = this._pageNo;
    queryValues.pageSize = this._pageSize;
    const httpAction = { url: this.httpAction.url + `?pageIndex=${queryValues.pageIndex}&pageSize=${queryValues.pageSize}`, 
      method: this.httpAction.method };
    this.editService.loadGridViewNew(httpAction, queryValues, this.context, this.resetreFreshFlag.bind(this));
  }
  resetreFreshFlag (res) {
    res.data.content.forEach(item =>{
      item.refreshFlag = item.refreshFlag || 'N'
    })
    return res
  }
  public getQueryParamsValue(isExport=false): any {
    return {
      strUserId: this.appConfigService.getUserId(),
      strPlantCode: this.queryParams.values.strPlantCode
        ? this.queryParams.values.strPlantCode
        : null,
      strMakeOrderNum: this.queryParams.values.strMakeOrderNum
        ? this.queryParams.values.strMakeOrderNum
        : null,
      strItemCode: this.queryParams.values.strItemCode
        ? this.queryParams.values.strItemCode
        : null,
      strScheduleGroupCode: this.queryParams.values.strScheduleGroupCode
        ? this.queryParams.values.strScheduleGroupCode
        : null,
      strResourceCode: this.queryParams.values.strResourceCode
        ? this.queryParams.values.strResourceCode
        : null,
      strProjectNumber: this.queryParams.values.strProjectNumber
        ? this.queryParams.values.strProjectNumber
        : null,
      rotorFlag: this.queryParams.values.rotorFlag ? this.queryParams.values.rotorFlag : null,
      // makeOrderNumNew: this.queryParams.values.makeOrderNumNew,
      startTime: this.queryParams.values.startRange[0]
        ? this.editService.formatDate(this.queryParams.values.startRange[0])
        : null,
      endTime: this.queryParams.values.startRange[1]
        ? this.editService.formatDate(this.queryParams.values.startRange[1])
        : null,
      moStatusList: this.queryParams.values.moStatusList,
      pageIndex: this.gridState.skip / this.gridState.take + 1,
      pageSize: this.gridState.take,
      export: isExport
    };
  }

  public OpenLevel(item?: any) {
    console.log('OpenLevel', item);
    console.log(this.selectionKeys.findIndex(it => it === item.makeOrderNum), 'this.selectionKeys');
    this.modal
      .static(MobBatchReleaseEditComponent, {
        orderid: item.makeOrderNum,
        PLANT_CODE: item.plantCode,
        Plantcodes: this.Plantcodes,
        CurPlant: this.appConfigService.getPlantCode(),
        UserPlantOptions: this.UserPlantOptions,
        SCHGroupOptions: this.SCHGroupOptions,
        linegroupoptions: this.linegroupoptions,
        PlantGroupLineoptions: this.PlantGroupLineoptions,
        SelectedAll:
          this.selectionKeys && this.selectionKeys.findIndex(it => it === item.makeOrderNum) >= 0,
      })
      .subscribe(res => {
        if (res) {
          this.query();
        }
      });
  }

  public groupChange(value: any) {
    this.loadLine();
  }

  public plantChange(value: any) {
    this.queryParams.values.strResourceCode = '';
    this.queryParams.values.strScheduleGroupCode = '';
    this.linegroupoptions.length = 0;
    this.PlantGroupLineoptions.length = 0;
    this.QueryService.GetUserPlantGroup(
      this.queryParams.values.strPlantCode || '',
    ).subscribe(result => {
      result.Extra.forEach(d => {
        this.linegroupoptions.push({
          label: d.scheduleGroupCode,
          value: d.scheduleGroupCode,
        });
      });
    });
  }

  public ItemChange(value: any) {
    if (
      this.queryParams.values.strItemCode.length < 5
    )
      return;
    this.editService
      .GetDescByItemCode(
        this.queryParams.values.strItemCode
      )
      .subscribe(result => {
        if (result.data !== undefined && result.data !== null) {
        }
      });
  }

  public loadLine() {
    this.PlantGroupLineoptions.length = 0;
    this.queryParams.values.strResourceCode = null;
    this.editService
      .GetUserPlantGroupLine(
        this.queryParams.values.strPlantCode || '',
        this.queryParams.values.strScheduleGroupCode,
      )
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          result.Extra.forEach(x => {
            this.PlantGroupLineoptions.push({
              label: `${x.resourceCode}(${x.descriptions})`,
              value: x.resourceCode,
            });
          });
        }
      });
  }

  public clear() {
    this.queryParams.values = {
      strUserId: this.appConfigService.getUserId(),
      strPlantCode: this.appConfigService.getPlantCode(),
      strMakeOrderNum: '',
      strItemCode: '',
      strScheduleGroupCode: null,
      strResourceCode: null,
      // strMakeOrderStatus: null,
      moStatusList: [],
      startRange: '',
      strProjectNumber: '',
      rotorFlag: ''
      // makeOrderNumNew: ''
    };
  }

  public release() {
    if (this.selectionKeys.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请选择任意行!'),
      );
      return;
    }
    this.editService
      .BacthRelease(
        this.selectionKeys,
        0,
        '',
        this.queryParams.values.strPlantCode,
      )
      .subscribe(result => {
        if (result !== null && result.code === 200) {
          this.msgSrv.success(
            this.appTranslationService.translate(result.msg || '发放成功'),
          );
          this.query();
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(result.msg || '发放失败'),
          );
        }
      });
  }

  expColumns = [
  ];

  expData: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.makeorderstatus },
    { field: 'scheduleFlag', options: this.enableOptions },
    { field: 'backlogFlag', options: this.enableOptions },
    { field: 'standardFlag', options: this.enableOptions },
    // { field: 'bondedFlag', options: this.enableOptions },
    // { field: 'moWarnningFlag', options: this.enableOptions },
    { field: 'topMoStatus', options: this.makeorderstatus },
    { field: 'parentMoStatus', options: this.makeorderstatus },
    { field: 'needSideCut', options: this.needSiteCutOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'gongcha', options: this.gongchaOptions },
    { field: 'rotorFlag', options: this.enableOptions },
    { field: 'refreshFlag', options: this.refreshFlagOptions}
  ];

  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.editService.exportAction(
      { url: this.editService.queryUrl, method: 'POST' },
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context,
      this.expDataPreFilter
    );
  }

  expDataPreFilter = (res) => {
    const data = res.data;
    data.content.forEach(d => {
      d.standardsType = this.generateStandardsType({
        data: d
      });
    });
    return data.content;
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
    this.tabSelect({ index: 1 });
  }
}
