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
// import { deepCopy } from '@delon/util';
import { ModalHelper } from '@delon/theme';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ActualOccurrenceDataEditComponent } from './edit/edit.component';

@Component({
  selector: 'actual-occurrence-data',
  templateUrl: './actual-occurrence-data.component.html',
  providers: [QueryService]
})
export class ActualOccurrenceDataComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
    private modal: ModalHelper,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  columns: any[] = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    { field: 'dataType', headerName: '数据类型', width: 120, valueFormatter: 'ctx.optionsFind(value, 1).label', },
    { field: 'periodMonth', headerName: '月份', width: 120, },
    { field: 'category', headerName: '品类', width: 100, },
    { field: 'channel', headerName: '渠道', width: 80, },
    { field: 'salesType', headerName: '内外销', width: 80, valueFormatter: 'ctx.optionsFind(value, 2).label', },
    { field: 'businessUnit', headerName: '事业部', width: 120, },
    { field: 'dtAmt', headerName: '金额(亿元)', width: 120, valueFormatter: params => this.parseNumberValue(params), },
    { field: 'dtQty', headerName: '数量(万台)', width: 120, valueFormatter: params => this.parseNumberValue(params), },
    { field: 'dtlAvgAmt', headerName: '月均金额(亿元)', width: 160, valueFormatter: params => this.parseNumberValue(params),},
    { field: 'dtlAvgPrice', headerName: '单价(元)', width: 120, valueFormatter: params => this.parseNumberValue(params), },
  ];

  parseNumberValue(params: any) {
    return Number(params.value).toFixed(2);
  }

  businessUnitCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  dataTypeOptions: any[] = [
    { value: 'OWN_INV', label: '自有库存', },
    { value: 'CHANNEL_INV', label: '渠道库存', },
    { value: 'SALE', label: '分销', },
    { value: 'WAREH', label: '出仓', },
    { value: 'PROD', label: '生产', },
  ];
  saleChannelOptions: any[] = [];

  channelOptions: any[] = [
    { value: '1', label: '线上', },
    { value: '2', label: '线下', },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch(optionsIndex) {
      case 1:
        options = this.dataTypeOptions;
        break;
      case 2:
        options = this.saleChannelOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.businessUnitCodeOptions, eventNo: 1, }, required: true, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, }, },
      { field: 'periodMonth', title: '月份', ui: { type: UiType.monthPicker, }, },
      { field: 'dataType', title: '数据类型', ui: { type: UiType.select, options: this.dataTypeOptions, }, },
      { field: 'channel', title: '渠道', ui: { type: UiType.select, options: this.channelOptions, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      marketCategory: [],
      periodMonth: null,
      dataType: null,
      channel: null,
    }
  };

  ngOnInit(): void {
    this.columns.forEach(item => {
      if (item.headerName === '操作') {
        item.cellRendererParams.customTemplate = this.customTemplate;
      }
    });
    this.loadOptions();
    this.query();
  }

  // 加载搜索项
  loadOptions() {
    this.getBusinessUnitCodeOptions();
    this.getCategoryOptions();
    this.getSaleChannelOptions();
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

  businessUnitCodeOptionsChange(event: any) {
    this.queryParams.values.marketCategory = [];
    this.getCategoryOptions();
  }

  // 获取品类列表
  getCategoryOptions() {
    const params = this.getQueryParams();
    this.categoryOptions.length = 0;
    this.queryService.getCategoryOptions(params.businessUnitCode).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const marketCategory = Array.from(new Set(data.filter(item => item.marketCategory).map(item => item.marketCategory)));
      marketCategory.forEach(item => {
        this.categoryOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  // 获取内外销列表
  getSaleChannelOptions() {
    this.saleChannelOptions.length = 0;
    this.queryService.getSaleChannelOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.saleChannelOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      // params.isExport = true;
      params.pageIndex = 1;
      params.pageSize = 100000;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    const bu = this.businessUnitCodeOptions.find(item => item.value === params.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    if (params.marketCategory && params.marketCategory.length) {
      params.category = params.marketCategory.join(',');
    } else {
      params.category = '';
    }
    console.log('getQueryParams', params);
    return params;
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: null,
      marketCategory: [],
      periodMonth: null,
      dataType: null,
      channel: null,
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const total = res.data && res.data.total ? res.data.total : 0;
      this.gridData = data;
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

  // 新增/编辑
  add(item?: any) {
    this.modal.static(
      ActualOccurrenceDataEditComponent,
      {
        i: item
          ? item
          : { id: null, businessUnitCode: null, marketCategory: null, planPeriodMonth: null, saleChannel: null, productQtyM1: null, productQtyM2: null, productQtyM3: null, productQtyM4: null, productQtyM5: null, productQtyM6: null, productQtyM7: null, productQtyM8: null, productQtyM9: null, productQtyM10: null, productQtyM11: null, productQtyM12: null, },
      },
      'lg',
    )
    .subscribe(value => {
      if (value) {
        this.query();
      }
    });
  }

  // 删除
  delete(item?: any) {

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
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const exportData = data;
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }
}
