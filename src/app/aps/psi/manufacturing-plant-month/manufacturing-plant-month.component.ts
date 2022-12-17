import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'manufacturing-plant-month',
  templateUrl: './manufacturing-plant-month.component.html',
  providers: [QueryService]
})
export class ManufacturingPlantMonthComponent extends CustomBaseContext implements OnInit  {
  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  currentYear = new Date().getFullYear();

  columns: any[] = [];

  staticColumns = [
    { field: 'index', headerName: '序号', pinned: 'left', width: 80, },
    { field: 'productCatgory', headerName: '品类', pinned: 'left', width: 80, },
    { field: 'itemCode', headerName: '商品编码', pinned: 'left', width: 100, },
    { field: 'productModel', headerName: '产品型号', pinned: 'left', width: 100, },
    { field: 'baseCode', headerName: '基准编码', pinned: 'left', width: 100, },
    { field: 'lifeCycle', headerName: '生命周期', pinned: 'left', width: 100, },
    { field: 'salesType', headerName: '去向', pinned: 'left', width: 80, },
  ];

  yearOptions: any[] = [];
  monthOptions: any[] = [];

  businessUnitCodeOptions: any[] = [];
  plantOptions: any[] = [];
  salesTypeOptions: any[] = [];

  // 商品编码
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '商品编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '商品名称',
      width: '100',
    },
  ];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.businessUnitCodeOptions, eventNo: 1, }, required: true, },
      { field: 'plantCode', title: '组织', ui: { type: UiType.select, options: this.plantOptions, }, required: true, },
      { field: 'salesType', title: '内销/外销', ui: { type: UiType.select, options: this.salesTypeOptions, } },
      { field: 'demandDate', title: '月份', ui: { type: UiType.monthPicker, }, required: true, },
      { field: 'item', title: '商品编码', ui: { type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2, extraEvent: { RowSelectEventNo: 3, }, },  },
      { field: 'yearNumStart', title: '开始年份', ui: { type: UiType.select, options: this.yearOptions, eventNo: 4, }, required: true, },
      { field: 'yearNumEnd', title: '结束年份', ui: { type: UiType.select, options: this.yearOptions, eventNo: 5, }, required: true, },
      { field: 'monthNumStart', title: '开始月份', ui: { type: UiType.select, options: this.monthOptions, eventNo: 6, }, required: true, },
      { field: 'monthNumEnd', title: '结束月份', ui: { type: UiType.select, options: this.monthOptions, eventNo: 7, }, required: true, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      salesType: null,
      demandDate: new Date(),
      item: { value: '', text: '' },
      itemId: null,
      yearNumStart: null,
      yearNumEnd: null,
      monthNumStart: 1,
      monthNumEnd: 12,
      yearBefore0: null, // 本年
      yearBefore1: null, // 上年
      yearBefore2: null, // 前年
    }
  };

  ngOnInit(): void {
    this.queryParams.values.yearNumStart = this.currentYear - 2;
    this.queryParams.values.yearNumEnd = this.currentYear;
    this.loadOptions();
    this.query();
  }

  // 加载搜索项
  loadOptions() {
    this.getBusinessUnitCodeOptions();
    this.getPlantOptions();
    this.getYearOptions();
    this.getMonthOptions();
    this.getSalesTypeOptions();
  }

  // 获取事业部列表
  getBusinessUnitCodeOptions() {
    this.businessUnitCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.businessUnitCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  businessUnitCodeOptionsChange(value) {
    this.queryParams.values.plantCode = null;
    this.getPlantOptions();
  }

  // 获取组织列表
  getPlantOptions() {
    const params = this.getQueryParams();
    this.plantOptions.length = 0;
    this.queryService.getPlant(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.plantOptions.push({
          value: item.plantCode,
          label: item.plantCode,
        });
      })
    });
  }

  // 获取内外销列表
  getSalesTypeOptions() {
    this.salesTypeOptions.length = 0;
    this.queryService.getSaleChannelOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.salesTypeOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  getYearOptions() {
    this.yearOptions.length = 0;
    for (let i = 5; i >= 0; i--) {
      this.yearOptions.push({
        label: `${this.currentYear - i}年`,
        value: this.currentYear - i,
      });
    }
  }

  getMonthOptions() {
    this.monthOptions.length = 0;
    for (let i = 0; i < 12; i++) {
      this.monthOptions.push({
        label: `${i + 1}月`,
        value: i + 1,
      });
    }
  }

  yearNumStartChange(yearNumStart) {
    const yearNumEnd = this.queryParams.values.yearNumEnd;
    if (yearNumStart && yearNumEnd && (+yearNumStart > +yearNumEnd)) {
      this.queryParams.values.yearNumStart = yearNumEnd;
      this.queryParams.values.yearNumEnd = yearNumStart;
    }
  }

  yearNumEndChange(yearNumEnd) {
    const yearNumStart = this.queryParams.values.yearNumStart;
    if (yearNumStart && yearNumEnd && (+yearNumStart > +yearNumEnd)) {
      this.queryParams.values.yearNumStart = yearNumEnd;
      this.queryParams.values.yearNumEnd = yearNumStart;
    }
  }

  monthNumStartChange(monthNumStart) {
    const monthNumEnd = this.queryParams.values.monthNumEnd;
    if (monthNumStart && monthNumEnd && (+monthNumStart > +monthNumEnd)) {
      this.queryParams.values.monthNumStart = monthNumEnd;
      this.queryParams.values.monthNumEnd = monthNumStart;
    }
  }

  monthNumEndChange(monthNumEnd) {
    const monthNumStart = this.queryParams.values.monthNumStart;
    if (monthNumStart && monthNumEnd && (+monthNumStart > +monthNumEnd)) {
      this.queryParams.values.monthNumStart = monthNumEnd;
      this.queryParams.values.monthNumEnd = monthNumStart;
    }
  }

  searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(e.SearchValue, PageIndex, e.PageSize);
  }

  // 搜索商品
  public loadItems(keyword: string, PageIndex: number, PageSize: number) {
    const params = this.getQueryParams();
    this.queryService.getItems(keyword || '', PageIndex, PageSize, params).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  rowSelectItems(e: any) {
    this.queryParams.values.itemId = e.Row && e.Row.value ? e.Row.value : null;
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    const bu = this.businessUnitCodeOptions.find(item => item.value === params.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    params.demandDate = params.demandDate ? this.queryService.formatDateTime2(params.demandDate, 'yyyy-MM-dd hh:mm:ss') : null;
    params.itemCode = params.item.value ? params.item.value : null;
    if (!params.itemCode) params.itemId = null;
    delete params.item;
    const { yearNumStart, yearNumEnd } = params;
    if (yearNumEnd - yearNumStart === 2) {
      params.yearBefore0 = yearNumEnd;
      params.yearBefore1 = yearNumEnd - 1;
      params.yearBefore2 = yearNumStart;
    }

    console.log('getQueryParams', params);
    return params;
  }

  // 渲染表头
  renderColumns(): void {
    const params = this.getQueryParams();
    let columns: any[] = [
      ...this.staticColumns,
    ];

    // 平台
    if (params.businessUnitCode === '30009804') {
      columns.push({ field: 'platform', headerName: '平台', pinned: 'left', width: 80, });
    }

    // 系列/产品平台
    const productSeriesName = params.businessUnitCode === '30009804' ? '系列' : '产品平台';
    columns.push({ filed: 'productSeries', headerName: productSeriesName, pinned: 'left', width: 100, });

    const monthStr = new Date(params.demandDate).getMonth() + 1;
    columns.push({ field: 'productionN1', headerName: monthStr + '月契约', width: 100, });
    columns.push({ field: 'yearQtyBefore2', headerName: params.yearBefore2 + '年生产量', width: 140, });
    columns.push({ field: 'yearQtyBefore1', headerName: params.yearBefore1 + '年生产量', width: 140, });
    columns.push({ field: 'yearQtyBefore0', headerName: params.yearBefore0 + '年生产量', width: 140, });
    columns.push({ field: 'yearNum', headerName: '年份', width: 80, });

    const monthColumns: any[] = [];
    const monthNumStart = Number(params.monthNumStart);
    const monthNumEnd = Number(params.monthNumEnd);
    const monthNum = monthNumEnd - monthNumStart + 1;
    for (let i = 0; i < monthNum; i++) {
      monthColumns.push({
        field: 'productQtyM_' + i,
        headerName: monthNumStart + i + '月',
        width: 100,
      });
    }

    columns = [
      ...columns,
      ...monthColumns,
    ];

    this.columns = columns;

    console.log('columns', this.columns);
  }

  query() {
    const params = this.getQueryParams();
    const { yearNumStart, yearNumEnd } = params;
    if (yearNumEnd - yearNumStart !== 2) {
      this.msgSrv.warning(this.appTranslationService.translate('年份范围跨度只支持3年'));
      return;
    }
    super.query();
    this.renderColumns();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: null,
      plantCode: null,
      salesType: null,
      demandDate: null,
      item: { value: '', text: '' },
      itemId: null,
      yearNumStart: null,
      yearNumEnd: null,
      monthNumStart: 1,
      monthNumEnd: 12,
      yearBefore0: null, // 本年
      yearBefore1: null, // 上年
      yearBefore2: null, // 前年
    };
  }

  commonQuery() {
    const params = this.getQueryParams();

    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
      this.gridData = this.createData(data);
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      });
    });
  }

  createData(data: any[] = []): any[] {
    const params = this.getQueryParams();
    const result = deepCopy(data);
    const monthNumStart = Number(params.monthNumStart);
    const monthNumEnd = Number(params.monthNumEnd);
    const monthNum = monthNumEnd - monthNumStart + 1;
    result.forEach(item => {
      for (let i = 0; i < monthNum; i++) {
        item['productQtyM_' + i] = item['productQtyM' + (monthNumStart + i)] === '' ? '-' : item['productQtyM' + (monthNumStart + i)];
      }
    });
    return result;
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const exportData = this.createData(data);
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }
}
