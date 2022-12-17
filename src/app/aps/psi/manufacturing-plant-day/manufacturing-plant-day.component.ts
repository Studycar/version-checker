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
import { getMonthDay } from '../util';

@Component({
  selector: 'manufacturing-plant-day',
  templateUrl: './manufacturing-plant-day.component.html',
  providers: [QueryService]
})
export class ManufacturingPlantDayComponent extends CustomBaseContext implements OnInit  {
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
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      salesType: null,
      demandDate: new Date(),
      item: { value: '', text: '' },
      itemId: null,
      yearBefore0: null, // 本年
      yearBefore1: null, // 上年
      yearBefore2: null, // 前年
    }
  };

  ngOnInit(): void {
    this.loadOptions();
    this.query();
  }

  // 加载搜索项
  loadOptions() {
    this.getBusinessUnitCodeOptions();
    this.getPlantOptions();
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
    params.demandDate = params.demandDate ? this.queryService.formatDateTime2(params.demandDate, 'yyyy-MM-dd hh:mm:ss') : '';
    params.itemCode = params.item.value ? params.item.value : null;
    if (!params.itemCode) params.itemId = null;
    delete params.item;

    if (params.demandDate) {
      const year = new Date(params.demandDate).getFullYear();
      params.yearBefore0 = year;
      params.yearBefore1 = year - 1;
      params.yearBefore2 = year - 2;
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
    // 进度
    columns.push({ field: 'productRatio_', headerName: '进度', width: 100, });
    columns.push({ field: 'yearQtyBefore2', headerName: `前年(${params.yearBefore2})生产量`, width: 150, });
    columns.push({ field: 'yearQtyBefore1', headerName: `上年(${params.yearBefore1})生产量`, width: 150, });
    columns.push({ field: 'yearQtyBefore0', headerName: `本年(${params.yearBefore0})生产量`, width: 150, });

    const dayColumns: any[] = [];

    const dayNum = getMonthDay(new Date(params.demandDate).getFullYear(), new Date(params.demandDate).getMonth() + 1);
    for (let i = 0; i < dayNum; i++) {
      dayColumns.push({
        field: 'productQtyD_' + i,
        headerName: `${i + 1}`,
        width: 80,
      });
    }

    columns = [
      ...columns,
      ...dayColumns,
    ];

    this.columns = columns;

    console.log('columns', this.columns);
  }

  query() {
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
    const dayNum = getMonthDay(new Date(params.demandDate).getFullYear(), new Date(params.demandDate).getMonth() + 1);
    result.forEach((item, index) => {
      item.index = index + 1;
      item.productRatio_ = item.productRatio ? item.productRatio + '%' : '';
      for (let i = 0; i < dayNum; i++) {
        item['productQtyD_' + i] = item['productQtyD' + (i + 1)] === '' ? '-' : item['productQtyD' + (i + 1)];
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
