import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { SopDemandOccupyService } from 'app/modules/generated_module/services/sopdemandoccupy-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sop-demand-occupy-child-demand-ag',
  templateUrl: './sop-demand-occupy-child-demand-ag.component.html',
  providers: [SopDemandOccupyService],
})
export class ProductSellBalanceSopdemandOccupyChildDemandAgComponent extends CustomBaseContext implements OnInit {

  isLoading = false;
  p: any = {};
  public queryParams = {
  };

  public columns = [

    { field: 'TONNAGE', headerName: '吨位', tooltipField: 'TONNAGE', menuTabs: ['filterMenuTab'] },
    {
      field: 'ITEM_CODE', headerName: '物料编码', tooltipField: 'ITEM_CODE', menuTabs: ['filterMenuTab']
    },
    {
      field: 'ITEM_DESCRIPTIONS', headerName: '物料描述', tooltipField: 'ITEM_DESCRIPTIONS', menuTabs: ['filterMenuTab']
    },
    {
      field: 'DEMAND_DATE', headerName: '月份', tooltipField: 'DEMAND_DATE', valueFormatter: 'ctx.demandDateFormatter(value)', menuTabs: ['filterMenuTab']
    },
    {
      field: 'DEMAND_QUANTITY', headerName: '需求数量', tooltipField: 'DEMAND_QUANTITY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'SCHEDULE_GROUP_CODE', headerName: '计划组', tooltipField: 'SCHEDULE_GROUP_CODE', menuTabs: ['filterMenuTab']
    },
    {
      field: 'RESOURCE_CODE', headerName: '机台', tooltipField: 'RESOURCE_CODE', menuTabs: ['filterMenuTab']
    },
    {
      field: 'RESOURCE_DESCRIPTIONS', headerName: '机台描述', tooltipField: 'RESOURCE_DESCRIPTIONS', menuTabs: ['filterMenuTab']
    },
    {
      field: 'SCHEDULE_DAY', headerName: '月度生产天数', tooltipField: 'SCHEDULE_DAY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'UPH', headerName: 'UPH', tooltipField: 'UPH', menuTabs: ['filterMenuTab']
    },
    {
      field: 'HOUR_PER_DAY', headerName: '日小时', tooltipField: 'HOUR_PER_DAY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'DEMAND_DAY', headerName: '需求天数', tooltipField: 'DEMAND_DAY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'SUPPLY_DAY', headerName: '供应天数', tooltipField: 'SUPPLY_DAY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'AVAILABLE_QUANTITY', headerName: '满足数量', tooltipField: 'AVAILABLE_QUANTITY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'CAPACITY_VARIANCE', headerName: '产能缺口', tooltipField: 'CAPACITY_VARIANCE',
      cellStyle: function (params) {
        if (params.value < 0) {
          return { color: 'red' };
        } else {
          return null;
        }
      }, menuTabs: ['filterMenuTab']
    },
    {
      field: 'REMAIN_DAY', headerName: '剩余天数', tooltipField: 'REMAIN_DAY',
      cellStyle: function (params) {
        if (params.value < 0) {
          return { color: 'red' };
        } else {
          return null;
        }
      }, menuTabs: ['filterMenuTab']
    }

  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: SopDemandOccupyService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    // this.customFormQueryComponent.showResetButton = false;
  }

  ngOnInit() {
    console.log(this.p.PLANT_CODE);
    this.queryCommon();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('sopdemandoccupychilddemand');
  }

  private getQueryParamsValue(): any {
    return {
      PLANT_CODE: this.p.PLANT_CODE,
      TONNAGE: this.p.TONNAGE,
      BATCH_NUMBER: this.p.BATCH_NUMBER,
      DEMAND_DATE: this.p.DEMAND_DATE,
      RESOURCE_TYPE: this.p.RESOURCE_TYPE,
      page: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  httpAction = { url: this.editService.seachUrlDemandChild, method: 'POST' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  expData: any[] = [];
  expColumns = this.columns;

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export({ url: this.editService.seachUrlDemandChildExp, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.p.values, this.excelexport);
  }

  /**
 * 格式化需求日期
 * @param value
 */
  public demandDateFormatter(value) {
    if (value !== undefined) {
      const date = new Date(value);
      return date.getFullYear() + '-' + (date.getMonth() + 1);
    }
    return value;
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
