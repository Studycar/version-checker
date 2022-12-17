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
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sop-demand-occupy-dtl-ag',
  templateUrl: './sop-demand-occupy-dtl-ag.component.html',
  providers: [SopDemandOccupyService],
})
export class ProductSellBalanceSopdemandOccupydtlAgComponent extends CustomBaseContext implements OnInit {


  isLoading = false;
  fileName = '';
  p: any = {};
  public queryParams = {
  };
  public columns = [];

  url = '';
  urlExp = '';
  public columns2 = [

    { field: 'PLANT_CODE', headerName: '工厂', tooltipField: 'PLANT_CODE' },
    { field: 'DEMAND_DATE', headerName: '月份', tooltipField: 'DEMAND_DATE', valueFormatter: 'ctx.demandDateFormatter(value)' },
    { field: 'SALES_TYPE', headerName: '来源', tooltipField: 'SALES_TYPE' },
    { field: 'PARENT_PLANT_CODE', headerName: '来源组织', tooltipField: 'PARENT_PLANT_CODE' },
    { field: 'PARENT_ITEM_CODE', headerName: '预测编码', tooltipField: 'PARENT_ITEM_CODE' },
    { field: 'PARENT_ITEM_DESCRIPTIONS', headerName: '预测描述', tooltipField: 'PARENT_ITEM_DESCRIPTIONS' },
    { field: 'PARENT_DEMAND_QUANTITY', headerName: '预测数量', tooltipField: 'PARENT_DEMAND_QUANTITY' },
    { field: 'ITEM_CODE', headerName: '下层物料', tooltipField: 'ITEM_CODE' },
    { field: 'ITEM_DESCRIPTIONS', headerName: '装配件描述', tooltipField: 'ITEM_DESCRIPTIONS' },
    { field: 'RESOURCE_CODE', headerName: '生产线', tooltipField: 'RESOURCE_CODE' },
    { field: 'RESOURCE_DESCRIPTIONS', headerName: '生产线描述', tooltipField: 'RESOURCE_DESCRIPTIONS' },
    { field: 'DEMAND_QUANTITY', headerName: '需求数量', tooltipField: 'DEMAND_QUANTITY' },
    { field: 'CONSUME_QUANTITY', headerName: '供应数量', tooltipField: 'CONSUME_QUANTITY' },
    {
      field: 'CAPACITY_VARIANCE', headerName: '缺口数量', tooltipField: 'CAPACITY_VARIANCE',
      cellStyle: function (params) {
        if (params.value < 0) {
          return { color: 'red' };
        } else {
          return null;
        }
      }
    }
  ];

  public columns3 = [

    { field: 'PLANT_CODE', headerName: '工厂', tooltipField: 'PLANT_CODE' },
    { field: 'DEMAND_DATE', headerName: '月份', tooltipField: 'DEMAND_DATE', valueFormatter: 'ctx.demandDateFormatter(value)' },
    { field: 'SALES_TYPE', headerName: '来源', tooltipField: 'SALES_TYPE' },
    { field: 'PARENT_PLANT_CODE', headerName: '来源组织', tooltipField: 'PARENT_PLANT_CODE' },
    { field: 'PARENT_ITEM_CODE', headerName: '预测编码', tooltipField: 'PARENT_ITEM_CODE' },
    { field: 'PARENT_ITEM_DESCRIPTIONS', headerName: '预测描述', tooltipField: 'PARENT_ITEM_DESCRIPTIONS' },
    { field: 'PARENT_DEMAND_QUANTITY', headerName: '预测数量', tooltipField: 'PARENT_DEMAND_QUANTITY' },
    { field: 'ITEM_CODE', headerName: '下层物料', tooltipField: 'ITEM_CODE' },
    { field: 'ITEM_DESCRIPTIONS', headerName: '装配件描述', tooltipField: 'ITEM_DESCRIPTIONS' },
    { field: 'RESOURCE_CODE', headerName: '机台', tooltipField: 'RESOURCE_CODE' },
    { field: 'RESOURCE_DESCRIPTIONS', headerName: '机台描述', tooltipField: 'RESOURCE_DESCRIPTIONS' },
    { field: 'DEMAND_QUANTITY', headerName: '需求数量', tooltipField: 'DEMAND_QUANTITY' },
    { field: 'CONSUME_QUANTITY', headerName: '供应数量', tooltipField: 'CONSUME_QUANTITY' },
    {
      field: 'CAPACITY_VARIANCE', headerName: '缺口数量', tooltipField: 'CAPACITY_VARIANCE',
      cellStyle: function (params) {
        if (params.value < 0) {
          return { color: 'red' };
        } else {
          return null;
        }
      }
    }
  ];

  public columns4 = [

    { field: 'PLANT_CODE', headerName: '工厂', tooltipField: 'PLANT_CODE' },
    { field: 'DEMAND_DATE', headerName: '月份', tooltipField: 'DEMAND_DATE', valueFormatter: 'ctx.demandDateFormatter(value)' },
    { field: 'SALES_TYPE', headerName: '来源', tooltipField: 'SALES_TYPE' },
    { field: 'PARENT_PLANT_CODE', headerName: '来源组织', tooltipField: 'PARENT_PLANT_CODE' },
    { field: 'PARENT_ITEM_CODE', headerName: '预测编码', tooltipField: 'PARENT_ITEM_CODE' },
    { field: 'PARENT_ITEM_DESCRIPTIONS', headerName: '预测描述', tooltipField: 'PARENT_ITEM_DESCRIPTIONS' },
    { field: 'PARENT_DEMAND_QUANTITY', headerName: '预测数量', tooltipField: 'PARENT_DEMAND_QUANTITY' },
    { field: 'ITEM_CODE', headerName: '下层物料', tooltipField: 'ITEM_CODE' },
    { field: 'ITEM_DESCRIPTIONS', headerName: '装配件描述', tooltipField: 'ITEM_DESCRIPTIONS' },
    { field: 'RESOURCE_CODE', headerName: '模具', tooltipField: 'RESOURCE_CODE' },
    { field: 'RESOURCE_DESCRIPTIONS', headerName: '模具描述', tooltipField: 'RESOURCE_DESCRIPTIONS' },
    { field: 'DEMAND_QUANTITY', headerName: '需求数量', tooltipField: 'DEMAND_QUANTITY' },
    { field: 'CONSUME_QUANTITY', headerName: '供应数量', tooltipField: 'CONSUME_QUANTITY' },
    {
      field: 'CAPACITY_VARIANCE', headerName: '缺口数量', tooltipField: 'CAPACITY_VARIANCE',
      cellStyle: function (params) {
        if (params.value < 0) {
          return { color: 'red' };
        } else {
          return null;
        }
      }
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
    this.gridHeight = 303;
    // this.customFormQueryComponent.showResetButton = false;
  }

  ngOnInit() {
    console.log(this.p.PLANT_CODE);
    if (this.p.RESOURCE_TYPE === '2') {

      console.log('eee' + this.p.PLANT_CODE);
      this.columns = this.columns2;
      this.fileName = '关键资源检视来源';
      this.url = this.editService.seachUrlDtl;
      this.urlExp = this.editService.seachUrlDtlExp;
    }
    if (this.p.RESOURCE_TYPE === '3') {

      this.columns = this.columns4;
      this.fileName = '注塑能力检视来源';
      this.url = this.editService.seachUrlDemandDtl;
      this.urlExp = this.editService.seachUrlDemandDtlExp;
    }
    if (this.p.RESOURCE_TYPE === '4') {

      this.columns = this.columns3;
      this.fileName = '模具能力检视来源';
      this.url = this.editService.seachUrlDieDtl;
      this.urlExp = this.editService.seachUrlDieDtlExp;
    }

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
    this.setGridWidth('sopdemandoccupydtl');
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


  httpAction = { url: this.editService.seachUrlDtl, method: 'POST' };

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
    this.commonQueryService.export({ url: this.editService.seachUrlDtlExp, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.p.values, this.excelexport);
  }

  public clear() {

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
