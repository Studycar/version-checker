import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { QueryService } from './queryService';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { State } from '@progress/kendo-data-query';
import { DemandImportImportComponent } from './import/import.component';
import { SopDemandImportImportService } from '../../../modules/generated_module/services/sopdemandimportservice';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopdemandimport',
  templateUrl: './sopdemandimport.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopdemandimportComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopDemandImportImportService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  plantOptions: any[] = [];
  mySelection: any[] = [];
  typeOptions: any[] = [];
  context = this;
  saleOptions: any[] = [];
  groupOptions: any[] = [];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'salesType', title: '内外销', ui: { type: UiType.select, options: this.saleOptions } },
      {
        field: 'txtItemCode', title: '物料', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'startDate', title: '需求开始时间', ui: { type: UiType.date } },
      { field: 'endDate', title: '需求结束时间', ui: { type: UiType.date } },
      { field: 'areaCode', title: '业务大区', ui: { type: UiType.text } },
      { field: 'foreastType', title: '预测类型', ui: { type: UiType.select, options: this.typeOptions } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      salesType: '',
      txtItemCode: { text: '', value: '' },
      startDate: '',
      endDate: '',
      areaCode: '',
      foreastType: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
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
    this.setGridWidth('sopdemandimport');
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.PLANT_CODE,
          value: element.PLANT_CODE
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('PP_DOMESTIC_EXPORT', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.saleOptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('PP_FORECAST_SET', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeOptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });
  }

  httpAction = {
    url: this.querydata.url,
    method: 'POST',
  };

  query() {
    super.query();
    this.queryService.loadGridView(this.httpAction, this.GetQueryParams(), this.context);
  }

  GetQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      salesType: this.queryParams.values.salesType,
      txtItemCode: this.queryParams.values.txtItemCode.text,
      startDate: this.queryParams.values.startDate,
      endDate: this.queryParams.values.endDate,
      areaCode: this.queryParams.values.areaCode,
      foreastType: this.queryParams.values.foreastType,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

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
    { field: 'PLANT_CODE', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'SALES_TYPE', headerName: '内外销', menuTabs: ['filterMenuTab'] },
    { field: 'DEMAND_DATE', headerName: '需求日期', menuTabs: ['filterMenuTab'] },
    { field: 'ITEM_CODE', headerName: '产品编码', menuTabs: ['filterMenuTab'] },
    { field: 'ITEM_DESC', headerName: '产品描述', tooltipField: 'ITEM_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'SALES_AREA', headerName: '业务大区', menuTabs: ['filterMenuTab'] },
    { field: 'FORECAST_TYPE', headerName: '预测类型', menuTabs: ['filterMenuTab'] },
    { field: 'FORECAST_SOP', headerName: '需求数量', menuTabs: ['filterMenuTab'] },
    { field: 'ERROR_MESSAGE', headerName: '错误消息', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 200, locked: false },
    { field: 'SALES_TYPE', title: '内外销', width: 200, locked: false },
    { field: 'DEMAND_DATE', title: '需求日期', width: 200, locked: false },
    { field: 'ITEM_CODE', title: '产品编码', width: 200, locked: false },
    { field: 'ITEM_DESC', title: '产品描述', width: 200, locked: false },
    { field: 'SALES_AREA', title: '业务大区', width: 200, locked: false },
    { field: 'FORECAST_TYPE', title: '预测类型', width: 200, locked: false },
    { field: 'FORECAST_SOP', title: '需求数量', width: 200, locked: false },
    { field: 'ERROR_MESSAGE', title: '错误消息', width: 200, locked: false }];

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      salesType: null,
      txtItemCode: { text: '', value: '' },
      startDate: '',
      endDate: '',
      areaCode: '',
      foreastType: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
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

  httpExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(), this.excelexport, this);
  }

  selectKeys = 'Id';
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
      this.query();
    } else {
      this.setLoading(false);
    }
  }

  plantChange(value: any) {
  }

  import() {
    this.modal
      .static(DemandImportImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

}
