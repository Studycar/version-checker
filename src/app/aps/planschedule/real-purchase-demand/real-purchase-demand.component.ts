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
  selector: 'real-purchase-demand',
  templateUrl: './real-purchase-demand.component.html',
  providers: [QueryService],
})
export class PSRealPurchaseDemandComponent extends CustomBaseContext implements OnInit {
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

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'POST',
  };

  // 表格列配置
  columns = [
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'demandTime',
      width: 120,
      headerName: '需求日期',
    },
    {
      field: 'requirementQty',
      width: 120,
      headerName: '汇总需求数量',
    },
    {
      field: 'onhandQty',
      width: 120,
      headerName: '库存数量',
    },
    {
      field: 'realRequirementQty',
      width: 120,
      headerName: '实时需求数量',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '产品编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '产品名称',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
    },
    {
      field: 'length',
      width: 120,
      headerName: '长度',
    },
    {
      field: 'width',
      width: 120,
      headerName: '宽度',
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
    },
    {
      field: 'meterNum',
      width: 120,
      headerName: '米数',
    },
    {
      field: 'unitWeight',
      width: 120,
      headerName: '单位重量',
    },
    {
      field: 'catName',
      width: 120,
      headerName: '胶膜分类',
    },
  ];

  plantOptions: any[] = [];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'dateRange', title: '需求日期', ui: { type: UiType.dateRange, } },
      { field: 'stockCode', title: '产品编码', ui: { type: UiType.text, } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'standards', title: '规格', ui: { type: UiType.text, } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      { field: 'catId', title: '胶膜分类', ui: { type: UiType.text, } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      dateRange: [],
      stockCode: '',
      steelType: null,
      standards: '',
      surface: null,
      catId: '',
    }
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if(params.dateRange.length === 2) {
      params.startDemandDate = this.queryService.formatDate(params.dateRange[0]);
      params.endDemandDate = this.queryService.formatDate(params.dateRange[1]);
    }
    delete params.dateRange;
    if (isExport) {
      params.export = true;
    } else {
      params.export = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 初始化生命周期
  ngOnInit(): void {
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  // 查询搜索条件
  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
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
      dateRange: [],
      stockCode: '',
      steelType: null,
      standards: '',
      surface: null,
      catId: '',
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

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
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