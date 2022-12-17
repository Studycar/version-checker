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
// import { SopDemandOccupyService } from 'app/modules/generated_module/services/sopdemandoccupy-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { SopPlantCapacityReviewService } from '../../../modules/generated_module/services/sopplantcapacityreview-service';
import { QueryService } from './queryService';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopplantcapacityreviewchild',
  templateUrl: './sopplantcapacityreviewchild.component.html',
  providers: [QueryService, SopPlantCapacityReviewService],
})
export class ProductSellBalanceSopPlantCapacityReviewChildAgComponent extends CustomBaseContext implements OnInit {

  isLoading = false;
  p: any = {};


  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private querydata: SopPlantCapacityReviewService,
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
    this.query();
    console.log(this.p);
  }

  public columns = [
    { field: 'buCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'salesType', headerName: '内外销', menuTabs: ['filterMenuTab'] },
    { field: 'capacityclass', headerName: '产能分类', menuTabs: ['filterMenuTab'] },
    { field: 'monthMM', headerName: '月份', menuTabs: ['filterMenuTab'] },
    // { field: 'MONTH_PLANNING_QUANTITY', headerName: '月度产能', menuTabs: ['filterMenuTab'] },
    { field: 'salesRegion', headerName: '业务区域', menuTabs: ['filterMenuTab'] },
    { field: 'customerCode', headerName: '客户', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '产品编码', menuTabs: ['filterMenuTab'] },
    { field: 'monthPlan', headerName: '月度计划', menuTabs: ['filterMenuTab'] },
    { field: 'satisfyQuantity', headerName: '分配(满足)数量', menuTabs: ['filterMenuTab'] },
    { field: 'unmetQuantity', headerName: '剩余产能', menuTabs: ['filterMenuTab'] },

  ];


  GetQueryParams() {
    return {
      buCode: this.p.buCode,
      plantCode: this.p.plantCode,
      salesType: this.p.salesType,
      monthMM: this.p.monthMM,
      capacityclass: this.p.capacityclass
    };
  }
  httpAction = { url: this.querydata.detailUrl, method: 'POST' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.GetQueryParams(), this.context);
  }

  expColumns = [
    { field: 'buCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'salesType', headerName: '内外销', menuTabs: ['filterMenuTab'] },
    { field: 'capacityclass', headerName: '产能分类', menuTabs: ['filterMenuTab'] },
    { field: 'monthMM', headerName: '月份', menuTabs: ['filterMenuTab'] },
    // { field: 'MONTH_PLANNING_QUANTITY', headerName: '月度产能', menuTabs: ['filterMenuTab'] },
    { field: 'salesRegion', headerName: '业务区域', menuTabs: ['filterMenuTab'] },
    { field: 'customerCode', headerName: '客户', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '产品编码', menuTabs: ['filterMenuTab'] },
    { field: 'monthPlan', headerName: '月度计划', menuTabs: ['filterMenuTab'] },
    { field: 'satisfyQuantity', headerName: '分配(满足)数量', menuTabs: ['filterMenuTab'] },
    { field: 'unmetQuantity', headerName: '剩余产能', menuTabs: ['filterMenuTab'] },
  ];
  httpExportAction = {
    url: this.querydata.ExportdetailUrl,
    method: 'POST'
  };
  expData: any[] = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
    /*this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(), this.excelexport, this);*/
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
    this.setGridWidth('plantcapacityreviewchild');
  }

}
