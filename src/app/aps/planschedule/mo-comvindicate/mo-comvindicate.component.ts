import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { EditService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { map } from 'rxjs/operators/map';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComVindicateService } from '../../../modules/generated_module/services/comvindicate-service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mo-comvindicate',
  templateUrl: './mo-comvindicate.component.html',
  providers: [EditService],
})
export class PlanscheduleMoComVindicateComponent extends CustomBaseContext implements OnInit {
  // 数字化工作台传参
  public pShowTitle = false;
  // 数字化工作台工单编码
  public pGridSelectRow: any;
  public moText = '';

  // mo例外传参
  j: any;
  // public context = this;
  expandForm = false;
  public gridView: GridDataResult;
  public gridData: any[] = [];
  UserPlantOptions: any[] = [];
  MoStatusOptions: any[] = [];
  supplytype: any[] = [];
  optionListItem2: any[] = [];
  public gridView2: GridDataResult = {
    data: [],
    total: 0
  };
  itemStyle = { width: '180px' };
  Plantcodes: string;
  CurLng: string;
  key: string;
  itemtypes: any[] = [];
  makebuycodes: any[] = [];
  linegroupoptions: any[] = [];
  PlantGroupLineoptions: any[] = [];
  yesnos: any[] = [];
  organizationids: any[] = [{ label: '  ', value: '' }];
  itemcodes: any[] = [{ label: '  ', value: '' }];
  Istrue = true;
  kendoHeight = document.body.clientHeight - 302;
  enableOptions = [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ];
  ColumnsMo: any[] = [
    {
      field: 'makeOrderNum',
      title: 'MO编号',
      width: '100'
    },
    /*
    {
      field: 'ITEM_CODE',
      title: '装配件编码',
      width: '100'
    },
    */
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    }
  ];

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  }; // 物料起
  public gridViewItems2: GridDataResult = {
    data: [],
    total: 0
  }; // 物料止

  public gridViewMo: GridDataResult = {
    data: [],
    total: 0
  };

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.UserPlantOptions, eventNo: 5 } },
      { field: 'prodLineGroupCode', title: '计划组', ui: { type: UiType.select, options: this.linegroupoptions, eventNo: 3 } },
      { field: 'prodLineCode', title: '资源', ui: { type: UiType.select, options: this.PlantGroupLineoptions } },
      {
        field: 'itemCode', title: '物料编码', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', name: 'itemCode'
          , gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 1
        }
      },
      { field: 'itemDesc', title: '物料描述', ui: { type: UiType.text } },
      { field: 'demandDate', title: '需求日期', ui: { type: UiType.dateRange } },
      {
        field: 'makeOrderNum', title: '工单号', ui: {
          type: UiType.popupSelect, valueField: 'makeOrderNum', textField: 'makeOrderNum', name: 'makeOrderNum'
          , gridView: this.gridViewMo, columns: this.ColumnsMo, eventNo: 4
        }
      },
      { field: 'makeOrderStatus', title: '工单状态', ui: { type: UiType.selectMultiple, options: this.MoStatusOptions } },
      { field: 'fpcDate', title: '工单开始时间', ui: { type: UiType.dateRange } },
      {
        field: 'comItemCode', title: '组件编码', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', name: 'comItemCode'
          , gridView: this.gridViewItems2, columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'moQty', title: '需求数量', ui: { type: UiType.text } },
      { field: 'suppyQty', title: '供应数量', ui: { type: UiType.text } },
      // { field: 'MAKE_ORDER_NUM', title: '工单号', ui: { type: UiType.text } },
      { field: 'demandcheck', title: '需求数量>已发料数', ui: { type: UiType.checkbox } }
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      prodLineGroupCode: null,
      prodLineCode: null, // 下拉框的初始值必须要设置为null，这样才能清除该值
      itemCode: { value: '', text: '' },
      itemDesc: '',
      demandDate: [],
      makeOrderNum: { value: '', text: '' },
      makeOrderStatus: [],
      fpcDate: [],
      comItemCode: { value: '', text: '' },
      moQty: '',
      suppyQty: '',
      demandcheck: false,
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };
  selectIndex = 1;
  httpAction = { url: this.editService.queryMoComUrl, method: 'GET', data: false };
  public mySelection: any[] = [];
  // queryParams: any = {};
  queryParamstemp: any;
  queryObj: any = {};
  showButton: Boolean = true;
  fixed: Boolean = true;
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
  productCategoryOptions: any[] = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private confirmationService: NzModalService,
    private appTranslationService: AppTranslationService,
    public editService: EditService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private comVindicateService: ComVindicateService,
    public QueryService: CommonQueryService,
    public appConfigService: AppConfigService
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
          field: 'comItemCode'
        },
        {
          field: 'comDescriptionsCn'
        },
        {
          field: 'demandTime'
        },
        {
          field: 'planQty'
        },
        {
          field: 'requirementQty'
        },
        {
          field: 'unitOfMeasure'
        },
        {
          field: 'issuedQty'
        },
        {
          field: 'usage'
        },
        {
          field: 'mrpvalue'
        },
        {
          field: 'finishQty'
        },
      ]
    },
    {
      tabIndex: 1,
      columns: [
        {
          field: 'makeOrderNum'
        },
        {
          field: 'makeOrderStatus'
        },
        {
          field: 'earliestStartTime'
        },
        {
          field: 'itemCode'
        },
        {
          field: 'descriptionsCn'
        },
        {
          field: 'scheduleGroupCode'
        },
        {
          field: 'scheduleGroupCodeDescriptions'
        },
        {
          field: 'resourceCode'
        },
        {
          field: 'resourceCodeDescriptions'
        },
        {
          field: 'supplyType'
        },
        {
          field: 'subinventoryDescription'
        },
        {
          field: 'onhandQuantity'
        },
        {
          field: 'alternateBomDesignator'
        },
        {
          field: 'subinventoryAllocation'
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
        options = this.makebuycodes;
        break;
      case 3:
        options = this.yesnos;
        break;
      case 4:
        options = this.MoStatusOptions;
        break;
      case 5:
        options = this.enableOptions;
        break;
      case 6:
        options = this.unitOptions;
        break;
      case 7:
        options = this.needSiteCutOptions;
        break;
      case 8:
        options = this.steelTypeOptions;
        break;
      case 9:
        options = this.surfaceOptions;
        break;
      case 10:
        options = this.productCategoryOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public columns = [
    { field: 'makeOrderNum', headerName: '工单号', menuTabs: ['filterMenuTab'] },
    {
      field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,4).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'earliestStartTime', headerName: '工单开始日期', menuTabs: ['filterMenuTab']
    },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    {
      field: 'descriptionsCn', headerName: '物料描述', tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab']
    },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCodeDescriptions', headerName: '计划组描述', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCodeDescriptions', headerName: '资源描述', menuTabs: ['filterMenuTab'] },
    {
      field: 'processCode', headerName: '工序号', menuTabs: ['filterMenuTab']
    },
    {
      field: 'comItemCode', headerName: '组件编码', menuTabs: ['filterMenuTab']
    },
    {
      field: 'comDescriptionsCn', headerName: '组件描述', tooltipField: 'comDescriptionsCn', menuTabs: ['filterMenuTab']
    },
    {
      field: 'demandTime', headerName: '需求日期', menuTabs: ['filterMenuTab']
    },
    {
      field: 'requirementQty', headerName: '计划内需求数量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'planQty', headerName: '需求数量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'unitOfMeasure', headerName: '单位', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'issuedQty', headerName: '已发料数', menuTabs: ['filterMenuTab']
    },
    {
      field: 'usage', headerName: 'BOM用量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'mrpvalue', headerName: 'MRP净值', menuTabs: ['filterMenuTab']
    },
    {
      field: 'finishQty', headerName: '完工数量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'supplyType', headerName: '供应类型', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'subinventoryDescription', headerName: '供应子库存', menuTabs: ['filterMenuTab']
    },
    {
      field: 'onhandQuantity', headerName: '现有量', menuTabs: ['filterMenuTab']
    },
    {
      field: 'subinventoryDescription', headerName: '供应子库存', menuTabs: ['filterMenuTab']
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
      field: 'subinventoryAllocation', headerName: '货位', menuTabs: ['filterMenuTab']
    },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,8).label',
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
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'length', width: 100, headerName: '长度',
    },
    {
      field: 'width', width: 100, headerName: '宽度',
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

  public searchMo(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadMo(this.queryParams.values.plantCode || this.Plantcodes, e.SearchValue, PageIndex, e.PageSize);
  }

  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode || this.Plantcodes, e.SearchValue, PageIndex, e.PageSize);
  }

  public searchItems2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode || this.Plantcodes, e.SearchValue, PageIndex, e.PageSize, 2);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number, ViewNo: number = 1) {
    // 加载物料
    this.QueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      if (ViewNo === 1) {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.content.length;
      } else {
        this.gridViewItems2.data = res.data.content;
        this.gridViewItems2.total = res.data.content.length;
      }
    });
  }

  public loadMo(PLANT_CODE: string, MAKE_ORDER_NUM: string, PageIndex: number, PageSize: number) {
    // 加载Mo
    this.comVindicateService.getMoNumPageList(PLANT_CODE || '', MAKE_ORDER_NUM || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewMo.data = res.data.content;
      this.gridViewMo.total = res.data.content.length;
    });
  }

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
    // this.clear();
    this.queryParams.values.plantCode = this.appConfigService.getPlantCode();
    /** 初始化 用户权限下的组织  下拉框*/
    this.QueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.UserPlantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });
      });
      // 数字化工作台传参初始化
      if (this.pShowTitle && this.pGridSelectRow !== undefined) {
        const that = this;
        that.moText = that.pGridSelectRow.makeOrderNum;
        this.queryParams.values.makeOrderNum.text = that.moText;
        this.query();
        this.showButton = false;
        this.fixed = false;
        this.gridHeight = 245;
      }

      // mo 例外调用传参
      if (this.j !== undefined) {
        this.queryParams.values.makeOrderNum.text = this.j.makeOrderNum;
        this.query();
      }
    });


    this.QueryService.GetUserPlantGroup(this.queryParams.values.plantCode).subscribe(result => {
      result.Extra.forEach(d => {
        this.linegroupoptions.push({
          label: `${d.scheduleGroupCode}(${d.descriptions})`,
          value: d.scheduleGroupCode,
        });
      });
    });

    // 先克隆查询参数
    this.cloneQueryParams();

    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  async loadOptions() {
    await this.QueryService.GetLookupByTypeRefZip({
      'PS_MO_COMP_SUPPLY_TYPE': this.supplytype,
      'PS_MAKE_ORDER_STATUS': this.MoStatusOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
    })
  }

  query() {
    if (!this.queryParams.values.makeOrderNum.text && !this.queryParams.values.comItemCode.text && !this.queryParams.values.itemCode.text) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工单号、物料编码、组件编码中的任意一种'));
      return;
    }

    if (this.queryParams.values.comItemCode.text || this.queryParams.values.itemCode.text) {
      if (!this.queryParams.values.makeOrderNum.text && !this.queryParams.values.fpcDate[0] && !this.queryParams.values.demandDate[0] && !this.queryParams.values.makeOrderStatus) {
        this.msgSrv.warning(this.appTranslationService.translate('请选择工单开始时间、需求时间、工单状态中的任意一种'));
        return;
      }
    }

    const re = /^[0-9]+?[0-9]*$/;
    if ((this.queryParams.values.moQty !== '' && !re.test(this.queryParams.values.moQty)) || (this.queryParams.values.suppyQty !== '' && !re.test(this.queryParams.values.suppyQty))) {
      this.msgSrv.warning(this.appTranslationService.translate('无效数字'));
      return;
    }
    this.editService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  public plantChange(value: any) {
    this.linegroupoptions.length = 0;
    this.QueryService.GetUserPlantGroup(this.queryParams.values.plantCode || this.appConfigService.getPlantCode()).subscribe(result => {
      result.Extra.forEach(d => {
        this.linegroupoptions.push({
          label: `${d.scheduleGroupCode}(${d.descriptions})`,
          value: d.scheduleGroupCode,
        });
      });
    });
  }

  public groupChange(value: any) {
    this.PlantGroupLineoptions.length = 0;
    this.editService.GetUserPlantGroupLine(this.queryParams.values.plantCode, this.queryParams.values.prodLineGroupCode)
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

  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      itemDesc: this.queryParams.values.itemDesc,
      moQty: this.queryParams.values.moQty,
      suppyQty: this.queryParams.values.suppyQty,
      makeOrderNum: this.queryParams.values.makeOrderNum.text,
      prodLineGroupCode: this.queryParams.values.prodLineGroupCode,
      prodLineCode: this.queryParams.values.prodLineCode,
      fpcDateFrom: this.queryParams.values.fpcDate[0] ? this.QueryService.formatDate(this.queryParams.values.fpcDate[0]) : null,
      fpcDateTo: this.queryParams.values.fpcDate[1] ? this.QueryService.formatDate(this.queryParams.values.fpcDate[1]) : null,
      makeOrderStatus: this.queryParams.values.makeOrderStatus,
      comItemCode: this.queryParams.values.comItemCode.text,
      demandDateFrom: this.queryParams.values.demandDate[0] ? this.QueryService.formatDate(this.queryParams.values.demandDate[0]) : null,
      demandDateTo: this.queryParams.values.demandDate[1] ? this.QueryService.formatDate(this.queryParams.values.demandDate[1]) : null,
      demandcheck: this.queryParams.values.demandcheck ? 'Y' : 'N',
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }


  public clear() {
    // jianl修改，改用刘建兄的克隆恢复的思路去实现重置
    super.clear();
  }

  expColumns = [
    {
      field: 'makeOrderNum',
      title: '工单号',
      width: 150,
      locked: false
    },
    {
      field: 'makeOrderStatus',
      width: 120,
      title: '工单状态',
      locked: false,
      ui: { type: 'select', index: 4, options: this.MoStatusOptions },
    },
    {
      field: 'earliestStartTime',
      title: '工单开始日期',
      width: 150,
      ui: { tooltip: 1 }
    },
    {
      field: 'itemCode',
      width: 150,
      title: '物料编码'
    },
    {
      field: 'descriptionsCn',
      width: 150,
      title: '物料描述',
      ui: { tooltip: 1 }
    },
    {
      field: 'scheduleGroupCode',
      width: 120,
      title: '计划组'
    },
    {
      field: 'processCode',
      width: 120,
      title: '工序号',
    },
    {
      field: 'comItemCode',
      width: 130,
      title: '组件编码'
    },
    {
      field: 'comDescriptionsCn',
      width: 120,
      title: '组件描述',
      ui: { tooltip: 1 }
    },
    {
      field: 'demandTime',
      width: 120,
      title: '需求日期',
      ui: { tooltip: 1 }
    },
    {
      field: 'requirementQty',
      width: 120,
      title: '计划内需求数量',
    },
    {
      field: 'planQty',
      width: 120,
      title: '需求数量'
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      title: '单位',
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
      field: 'mrpvalue',
      width: 120,
      title: 'MRP净值',
      ui: { type: 'select', index: 5, options: this.enableOptions },
    },
    {
      field: 'finishQty',
      width: 120,
      title: '完工数量'
    },
    {
      field: 'supplyType',
      width: 120,
      title: '供应类型',
      ui: { type: 'select', index: 1, options: this.supplytype },
    },
    {
      field: 'subinventoryDescription',
      width: 120,
      title: '供应子库存',
      ui: { tooltip: 1 }
    },
    {
      field: 'onhandQuantity',
      width: 120,
      title: '现有量'
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
      field: 'subinventoryAllocation',
      width: 120,
      title: '货位'
    },

  ];
  expColumnsOptions = [
    { field: 'makeOrderStatus', options: this.MoStatusOptions },
    { field: 'supplyType', options: this.supplytype },
    { field: 'needSideCut', options: this.needSiteCutOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.editService.exportAction({ url: this.editService.expUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }
}



