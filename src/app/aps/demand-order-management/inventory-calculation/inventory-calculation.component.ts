import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ModalHelper } from '@delon/theme';
import { Subject } from 'rxjs';
import { InventoryCalculationImportComponent } from './import/import.component';
import { InventoryCalculationEditComponent } from './edit/edit.component';
import { InventoryCalculationService } from './inventory-calculation.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

@Component({
  selector: 'app-inventory-calculation',
  templateUrl: './inventory-calculation.component.html',
  providers: [InventoryCalculationService],
})
export class InventoryCalculationComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private queryService: InventoryCalculationService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
    super.setTopMargin(209);
  }

  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100',
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100',
    },
  ];
  divisionOptions: Array<{ label: string, value: any }> = [];
  plantOptions: Array<{ label: string, value: any }> = [];
  inventoryModeOptions: Array<{ label: string, value: any }> = [];
  summaryPeriodOptions: Array<{ label: string, value: any }> = [];
  queryParams = {
    defines: [
      {
        field: 'division',
        title: '事业部',
        required: true,
        ui: { type: UiType.select, options: this.divisionOptions, ngModelChange: this.onDivisionChange, }
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.onPlantCodeChange, }
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'ITEM_CODE',
          textField: 'ITEM_CODE',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
        },
      },
      {
        field: 'inventoryMode',
        title: '库存计划模式',
        ui: { type: UiType.select, options: this.inventoryModeOptions },
      },
    ],
    values: {
      division: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' },
      inventoryMode: null
    }
  };
  selectIndex = 0;
  tabs: Array<{ index: number, name: string }> = [
    { index: 0, name: '汇总时段' },
    { index: 1, name: '计划参数' },
    { index: 2, name: '库存计划结果' },
  ];
  tabFirstFlag = Array(this.tabs.length).fill(true);
  stateKey = 'inventoryCalculation';
  tabSubject = new Subject<{ index: number; curColDef: any[]; columnApi: any; gridApi: any; }>();
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  allColumns = [
    {
      colId: 'select',
      field: 'select',
      cellClass: '',
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
      suppressSizeToFit: true,
    },
    {
      colId: 'action',
      field: 'action',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    { field: 'SCHEDULE_REGION_CODE', headerName: '事业部', width: 90, menuTabs: ['filterMenuTab'], },
    { field: 'INV_PLAN_MODEL', headerName: '库存计划模式', width: 130, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'], },
    { field: 'TIME_FENCE', headerName: '汇总时段', width: 110, valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'], },
    { field: 'TIME_FENCE_DEFINION', headerName: '汇总时段自定义', width: 140, menuTabs: ['filterMenuTab'], },
    { field: 'PLANT_CODE', headerName: '工厂', width: 90, menuTabs: ['filterMenuTab'], },
    { field: 'SOURCE_TYPE', headerName: '类别', width: 90, menuTabs: ['filterMenuTab'], },
    { field: 'SOURCE_CODE', headerName: '类别值', width: 110, menuTabs: ['filterMenuTab'], },
    { field: 'SOURCE_DESC', headerName: '描述', width: 150, menuTabs: ['filterMenuTab'], },
    { field: 'TARGET_TURNOVER_DAYS', headerName: '目标周转天数', width: 130, menuTabs: ['filterMenuTab'], },
    { field: 'TARGET_SVRVICE_LEVEL', headerName: '目标服务水平%', width: 130, menuTabs: ['filterMenuTab'], },
    { field: 'ECONOMIC_BATCH', headerName: '经济批量', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'MIN_PRODUCTION_BATCH', headerName: '最小生产批量', width: 130, menuTabs: ['filterMenuTab'], },
    { field: 'QULITY_LEAD_TIME', headerName: '质检周期', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'FLUCTUATION_COEFFICIENT', headerName: '波动系数', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'SPLIT_RATIO', headerName: '工厂分配比例', width: 130, menuTabs: ['filterMenuTab'], },
    { field: 'PURCHASE_FREQUENCY', headerName: '采购频次', width: 100, menuTabs: ['filterMenuTab'], },
    {
      field: 'START_DATE',
      headerName: '生效日期',
      width: 120,
      valueFormatter: function(params) {
        if (params.value) {
          return params.value.split(' ')[0];
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'END_DATE',
      headerName: '失效日期',
      width: 120,
      valueFormatter: function (params) {
        if (params.value) {
          return params.value.split(' ')[0];
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab'],
    },
    { field: 'ITEM_CODE', headerName: '物料编码', width: 110, menuTabs: ['filterMenuTab'], },
    { field: 'ITEM_DESC', headerName: '物料描述', width: 200, menuTabs: ['filterMenuTab'], },
    // { field: 'PURCHASE_CYCLE', headerName: '采购周期', width: 100, menuTabs: ['filterMenuTab'], },
    // { field: 'PRODUCE_CYCLE', headerName: '生产周期', width: 100, menuTabs: ['filterMenuTab'], },
    // { field: 'QUEUE_CYCLE', headerName: '排队周期', width: 100, menuTabs: ['filterMenuTab'], },
    // { field: 'AVERAGE_DAILY_DEMAND', headerName: '日均需求量', width: 120, menuTabs: ['filterMenuTab'], },
    // { field: 'REPLENISHMENT_BATCH', headerName: '补货批次', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'SAFETY_STOCK', headerName: '安全库存建议', width: 130, menuTabs: ['filterMenuTab'], },
    { field: 'TAGET_STOCK', headerName: '目标库存建议', width: 130, menuTabs: ['filterMenuTab'], },
  ];
  tabHideColumns: Array<{ tabIndex: number, columns: Array<{ field: string }> }> = [
    {
      tabIndex: 0,
      columns: [
        { field: 'select' },
        { field: 'SOURCE_TYPE' },
        { field: 'SOURCE_CODE' },
        { field: 'SOURCE_DESC' },
        { field: 'TARGET_TURNOVER_DAYS' },
        { field: 'TARGET_SVRVICE_LEVEL' },
        { field: 'ECONOMIC_BATCH' },
        { field: 'MIN_PRODUCTION_BATCH' },
        { field: 'QULITY_LEAD_TIME' },
        { field: 'FLUCTUATION_COEFFICIENT' },
        { field: 'SPLIT_RATIO' },
        { field: 'PURCHASE_FREQUENCY' },
        { field: 'START_DATE' },
        { field: 'END_DATE' },
        { field: 'ITEM_CODE' },
        { field: 'ITEM_DESC' },
        // { field: 'PURCHASE_CYCLE' },
        // { field: 'PRODUCE_CYCLE' },
        // { field: 'QUEUE_CYCLE' },
        // { field: 'AVERAGE_DAILY_DEMAND' },
        // { field: 'REPLENISHMENT_BATCH' },
        { field: 'SAFETY_STOCK' },
        { field: 'TAGET_STOCK' },
      ]
    },
    {
      tabIndex: 1,
      columns: [
        { field: 'select' },
        { field: 'SCHEDULE_REGION_CODE' },
        { field: 'INV_PLAN_MODEL' },
        { field: 'TIME_FENCE' },
        { field: 'TIME_FENCE_DEFINION' },
        { field: 'ITEM_CODE' },
        { field: 'ITEM_DESC' },
        // { field: 'PURCHASE_CYCLE' },
        // { field: 'PRODUCE_CYCLE' },
        // { field: 'QUEUE_CYCLE' },
        // { field: 'AVERAGE_DAILY_DEMAND' },
        // { field: 'REPLENISHMENT_BATCH' },
        { field: 'SAFETY_STOCK' },
        { field: 'TAGET_STOCK' },
      ]
    },
    {
      tabIndex: 2,
      columns: [
        { field: 'action' },
        { field: 'TIME_FENCE' },
        { field: 'TIME_FENCE_DEFINION' },
        { field: 'SOURCE_TYPE' },
        { field: 'SOURCE_CODE' },
        { field: 'SOURCE_DESC' },
      ]
    },
  ];
  curTabColumns: any[] = [];
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'INV_PLAN_MODEL', options: this.inventoryModeOptions },
    { field: 'TIME_FENCE', options: this.summaryPeriodOptions },
  ];
  exportFileName = this.tabs.find(item => item.index === this.selectIndex).name;
  @ViewChild('excelExport', { static: true }) excelExport: CustomExcelExportComponent;
  expColumnsMaps: Array<any[]> = [
    [
      { field: 'SCHEDULE_REGION_CODE', title: '事业部', width: 150, locked: false },
      { field: 'INV_PLAN_MODEL', title: '库存计划模式', width: 150, locked: false },
      { field: 'TIME_FENCE', title: '汇总时段', width: 150, locked: false },
      { field: 'TIME_FENCE_DEFINION', title: '汇总时段自定义', width: 150, locked: false },
    ],
    [
      { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false },
      { field: 'SOURCE_TYPE', title: '类别', width: 150, locked: false },
      { field: 'SOURCE_CODE', title: '类别值', width: 150, locked: false },
      { field: 'SOURCE_DESC', title: '描述', width: 150, locked: false },
      { field: 'TARGET_TURNOVER_DAYS', title: '目标周转天数', width: 150, locked: false },
      { field: 'TARGET_SVRVICE_LEVEL', title: '目标服务水平%', width: 150, locked: false },
      { field: 'ECONOMIC_BATCH', title: '经济批量', width: 150, locked: false },
      { field: 'MIN_PRODUCTION_BATCH', title: '最小生产批量', width: 150, locked: false },
      { field: 'QULITY_LEAD_TIME', title: '质检周期', width: 150, locked: false },
      { field: 'FLUCTUATION_COEFFICIENT', title: '波动系数', width: 150, locked: false },
      { field: 'SPLIT_RATIO', title: '工厂分配比例', width: 150, locked: false },
      { field: 'PURCHASE_FREQUENCY', title: '采购频次', width: 150, locked: false },
      { field: 'START_DATE', title: '生效日期', width: 150, locked: false },
      { field: 'END_DATE', title: '失效日期', width: 150, locked: false },
    ],
    [
      { field: 'SCHEDULE_REGION_CODE', title: '事业部', width: 150, locked: false },
      { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false },
      { field: 'INV_PLAN_MODEL', title: '库存计划模式', width: 150, locked: false },
      { field: 'ITEM_CODE', title: '物料编码', width: 150, locked: false },
      { field: 'ITEM_DESC', title: '物料描述', width: 150, locked: false },
      // { field: 'PURCHASE_CYCLE', title: '采购周期', width: 150, locked: false },
      { field: 'PURCHASE_FREQUENCY', title: '采购频次', width: 150, locked: false },
      // { field: 'PRODUCE_CYCLE', title: '生产周期', width: 150, locked: false },
      // { field: 'QUEUE_CYCLE', title: '排队周期', width: 150, locked: false },
      { field: 'QULITY_LEAD_TIME', title: '质检周期', width: 150, locked: false },
      // { field: 'AVERAGE_DAILY_DEMAND', title: '日均需求量', width: 150, locked: false },
      { field: 'TARGET_SVRVICE_LEVEL', title: '目标服务水平%', width: 150, locked: false },
      { field: 'FLUCTUATION_COEFFICIENT', title: '波动系数', width: 150, locked: false },
      { field: 'ECONOMIC_BATCH', title: '经济批量', width: 150, locked: false },
      // { field: 'REPLENISHMENT_BATCH', title: '补货批次', width: 150, locked: false },
      { field: 'TARGET_TURNOVER_DAYS', title: '目标周转天数', width: 150, locked: false },
      { field: 'MIN_PRODUCTION_BATCH', title: '最小生产批量', width: 150, locked: false },
      { field: 'SPLIT_RATIO', title: '工厂分配比例', width: 150, locked: false },
      { field: 'SAFETY_STOCK', title: '安全库存建议', width: 150, locked: false },
      { field: 'TAGET_STOCK', title: '目标库存建议', width: 150, locked: false },
      { field: 'START_DATE', title: '生效日期', width: 150, locked: false },
      { field: 'END_DATE', title: '失效日期', width: 150, locked: false },
    ]
  ];

  ngOnInit() {
    this.getInventoryModeOptions();
    this.getSummaryPeriodOptions();
    this.getDivisionOptions();
    this.getPlantOptions(this.queryParams.values.division);
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      division: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' },
      inventoryMode: null,
    };
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      this.queryService.queryUrlsOptions[this.selectIndex],
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams(isExport: boolean = false) {
    return {
      division: this.queryParams.values.division,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      inventoryMode: this.queryParams.values.inventoryMode,
      page: this._pageNo,
      pageIndex: this._pageNo, // jianl新增，为了迎合后台定义的dto的属性名，所以增加了这个参数，和page是一样的（page不知道是哪个接口有用到，不敢删）
      pageSize: this._pageSize,
      isExport: isExport,
    };
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.tabSelect({ index: 0, name: '汇总时段' });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.inventoryModeOptions;
        break;
      case 2:
        options = this.summaryPeriodOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  getSummaryPeriodOptions() {
    this.commonQueryService.GetLookupByType('INV_SUMMARY_PERIOD').subscribe(res => {
      res.Extra.forEach(item => {
        this.summaryPeriodOptions.push({
          label: item.MEANING,
          value: item.LOOKUP_CODE,
        });
      });
    });
  }

  getInventoryModeOptions() {
    this.commonQueryService.GetLookupByType('INV_PLAN_MODEL').subscribe(res => {
      res.Extra.forEach(item => {
        this.inventoryModeOptions.push({
          label: item.MEANING,
          value: item.LOOKUP_CODE,
        });
      });
    });
  }

  getDivisionOptions() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.extra.forEach(item => {
        this.divisionOptions.push({
          label: item.SCHEDULE_REGION_CODE,
          value: item.SCHEDULE_REGION_CODE
        });
      });
    });
  }

  getPlantOptions(division: string) {
    this.commonQueryService.GetUserPlant(division).subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE
        });
      });
    });
  }

  onDivisionChange(division: string) {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
    this.getPlantOptions(division);
  }

  onPlantCodeChange(plant: string) {
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
  }

  add(dataItem?: any) {
    this.modal.static(
      InventoryCalculationEditComponent,
      {
        i: { Id: dataItem ? dataItem.Id : null },
        selectIndex: this.selectIndex,
      }
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  importFile() {
    this.modal.static(InventoryCalculationImportComponent, {}, 'md').subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  exportFile() {
    this.expColumns = this.expColumnsMaps[this.selectIndex];
    this.exportFileName = this.tabs.find(item => item.index === this.selectIndex).name;
    this.commonQueryService.exportAction(
      this.queryService.queryUrlsOptions[this.selectIndex],
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
  }

  recommendSafetyStock() {
    this.getGridSelectionKeys();
    if (this.selectionKeys.length < 1) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选数据！'));
      return;
    }
    // const ids = '["' + this.selectionKeys.join('","') + '"]';
    const ids = JSON.stringify(this.selectionKeys);

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要引入安全库存？'),
      nzOnOk: () => {
        this.queryService
          .SaveStock(ids)
          .subscribe(res => {
            if (res.Success === true) {
              this.msgSrv.success(this.appTranslationService.translate('引入成功'));
            } else {
              this.msgSrv.warning(this.appTranslationService.translate(res.Message));
            }
          });
        },
    });
  }

  remove(dataItem: any) {
    switch (this.selectIndex) {
      case 0:
        this.queryService.deleteSummaryPeriodItem(dataItem.Id).subscribe(res => {
          if (res.Success) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.Message));
          }
        });
        break;
      case 1:
        this.queryService.deletePlanParameterItem(dataItem.Id).subscribe(res => {
          if (res.Success) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.Message));
          }
        });
        break;
    }
  }

  // 因tabSelect函数里不能使用selectIndex，新定义一个函数用于tab切换时数据初始化
  tabSearch(index: number) {
    super.query();
    this.commonQueryService.loadGridView(
      this.queryService.queryUrlsOptions[index],
      this.getQueryParams(),
      this.context
    );
  }

  /**
   * 函数里不能直接使用selectIndex，这时候selectIndex的值还未改变
   * @param index
   * @param name
   */
  tabSelect({ index, name }) {
    this.gridApi.deselectAll();
    const curDisabledColumns = this.tabHideColumns.find(h => h.tabIndex === index).columns;
    this.curTabColumns = this.allColumns.filter(c => !curDisabledColumns.find(cc => cc.field === c.field));
    if (index !== 2) {
      this.curTabColumns.find(item => item.field === 'action').cellRendererParams.customTemplate = this.customTemplate;
    }
    this.tabSubject.next({
      index: index + 1,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
    });
    this.tabSearch(index);
    this.gridApi.redrawRows();
    this.initGridWidth();
  }

  searchItems(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  loadItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.commonQueryService.GetUserPlantItemPageList(
      PLANT_CODE || '',
      ITEM_CODE || '',
      '',
      PageIndex,
      PageSize,
    ).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }

  /*rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.itemCode.text = Text;
    this.queryParams.values.itemCode.value = Value;
  }*/

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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
