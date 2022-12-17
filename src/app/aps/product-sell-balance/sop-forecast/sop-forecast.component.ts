import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from './queryService.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceSopForecastImportComponent } from './import/import.component';
import { process } from '@progress/kendo-data-query';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sop-forecast',
  templateUrl: './sop-forecast.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [QueryService],
})
export class ProductSellBalanceSopForecastComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  listPlant: any[] = [];
  listVersion: any[] = [];
  listReqType: any[] = [];
  totalCount = 0;
  queryDateRange = []; // 查询的准确时间范围
  isFormLoad = true;
  searchParans: any;
  lastDateRange: any;
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.listPlant, ngModelChange: this.plantChange } },
      { field: 'version', title: '版本号', required: true, ui: { type: UiType.select, options: this.listVersion } },
      { field: 'itemCode', title: '物料编码', ui: { type: UiType.text } },
      { field: 'reqNumber', title: '订单号', ui: { type: UiType.text } },
      { field: 'reqType', title: '订单类型', ui: { type: UiType.select, options: this.listReqType } },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      version: null,
      itemCode: '',
      reqNumber: '',
      reqType: null,
    }
  };

  columns = [];
  staticColumns = [
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'reqNumber', headerName: '订单号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'reqType', headerName: '订单类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
  ];
  extendColumns = [];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private queryService: QueryService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.listReqType;
        break;
    }
    const tmp = options.find(x => x.value === value);
    return tmp ? tmp.label : value;
  }

  public ngOnInit(): void {
    this.clear();
    this.loadOptionData();
    // this.query();
  }

  loadOptionData() {
    // 当前用户对应工厂
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.listPlant.push({ value: d.plantCode, label: d.plantCode });
      });
    });
    this.plantChange(this.queryParams.values.plantCode);

    // 查询订单类型
    this.queryService.GetLookupByTypeNew('SOP_DEMOND_STYPE').subscribe(result => {
      result.data.forEach(item => {
        this.listReqType.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  plantChange(event) {
    // 联动版本号
    this.queryParams.values.version = null;
    this.listVersion.length = 0;
    this.queryService.queryVersion(this.queryParams.values.plantCode).subscribe(result => {
      // 版本
      result.data.forEach(item => {
        this.listVersion.push({
          label: item,
          value: item,
        });
      });
      if (this.queryParams.values.version === null && this.listVersion.length > 0) {
        this.queryParams.values.version = this.listVersion[0].value;
      }
      if (this.isFormLoad) {
        this.isFormLoad = false;
        this.query();
      }
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.setLoading(true);
    this.searchParans = this.getQueryParams(false);
    this.queryService.querySopForecastPage(this.searchParans).subscribe(result => {
      this.setLoading(false);
      if (result.code !== 200) {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
        return;
      }
      if (this.gridData !== null && this.gridData !== undefined) this.gridData.length = 0;

      this.gridData = result.data.dataResult;
      this.totalCount = result.data.totalCount;
      this.gridApi.paginationSetPageSize(this.gridData.length);
      if (this.totalCount === 0) {
        this.lastPageNo = 1;
      }
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter,
        }).data,
        total: this.totalCount,
      };

      this.queryDateRange = [new Date(result.data.startDate), new Date(result.data.endDate)];
      // 添加列必须在绑定数据源后
      this.createExtendColumns(result.data.listCols);
    });
  }

  createExtendColumns(extendCols: any) {
    let isChange = false;
    if (this.lastDateRange == null
      || this.lastDateRange.startDate !== this.queryDateRange[0]
      || this.lastDateRange.endDate !== this.queryDateRange[1]
    ) {
      // 时间范围有修改
      isChange = true;

      this.lastDateRange = {
        startDate: this.queryDateRange[0],
        endDate: this.queryDateRange[1],
      };
    }
    if (!isChange) return;

    this.extendColumns.length = 0;
    // this.redColumnHeaders.length = 0;
    // 加载列头
    extendCols.forEach(cols => {
      const col = {
        field: cols.fieldName,
        headerName: cols.headerName,
        width: 150,
        title: cols.headerName,
        colDate: cols.startDate,
        cellClass: function (params) {
          return params.context.getCellClass(params.data, cols.extra);
        },
      };
      this.extendColumns.push(col);
    });

    this.setGridColumn();
  }

  public getCellClass(dataItem: any, extra: any) {
    return '';
  }

  setGridColumn() {
    this.columns = [];
    this.expColumns = [];

    this.staticColumns.forEach(col => {
      this.columns.push(col);
    });

    this.extendColumns.forEach(col => {
      this.columns.push(col);
    });
  }

  private getQueryParams(isExport: boolean) {
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      version: this.queryParams.values.version,
      itemCode: this.queryParams.values.itemCode,
      reqNumber: this.queryParams.values.reqNumber,
      reqType: this.queryParams.values.reqType,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
    return dto;
  }

  // 导入
  public import() {
    this.modal.static(ProductSellBalanceSopForecastImportComponent, {}, 'md').subscribe(value => {
      if (value) {
        // this.queryCommon();
        this.isFormLoad = true; // 重新加载数据
        this.plantChange(this.queryParams.values.plantCode);
      }
    });
  }
  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      version: null,
      itemCode: '',
      reqNumber: '',
      reqType: null,
    };

    this.plantChange(this.queryParams.values.plantCode);
  }

  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'reqType', options: this.listReqType },
  ];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.queryService.querySopForecastPage(dto).subscribe(result => {
      this.excelexport.export(result.data.dataResult);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
