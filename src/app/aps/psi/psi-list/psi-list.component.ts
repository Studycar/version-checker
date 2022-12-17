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
import { ShowPsiComponent } from './show-psi/show-psi.component';
import { AdjustPsiComponent } from './adjust-psi/adjust-psi.component';
import { PsiKpiComponent } from './psi-kpi/psi-kpi.component';

@Component({
  selector: 'psi-list',
  templateUrl: './psi-list.component.html',
  providers: [QueryService]
})
export class PsiListComponent extends CustomBaseContext implements OnInit {
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
      width: 120,
      pinned: this.pinnedAlign,
      lockPinned: true,
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    { field: 'psiCode', headerName: 'PSI编号', width: 120, },
    { field: 'rsltVersion', headerName: 'PSI版本', width: 100, },
    { field: 'smltNum', headerName: '模拟号/合并号', width: 160, },
    { field: 'creationDate', headerName: 'PSI创建时间', width: 150, },
    { field: 'lastUpdateDate', headerName: 'PSI更新时间', width: 150, },
    { field: 'psiType', headerName: '类型', width: 80, valueFormatter: 'ctx.optionsFind(value, 1).label', },
    { field: 'businessUnit', headerName: '事业部', width: 120, },
    { field: 'planPeriodMonth', headerName: '计划期', width: 100, },
    { field: 'marketCategory', headerName: '品类', width: 100, },
    { field: 'createdBy', headerName: '创建人', width: 100, },
    { field: 'psiStatus', headerName: 'PSI状态', width: 100, valueFormatter: 'ctx.optionsFind(value, 2).label', },
  ];

  businessUnitCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  psiCodeOptions: any[] = [];
  psiTypeOptions: any[] = [
    { value: '1', label: '模拟PSI' },
    { value: '2', label: '调整PSI' },
    { value: '3', label: '合并PSI' },
  ];
  psiStatusOptions: any[] = [];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch(optionsIndex) {
      case 1:
        options = this.psiTypeOptions;
        break;
      case 2:
        options = this.psiStatusOptions;
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
      { field: 'psiCode', title: 'PSI编号', ui: { type: UiType.select, options: this.psiCodeOptions, }, },
      { field: 'psiType', title: 'PSI类型', ui: { type: UiType.select, options: this.psiTypeOptions, }, },
      { field: 'smltNum', title: '模拟号', ui: { type: UiType.string, }, },
      { field: 'startUpdateDate', title: '开始时间', ui: { type: UiType.datetime, }, },
      { field: 'endUpdateDate', title: '结束时间', ui: { type: UiType.datetime, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      planPeriodMonth: null,
      marketCategory: [],
      psiCode: null,
      psiType: null,
      smltNum: null,
      startUpdateDate: null,
      endUpdateDate: null,
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
    this.getPsiCodeOptions();
    this.getPsiStatusOptions();
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

  // PSI编码列表
  getPsiCodeOptions() {
    this.psiCodeOptions.length = 0;
    this.queryService.getPsiCodeOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.psiCodeOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }


  // PSI状态列表
  getPsiStatusOptions() {
    this.psiStatusOptions.length = 0;
    this.queryService.getPsiStatusOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.psiStatusOptions.push({
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
      psiCode: null,
      psiType: null,
      smltNum: null,
      startUpdateDate: null,
      endUpdateDate: null,
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

  // 预览
  showPsi(dataItem: any) {
    this.modal.static(
      ShowPsiComponent,
      {
        i: {
          psiCode: dataItem.psiCode,
          rsltVersion: dataItem.rsltVersion,
        },
      },
      'xl',
    ).subscribe(res => {});
  }

  // 修改
  edit(dataItem: any) {
    this.modal.static(
      AdjustPsiComponent,
      {
        i: {
          psiCode: dataItem.psiCode,
          rsltVersion: dataItem.rsltVersion,
        },
      },
      'xl',
    ).subscribe(res => {});
  }

  // 发布
  release(dataItem: any) {
    const params = {
      id: dataItem.id,
      psiStatus: 1,
    };
    this.setLoading(true);
    this.queryService.release(params).subscribe(res => {
      this.setLoading(false);
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('发布成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '发布成功'));
      }
    });
  }

  // 指标查看
  toKpi(dataItem: any) {
    this.modal.static(
      PsiKpiComponent,
      {
        i: {
          id: dataItem.id,
          psiCode: dataItem.psiCode,
          rsltVersion: dataItem.rsltVersion,
        }
      },
      'xl',
    ).subscribe(res => {});
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
