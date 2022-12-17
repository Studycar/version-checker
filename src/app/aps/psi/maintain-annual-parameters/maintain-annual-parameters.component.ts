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
import { MaintainAnnualParametersEditComponent } from './edit/edit.component';
import { MaintainAnnualParametersImportComponent } from './import/import.component';

@Component({
  selector: 'maintain-annual-parameters',
  templateUrl: './maintain-annual-parameters.component.html',
  providers: [QueryService]
})
export class MaintainAnnualParametersComponent extends CustomBaseContext implements OnInit {
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
    { field: 'businessUnit', headerName: '事业部', pinned: 'left', width: 120, },
    { field: 'planPeriodMonth', headerName: '计划期', pinned: 'left', width: 100, },
    { field: 'marketCategory', headerName: '品类', pinned: 'left', width: 100, },
    { field: 'categoryTotalAmount', headerName: '品类合计(亿元)', width: 140, },
    { field: 'saleChannel', headerName: '渠道', width: 100, valueFormatter: 'ctx.optionsFind(value, 1).label', },
    { field: 'planningAmount', headerName: '规划值(亿元)', width: 140, valueFormatter: params => this.parseNumberValue(params), },
    { field: 'originPlanningAmount', headerName: '调整前值(亿元)', width: 140, valueFormatter: params => this.parseNumberValue(params), },
    { field: 'planningRatio', headerName: '占比', width: 80, valueFormatter: params => this.parseRateValue(params), },
    { field: 'buTotalAmount', headerName: '事业部合计(亿元)', width: 140, valueFormatter: params => this.parseNumberValue(params), },
    { field: 'invSalesRatio', headerName: '库存收入比', width: 140, valueFormatter: params => this.parseRateValue(params), },
    { field: 'invRevolveDays', headerName: '库存周转天数', width: 160, valueFormatter: params => this.parseInvRevolveDays(params) },
    { field: 'prodFluSd', headerName: '产量波动标准差<X', width: 140, },
    { field: 'monthFluRatio', headerName: '相邻月份波动幅度', width: 140, valueFormatter: params => this.parseRateValue(params) },
  ];

  buCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  saleChannelOptions: any[] = [
    { value: '1', label: '线上' },
    { value: '2', label: '线下' },
  ]

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch(optionsIndex) {
      case 1:
        options = this.saleChannelOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  parseRateValue(params: any) {
    return params.value + '%';
  }

  parseNumberValue(params: any) {
    return Number(params.value).toFixed(2);
  }

  parseInvRevolveDays(params: any) {
    const { invRevolveMaxDays, invRevolveMinDays } = params.data;
    return invRevolveMinDays - invRevolveMaxDays;
  }

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'planPeriodMonth', title: '计划期', ui: { type: UiType.monthPicker, }, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      planPeriodMonth: null,
      marketCategory: [],
      paramType: '1',
    }
  };

  httpAction = {
    url: '',
    method: 'GET',
  }

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
    this.getBuCodeOptions();
    this.getCategoryOptions();
  }

  // 获取事业部列表
  getBuCodeOptions() {
    this.buCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.buCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  buCodeOptionsChange(event: any) {
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

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    params.planPeriodMonth = params.planPeriodMonth ? this.queryService.formatDateTime2(params.planPeriodMonth, 'yyyy-MM') : null;

    if (isExport) {
      // params.isExport = true;
      params.pageIndex = 1;
      params.pageSize = 100000;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    if (params.marketCategory && params.marketCategory.length) {
      params.marketCategory = params.marketCategory.join(',');
    } else {
      params.marketCategory = '';
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
      planPeriodMonth: null,
      marketCategory: [],
      paramType: '1',
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      this.setLoading(false);
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const total = res.data && res.data.total ? res.data.total : 0;
      this.gridData = data;
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
    });
  }

  // 新增/编辑
  add(item?: any) {
    this.modal.static(
      MaintainAnnualParametersEditComponent,
      {
        i: item
          ? Object.assign({}, item)
          : { id: null, },
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
  delete(item: any) {
    this.queryService.delete(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '删除失败'));
      }
    });
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
  expColumnsOptions: any[] = [
    { field: 'saleChannel', options: this.saleChannelOptions, },
  ];
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

  // 导入
  imports() {
    this.modal.static(MaintainAnnualParametersImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
