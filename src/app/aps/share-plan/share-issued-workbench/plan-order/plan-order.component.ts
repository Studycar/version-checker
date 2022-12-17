import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { QueryService } from '../query.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plan-order',
  templateUrl: './plan-order.component.html',
  providers: [QueryService, CommonQueryService]
})
export class sharePlanOrderComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  params: any = {};
  plantCode: any;
  makeOrderNum: any;
  lpcTime: any;

  public gridView: GridDataResult;

  i: any;
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private modalS: NzModalRef,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public commonQueryService: CommonQueryService,
    private confirmationService: NzModalService,
    public queryService: QueryService,
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 400;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.query();
  }

  public columns = [
    { field: 'version', headerName: '版本号', width: 100 },
    { field: 'planName', headerName: '计划名称', width: 100 },
    { field: 'plantCode', headerName: '工厂编码', width: 100 },
    { field: 'allocatedQuantity', headerName: '需求数量', width: 100 },
    // { field: 'supplyQuantity', headerName: '供应数量', width: 100 },
    { field: 'demandDate', headerName: '需求日期', width: 100, valueFormatter: 'ctx.demandDateRenderToLpcTime()',
  },
    // { field: 'supplyDate', headerName: '供应日期', width: 100 },
    { field: 'orderType', headerName: '供应类型', width: 100 },
    { field: 'itemId', headerName: '物料编码', width: 100 },
    // { field: 'demandId', headerName: '需求ID', width: 100 },
    // { field: 'orderNumber', headerName: '订单编号', width: 100 },
    // { field: 'projectNumber', headerName: '项目编号', width: 100 },
  ];

  public expColumns = [
    { field: 'VERSION', headerName: '版本号', width: 100 },
    { field: 'PLAN_NAME', headerName: '计划名称', width: 100 },
    { field: 'PLANT_CODE', headerName: '工厂编码', width: 100 },
    { field: 'DEMAND_QUANTITY', headerName: '需求数量', width: 100 },
    { field: 'SUPPLY_QUANTITY', headerName: '供应数量', width: 100 },
    { field: 'DEMAND_DATE', headerName: '需求日期', width: 100 },
    { field: 'SUPPLY_DATE', headerName: '供应日期', width: 100 },
    { field: 'ORDER_TYPE', headerName: '供应类型', width: 100 },
    { field: 'ITEM_ID', headerName: '物料ID', width: 100 },
    { field: 'DEMAND_ID', headerName: '需求ID', width: 100 },
    { field: 'ORDER_NUMBER', headerName: '订单编号', width: 100 },
    { field: 'PROJECT_NUMBER', headerName: '项目编号', width: 100 },
  ];

  httpAction = { url: this.queryService.queryListMrpSupply, method: 'GET' };
  public query() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  private getQueryParamsValue(isExport: boolean): any {
    return {
      plantCode: this.plantCode,
      moNum: this.makeOrderNum,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
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
      this.query();
    } else {
      this.setLoading(false);
    }
  }

  expData: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParamsValue(true), this.excelexport);
  }

  private demandDateRenderToLpcTime() {
    return this.lpcTime;
  }
}
