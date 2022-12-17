import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { ModalHelper } from '@delon/theme';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { IntelligentSimulationSaveComponent } from './save/save.component';

@Component({
  selector: 'intelligent-simulation',
  templateUrl: './intelligent-simulation.component.html',
  providers: [QueryService]
})
export class IntelligentSimulationComponent extends CustomBaseContext implements OnInit {
  @ViewChild('invSalesRatioTemplate', { static: true }) invSalesRatioTemplate: TemplateRef<any>;
  @ViewChild('invRevolveDaysTemplate', { static: true }) invRevolveDaysTemplate: TemplateRef<any>;
  @ViewChild('prodFluSdTemplate', { static: true }) prodFluSdTemplate: TemplateRef<any>;
  @ViewChild('monthFluRatioTemplate', { static: true }) monthFluRatioTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
    private modal: ModalHelper,
    private modalService: NzModalService,
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
    { field: 'paramVersion', headerName: '版本', pinned: 'left', width: 100, },
    { field: 'businessUnit', headerName: '事业部', pinned: 'left', width: 120, },
    { field: 'planPeriodMonth', headerName: '计划期', pinned: 'left', width: 100, },
    { field: 'marketCategory', headerName: '品类', pinned: 'left', width: 100, },
    { field: 'categoryTotalAmount', headerName: '品类合计(亿元)', width: 140, },
    { field: 'saleChannel', headerName: '渠道', width: 100, valueFormatter: 'ctx.optionsFind(value, 1).label', },
    { field: 'planningAmount', headerName: '规划值(亿元)', width: 140, },
    { field: 'originPlanningAmount', headerName: '调整前值(亿元)', width: 140, },
    { field: 'planningRatio', headerName: '占比', width: 80, valueFormatter: params => this.parseRateValue(params), },
    { field: 'buTotalAmount', headerName: '事业部合计(亿元)', width: 140, },
    { field: 'invSalesRatio', headerName: '库存收入比', width: 190, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, }, },
    { field: 'invRevolveDays', headerName: '库存周转天数', width: 190, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, }, },
    { field: 'prodFluSd', headerName: '产量波动标准差', width: 160, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, }, },
    { field: 'monthFluRatio', headerName: '相邻月份波动幅度', width: 190, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, }, },
  ];

  buCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  saleChannelOptions: any[] = [];
  versionOptions: any[] =[];

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

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'planPeriodMonth', title: '计划期', ui: { type: UiType.monthPicker, eventNo: 2, }, required: true, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, eventNo: 3, }, required: true, },
      { field: 'paramVersion', title: '版本', ui: { type: UiType.select, options: this.versionOptions, }, required: true, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      planPeriodMonth: new Date(),
      marketCategory: [],
      paramVersion: null,
      pageIndex: 1,
      pageSize: 999,
    }
  };

  httpAction = {
    url: '',
    method: 'GET',
  }

  ngOnInit(): void {
    this.columns.forEach(item => {
       if (item.field === 'invSalesRatio') {
        item.cellRendererParams.customTemplate = this.invSalesRatioTemplate;
      } else if (item.field === 'invRevolveDays') {
        item.cellRendererParams.customTemplate = this.invRevolveDaysTemplate;
      } else if (item.field === 'prodFluSd') {
        item.cellRendererParams.customTemplate = this.prodFluSdTemplate;
      } else if (item.field === 'monthFluRatio') {
        item.cellRendererParams.customTemplate = this.monthFluRatioTemplate;
      }
    });
    this.loadOptions();
    this.query();
  }

  // 加载搜索项
  loadOptions() {
    this.getBuCodeOptions();
    this.getCategoryOptions();
    this.getSaleChannelOptions();
    this.getVersionOptions();
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
    this.queryParams.values.paramVersion = null;
    this.getCategoryOptions();
    this.getVersionOptions();
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

  categoryOptionsChange(event: any) {
    this.queryParams.values.paramVersion = null;
    this.getVersionOptions();
  }

  planPeriodMonthChange(event: any) {
    this.queryParams.values.paramVersion = null;
    this.getVersionOptions();
  }

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

  // 获取版本号列表
  getVersionOptions() {
    const params = this.getQueryParams();
    const queryParams = {
      businessUnitCode: params.businessUnitCode,
      planPeriodMonth: params.planPeriodMonth,
      marketCategory: params.marketCategory,
    }
    this.versionOptions.length = 0;
    this.queryService.getVersionOptions(queryParams).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.versionOptions.push({
          label: item,
          value: item,
        });
      });
      if (this.versionOptions.length) {
        this.queryParams.values.paramVersion = this.versionOptions[this.versionOptions.length - 1].value;
      }
    });
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    params.planPeriodMonth = params.planPeriodMonth ? this.queryService.formatDateTime2(params.planPeriodMonth, 'yyyy-MM') : null;
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
      paramVersion: null,
      pageIndex: 1,
      pageSize: 999,
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
      setTimeout(() => {
        this.onVirtualColumnsChanged(null);
      }, 500);
    });
  }

  // 保存
  save() {
    if (this.gridData.length) {
      const params = this.getQueryParams();
      this.modal.static(
        IntelligentSimulationSaveComponent,
        {
          i: {
            originParamVersion: params.paramVersion,
            paramVersion: '',
            versionOptions: [...this.versionOptions],
            sopPsiYearParamDtoList: this.gridData,
          },
        },
        'lg',
      ).subscribe(value => {
        if (value) {
          this.getVersionOptions();
          this.queryParams.values.paramVersion = value;
          this.query();
        }
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('没有可保存的数据'));
    }
  }

  // 模拟
  simulation() {
    const params = this.getQueryParams();
    params.userName = this.appConfigService.getUserName();
    this.queryService.simulation(params).subscribe(res => {
      if (res.code === 200) {
        this.modalService.success({
          nzTitle: '提示',
          nzContent: `已经提交模拟。(模拟号 = ${res.data.smltNum})`,
        })
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '模拟失败'));
      }
    });
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['库存收入比', '库存周转天数', '产量波动标准差', '相邻月份波动幅度'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#intelligentSimulation');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  onCellValueChanged(event) {
  }
}
