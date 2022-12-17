import { Component, OnInit, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';

@Component({
  selector: 'short-report',
  templateUrl: './short-report.component.html',
  providers: [QueryService],
})
export class ShortReportComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: QueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }
  organizationids: any[] = [];
  productCategoryOptions: any[] = [];
  steelTypeOption: any[] = [];
  surfaceOptions: any[] = [];
  subsectionStateOptions: any[] = [];
  YesNoOptions: any[] = [];
  gongchaOptions: any[] = [];
  surfaceProtectOptions: any[] = [];
  orderStatusOptions: any[] = [];
  sources: any[] = [];

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };

  // 表格列配置
  columns = [
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 90,
    },
    {
      field: 'reqDate',
      width: 120,
      headerName: '需求日期',
    },
    {
      field: 'productCategory', 
      width: 100, 
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'stockName', 
      width: 100, 
      headerName: '产品名称',
    },
    {
      field: 'standardsType', 
      width: 100, 
      headerName: '规格尺寸',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'steelType', 
      width: 100, 
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'surface', 
      width: 100, 
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'source',
      width: 120,
      headerName: '订单来源',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'orderStatus',
      width: 120,
      headerName: '单据状态',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'subsectionState', 
      width: 100, 
      headerName: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'tolerance', 
      width: 100, 
      headerName: '公差',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'urgent', 
      width: 100, 
      headerName: '急要',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'paper',
      width: 120,
      headerName: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜存货描述'
    },
    {
      field: 'reqQty',
      width: 120,
      headerName: '需求数量',
    },
    {
      field: 'moCompletedQuantity',
      width: 120,
      headerName: '正常完工数量',
    },
    {
      field: 'orderOweQty',
      width: 120,
      headerName: '订单欠数',
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.productCategoryOptions;
        break;
      case 2:
        options = this.steelTypeOption;
        break;
      case 3:
        options = this.surfaceOptions;
        break;
      case 4:
        options = this.sources;
        break;
      case 5:
        options = this.subsectionStateOptions;
        break;
      case 6:
        options = this.gongchaOptions;
        break;
      case 7:
        options = this.YesNoOptions;
        break;
      case 8:
        options = this.surfaceProtectOptions;
        break;
      case 9:
        options = this.orderStatusOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.organizationids }, required: true },
      { field: 'stockName', title: '产品名称', ui: { type: UiType.text } },
      { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOption } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      { field: 'standardsType', title: '规格尺寸', ui: { type: UiType.text } },
      { field: 'dateRange', title: '需求日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      productCategory: null,
      steelType: null,
      surface: null,
      stockName: '',
      standardsType: '',
      dateRange: [],
    },
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values, };
    params.startBegin = this.queryParams.values.dateRange.length > 0 ? this.queryService.formatDate(this.queryParams.values.dateRange[0]) : '';
    params.startEnd = this.queryParams.values.dateRange.length > 0 ? this.queryService.formatDate(this.queryParams.values.dateRange[1]) : '';
    delete params.dateRange;
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 初始化生命周期
  ngOnInit(): void {
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
    this.query();
  }

  // 查询搜索条件
  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PP_DM_SOURCE_SYSTEM': this.sources,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_SURFACE_PROTECT': this.surfaceProtectOptions,
      'PS_ORDER_STATUS': this.orderStatusOptions,
    });
    const steelTypeRes = await this.queryService.GetLookupByType('PS_CONTRACT_STEEL_TYPE').toPromise();
    if (steelTypeRes.Extra) {
      steelTypeRes.Extra.forEach(d => {
        this.steelTypeOption.push({
          label: d.meaning,
          value: d.lookupCode,
          attribute2: d.attribute2,
        });
      });
      this.queryService.getArrBySort(this.steelTypeOption, 'attribute2', 'asc');
    }
    const surfaceRes = await this.queryService.GetLookupByType('PS_CONTRACT_SURFACE').toPromise();
    if (surfaceRes.Extra) {
      surfaceRes.Extra.forEach(d => {
        this.surfaceOptions.push({
          label: d.meaning,
          value: d.lookupCode,
          attribute2: d.attribute2,
        });
      });
      this.queryService.getArrBySort(this.surfaceOptions, 'attribute2', 'asc');
    }
    /** 初始化 组织  下拉框*/
    this.queryService.GetUserPlant().subscribe(result => {
      this.organizationids.length = 0;
      result.Extra.forEach(d => {
        this.organizationids.push({ value: d.plantCode, label: `${d.plantCode}(${d.descriptions})` });
      });
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getActivePlantCode(),
      productCategory: null,
      steelType: null,
      surface: null,
      stockName: '',
      standardsType: '',
      dateRange: [],
    };
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
  
  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'plantCode';
    // 需要统计的列数组
    const fields = ['reqQty', 'moCompletedQuantity', 'orderOweQty'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'steelType', options: this.steelTypeOption },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'source', options: this.sources },
    { field: 'subsectionState', options: this.subsectionStateOptions },
    { field: 'tolerance', options: this.gongchaOptions },
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'paper', options: this.surfaceProtectOptions },
    { field: 'orderStatus', options: this.orderStatusOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context
    );
  }
}