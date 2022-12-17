import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryKitStatusService } from '../../../modules/generated_module/services/query-kit-status-service';
import { State, process } from '../../../../../node_modules/@progress/kendo-data-query';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { map } from '../../../../../node_modules/rxjs/operators';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppGridStateService } from '../../../modules/base_module/services/app-gridstate-service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { PreparationPlatformPurItemDetailedComponent } from './item-detailed/item-detailed.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { CacheService } from '../query-kit-modal-route/cache.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'query-purchasekitstatus',
  templateUrl: './query-purchasekitstatus.component.html',
  providers: [QueryService]
})
export class PreparationPlatformQueryPurchaseKitStatusComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.gridData = [];
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.UserPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PC_KIT_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.KitStatusOption.push({
          label: d.meaning,
          value: d.meaning,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.MoStatusOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.queryPurchaseKitStatusService.getBuyers().subscribe(result => {
      if (result.data !== undefined && result.data !== null) {
        result.data.forEach(x => {
          this.BuyersOptions.push({
            label: x.fullName,
            value: x.employeeNumber,
          });
        });
      }
    });

    this.commonQueryService.GetLookupByType('PS_MAKE_BUY_CODE').subscribe(result => {
      result.Extra.forEach(d => {
        this.makebuycodes.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  selectIndex = 1;
  public mySelection: any[] = [];
  public UserPlantOptions: any[] = [];
  public KitStatusOption: any[] = [];
  public MoStatusOptions: any[] = [];
  public BuyersOptions: any[] = [];
  public categoryOptions: any[] = [];
  public makebuycodes: any[] = [];
  public yesOrNoOptions: any[] = [
    {label: 'Y', value: 'Y'},
    {label: 'N', value: 'N'}
  ];
  public columnsCate: any[] = [
    {
      field: 'categoryCode',
      title: '物料分类',
      width: '100'
    },
    {
      field: 'descriptions',
      title: '描述',
      width: '100'
    }
  ];
  public gridViewCat: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.UserPlantOptions, eventNo: 1 } },
      {
        field: 'categoryCode', title: '物料类别', ui: {
          type: UiType.popupSelect, valueField: 'categoryCode', textField: 'categoryCode'
          , gridView: this.gridViewCat, columns: this.columnsCate, eventNo: 2
        }
      },
      {
        field: 'itemCode', title: '物料编码', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode'
          , gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 3
        }
      },
      { field: 'demandDate', title: '需求日期', ui: { type: UiType.dateRange } },
      { field: 'buyer', title: '采购员', ui: { type: UiType.select, options: this.BuyersOptions } },
      { field: 'keyItemFlag', title: '关键料', ui: { type: UiType.select, options: this.yesOrNoOptions } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      categoryCode: { value: '', text: '' },
      itemCode: { value: '', text: '' },
      demandDate: [],
      buyer: null,
      keyItemFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null       // Complementing the Cell Renderer parameters
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 80 },
    { field: 'componentItemCode', headerName: '物料编码', tooltipField: 'componentItemCode', width: 100 },
    { field: 'componentDescriptions', headerName: '物料描述', tooltipField: 'componentDescriptions', width: 100 },
    { field: 'keyItemFlag', headerName: '关键料标志', width: 120 },
    // { field: 'buyer', headerName: '采购员', valueFormatter: 'ctx.optionsFind(value,4).label', width: 80 },
    { field: 'lastName', headerName: '采购员', width: 120 },
    { field: 'demandQuantity', headerName: '需求数量', width: 100 },
    { field: 'issuedQuantity', headerName: '已发料量', width: 100 },
    { field: 'existingQty', headerName: '现有量', width: 100 },
    { field: 'wayQty', headerName: '在途量', width: 100 },
    { field: 'standardKitShtqty', headerName: '标准齐套缺料量', width: 150 },
    { field: 'standardKitStatus', headerName: '标准齐套状态', width: 150 },
    { field: 'standardKitAssignedQty', headerName: '标准齐套已分配量', width: 150 },
    // { field: 'standardKitDistributableQty', headerName: '标准齐套可分配量', width: 150 },
    { field: 'attribute4', headerName: '扩展齐套缺料量', width: 150 },
    { field: 'attribute5', headerName: '扩展齐套状态', width: 150 },
    { field: 'attribute3', headerName: '扩展齐套已分配量', width: 150 },
    // { field: 'extendKitDistributableQty', headerName: '扩展齐套可分配量', width: 150 },
    { field: 'extendKitShtqty', headerName: '广义扩展齐套缺料量', width: 160 },
    { field: 'extendKitStatus', headerName: '广义扩展齐套状态', width: 160 },
    { field: 'extendKitAssignedQty', headerName: '广义扩展齐套分配量', width: 160 },
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 100, locked: false, ui: { tooltip: 1 } },
    { field: 'componentItemCode', title: '物料编码', width: 150, locked: false, },
    { field: 'componentDescriptions', title: '物料描述', width: 150, locked: false, ui: { tooltip: 1 } },
    // { field: 'makeOrderNum', title: '工单号', width: 150, locked: false },
    // { field: 'makeOrderStatus', title: '工单状态', width: 150, locked: false, ui: { type: 'select', index: 1, options: this.MoStatusOptions } },
    { field: 'buyer', title: '采购员', width: 100, locked: false, ui: { type: 'select', index: 4, options: this.BuyersOptions } },
    { field: 'demandQuantity', title: '需求数量', width: 150, locked: false },
    { field: 'issuedQuantity', title: '已发料量', width: 100, locked: false },
    { field: 'existingQty', title: '现有量', width: 120, locked: false },
    { field: 'wayQty', title: '在途量', width: 120, locked: false },
    { field: 'standardKitShtqty', title: '标准齐套缺料量', width: 150, locked: false },
    { field: 'standardKitStatus', title: '标准齐套状态', width: 150, locked: false },
    { field: 'standardKitAssignedQty', title: '标准齐套已分配量', width: 150, locked: false },
    { field: 'standardKitDistributableQty', title: '标准齐套可分配量', width: 150, locked: false },
    { field: 'extendKitShtqty', title: '扩展齐套缺料量', width: 150, locked: false },
    { field: 'extendKitStatus', title: '扩展齐套状态', width: 150, locked: false },
    { field: 'extendKitAssignedQty', title: '扩展齐套已分配量', width: 150, locked: false },
    { field: 'extendKitDistributableQty', title: '扩展齐套可分配量', width: 150, locked: false }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.MoStatusOptions;
        break;
      case 2:
        options = this.KitStatusOption;
        break;
      case 3:
        options = this.makebuycodes;
        break;
      case 4:
        options = this.BuyersOptions;
        break;
    }
    return options.find(x => x.value === value.toString()) || { label: value };
  }

  httpAction = { url: this.queryPurchaseKitStatusService.queryPurchaseKitStatus, method: 'POST', data: false };
  public query() {
    this.queryCommon();
  }
  public queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.gridState.take = event.take;
    this.commonQueryService.read(this.httpAction);
  }

  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode || this.appConfigService.getPlantCode(), e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  public searchCat(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCat(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadCat(value: string, PageIndex: number, PageSize: number) {

    // 加载物料
    this.commonQueryService.GetCategoryPageList1('采购分类' ,value,  PageIndex, PageSize).subscribe(res => {
      this.gridViewCat.data = res.data.content;
      this.gridViewCat.total = res.data.totalElements;
    });
    
  }

  public plantChange(value: any) {
    
  }  

  private getQueryParamsValue(isExport: boolean): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      categoryCode: this.queryParams.values.categoryCode.text,
      componentItemCode: this.queryParams.values.itemCode.text,
      startDate: this.queryParams.values.demandDate ? this.commonQueryService.formatDateTime(this.queryParams.values.demandDate[0]) : null,
      endDate: this.queryParams.values.demandDate ? this.commonQueryService.formatDateTime(this.queryParams.values.demandDate[1]) : null,
      buyers: this.queryParams.values.buyer,
      keyItemFlag: this.queryParams.values.keyItemFlag,
      // plannerCode: this.queryParams.values.plannerCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    };
  }

  public itemdetail(item: any) {
    /*this.modal
      .static(PreparationPlatformPurItemDetailedComponent, {
        plantcode: item.PLANT_CODE,
        itemcode: item.COMPONENT_ITEM_CODE,
        MoStatusOptions: this.MoStatusOptions,
        makebuycodes: this.makebuycodes
      })
      .subscribe((value) => {
        if (value) {
          // this.query();
        }
      });*/
    this.cache.plantCode = item.plantCode;
    this.cache.componentItemId = item.componentItemId;
    this.cache.componentItemCode = item.componentItemCode;
    this.cache.moStatusOptions = [...this.MoStatusOptions];
    this.cache.makeBuyCodes = [...this.makebuycodes];
    this.cache.type = 'prepare';
    this.router.navigate(['/preparation-platform/querykitstatus/query-kit-modal']).then(r => {});
  }

  expData: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.MoStatusOptions },
    { field: 'buyer', options: this.BuyersOptions }
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParamsValue(true), this.excelexport);
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

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      categoryCode: { value: '', text: '' },
      itemCode: { value: '', text: '' },
      demandDate: [],
      buyer: null,
      keyItemFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryPurchaseKitStatusService: QueryKitStatusService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    public pro: BrandService,
    private appGridStateService: AppGridStateService,
    private cache: CacheService,
    private router: Router
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
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
    this.setGridWidth('query-purchasekitstatus-main');
  }
}
