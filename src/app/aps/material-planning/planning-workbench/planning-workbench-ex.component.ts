import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { STComponent } from '@delon/abc';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
import { MrpPlanningExceptionComponent } from './view/planning-exception.component';
import { MrpPlanningOnhandComponent } from './view/planning-onhand.component';
import { MrpPlanningPeggingComponent } from './view/planning-pegging.component';
import { process } from '@progress/kendo-data-query';
import { MrpPlanningWorkbenchComponent } from './planning-workbench.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mrp-planning-workbench-ex',
  templateUrl: './planning-workbench-ex.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [QueryService],
  styles: [`.k-grid .no-padding{padding:0}
          .whole-cell{display:block;padding:0;margin:0;}
          .redCellStyle {color:red;}
          .blueCellStyle {color:blue;}
          .backColor0 {background-color:#ffffff !important}
          .backColor1 {background-color:#f5f7fa !important}
          .show-cell {
                background: white;
                border-left: 0.5px lightgrey solid !important;
                border-right: 0.5px lightgrey solid !important;
                border-bottom: 0.5px lightgrey solid !important;
            }`]
})
export class MrpPlanningWorkbenchExComponent extends CustomBaseContext implements OnInit {

  components;
  isRowSelectable;
  isFormLoad = true;
  listPlan: any[] = [];
  listPlant: any[] = [];
  listVersion: any[] = [];
  listMakeBuy: any[] = [];
  listDateType: any[] = [{ label: '日', value: 'DAY' }, { label: '周', value: 'WEEK' }, { label: '月', value: 'MONTH' }];
  searchParans: any = {};
  lastDateRange: any = {};
  totalCount = 0;
  queryDateRange = []; // 查询的准确时间范围
  CUSTOMER_APPOINT_VENDOR = false;
  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private appTranslate: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfig: AppConfigService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private queryService: QueryService,
  ) {
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    // this.headerNameTranslate(this.columns);

    this.components = { showCellRenderer: this.createShowCellRenderer() };
    this.defaultColDef.sortable = false;

    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.SHOW_CELL : false;
    };
    this.setGridColumn();
  }

  context = this;
  queryParams = {
    defines: [
      { field: 'planName', title: '计划名称', ui: { type: UiType.select, options: this.listPlan, ngModelChange: this.onPlanChange }, required: true },
      { field: 'version', title: '版本', ui: { type: UiType.select, options: this.listVersion }, required: true },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.listPlant, }, required: true },
      { field: 'dateType', title: '日期类型', ui: { type: UiType.select, options: this.listDateType }, required: true },
      { field: 'demandSupplyDate', title: '新到日期', ui: { type: UiType.dateRange }, required: true },
      { field: 'itemCode', title: '物料号', ui: { type: UiType.text } },
      { field: 'replaceCode', title: '替代组', ui: { type: UiType.text } },
      { field: 'planner', title: '计划员', ui: { type: UiType.text } },
      { field: 'buyer', title: '采购员', ui: { type: UiType.text } },
      { field: 'makeBuyCode', title: '制造或采购', ui: { type: UiType.select, options: this.listMakeBuy } },
    ],
    values: {
      planName: null,
      version: null,
      plantCode: null,
      dateType: null,
      demandSupplyDate: [],
      itemCode: null,
      replaceCode: null,
      planner: null,
      buyer: null,
      makeBuyCode: null,
    }
  };

  // 静态列
  staticColumns = [
    // {
    //   colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
    //   checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    //   rowSpan: function (params) {
    //     return params.data.ROW_SPAN;
    //   },
    //   cellClassRules: {
    //     'show-cell': function (params) { return params.data.SHOW_CELL; },
    //     'backColor0': function (params) { return params.data.SHOW_CELL && params.data.ITEM_INDEX % 2 === 0; },
    //     'backColor1': function (params) { return params.data.SHOW_CELL && params.data.ITEM_INDEX % 2 !== 0; }
    //   },
    //   menuTabs: ['filterMenuTab']
    // },
    // { field: 'MAIN_DATA', headerName: '主要信息', menuTabs: ['filterMenuTab'], pinned: 'left', lockPinned: true, },
    {
      field: 'groupCode',
      headerName: '绑定组',
    },
    {
      field: 'mainData',
      cellRenderer: 'showCellRenderer',
      rowSpan: function (params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell': function (params) { return params.data.showCell; },
        'backColor0': function (params) { return params.data.showCell && params.data.itemIndex % 2 === 0; },
        'backColor1': function (params) { return params.data.showCell && params.data.itemIndex % 2 !== 0; }
      },
      title: '物料/替代组', headerName: '物料/替代组', width: 150, pinned: 'left', lockPinned: true, isExtend: false, // 非日期扩展列
    },
    { field: 'otherData', headerName: '物料信息', menuTabs: ['filterMenuTab'], pinned: 'left', lockPinned: true, isExtend: false, },
    {
      field: 'rowTypeDesc', headerName: '行类型', menuTabs: ['filterMenuTab'], pinned: 'left', lockPinned: true,
      cellClass: function (params) { return params.context.getCellClass(params.data, 'rowTypeDesc'); }, isExtend: false, // 非日期扩展列
    },
    { field: 'customerNumber', headerName: '客户编码', menuTabs: ['filterMenuTab'], pinned: 'left', lockPinned: true, isExtend: false, },
    { field: 'productItemCode', headerName: '成品编码', menuTabs: ['filterMenuTab'], pinned: 'left', lockPinned: true, isExtend: false, },
    {
      field: 'subtotal', headerName: '小计', menuTabs: ['filterMenuTab'], pinned: 'left', lockPinned: true,
      cellClass: function (params) { return params.context.getCellClass(params.data, 'subtotal'); }, isExtend: false, // 非日期扩展列
    },
    {
      field: 'beginningSum',
      headerName: '期初',
    },
  ];

  columns = []; // 网格列
  extendColumns = []; // 日期扩展列
  expColumns = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  createShowCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      const cellBlank = !params.value;
      if (cellBlank) {
        return null;
      }
      this.ui = document.createElement('div');
      // this.ui.innerHTML = '<div class="show-name">' + params.value;
      if (params.colDef.field === 'itemCode') {
        this.ui.innerHTML = '<div class="show-name">' + params.data.itemCode + '</div>' +
          '<div style="white-space: normal;"><span>' + params.data.itemDesc + '</span></div>';
      } else {
        this.ui.innerHTML = '<div class="show-name">' + params.value + '</div>';
      }
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }

  // grid 设置行样式
  public getRowClass = function (params) {
    // 根据物料隔行变色
    if (params.data.itemIndex % 2 === 0) {
      return 'backColor0';
    } else {
      return 'backColor1';
    }
  };

  public getCellClass(dataItem: any, field: string) {
    // 负数显示红色
    if (this.strToNumber(dataItem[field]) < 0) {
      return 'redCellStyle';
    }

    // 计划单显示蓝色
    if (dataItem.rowType === 'PLANNED_ORDER' && field === 'rowTypeDesc') {
      return 'blueCellStyle';
    }
    return '';
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  ngOnInit() {
    this.clear();
    // this.setGridColumn();
    this.loadInitData();
  }

  loadInitData() {
    this.queryService.QueryPlans().subscribe(res => {
      res.data.forEach(item => {
        this.listPlan.push({
          label: item.planName,
          value: item.planName
        });
      });

      if (this.listPlan.length > 0)
        this.queryParams.values.planName = this.listPlan[0].value;

      this.onPlanChange(this.queryParams.values.planName);
    });
    // 制造或采购
    this.queryService.GetLookupByTypeNew('PS_MAKE_BUY_CODE').subscribe(result => {
      result.data.forEach(d => {
        this.listMakeBuy.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  onPlanChange(value) {
    this.queryParams.values.version = null;
    this.queryParams.values.plantCode = null;
    this.queryService.QueryDataByPlan(value).subscribe(res => {
      this.listVersion.length = 0;
      this.listPlant.length = 0;

      // 版本
      res.data.listVersion.forEach(item => {
        this.listVersion.push({
          label: item,
          value: item
        });
      });
      if (this.listVersion.length > 0)
        this.queryParams.values.version = this.listVersion[0].value;

      // 计划工厂
      res.data.listPlant.forEach(item => {
        this.listPlant.push({
          label: item,
          value: item
        });
      });

      this.CUSTOMER_APPOINT_VENDOR = res.data.customerAppointVendor === 'Y' ? true : false;

      if (this.listPlant.length > 0)
        this.queryParams.values.plantCode = this.listPlant[0].value;

      this.setGridColumn();

      if (this.isFormLoad) {
        this.isFormLoad = false;
        this.query();
      }
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  clear() {
    this.queryParams.values = {
      planName: null,
      version: null,
      plantCode: null,
      dateType: null,
      itemCode: null,
      replaceCode: null,
      planner: null,
      buyer: null,
      makeBuyCode: null,
      demandSupplyDate: [],
    };
    // 日期类型默认日，时间范围默认一个月
    this.queryParams.values.dateType = 'DAY';
    const tf = new Date();
    const tt = this.queryService.addMonths(tf, 1);
    this.queryParams.values.demandSupplyDate = [tf, tt];

    if (this.listPlan.length > 0) {
      this.queryParams.values.planName = this.listPlan[0].value;
      this.onPlanChange(this.queryParams.values.planName);
    }
  }

  // queryCommon() {
  //   this.queryService.loadGridView(this.queryService.planWorkbenchQuery, this.getQueryParams(), this.context);
  // }

  queryCommon() {
    this.setLoading(true);
    this.searchParans = this.getQueryParams(false);
    this.queryService.QueryPlanWorkbenchEx(this.searchParans, this.CUSTOMER_APPOINT_VENDOR).subscribe(result => {
      this.setLoading(false);
      if (result.code !== 200) {
        this.msgSrv.error(this.appTranslate.translate(result.msg));
        return;
      }
      if (this.gridData !== null && this.gridData !== undefined) this.gridData.length = 0;

      this.gridData = result.data.dataResult;
      this.totalCount = result.data.totalCount;
      this.gridApi.paginationSetPageSize(this.gridData.length);
      if (this.totalCount === 0) {
        this.lastPageNo = 1;
      }
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter,
        }).data,
        total: this.totalCount,
      };

      this.queryDateRange = [new Date(result.data.demandSupplyDateS), new Date(result.data.demandSupplyDateT)];
      // 添加列必须在绑定数据源后
      this.createExtendColumns(result.data.listCols);
    });
  }

  createExtendColumns(extendCols: any) {
    let isChange = false;
    if (this.lastDateRange == null
      || this.lastDateRange.dateType !== this.searchParans.dateType
      || this.lastDateRange.demandSupplyDateS !== this.searchParans.demandSupplyDateS
      || this.lastDateRange.demandSupplyDateT !== this.searchParans.demandSupplyDateT
    ) {
      // 时间范围有修改
      isChange = true;

      this.lastDateRange = {
        dateType: this.searchParans.dateType,
        demandSupplyDate_S: this.searchParans.demandSupplyDateS,
        demandSupplyDate_T: this.searchParans.demandSupplyDateT,
      };
    }
    if (!isChange) return;

    this.extendColumns.length = 0;
    // 加载列头
    extendCols.forEach(cols => {
      const col = {
        field: cols.fieldName,
        headerName: cols.headerName,
        width: 150,
        title: cols.headerName,
        dataRange: [new Date(cols.startDate), new Date(cols.endDate)], // 记录日期范围，用于查询明细数据
        // // 列编辑模式
        // editable: function (params) {
        //   return params.context.cellEditState(params);
        // },
        isExtend: true, // 日期扩展列
        cellClass: function (params) {
          return params.context.getCellClass(params.data, cols.fieldName);
        },
      };
      this.extendColumns.push(col);

    });

    this.setGridColumn();
  }

  setGridColumn() {
    this.columns = [];
    this.expColumns = [];

    this.staticColumns.forEach(col => {
      // 客指供应商，增加客户和成品编码列
      if (col.field === 'customerNumber' || col.field === 'productItemCode') {
        if (this.CUSTOMER_APPOINT_VENDOR) {
          this.columns.push(col);
          this.expColumns.push({ field: col.field, title: col.headerName, width: 200 });
        }
      } else {
        this.columns.push(col);
        if (col.field !== 'check')
          this.expColumns.push({ field: col.field, title: col.headerName, width: 200 });
      }
    });

    this.extendColumns.forEach(col => {
      this.columns.push(col);
      this.expColumns.push({ field: col.field, title: col.headerName, width: 200 });
    });
  }

  formatDate(date?: Date): string {
    // if (!date) return '';
    // return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return this.queryService.formatDate(date);
  }

  getQueryParams(isExport?: boolean) {
    return {
      planName: this.queryParams.values.planName,
      version: this.queryParams.values.version,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      replaceCode: this.queryParams.values.replaceCode,
      dateType: this.queryParams.values.dateType,
      planner: this.queryParams.values.planner,
      buyer: this.queryParams.values.buyer,
      makeBuyCode: this.queryParams.values.makeBuyCode,
      demandSupplyDateS: this.queryParams.values.demandSupplyDate[0],
      demandSupplyDateT: this.queryParams.values.demandSupplyDate[1],
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    };
  }

  exportFile() {
    // super.export();
    // this.queryService.exportAction(this.queryService.planWorkbenchQuery, this.getQueryParams(true), this.excelexport, this.context);
    this.queryService.QueryPlanWorkbenchEx(this.getQueryParams(true), this.CUSTOMER_APPOINT_VENDOR).subscribe(result => {
      this.excelexport.export(result.data.DataResult);
    });
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        // this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    if (event.value === undefined || event.value === null || event.value === '' || event.value === 0) return;

    let isShowDetail = false;
    const inputParam = {
      planName: event.data.planName,
      version: event.data.version,
      plantCode: event.data.plantCode,
      itemCode: event.data.itemCode,
      itemId: event.data.itemId,
      planType: '',
      noPlanType: '',
      vendorNumber: '',
      vendorSiteCode: '',
      dataType: '',
      demandSupplyDate: [],
    };
    if (event.colDef.field === 'mainData') {
      // 双击物料列，弹出物料所有明细
      isShowDetail = true;
      // this.queryDateRange, 结束时间需要减一天
      inputParam.demandSupplyDate = [this.queryDateRange[0], this.queryService.addDays(this.queryDateRange[1], -1)];
    }

    if (event.colDef.isExtend) {
      // 双击日期扩展列，弹出明细
      const rowType = event.data.rowType;
      if (rowType !== 'AVAILABLE_QUANTITY') { // 预计可用量不展示明细
        isShowDetail = true;

        if (rowType === 'DEMAND') { // 需求
          inputParam.dataType = '1';
        } else {
          if (rowType === 'SUPPLY') { // 供应，排除计划
            inputParam.dataType = '2';
            inputParam.noPlanType = 'PLANNED_ORDER';
          } else {
            // 计划，仅查询计划
            inputParam.dataType = '2';
            inputParam.planType = 'SUPPLY_PLANNED_ORDER';
            inputParam.vendorNumber = event.data.vendorNumber;
            inputParam.vendorSiteCode = event.data.vendorSiteCode;
          }
        }
        // 结束时间需要减一天
        inputParam.demandSupplyDate = [event.colDef.dataRange[0], this.queryService.addDays(event.colDef.dataRange[1], -1)];
      }
    }

    if (isShowDetail) {
      // 弹出明细页面
      this.modal.static(MrpPlanningWorkbenchComponent, { inputParam: inputParam, isPopShow: true, }, 'xl').subscribe(res => {
      });
    }
  }
}
