import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
// import { NumberInputEditorComponent } from '../number-input.component';
import { deepCopy } from '@delon/util';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { PlatformProgressReportChartDialogComponent } from './chart-dialog/chart-dialog.component';

@Component({
  selector: 'platform-progress-report',
  templateUrl: './platform-progress-report.component.html',
  providers: [QueryService]
})
export class PlatformProgressReportComponent extends CustomBaseContext implements OnInit {
  @ViewChild('clickBtn', { static: true }) clickBtn: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
    private modal: ModalHelper,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  columns: any[] = [];

  staticColumns = [
    { field: 'businessUnit', headerName: '事业部', pinned: 'left', width: 120, },
    { field: 'plantCode', headerName: '组织', pinned: 'left', width: 80, },
    { field: 'demandDate', headerName: '月份', pinned: 'left', width: 100, },
    { field: 'salesTypeDesc', headerName: '去向', pinned: 'left', width: 80, },
  ];

  restColumns: any[] = [];

  buCodeOptions: any[] = [];
  organizationOptions: any[] = [];
  salesTypeOptions: any[] = [];
  salesCategoryBigOptions: any[] = [];
  salesCategorySubOptions: any[] = [];
  divisionNameOptions: any[] = [];

  // 商品编码
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料名称',
      width: '100',
    },
  ];

  dimensionOptions: any[] = [
    { label: '区域', value: 'areaNameShow', checked: true },
    { label: '客户', value: 'customerNameShow', checked: true },
    { label: '业务员', value: 'saleserShow', checked: true },
    { label: '营销大类', value: 'salesCategoryBigShow', checked: true },
    { label: '营销小类', value: 'salesCategorySubShow', checked: true },
    { label: '物料编码', value: 'itemCodeShow', checked: true },
    { label: '基准编码', value: 'referenceCodeShow', checked: true },
  ];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'plantCode', title: '组织', ui: { type: UiType.select, options: this.organizationOptions, eventNo: 2, }, required: true, },
      { field: 'salesType', title: '内销/外销', ui: { type: UiType.select, options: this.salesTypeOptions, } },
      { field: 'demandDate', title: '月份', ui: { type: UiType.monthPicker, }, required: true, },
      { field: 'salesCategoryBig', title: '营销大类', ui: { type: UiType.select, options: this.salesCategoryBigOptions, eventNo: 5, } },
      { field: 'salesCategorySub', title: '营销小类', ui: { type: UiType.select, options: this.salesCategorySubOptions, } },
      { field: 'divisionName', title: '汇总维度', ui: { type: UiType.select, options: this.divisionNameOptions, } },
      { field: 'areaName', title: '区域', ui: { type: UiType.string, } },
      { field: 'customerName', title: '客户', ui: { type: UiType.string, } },
      { field: 'saleser', title: '业务员', ui: { type: UiType.string, } },
      { field: 'item', title: '物料编码', ui: { type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 3, extraEvent: { RowSelectEventNo: 4, }, },  },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      salesType: null,
      demandDate: new Date(),
      salesCategoryBig: null,
      salesCategorySub: null,
      divisionName: null,
      areaName: null,
      customerName: null,
      saleser: null,
      item: { value: '', text: '' },
      itemId: null,
    }
  };

  httpAction = {
    url: '',
    method: 'GET',
  }

  ngOnInit(): void {
    this.loadOptions();
    this.query();
  }

  // 选择维度
  chooseDimension(event) {
    this.dimensionOptions.forEach(item => {
      const checked = item.checked;
      if (item.value === 'areaNameShow') {
        const target = this.queryParams.defines.find(d => d.field === 'areaName');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.areaName = null);
      } else if (item.value === 'customerNameShow') {
        const target = this.queryParams.defines.find(d => d.field === 'customerName');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.customerName = null);
      } else if (item.value === 'saleserShow') {
        const target = this.queryParams.defines.find(d => d.field === 'saleser');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.saleser = null);
      } else if (item.value === 'salesCategoryBigShow') {
        const target = this.queryParams.defines.find(d => d.field === 'salesCategoryBig');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.salesCategoryBig = null);
      } else if (item.value === 'salesCategorySubShow') {
        const target = this.queryParams.defines.find(d => d.field === 'salesCategorySub');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.salesCategorySub = null);
      } else if (item.value === 'itemCodeShow') {
        const target = this.queryParams.defines.find(d => d.field === 'item');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.item = { value: '', text: '' });
      }
    });
  }

  // 加载搜索项
  loadOptions() {
    this.getBuCodeOptions();
    this.getOrganizationOptions();
    this.getSalesCategoryBigOptions();
    this.getDivisionNameOptions();
  }

  // 获取事业部列表
  getBuCodeOptions() {
    this.buCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.buCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  buCodeOptionsChange(value) {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.item = { value: '', text: '', };
    this.queryParams.values.salesCategoryBig = null;
    this.queryParams.values.salesCategorySub = null;
    this.salesCategorySubOptions.length = 0;
    this.getOrganizationOptions();
    this.getSalesCategoryBigOptions();
  }

  // 获取组织列表
  getOrganizationOptions() {
    const params = this.getQueryParams();
    this.organizationOptions.length = 0;
    this.queryService.getPlant(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.organizationOptions.push({
          value: item.plantCode,
          label: item.plantCode,
        });
      })
    });
  }

  organizationOptionsChange(value) {
    this.queryParams.values.item = { value: '', text: '', };
  }

  // 获取营销大类
  getSalesCategoryBigOptions() {
    const params = this.getQueryParams();
    this.salesCategoryBigOptions.length = 0;
    this.queryService.getSalesCategoryBigOptions(params).subscribe(res => {
      console.log(res);
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.salesCategoryBigOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  salesCategoryBigChange(value) {
    this.queryParams.values.salesCategorySub = null;
    this.getSalesCategorySubOptions();
  }

  // 获取营销小类
  getSalesCategorySubOptions() {
    const params = this.getQueryParams();
    this.salesCategorySubOptions.length = 0;
    this.queryService.getSalesCategorySubOptions(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.salesCategorySubOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  getDivisionNameOptions() {
    this.divisionNameOptions.length = 0;
    this.queryService.getDivisionNameOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.divisionNameOptions.push({
          label: item.description,
          value: item.description,
        });
      });
    });
  }

  searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(e.SearchValue, PageIndex, e.PageSize);
  }

  // 搜索商品
  public loadItems(keyword: string, PageIndex: number, PageSize: number) {
    const params = this.getQueryParams();
    this.queryService.getItems(keyword || '', PageIndex, PageSize, params).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  rowSelectItems(e: any) {
    this.queryParams.values.itemId = e.Row && e.Row.itemId ? e.Row.itemId : null;
  }

  // 获取内外销列表
  getSalesTypeOptions() {
    this.salesTypeOptions.length = 0;
    this.queryService.getSaleChannelOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.salesTypeOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      // params.isExport = true;
      params.pageIndex = 1;
      params.pageSize = 100000;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    const bu = this.buCodeOptions.find(item => item.value === params.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    params.demandDate = params.demandDate ? this.queryService.formatDateTime2(params.demandDate, 'yyyy-MM') : null;
    params.itemCode = params.item.value ? params.item.value : null;
    if (!params.itemCode) params.itemId = null;
    delete params.item;
    params.salesCatgoryBig = params.salesCategoryBig || null;
    delete params.salesCategoryBig;
    params.salesCatgorySub = params.salesCategorySub || null;
    delete params.salesCategorySub;

    console.log('getQueryParams', params);
    return params;
  }

  // 渲染表头
  renderColumns(): void {
    const params = this.getQueryParams();
    const date = new Date(params.demandDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let columns: any[] = [
      ...this.staticColumns,
    ];

    columns = [
      ...columns,
    ];
    this.dimensionOptions.forEach(item => {
      if (item.value === 'areaNameShow') {
        if (item.checked) {
          columns.push({ field: 'areaName', headerName: '区域', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'customerNameShow') {
        if (item.checked) {
          columns.push({ field: 'customerName', headerName: '客户', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'saleserShow') {
        if (item.checked) {
          columns.push({ field: 'saleser', headerName: '业务员', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'salesCategoryBigShow') {
        if (item.checked) {
          columns.push({ field: 'salesCatgoryBig', headerName: '销售大类', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'salesCategorySubShow') {
        if (item.checked) {
          columns.push({ field: 'salesCatgorySub', headerName: '销售小类', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'itemCodeShow') {
        if (item.checked) {
          columns.push({ field: 'itemCode', headerName: '物料编码', pinned: 'left', width: 100, });
          columns.push({ field: 'descriptions', headerName: '编码描述', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'referenceCodeShow') {
        if (item.checked) {
          columns.push({ field: 'referenceCode', headerName: '基准编码', pinned: 'left', width: 100, });
        }
      }
    });

    const monthList = [];
    const monthColumns: any[] = [];

    for (let i = 0; i < 3; i++) {
      const template = month + i;
      const row = {
        month: template > 12 ? template - 12 : template,
        year: template > 12 ? year + 1 : year,
      };
      monthList.push(row);
    }

    const monthFieldList = [
      { filed: 'forecastN', headerName: '月预测', width: 100, },
      { filed: 'orderReceivedN', headerName: '月接单', width: 100, },
      { filed: 'productionN', headerName: '月已生产', width: 120, },
      { filed: 'receivedProportionN', headerName: '月接单占比', width: 140, },
      { filed: 'productionProportionN', headerName: '月生产占比', width: 140, },
    ];

    monthFieldList.forEach(item => {
      monthList.forEach((jItem, jIndex) => {
        const field = `${item.filed}${jIndex + 1}`;
        const column = {
          field,
          headerName: `${jItem.month < 10 ? '0' + jItem.month : jItem.month}${item.headerName}`,
          width: item.width,
          cellRendererFramework: CustomOperateCellRenderComponent,
          cellRendererParams: {
            customTemplate: this.clickBtn,
            field,
          },
        };

        monthColumns.push(column);
      });
    });

    columns = [
      ...columns,
      ...monthColumns,
    ];

    this.columns = columns;

    console.log('columns', this.columns);
  }

  query() {
    super.query();
    this.renderColumns();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: null,
      plantCode: null,
      salesType: null,
      demandDate: null,
      salesCategoryBig: null,
      salesCategorySub: null,
      divisionName: null,
      areaName: null,
      customerName: null,
      saleser: null,
      item: { value: '', text: '' },
      itemId: null,
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
      this.gridData = this.createData(data);
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      });
    });
  }

  createData(data: any[] = []): any[] {
    const result = deepCopy(data);
    return result;
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const exportData = this.createData(data);
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  // 查看echart图
  showChartsDialog(dataItem: any) {
    this.modal.create(
      PlatformProgressReportChartDialogComponent,
      {
        data: dataItem,
      },
      {
        size: 'xl',
      },
    ).subscribe(res => {})
  }
}
