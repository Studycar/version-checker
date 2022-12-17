import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ComVindicateService } from '../../../modules/generated_module/services/comvindicate-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { EditService } from './edit.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ComvindicateEditComponent } from './edit/edit.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'comvindicate',
  templateUrl: './comvindicate.component.html',
  providers: [EditService],
})
export class ComVindicateComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  // 数字化工作台传参
  public pShowTitle = false;
  // 数字化工作台工单编码
  public pGridSelectRow: any;
  public moText = '';
  // public context = this;
  fixed: Boolean = true;
  showButton: Boolean = true;
  expandForm = false;
  UserPlantOptions: any[] = [];
  supplytype: any[] = [];
  listMostatus = [];
  Columns_popup: any[] = [
    {
      field: 'makeOrderNum',
      title: 'MO编号',
      width: '100'
    },
    {
      field: 'stockCode',
      title: '装配件',
      width: '100'
    },
    {
      field: 'plantCode',
      title: '组织',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'makeOrderNum', title: '工单号', ui: { type: UiType.string }, required: true },
      { field: 'plantCode', readonly: 'readonly', title: '工厂', ui: { type: UiType.string } },
      { field: 'resourceCode', readonly: 'readonly', title: '资源', ui: { type: UiType.string } },
      { field: 'stockCode', readonly: 'readonly', title: '物料编码', ui: { type: UiType.string } },
      { field: 'stockName', readonly: 'readonly', title: '物料描述', ui: { type: UiType.string } },
      { field: 'moQty', readonly: 'readonly', title: '需求数量', ui: { type: UiType.string } },
      { field: 'makeOrderStatus', readonly: 'readonly', title: '工单状态', ui: { type: UiType.select, options: this.listMostatus } },
      { field: 'demandDate', readonly: 'readonly', title: '需求时间', ui: { type: UiType.string } },
      // { field: 'check', readonly: 'readonly', title: '替代件', ui: { type: UiType.checkbox } },
    ],
    values: {
      makeOrderNum: '',
      plantCode: '',
      resourceCode: '',
      stockCode: '',
      stockName: '',
      moQty: '',
      makeOrderStatus: '',
      demandDate: '',
      // check: false
    }
  };
  selectIndex = 1;
  httpAction = { url: this.editService.queryUrl, method: 'GET' };
  public mySelection: any[] = [];
  queryObj: any = {};
  public selectBy = 'id';
  unitOptions: any[] = [];
  needSiteCutOptions: any[] = [
    {
      label: '切',
      value: 1,
    },
    {
      label: '不切',
      value: 0,
    },
  ];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private comVindicateService: ComVindicateService,
    public editService: EditService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
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
      name: '供应',
    }
  ];
  hideObjs = [
    {
      tabIndex: 2,
      columns: [
        {
          field: 'processCode'
        },
        {
          field: 'stockName'
        },
        {
          field: 'unitOfMeasure'
        },
        {
          field: 'requirementQty'
        },
        {
          field: 'planQty'
        },
        {
          field: 'quantityPerAssembly'

        },
        {
          field: 'issuedQty'
        },
        {
          field: 'usage'
        },
        {
          field: 'supplySubinventory'
        },
        // {
        //   field: 'subinventoryDescription'
        // },
      ]
    },
    {
      tabIndex: 1,
      columns: [
        {
          field: 'demandDate'
        },
        {
          field: 'supplyType'
        },
        // {
        //   field: 'subinventoryAllocation'
        // },
        // {
        //   field: 'onhandQuantity'
        // },
        {
          field: 'substituteGroup'
        },
        {
          field: 'alternateBomDesignator'
        },
        {
          field: 'priority'
        },
        {
          field: 'substituteChance'
        }
      ]
    },
  ];
  hiddenColumns = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.supplytype;
        break;
      case 2:
        options = this.needSiteCutOptions;
        break;
      case 3:
        options = this.steelTypeOptions;
        break;
      case 4:
        options = this.surfaceOptions;
        break;
      case 5:
        options = this.unitOptions;
        break;
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
    { field: 'stockCode', headerName: '组件编码', menuTabs: ['filterMenuTab'] },
    {
      field: 'processCode', headerName: '工序号', tooltipField: 'processCode', menuTabs: ['filterMenuTab']
    },
    {
      field: 'stockName', headerName: '描述',
      tooltipField: 'stockName', menuTabs: ['filterMenuTab']
    },
    { field: 'unitOfMeasure', headerName: '单位', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,5).label', },
    {
      field: 'planQty', headerName: '需求数量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'issuedQty', headerName: '已发料数', menuTabs: ['filterMenuTab']
    },
    {
      field: 'usage', headerName: 'BOM用量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'demandDate', headerName: '需求时间', menuTabs: ['filterMenuTab']
    },
    { field: 'supplySubinventory', headerName: '供应子库', menuTabs: ['filterMenuTab'] },
    // { field: 'subinventoryDescription', headerName: '子库名称', menuTabs: ['filterMenuTab'] },
    {
      field: 'supplyType', headerName: '供应类型',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    // {
    //   field: 'subinventoryAllocation', headerName: '货位', menuTabs: ['filterMenuTab']
    // },
    // {
    //   field: 'onhandQuantity', headerName: '现有量', menuTabs: ['filterMenuTab']
    // },
    {
      field: 'substituteGroup', headerName: '替代组', menuTabs: ['filterMenuTab']
    },
    {
      field: 'alternateBomDesignator', headerName: '替代策略', menuTabs: ['filterMenuTab']
    },
    {
      field: 'priority', headerName: '替代优先级', menuTabs: ['filterMenuTab']
    },
    {
      field: 'substituteChance', headerName: '替代百分比', menuTabs: ['filterMenuTab']
    },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'standards', width: 100, headerName: '规格',

    },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'length', width: 100, headerName: '长度',
    },
    {
      field: 'width', width: 100, headerName: '宽度',
    },
    {
      field: 'standardsType', width: 100, headerName: '规格尺寸',
      valueGetter: (params) => this.generateStandardsType(params)
    },
    {
      field: 'moQty',
      headerName: '工单数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'completeNum',
      headerName: '完工数量',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'residueNum',
      headerName: '剩余数量',
      tooltipField: 'residueNum',
      menuTabs: ['filterMenuTab'],
    },
  ];

  tabSelect(arg: any): void {
    this.selectIndex = arg.index;
    this.hiddenColumns.length = 0;
    this.hideObjs.forEach(e => {
      if (e.tabIndex === this.selectIndex) {
        e.columns.forEach(i => { this.hiddenColumns.push(i.field); });
        this.gridColumnApi.resetColumnState();
        this.gridColumnApi.setColumnsVisible(this.hiddenColumns, false);
        return;
      }
    });
    this.initGridWidth();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadMoStatus();
    this.gridData = [];
    this.clear();  
    /** 初始化 供应类型  下拉框*/
    this.editService.GetLookupByType('PS_MO_COMP_SUPPLY_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.supplytype.push({
          label: item.meaning,
          value: item.lookupCode,

        });
      });
      // 数字化工作台传参初始化
      if (this.pShowTitle && this.pGridSelectRow !== undefined) {
        const that = this;
        that.moText = that.pGridSelectRow.makeOrderNum;
        this.queryParams.values.makeOrderNum = that.moText;
        this.query();
        this.showButton = false;
        this.fixed = false;
        this.gridHeight = 245;
      }
    });

    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })

  }

  async loadOptions() {
    await this.commonQueryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_ITEM_UNIT': this.unitOptions,
    })
  }

  query() {
    if (this.queryParams.values.makeOrderNum === '' || this.queryParams.values.makeOrderNum === null) {
      this.clear();
    }
    if (this.queryParams.values.makeOrderNum !== '' && this.queryParams.values.makeOrderNum !== null) {
      this.editService.QueryMoInfo(this.queryParams.values.makeOrderNum).subscribe(result => {
        this.queryParams.values.plantCode = result.data.plantCode;
        this.queryParams.values.resourceCode = result.data.resourceCodeDescriptions || result.data.resourceCode;
        this.queryParams.values.moQty = result.data.moQty;
        this.queryParams.values.demandDate = result.data.demandDate;
        this.queryParams.values.stockCode = result.data.stockCode;
        this.queryParams.values.stockName = result.data.stockName;
        this.queryParams.values.makeOrderStatus = result.data.makeOrderStatus;
      });
    }


    this.queryObj = {
      makeOrderNum: this.queryParams.values.makeOrderNum,
      pageIndex: this.gridState.skip / this.gridState.take + 1,
      pageSize: this.gridState.take
    };
    super.query();
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.queryParams.values,
      this.context
    );
  }

  loadMoStatus(): void {
    this.listMostatus.length = 0;
    this.editService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.listMostatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  getMoStatusMeaning(moStatus: string): string {
    const moStatusData = this.listMostatus.find(item => item.value === moStatus);
    const meaning = moStatusData ? moStatusData.label : '';
    return meaning;
  }

  public clear() {
    this.queryParams.values = {
      makeOrderNum: '',
      stockCode: '',
      moQty: '',
      plantCode: '',
      resourceCode: '',
      stockName: '',
      demandDate: '',
      makeOrderStatus: null,
    };
  }

  expData: any[] = [];
  // expColumns = [
  //   {
  //     field: 'ITEM_CODE',
  //     title: '组件编码',
  //     filter: 'string',
  //     width: 150,
  //     locked: true
  //   },
  //   {
  //     field: 'PROCESS_CODE',
  //     width: 120,
  //     title: '工序号'
  //   },
  //   {
  //     field: 'DESCRIPTIONS_CN',
  //     title: '描述',
  //     width: 150,
  //     style: 'white-space:nowrap;text-overflow:ellipsis;',
  //     ui: { tooltip: 1 }
  //   },
  //   {
  //     field: 'UNIT_OF_MEASURE',
  //     width: 120,
  //     title: '单位',
  //     locked: false
  //   },
  //   {
  //     field: 'PLAN_QTY',
  //     width: 120,
  //     title: '需求数量'
  //   },
  //   // {
  //   //   field: 'REQUIREMENT_QTY',
  //   //   width: 120,
  //   //   title: '计划内需求数量'
  //   // },
  //   // {
  //   //   field: 'QUANTITY_PER_ASSEMBLY',
  //   //   width: 120,
  //   //   title: '每装需求数量',
  //   // },
  //   {
  //     field: 'ISSUED_QTY',
  //     width: 120,
  //     title: '已发料数'
  //   },
  //   {
  //     field: 'USAGE',
  //     width: 120,
  //     title: 'BOM用量'
  //   },
  //   { field: 'SUPPLY_SUBINVENTORY', title: '供应子库', width: 120 },
  //   {
  //     field: 'SUBINVENTORY_DESCRIPTION',
  //     width: 120,
  //     title: '子库名称',
  //     ui: { tooltip: 1 }
  //   },
  //   {
  //     field: 'SUPPLY_TYPE',
  //     width: 120,
  //     title: '供应类型',
  //     ui: { type: 'select', index: 1, options: this.supplytype },
  //   },
  //   {
  //     field: 'SUBINVENTORY_ALLOCATION',
  //     width: 120,
  //     title: '货位'
  //   },
  //   {
  //     field: 'ONHAND_QUANTITY',
  //     width: 120,
  //     title: '现有量'
  //   },
  //   {
  //     field: 'SUBSTITUTE_GROUP',
  //     width: 120,
  //     title: '替代组'
  //   },
  //   {
  //     field: 'ALTERNATE_BOM_DESIGNATOR',
  //     width: 120,
  //     title: '替代策略'
  //   },
  //   {
  //     field: 'PRIORITY',
  //     width: 120,
  //     title: '替代优先级'
  //   },
  //   {
  //     field: 'SUBSTITUTE_CHANCE',
  //     width: 120,
  //     title: '替代百分比'
  //   },
  //   {
  //     field: 'DEMAND_DATE',
  //     width: 120,
  //     title: '需求时间',
  //     ui: { tooltip: 1 }
  //   },
  // ];

  // expColumnsOptions = [
  //   { field: 'SUPPLY_TYPE', options: this.supplytype }
  // ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  expColumnsOptions: any[] = [
    { field: 'supplyType', options: this.supplytype },
    { field: 'needSideCut', options: this.needSiteCutOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
  ];
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }
  // @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  // public export() {
  //   this.queryObj = {
  //     moNo: this.queryParams.values.MAKE_ORDER_NUM,
  //     desc: this.queryParams.values.DESCRIPTIONS,
  //     plantcode: this.appConfigService.getPlantCode(),
  //     PAGE_INDEX: this.gridState.skip / this.gridState.take + 1,
  //     PAGE_SIZE: this.gridState.take
  //   };
  //   this.editService.exportAction({ url: this.editService.excUrl, method: 'POST' }, this.queryObj, this.excelexport);
  // }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }

}
