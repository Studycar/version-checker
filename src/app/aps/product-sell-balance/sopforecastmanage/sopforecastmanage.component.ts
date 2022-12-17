import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from './queryService';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { SopForeastManageService } from 'app/modules/generated_module/services/sopforecastmanage-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ProductSellBalanceSopforecastmanageEditComponent } from './edit/edit.component';
import { ForecastManageImportComponent } from './import/import.component';
import { ProductSellBalanceSopforecastmanageDetailComponent } from './detail/detail.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforecastmanage',
  templateUrl: './sopforecastmanage.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopforecastmanageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopForeastManageService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  businessOptions: any[] = [];
  context = this;
  typeOptions: any[] = [];
  sourceOptions: any[] = [];
  plantOptions: any[] = [];
  bigOptions: any[] = [];
  smallOptions: any[] = [];
  saleRegionOptions: any[] = []; // 业务大区
  saleAreaOptions: any[] = []; // 业务区域
  customerOptions: any[] = []; // 客户

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.LoadData();
    this.query();
    this.plantChange(this.appconfig.getPlantCode());
  }

  LoadData() {
    this.commonquery.GetLookupByTypeNew('SOP_SALES_TYPE').subscribe(res => {
      res.data.forEach(element => {
        this.sourceOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('SOP_FORECAST_TYPE').subscribe(res => {
      res.data.forEach(element => {
        this.typeOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.businessOptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode
        });
      });
    });

    this.commonquery.GetUserPlant(this.appconfig.getActiveScheduleRegionCode()).subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  getSalesCategoryBig(businessUnitCode: string, salesType: string, plantCode: string) {
    this.querydata.getBig(businessUnitCode, salesType, plantCode).subscribe(res => {
      this.bigOptions.length = 0;
      res.data.forEach(item => {
        this.bigOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  getSalesCategorySub(businessUnitCode: string, salesType: string, plantCode: string) {
    this.querydata.getSmall(businessUnitCode, salesType, plantCode).subscribe(res => {
      this.smallOptions.length = 0;
      res.data.forEach(item => {
        this.smallOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  getSalesRegion(businessUnitCode: string, salesType: string, plantCode: string) {
    this.querydata.getSaleRegion(businessUnitCode, salesType, plantCode).subscribe(res => {
      this.saleRegionOptions.length = 0;
      res.data.forEach(item => {
        this.saleRegionOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  getSalesArea(businessUnitCode: string, salesType: string, plantCode: string) {
    this.querydata.getArea(businessUnitCode, salesType, plantCode).subscribe(res => {
      this.saleAreaOptions.length = 0;
      res.data.forEach(item => {
        this.saleAreaOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  getCustomer(businessUnitCode: string, salesType: string, plantCode: string) {
    this.querydata.getCustomer(businessUnitCode, salesType, plantCode).subscribe(res => {
      this.customerOptions.length = 0;
      res.data.forEach(item => {
        if (!item) return;
        this.customerOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  httpAction = {
    url: this.querydata.url,
    method: 'GET',
    data: false
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
      { field: 'BUSINESS_UNIT_CODE', title: '事业部', ui: { type: UiType.select, options: this.businessOptions, eventNo: 2 } },
      { field: 'SALES_TYPE', title: '内外销', ui: { type: UiType.select, options: this.sourceOptions, eventNo: 4 } },
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 3 } },
      { field: 'SALES_CATEGORY_BIG', title: '产品大类', ui: { type: UiType.select, options: this.bigOptions } },
      { field: 'SALES_CATEGORY_SUB', title: '产品小类', ui: { type: UiType.select, options: this.smallOptions } },
      { field: 'ITEM_CODE', title: '物料', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 1
      }
      },
      { field: 'SALES_REGION', title: '业务大区', ui: { type: UiType.select, options: this.saleRegionOptions } },
      { field: 'SALES_AREA', title: '业务区域', ui: { type: UiType.select, options: this.saleAreaOptions } },
      { field: 'CUSTOMER_NAME', title: '客户', ui: { type: UiType.select, options: this.customerOptions } },
      { field: 'demandDateForm', title: '需求时间从', ui: { type: UiType.date } },
      { field: 'demandDateTo', title: '需求时间至', ui: { type: UiType.date } }
    ],
    values: {
      BUSINESS_UNIT_CODE: this.appconfig.getActiveScheduleRegionCode(),
      SALES_TYPE: '',
      PLANT_CODE: this.appconfig.getPlantCode(),
      SALES_CATEGORY_BIG: '',
      SALES_CATEGORY_SUB: '',
      ITEM_CODE: { value: '', text: '' },
      SALES_REGION: '',
      SALES_AREA: '',
      CUSTOMER_NAME: '',
      demandDateForm: null,
      demandDateTo: null,
    }
  };

  query() {
    super.query();
    this.commonQuery();
  }
  commonQuery () {
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(), this.context);
  }

  GetQueryParams(isExport: boolean = false) {
    return {
      businessUnitCode: this.queryParams.values.BUSINESS_UNIT_CODE,
      salesType: this.queryParams.values.SALES_TYPE,
      plantCode: this.queryParams.values.PLANT_CODE,
      salesCategoryBig: this.queryParams.values.SALES_CATEGORY_BIG,
      salesCategorySub: this.queryParams.values.SALES_CATEGORY_SUB,
      itemCode: this.queryParams.values.ITEM_CODE.text,
      salesRegion: this.queryParams.values.SALES_REGION,
      salesArea: this.queryParams.values.SALES_AREA,
      customerName: this.queryParams.values.CUSTOMER_NAME,
      demandDateForm: this.queryParams.values.demandDateForm,
      demandDateTo: this.queryParams.values.demandDateTo,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport,
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
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'businessUnitCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'salesType', headerName: '内外销', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'salesCatgoryBig', headerName: '产品大类', menuTabs: ['filterMenuTab'] },
    { field: 'salesCatgorySub', headerName: '产品小类', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsCn', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'salesRegion', headerName: '业务大区', menuTabs: ['filterMenuTab'] },
    { field: 'salesArea', headerName: '业务区域', menuTabs: ['filterMenuTab'] },
    { field: 'customerName', headerName: '客户', menuTabs: ['filterMenuTab'] },
    { field: 'forecastType', headerName: '预测类型', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'forecastDate', headerName: '原始日期', menuTabs: ['filterMenuTab'] },
    { field: 'netForecastDate', headerName: '净预测日期', menuTabs: ['filterMenuTab'] },
    { field: 'originalQty', headerName: '预测数量', menuTabs: ['filterMenuTab'] },
    { field: 'netQty', headerName: '净预测数量', menuTabs: ['filterMenuTab'] }];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 200, locked: false },
    { field: 'salesType', title: '内外销', width: 200, locked: false },
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'salesCatgoryBig', title: '产品大类', width: 200, locked: false },
    { field: 'salesCatgorySub', title: '产品小类', width: 200, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'descriptionsCn', title: '物料描述', width: 200, locked: false },
    { field: 'salesRegion', title: '业务大区', width: 200, locked: false },
    { field: 'salesArea', title: '业务区域', width: 200, locked: false },
    { field: 'customerName', title: '客户', width: 200, locked: false },
    { field: 'forecastType', title: '预测类型', width: 200, locked: false },
    { field: 'forecastDate', title: '原始日期', width: 200, locked: false },
    { field: 'netForecastDate', title: '净预测日期', width: 200, locked: false },
    { field: 'originalQty', title: '预测数量', width: 200, locked: false },
    { field: 'netQty', title: '净预测数量', width: 200, locked: false }];

  expColumnsOptions = [
    { field: 'salesType', options: this.sourceOptions },
    { field: 'forecastType', options: this.typeOptions },
  ];

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.sourceOptions;
        break;
      case 2:
        options = this.typeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  clear() {
    this.queryParams.values = {
      BUSINESS_UNIT_CODE: null,
      SALES_TYPE: null,
      PLANT_CODE: null,
      SALES_CATEGORY_BIG: null,
      SALES_CATEGORY_SUB: null,
      ITEM_CODE: { value: '', text: '' },
      SALES_REGION: null,
      SALES_AREA: null,
      CUSTOMER_NAME: null,
      demandDateForm: '',
      demandDateTo: '',
    };
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopforecastmanageEditComponent,
        {
          i: item !== undefined ? item : {}
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  record(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopforecastmanageDetailComponent,
        {
          K: { id: (item !== undefined ? item.id : null) }
        },
        'lg',
      ).subscribe();
  }

  /*remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }*/

  ModifyBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要释放的行！');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要修改吗？'),
      nzOnOk: () => {
        this.querydata.ModifyBatch(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.apptranslate.translate('修改成功'));
            this.query();
          } else {
            this.msgSrv.error(this.apptranslate.translate(res.msg));
          }
        });
      },
    });
  }

  httpExportAction = {
    url: this.querydata.url,
    method: 'GET'
  };
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(true), this.excelexport, this);
  }
  selectKeys = 'id';

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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }

  import() {
    this.modal
      .static(ForecastManageImportComponent, { i: { queryParams: this.GetQueryParams(true) } }, 'md')
      .subscribe((res) => {
        if (res) {
          this.query();
        }
      });
  }

  regionChange(value: any) {
    this.queryParams.values.PLANT_CODE = null;
    this.queryParams.values.ITEM_CODE.text = '';
    this.queryParams.values.ITEM_CODE.value = '';
    this.queryParams.values.SALES_CATEGORY_BIG = null;
    this.queryParams.values.SALES_CATEGORY_SUB = null;
    this.queryParams.values.SALES_REGION = null;
    this.queryParams.values.SALES_AREA = null;
    this.queryParams.values.CUSTOMER_NAME = null;

    this.commonquery.GetUserPlant(value).subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
    this.getSalesCategoryBig(value, this.queryParams.values.SALES_TYPE || '', this.queryParams.values.PLANT_CODE || '');
    this.getSalesCategorySub(value, this.queryParams.values.SALES_TYPE || '', this.queryParams.values.PLANT_CODE || '');
    this.getSalesRegion(value, this.queryParams.values.SALES_TYPE || '', this.queryParams.values.PLANT_CODE || '');
    this.getSalesArea(value, this.queryParams.values.SALES_TYPE || '', this.queryParams.values.PLANT_CODE || '');
    this.getCustomer(value, this.queryParams.values.SALES_TYPE || '', this.queryParams.values.PLANT_CODE || '');
  }

  plantChange(value: any) {
    this.queryParams.values.ITEM_CODE.text = '';
    this.queryParams.values.ITEM_CODE.value = '';
    this.queryParams.values.SALES_CATEGORY_BIG = null;
    this.queryParams.values.SALES_CATEGORY_SUB = null;
    this.queryParams.values.SALES_REGION = null;
    this.queryParams.values.SALES_AREA = null;
    this.queryParams.values.CUSTOMER_NAME = null;

    this.getSalesCategoryBig(this.queryParams.values.BUSINESS_UNIT_CODE || '', this.queryParams.values.SALES_TYPE || '', value);
    this.getSalesCategorySub(this.queryParams.values.BUSINESS_UNIT_CODE || '', this.queryParams.values.SALES_TYPE || '', value);
    this.getSalesRegion(this.queryParams.values.BUSINESS_UNIT_CODE || '', this.queryParams.values.SALES_TYPE || '', value);
    this.getSalesArea(this.queryParams.values.BUSINESS_UNIT_CODE || '', this.queryParams.values.SALES_TYPE || '', value);
    this.getCustomer(this.queryParams.values.BUSINESS_UNIT_CODE || '', this.queryParams.values.SALES_TYPE || '', value);
  }

  typeChange(value: any) {
    this.queryParams.values.SALES_CATEGORY_BIG = null;
    this.queryParams.values.SALES_CATEGORY_SUB = null;
    this.queryParams.values.SALES_REGION = null;
    this.queryParams.values.SALES_AREA = null;
    this.queryParams.values.CUSTOMER_NAME = null;

    this.getSalesCategoryBig(this.queryParams.values.BUSINESS_UNIT_CODE || '', value, this.queryParams.values.PLANT_CODE || '');
    this.getSalesCategorySub(this.queryParams.values.BUSINESS_UNIT_CODE || '', value, this.queryParams.values.PLANT_CODE || '');
    this.getSalesRegion(this.queryParams.values.BUSINESS_UNIT_CODE || '', value, this.queryParams.values.PLANT_CODE || '');
    this.getSalesArea(this.queryParams.values.BUSINESS_UNIT_CODE || '', value, this.queryParams.values.PLANT_CODE || '');
    this.getCustomer(this.queryParams.values.BUSINESS_UNIT_CODE || '', value, this.queryParams.values.PLANT_CODE || '');
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }

}
