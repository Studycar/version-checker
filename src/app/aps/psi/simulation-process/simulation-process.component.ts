import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { ModalHelper } from '@delon/theme';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { SimulationProcessLogDialogComponent } from './log-dialog/log-dialog.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

@Component({
  selector: 'simulation-process',
  templateUrl: './simulation-process.component.html',
  providers: [QueryService]
})
export class SimulationProcessComponent extends CustomBaseContext implements OnInit {
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
    { field: 'smltNum', headerName: '模拟号', width: 120, },
    { field: 'smltStartTime', headerName: '模拟开始时间', width: 150, },
    { field: 'smltEndTime', headerName: '模拟结束时间', width: 150, },
    { field: 'status', headerName: '状态', width: 80, valueFormatter: 'ctx.optionsFind(value, 1).label', },
    { field: 'paramVersion', headerName: '参数版本', width: 120, },
    { field: 'businessUnit', headerName: '事业部', width: 120, },
    { field: 'planPeriodMonth', headerName: '计划期', width: 100, },
    { field: 'marketCategory', headerName: '品类', width: 100, },
    { field: 'userName', headerName: '模拟人', width: 100, },
    { field: 'smltMsg', headerName: '模拟信息', width: 120, },
  ];

  businessUnitCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  userOptions: any[] = [];
  statusOptions: any[] = [];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch(optionsIndex) {
      case 1:
        options = this.statusOptions;
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
      { field: 'planPeriodMonth', title: '计划期', ui: { type: UiType.monthPicker, }, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, }, },
      { field: 'smltNum', title: '模拟号', ui: { type: UiType.string, }, },
      { field: 'paramVersion', title: '参数版本', ui: { type: UiType.string, }, },
      { field: 'user', title: '模拟人', ui: { type: UiType.select, options: this.userOptions, } },
      { field: 'smltStartTime', title: '开始时间', ui: { type: UiType.datetime, }, },
      { field: 'smltEndTime', title: '结束时间', ui: { type: UiType.datetime, }, },
      { field: 'status', title: '状态', ui: { type: UiType.select, options: this.statusOptions, } },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      planPeriodMonth: null,
      marketCategory: [],
      smltNum: null,
      paramVersion: null,
      user: null,
      smltStartTime: null,
      smltEndTime: null,
      status: null,
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
    this.getBusinessUnitCodeOptions();
    this.getCategoryOptions();
    this.getStatusOptions();
    this.getUserOptions();
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

  getStatusOptions() {
    this.statusOptions.length = 0;
    this.queryService.getStatusOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.statusOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  // 获取用户列表
  getUserOptions() {
    this.userOptions.length = 0;
    this.queryService.GetUserInfos().subscribe(result => {
      result.data.forEach(d => {
        this.userOptions.push({
          label: d.userName,
          value: d.userName,
        });
      });
    });
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    params.planPeriodMonth = params.planPeriodMonth ? this.queryService.formatDateTime2(params.planPeriodMonth, 'yyyy-MM') : null;
    if (isExport) {
      params.isExport = true;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    const bu = this.businessUnitCodeOptions.find(item => item.value === params.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    if (params.marketCategory && params.marketCategory.length) {
      params.marketCategory = params.marketCategory.join(',');
    } else {
      params.marketCategory = '';
    }
    params.userCode = params.user || null;
    delete params.user;
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
      smltNum: null,
      paramVersion: null,
      user: null,
      smltStartTime: null,
      smltEndTime: null,
      status: null,
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
      }, 500);
    });
  }

  // 导出参数
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public exportParams(dataItem: any) {
    super.export();
    const columns = [
      {
        colId: 0,
        field: '',
        headerName: '操作',
        width: 80,
      },
      { field: 'businessUnit', headerName: '事业部', pinned: 'left', width: 120, },
      { field: 'planPeriodMonth', headerName: '计划期', pinned: 'left', width: 100, },
      { field: 'marketCategory', headerName: '品类', pinned: 'left', width: 100, },
      { field: 'categoryTotalAmount', headerName: '品类合计(亿元)', width: 140, },
      { field: 'saleChannel', headerName: '渠道', width: 100, },
      { field: 'planningAmount', headerName: '规划值(亿元)', width: 140, },
      { field: 'originPlanningAmount', headerName: '调整前值(亿元)', width: 140, },
      { field: 'planningRatio', headerName: '占比', width: 80, },
      { field: 'buTotalAmount', headerName: '事业部合计(亿元)', width: 140, },
      { field: 'invSalesRatio', headerName: '库存收入比', width: 140, },
      { field: 'invRevolveDays', headerName: '库存周转天数', width: 160, },
      { field: 'prodFluSd', headerName: '产量波动标准差<X', width: 140, },
      { field: 'monthFluRatio', headerName: '相邻月份波动幅度', width: 140, },
    ];
    this.expColumns = this.excelexport.setExportColumn(columns);
    const params = {...dataItem,
      smltId: dataItem.smltNum
    };
  this.queryService.getExportParams(params).subscribe(res => {
      const data = res.data && res.data.sheet1Value && Array.isArray(res.data.sheet1Value) ? res.data.sheet1Value : [];
      const exportData = data;
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  // 查看日志
  getSmltLog(dataItem: any) {
    this.modal.static(
      SimulationProcessLogDialogComponent,
      {
        i: dataItem,
      },
      'lg',
    ).subscribe(res => {})
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
}
