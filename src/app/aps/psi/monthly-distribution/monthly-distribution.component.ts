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
import { MonthlyDistributionEditComponent } from './edit/edit.component';
import { MonthlyDistributionCopyComponent } from './copy/copy.component';
import { MonthlyDistributionImportComponent } from './import/import.component';

@Component({
  selector: 'monthly-distribution',
  templateUrl: './monthly-distribution.component.html',
  providers: [QueryService]
})
export class MonthlyDistributionComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;

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
    { field: 'planPeriodMonth', headerName: '计划期月份', pinned: 'left', width: 120, },
    { field: 'marketCategory', headerName: '品类', pinned: 'left', width: 100, },
    { field: 'saleChannel', headerName: '渠道', pinned: 'left', width: 80, },
    { field: 'productQtyM1', headerName: '1月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM1', } },
    { field: 'productQtyM2', headerName: '2月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM2', } },
    { field: 'productQtyM3', headerName: '3月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM3', } },
    { field: 'productQtyM4', headerName: '4月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM4', } },
    { field: 'productQtyM5', headerName: '5月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM5', } },
    { field: 'productQtyM6', headerName: '6月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM6', } },
    { field: 'productQtyM7', headerName: '7月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM7', } },
    { field: 'productQtyM8', headerName: '8月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM8', } },
    { field: 'productQtyM9', headerName: '9月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM9', } },
    { field: 'productQtyM10', headerName: '10月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM10', } },
    { field: 'productQtyM11', headerName: '11月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM11', } },
    { field: 'productQtyM12', headerName: '12月', width: 80, cellRendererFramework: CustomOperateCellRenderComponent, cellRendererParams: { customTemplate: null, field: 'productQtyM12', } },
  ];

  calculateArr = ['productQtyM1', 'productQtyM2', 'productQtyM3', 'productQtyM4', 'productQtyM5', 'productQtyM6', 'productQtyM7', 'productQtyM8', 'productQtyM9', 'productQtyM10', 'productQtyM11', 'productQtyM12'];

  buCodeOptions: any[] = [];
  categoryOptions: any[] = [];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, }, },
      { field: 'planPeriodMonth', title: '计划期时间', ui: { type: UiType.monthPicker, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      marketCategory: [],
      planPeriodMonth: null,
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
      } else if (this.calculateArr.includes(item.field)) {
        item.cellRendererParams.customTemplate = this.valueTemplate;
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
      marketCategory: [],
      planPeriodMonth: null,
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
      MonthlyDistributionEditComponent,
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

  // 复制
  copy() {
    this.modal.static(
      MonthlyDistributionCopyComponent,
      {
        i: { },
      },
      'lg',
    )
    .subscribe(value => {
      if (value) {
        this.query();
      }
    });
  }

  // 历史比率计算
  historyRateCalculate() {
    const params = this.getQueryParams();
    if (!params.businessUnitCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择事业部'));
      return;
    }
    if (!params.planPeriodMonth) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择计划期时间'));
      return;
    }
    this.setLoading(true);
    console.log('history', params);
    this.queryService.historyRateCalculate(params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '计算成功！'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '计算失败！'));
      }
      this.setLoading(false);
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

  // 导入
  imports() {
    this.modal.static(MonthlyDistributionImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
