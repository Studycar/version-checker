import { QueryService } from './query.service';
import { PoComVindicateService } from '../../../modules/generated_module/services/pocomvindicate-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pocomvindicate',
  templateUrl: './pocomvindicate.component.html',
  providers: [QueryService],
})
export class ProcessSchedulePoComVindicateComponent extends CustomBaseContext implements OnInit {
  /**
   * 工序工单传参，区分标识："ps_op_make_order"
   * j = {
   *    PROCESS_MO_NUM: '',
   *    FIXED: '',
   *    showButton: false
   * }
   */
  public j: any;
  // 数字化工作台传参
  public pShowTitle = false;
  // 数字化工作台工单编码
  public pGridSelectRow: any;
  // 页脚固定
  fixed: Boolean = true;
  showButton: boolean;
  public moText = '';
  // public context = this;
  expandForm = false;
  UserPlantOptions: any[] = [];
  supplytype: any[] = [];
  Columns_popup: any[] = [
    {
      field: 'MAKE_ORDER_NUM',
      title: 'MO编号',
      width: '100'
    },
    {
      field: 'itemCode',
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
      { field: 'processMakeOrderNum', title: '工序工单', ui: { type: UiType.string }, required: true },
      { field: 'plantCode', readonly: 'readonly', title: '工厂', ui: { type: UiType.string } },
      { field: 'resourceCode', readonly: 'readonly', title: '资源', ui: { type: UiType.string } },
      { field: 'itemCode', readonly: 'readonly', title: '物料编码', ui: { type: UiType.string } },
      { field: 'descriptions', readonly: 'readonly', title: '物料描述', ui: { type: UiType.string } },
      { field: 'moQty', readonly: 'readonly', title: '需求数量', ui: { type: UiType.string } },
      { field: 'oriMoQty', readonly: 'readonly', title: '供应数量', ui: { type: UiType.string } },
      { field: 'demandDate', readonly: 'readonly', title: '需求时间', ui: { type: UiType.string } },
    ],
    values: {
      processMakeOrderNum: '',
      itemCode: '',
      descriptions: '',
      plantCode: '',
      resourceCode: '',
      oriMoQty: '',
      moQty: '',
      demandDate: '',
      check: false
    }
  };
  selectIndex = 1;
  httpAction = { url: this.poComVindicateService.queryUrl1, method: 'GET', data: false };
  public mySelection: any[] = [];
  queryParamstemp: any;
  queryObj: any = {};
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private poComVindicateService: PoComVindicateService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
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
          field: 'descriptionsCn'
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
          field: 'subinventoryDescription'
        },
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
        {
          field: 'subinventoryAllocation'
        },
        {
          field: 'onhandQuantity'
        },
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
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public columns = [
    { field: 'itemCode', headerName: '组件编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processCode', headerName: '工序号', tooltipField: 'processCode', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'descriptionsCn', headerName: '描述',
      tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'unitOfMeasure', headerName: '单位', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'planQty', headerName: '需求数量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'requirementQty', headerName: '计划内需求数', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'quantityPerAssembly', headerName: '每装需求数量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'issuedQty', headerName: '已发料数', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'usage', headerName: 'BOM用量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'demandDate', headerName: '需求时间', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'subinventoryDescription', headerName: '供应子库存', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'supplyType', headerName: '供应类型',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'subinventoryAllocation', headerName: '货位', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'onhandQuantity', headerName: '现有量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'substituteGroup', headerName: '替代组', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'alternateBomDesignator', headerName: '替代策略', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'priority', headerName: '替代优先级', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'substituteChance', headerName: '替代百分比', menuTabs: ['filterMenuTab', 'columnsMenuTab'] }
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
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.gridData = [];
    const that = this;
    this.showButton = true;
    this.clear();
    /** 初始化 用户权限下的组织  下拉框*/
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.UserPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });

      // 数字化工作台传参初始化
      if (this.pShowTitle && this.pGridSelectRow !== undefined) {
        that.moText = that.pGridSelectRow.processMakeOrderNum;
        this.queryParams.values.processMakeOrderNum = that.moText;
        this.query();
        that.showButton = false;
        that.fixed = false;
        that.gridHeight = 245;
      }

      if (that.j && that.j.PROCESS_MO_NUMBER !== undefined && that.j.PROCESS_MO_NUMBER !== null) {
        that.queryParams.values.processMakeOrderNum = that.j.PROCESS_MO_NUMBER;
        that.fixed = that.j.FIXED;
        that.showButton = false;
        that.gridHeight = this.j.HEIGHT;
        that.query();
      }
    });

    /** 初始化 供应类型  下拉框*/
    this.queryService.GetLookupByType('PS_MO_COMP_SUPPLY_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.supplytype.push({
          label: d.meaning,
          value: d.lookupTypeCode,
        });
      });
    });
  }
  query() {
    if (this.queryParams.values.processMakeOrderNum === null || this.queryParams.values.processMakeOrderNum === '')
      this.clear();

    if (this.queryParams.values.processMakeOrderNum !== '' && this.queryParams.values.processMakeOrderNum !== null) {
      this.poComVindicateService.queryMoInfo('', this.queryParams.values.processMakeOrderNum).subscribe(result => {
        result.data.forEach(d => {
          this.queryParams.values.plantCode = d.plantCode,
            this.queryParams.values.resourceCode = d.resourceCode,
            this.queryParams.values.moQty = d.moQty,
            this.queryParams.values.demandDate = d.demandDate,
            this.queryParams.values.itemCode = d.itemCode,
            this.queryParams.values.descriptions = d.descriptions;
          this.queryParams.values.check = d.alternateBomDesignator && d.alternateBomDesignator !== '' ? true : false;
        });
      });
    }

    this.queryObj = {
      moNo: this.queryParams.values.processMakeOrderNum,
      desc: this.queryParams.values.descriptions,
      plantcode: this.queryParams.values.plantCode,
    };
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.queryObj, this.context);
  }
  public clear() {
    this.queryParams.values = {
      processMakeOrderNum: '', itemCode: '', moQty: '',
      plantCode: '', resourceCode: '', descriptions: '', demandDate: '', oriMoQty: '', check: false
    };
  }

  expColumns = [
    {
      field: 'itemCode',
      title: '组件编码',
      filter: 'string',
      width: 150,
      locked: true
    },
    {
      field: 'processCode',
      width: 120,
      title: '工序号'
    },
    {
      field: 'descriptionsCn',
      title: '描述',
      width: 150,
      style: 'white-space:nowrap;text-overflow:ellipsis;',
      ui: { tooltip: 1 }
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      title: '单位',
      locked: false
    },
    {
      field: 'planQty',
      width: 120,
      title: '需求数量'
    },
    {
      field: 'requirementQty',
      width: 120,
      title: '计划内需求数'
    },
    {
      field: 'quantityPerAssembly',
      width: 120,
      title: '每装需求数量',
    },
    {
      field: 'issuedQty',
      width: 120,
      title: '已发料数'
    },
    {
      field: 'usage',
      width: 120,
      title: 'BOM用量'
    },
    {
      field: 'subinventoryDescription',
      width: 120,
      title: '供应子库存',
      ui: { tooltip: 1 }
    },
    {
      field: 'supplyType',
      width: 120,
      title: '供应类型',
      ui: { type: 'select', index: 1, options: this.supplytype },
    },
    {
      field: 'subinventoryAllocation',
      width: 120,
      title: '货位'
    },
    {
      field: 'onhandQuantity',
      width: 120,
      title: '现有量'
    },
    {
      field: 'substituteGroup',
      width: 120,
      title: '替代组'
    },
    {
      field: 'alternateBomDesignator',
      width: 120,
      title: '替代策略'
    },
    {
      field: 'priority',
      width: 120,
      title: '替代优先级'
    },
    {
      field: 'substituteChance',
      width: 120,
      title: '替代百分比'
    },
    {
      field: 'demandDate',
      width: 120,
      title: '需求时间',
      ui: { tooltip: 1 }
    },
  ];
  expColumnsOptions = [
    { field: 'supplyType', options: this.supplytype }
  ];

  expData: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    // this.queryObj = {
    //   moNum: this.queryParams.values.processMakeOrderNum,
    //   desc: this.queryParams.values.descriptions,
    //   plantCode: this.appConfigService.getPlantCode(),
    // };
    //this.queryService.exportAction({ url: this.queryService.excUrl, method: 'POST' }, this.queryObj, this.excelexport);

    this.queryService.exportAction(this.httpAction, this.queryObj, this.excelexport, this.context);
  }

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
