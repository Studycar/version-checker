/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-08 09:00:01
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 11:20:19
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { map } from 'rxjs/operators';
import { process, State } from '@progress/kendo-data-query';
import { DemandPutService } from '../../../modules/generated_module/services/demand-put-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent } from './edit/edit.component';
import { SopSupplierCapacityMaintenanceService } from 'app/modules/generated_module/services/sopsuppliercapacitymaintenance-service';
import { SupplierCapacityImportComponent } from './import/import.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopsuppliercapacitymaintenance',
  templateUrl: './sopsuppliercapacitymaintenance.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopsuppliercapacitymaintenanceComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryservice: QueryService,
    private querydata: SopSupplierCapacityMaintenanceService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);

  }

  mySelection: any[] = [];
  plantoptions: any[] = [];
  itemoptions: any[] = [];
  public dis: Boolean = false;
  context = this;
  divisiontoptions: any[] = []; // 维度类型、产能颗粒度
  valueOptions: any[] = []; // 维度值
  randomUserUrl: string;
  k: string;
  isLoading: Boolean = false;
  pageIndex1: number;
  pageSize1: Number = 10;
  public gridViewVendors: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100'
    },
    {
      field: 'vendorName',
      title: '供应商描述',
      width: '100'
    }
  ];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } },
      {
        field: 'vendorNumber', title: '供应商编码', ui: {
          type: UiType.popupSelect, valueField: 'vendorNumber', textField: 'vendorNumber', gridView: this.gridViewVendors, columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'dimensionType', title: '产能维度', ui: { type: UiType.select, options: this.divisiontoptions, eventNo: 3 } },
      { field: 'divisionValue', title: '维度值', ui: { type: UiType.scrollSelect, options: this.valueOptions, extraEvent: { ScrollEventNo: 4, SearchEventNo: 5 } } },
      { field: 'startTimeRange', title: '开始时间范围', ui: { type: UiType.dateTimeRange } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      vendorNumber: { value: '', text: '' },
      dimensionType: '',
      divisionValue: '',
      startTimeRange: [],
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'divisionType', headerName: '产能维度',valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'divisionValue', headerName: '维度值', menuTabs: ['filterMenuTab'] },
    { field: 'desc', headerName: '产能维度描述', tooltipField: 'desc', menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    { field: 'vendorName', headerName: '供应商名称', menuTabs: ['filterMenuTab'] },
    { field: 'capacity', headerName: '月度产能', menuTabs: ['filterMenuTab'] },
    { field: 'startDate', headerName: '开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'endDate', headerName: '结束时间', menuTabs: ['filterMenuTab'] }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.divisiontoptions;
        break;
     
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'divisionType', title: '产能颗粒度', width: 200, locked: false },
    { field: 'divisionValue', title: '产能维度', width: 200, locked: false },
    { field: 'desc', title: '产能维度描述', width: 200, locked: false },
    { field: 'vendorNumber', title: '供应商编码', width: 200, locked: false },
    { field: 'vendorName', title: '供应商名称', width: 200, locked: false },
    { field: 'capacity', title: '月度产能', width: 200, locked: false },
    { field: 'startDate', title: '开始时间', width: 200, locked: false },
    { field: 'endDate', title: '结束时间', width: 200, locked: false }
  ];

  httpAction = {
    url: this.querydata.url,
    method: 'POST'
  };

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.pageIndex1 = 0;
    this.k = '';
    this.dis = true;
    this.queryCommon();
    this.LoadData();
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
    this.setGridWidth('sopsuppliercapacitymaintenance');
  }

  LoadData() {
    this.commonquery.GetLookupByTypeRef('SOP_CAPACITY_TYPE', this.divisiontoptions);

    // this.commonquery.GetLookupByTypeLang('SOP_capacity_TYPE', this.appconfig.getLanguage()).subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.divisiontoptions.push({
    //       label: element.MEANING,
    //       value: element.LOOKUP_CODE
    //     });
    //   });
    // });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent,
        { i: { id: (item !== undefined ? item.id : null), plantCode: (item !== undefined ? item.plantCode : null) } },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  plantchange(value) {
    this.dis = false;
  }

  private getQueryParamsValue(isExport: boolean): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      vendorNumber: this.queryParams.values.vendorNumber.text,
      dimensionType: this.queryParams.values.dimensionType,
      divisionValue: this.queryParams.values.divisionValue,
      startDate: this.queryParams.values.startTimeRange[0],
      endDate: this.queryParams.values.startTimeRange[1],
      export: isExport,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      vendorNumber: { value: '', text: '' },
      dimensionType: null,
      divisionValue: null,
      startTimeRange: [],
      pageIndex: 1,
      pageSize: this.gridState.take
    };
    this.gridViewVendors.data = [];
    this.gridViewVendors.total = 0;
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  searchVendors(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadVendor(vendorNumber: string, PageIndex: number, PageSize: number) {
    this.querydata.GetVendorPageList( this.queryParams.values.plantCode || '',vendorNumber || '',  PageIndex, PageSize).subscribe(res => {
      this.gridViewVendors.data = res.data.content;
      this.gridViewVendors.total = res.data.totalElements;
    });
  }


  expColumnsOptions: any[] = [
    { field: 'divisionType', options: this.divisiontoptions }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryservice.export(this.httpAction, this.getQueryParamsValue(true), this.excelexport, this);
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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

  typeChange(value: any) {
    this.queryParams.values.divisionValue = null;
    while (this.valueOptions.length !== 0) {
      this.valueOptions.pop();
    }
    this.onSearch('');
  }

  loadMore(): void {
    this.randomUserUrl = '/api/sop/sopsupplycapacity/getValue?type=' + this.queryParams.values.dimensionType + '&plantCode=' + this.queryParams.values.plantCode + '&pageIndex=' + this.pageIndex1 + '&pageSize=' + this.pageSize1 + '&k=' + this.k;
    this.isLoading = true;
    this.querydata.getRandomNameList(this.randomUserUrl).subscribe(data => {
      this.isLoading = false;
      data.forEach(element1 => {
        this.valueOptions.push({
          label: element1,
          value: element1
        });
      });
    });
    this.pageIndex1++;
  }

  // 搜索
  onSearch(value: string): void {
    this.pageIndex1 = 0;
    while (this.valueOptions.length !== 0) {
      this.valueOptions.pop();
    }
    this.isLoading = true;
    this.k = value;
    this.loadMore();
  }

  import() {
    this.modal
      .static(SupplierCapacityImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }
}
