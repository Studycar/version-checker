import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { QueryKitStatusService } from 'app/modules/generated_module/services/query-kit-status-service';
import { QueryPurchaseKitStatusService } from 'app/modules/generated_module/services/query-purchasekitstatus-service';
import { CacheService } from './cache.service';
import { QueryParamObject } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'query-kit-modal-route',
  templateUrl: './query-kit-modal-route.component.html'
})
export class QueryKitModalRouteComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryKitStatusService: QueryKitStatusService,
    private queryPurchaseKitStatusService: QueryPurchaseKitStatusService,
    private cache: CacheService,
  ) {
    super({ pro: pro, msgSrv: msgSrv, appConfigSrv: appConfigService, appTranslationSrv: appTranslationService });
    this.headerNameTranslate(this.columns);
    // this.gridHeight = document.body.clientHeight - 55 - 32 - 40 - 24;
  }

  queryParams: QueryParamObject = { defines: [], values: {} };
  moStatusOptions: any[] = [];
  makeBuyCodes: any[] = [];
  excMoStatusOptions: any[] = [];
  excMakeBuyCodes: any[] = [];
  buyersOptions: any[] = [];
  columns: any[];
  originalColumns = [
    { field: 'makeOrderNum', headerName: '工单号', width: 100 },
    { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,1).label', width: 100 },
    { field: 'itemCode', headerName: '装配件编码', tooltipField: 'itemCode', width: 120 },
    { field: 'descriptions', headerName: '装配件描述', tooltipField: 'descriptions', width: 120 },
    { field: 'componentItemCode', headerName: '组件物料编码', tooltipField: 'componentItemCode', width: 100 },
    { field: 'componentDescriptions', headerName: '物料描述', tooltipField: 'componentDescriptions', width: 100 },
    { field: 'startDate', headerName: '工单开始日期', width: 150 },
    { field: 'completedDate', headerName: '工单完成日期', width: 150 },
    { field: 'demandQuantity', headerName: '需求数量', width: 100 },
    { field: 'issuedQuantity', headerName: '已发料数', width: 100 },
    { field: 'existingQty', headerName: '现有量', width: 100 },
    { field: 'wayQty', headerName: '在途量', width: 100 },
    { field: 'standardKitShtqty', headerName: '标准齐套缺料量', width: 150 },
    { field: 'standardKitStatus', headerName: '标准齐套状态', width: 150 },
    { field: 'standardKitAssignedQty', headerName: '标准齐套已分配量', width: 150 },
    // { field: 'standardKitDistributableQty', headerName: '标准齐套可分配量' },
    { field: 'attribute4', headerName: '扩展齐套缺料量', width: 150 },
    { field: 'attribute5', headerName: '扩展齐套状态', width: 150 },
    { field: 'attribute3', headerName: '扩展齐套已分配量', width: 150 },
    { field: 'attribute2', headerName: '扩展齐套时间点', width: 150 },
    // { field: 'extendKitDistributableQty', headerName: '扩展齐套可分配量', width: 150 }，
    { field: 'extendKitShtqty', headerName: '广义扩展齐套缺料量', width: 150 },
    { field: 'extendKitStatus', headerName: '广义扩展齐套状态', width: 150 },
    { field: 'extendKitAssignedQty', headerName: '广义扩展齐套已分配量', width: 150 },
  ];
  expColumns: any[];
  originalExpColumns = [
    { field: 'makeOrderNum', title: '工单号', width: 150, locked: false },
    { field: 'makeOrderStatus', title: '工单状态', width: 100, locked: false },
    { field: 'itemCode', title: '装配件编码', width: 180, locked: false },
    { field: 'descriptions', title: '装配件描述', width: 150, locked: false },
    { field: 'demandDate', title: '组件需求日期', width: 200, locked: false },
    { field: 'componentItemCode', title: '组件物料编码', width: 180, locked: false },
    { field: 'startDate', title: '工单开始日期', width: 200, locked: false },
    { field: 'completedDate', title: '工单完成日期', width: 200, locked: false },
    { field: 'componentDescriptions', title: '物料描述', width: 200, locked: false },
    { field: 'demandQuantity', title: '计划数量', width: 120, locked: false },
    { field: 'issuedQuantity', title: '已发料数', width: 120, locked: false },
    { field: 'existingQty', title: '现有量', width: 120, locked: false },
    { field: 'wayQty', title: '在途量', width: 120, locked: false },
    { field: 'standardKitShtqty', title: '标准齐套缺料量', width: 150, locked: false },
    { field: 'standardKitStatus', title: '标准齐套状态', width: 150, locked: false },
    { field: 'standardKitAssignedQty', title: '标准齐套已分配量', width: 150, locked: false },
    { field: 'standardKitDistributableQty', title: '标准齐套可分配量', width: 150, locked: false },
    { field: 'extendKitShitqty', title: '扩展齐套缺料量', width: 150, locked: false },
    { field: 'extendKitStatus', title: '扩展齐套状态', width: 150, locked: false },
    { field: 'extendKitAssignedQty', title: '扩展齐套已分配量', width: 150, locked: false },
    { field: 'extendKitDistributableQty', title: '扩展齐套可分配量', width: 150, locked: false },
    { field: 'attribute1', title: '处理顺序', width: 150, locked: false },
  ];
  expColumnsOptions = [
    { field: 'makeOrderStatus', options: this.excMoStatusOptions },
    { field: 'makeBuyCode', options: this.excMakeBuyCodes },
    { field: 'buyer', options: this.buyersOptions }
  ];
  _pageSize = 50;
  plantCode: any;
  itemCode: any;
  componentItemId: string;
  componentItemCode: string;

  ngOnInit() {
    this.columnsInit();
    this.plantCode = this.cache.plantCode;
    this.itemCode = this.cache.itemCode;
    this.componentItemId = this.cache.componentItemId;
    this.componentItemCode = this.cache.componentItemCode;
    this.moStatusOptions = [...this.cache.moStatusOptions];
    this.makeBuyCodes = [...this.cache.makeBuyCodes];
    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.excMoStatusOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_MAKE_BUY_CODE').subscribe(result => {
      result.Extra.forEach(d => {
        this.excMakeBuyCodes.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.query();
  }

  // 再次进入页面时触发的方法(即菜单tab切换)
  _onReuseInit() {
    this.columnsInit();
    this.plantCode = this.cache.plantCode;
    this.itemCode = this.cache.itemCode;
    this.componentItemId = this.cache.componentItemId;
    this.componentItemCode = this.cache.componentItemCode;
    this.moStatusOptions = [...this.cache.moStatusOptions];
    this.makeBuyCodes = [...this.cache.makeBuyCodes];
    this.query();
  }

  columnsInit() {
    if (this.cache.type === 'mo') {
      this.columns = [...this.originalColumns];
      this.expColumns = [...this.originalExpColumns];
    } else {
      this.columns = [...this.originalColumns, { field: 'buyer', headerName: '采购员', valueFormatter: 'ctx.optionsFind(value,3).label', width: 100 }];
      this.expColumns = [...this.originalExpColumns, { field: 'buyer', title: '采购员', width: 100, locked: false }];

      this.queryKitStatusService.getBuyers().subscribe(result => {
        if (result.data !== undefined && result.data !== null) {
          this.buyersOptions.length = 0;
          result.data.forEach(x => {
            this.buyersOptions.push({
              label: x.fullName,
              value: x.employeeNumber,
            });
          });
        }
      });
    }
  }

  httpAction = { url: this.queryKitStatusService.queryitemdetailUrl, method: 'POST' };
  query() {
    // this.httpAction.url = this.cache.type === 'mo' ? this.queryKitStatusService.queryitemdetailUrl : this.queryPurchaseKitStatusService.queryitemdetailUrl;
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  getQueryParamsValue(isExport: boolean): any {
    return {
      plantCode: this.plantCode,
      itemCode: this.itemCode,
      componentItemId: this.componentItemId,
      componentItemCode: this.componentItemCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    };
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.moStatusOptions;
        break;
      case 2:
        options = this.makeBuyCodes;
        break;
      case 3:
        options = this.buyersOptions;
        break;
    }
    return options.find(x => x.value === value.toString());
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  exportFile() {
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParamsValue(true), this.excelexport);
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
}
