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
import { HeadquartersPsiChartDialogComponent } from './chart-dialog/chart-dialog.component';

@Component({
  selector: 'headquarters-psi',
  templateUrl: './headquarters-psi.component.html',
  providers: [QueryService]
})
export class HeadquartersPsiComponent extends CustomBaseContext implements OnInit {
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
    { field: 'salesTypeDesc', headerName: '内/外销', pinned: 'left', width: 100, },
  ];

  restColumns: any[] = [
    {
      headerName: '当月PSI执行情况',
      children: [
        {
          field: 'forecastN', headerName: '分销规划', width: 120,
        },
        {
          field: 'monthSaleN', headerName: '当前已分销', width: 120,
        },
        {
          field: 'productionN', headerName: '生产规划', width: 100,
        },
        {
          field: 'monthProductionN', headerName: '当前已完成', width: 120,
        },
        {
          field: 'onhandN', headerName: '规划库存', width: 100,
        },
        {
          field: 'monthOnhandN', headerName: '当前库存', width: 100,
        },
      ],
    },
  ];

  buCodeOptions: any[] = [];
  organizationOptions: any[] = [];
  salesTypeOptions: any[] = [];
  isNewProductOptions: any[] = [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ];
  salesCategoryBigOptions: any[] = [];
  salesCategorySubOptions: any[] = [];
  monAverageOptions: any[] = [];
  divisionNameOptions: any[] = [];

  // 商品编码
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '商品编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '商品名称',
      width: '100',
    },
  ];

  dimensionOptions: any[] = [
    { label: '营销大类', value: 'salesCategoryBigShow', checked: true },
    { label: '营销小类', value: 'salesCategorySubShow', checked: true },
    { label: '是否新品', value: 'isNewProductShow', checked: true },
    { label: '商品', value: 'itemShow', checked: true },
  ];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'plantCode', title: '组织', ui: { type: UiType.select, options: this.organizationOptions, eventNo: 2, }, required: true, },
      { field: 'salesType', title: '内销/外销', ui: { type: UiType.select, options: this.salesTypeOptions, } },
      { field: 'demandDate', title: '月份', ui: { type: UiType.monthPicker, }, required: true, },
      { field: 'salesCategoryBig', title: '营销大类', ui: { type: UiType.select, options: this.salesCategoryBigOptions, eventNo: 6, } },
      { field: 'salesCategorySub', title: '营销小类', ui: { type: UiType.select, options: this.salesCategorySubOptions, } },
      { field: 'isNewProduct', title: '是否新品', ui: { type: UiType.select, options: this.isNewProductOptions, } },
      { field: 'item', title: '商品编码', ui: { type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 3, extraEvent: { RowSelectEventNo: 4, }, },  },
      { field: 'monAverage', title: '月均分销', ui: { type: UiType.selectMultiple, options: this.monAverageOptions, eventNo: 5, } },
      { field: 'divisionName', title: '维度', ui: { type: UiType.select, options: this.divisionNameOptions, } },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      salesType: null,
      demandDate: new Date(),
      salesCategoryBig: null,
      salesCategorySub: null,
      isNewProduct: null,
      item: { value: '', text: '', },
      itemId: null,
      monAverage: [],
      divisionName: null,
    }
  };

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.isNewProductOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

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
      if (item.value === 'isNewProductShow') {
        const target = this.queryParams.defines.find(d => d.field === 'isNewProduct');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.isNewProduct = null);
      } else if (item.value === 'itemShow') {
        const target = this.queryParams.defines.find(d => d.field === 'item');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.item = { value: '', text: '' });
      } else if (item.value === 'salesCategoryBigShow') {
        const target = this.queryParams.defines.find(d => d.field === 'salesCategoryBig');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.salesCategoryBig = null);
      } else if (item.value === 'salesCategorySubShow') {
        const target = this.queryParams.defines.find(d => d.field === 'salesCategorySub');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.salesCategorySub = null);
      }
    })
  }

  // 加载搜索项
  loadOptions() {
    this.getBuCodeOptions();
    this.getOrganizationOptions();
    this.getSalesCategoryBigOptions();
    this.getDivisionNameOptions();
    this.getSalesTypeOptions();
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
    params.itemCode = params.item.value ? params.item.value : null;
    if (!params.itemCode) params.itemId = null;
    delete params.item;
    params.salesCatgoryBig = params.salesCategoryBig || null;
    delete params.salesCategoryBig;
    params.salesCatgorySub = params.salesCategorySub || null;
    delete params.salesCategorySub;
    params.demandDate = params.demandDate ? this.queryService.formatDateTime2(params.demandDate, 'yyyy-MM') : null;

    this.dimensionOptions.forEach(item => {
      if (item.value === 'isNewProductShow') {
        params.isNewProductShow = item.checked ? 'Y' : 'N';
      } else if (item.value === 'itemShow') {
        params.itemShow = item.checked ? 'Y' : 'N';
      } else if (item.value === 'salesCategoryBigShow') {
        params.salesCatgoryBigShow = item.checked ? 'Y' : 'N';
      } else if (item.value === 'salesCategorySubShow') {
        params.salesCatgorySubShow = item.checked ? 'Y' : 'N';
      }
    });
    delete params.monAverage;
    console.log('getQueryParams', params);
    return params;
  }

  // 渲染表头
  renderColumns(): void {
    const params = this.getQueryParams();
    const date = new Date(params.demandDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.monAverageOptions.length = 0;

    let columns: any[] = [
      ...this.staticColumns,
    ];
    this.dimensionOptions.forEach(item => {
      if (item.value === 'salesCategoryBigShow') {
        if (item.checked) {
          columns.push({ field: 'salesCatgoryBig', headerName: '销售大类', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'salesCategorySubShow') {
        if (item.checked) {
          columns.push({ field: 'salesCatgorySub', headerName: '销售小类', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'itemShow') {
        if (item.checked) {
          columns.push({ field: 'itemCode', headerName: '商品编码', pinned: 'left', width: 100, });
          columns.push({ field: 'itemName', headerName: '商品名称', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'isNewProductShow') {
        if (item.checked) {
          columns.push({ field: 'isNewProduct', headerName: '是否新品', pinned: 'left', width: 100, valueFormatter: 'ctx.optionsFind(value,1).label', });
        }
      }
    });

    const monthColumns: any[] = [];

    const monthList = [];
    for (let i = 12; i > 0; i--) {
      const template = month - i;
      const row = {
        month: template < 1 ? 12 + template : template,
        year: template < 1 ? year - 1 : year,
        field: `monthSaleL${i}`,
      };
      monthList.push(row);
    }

    monthList.forEach(item => {
      // 分销情况
      monthColumns.push({
        field: item.field,
        headerName: `${item.month}月分销`,
        width: 100,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.clickBtn,
          field: item.field,
          type: 1,
        },
      });
      // 月均分销列表
      const t = item.month < 10 ? `${item.year}-0${item.month}` : `${item.year}-${item.month}`;
      this.monAverageOptions.push({
        label: t,
        value: t,
      });
    });
    this.monAverageOptions.reverse();

    // 月均分销
    monthColumns.push({
      field: 'monAverage', headerName: '月均分销(近三个月)', width: 160,
    });

    // next 2 month
    const nextList = [];
    for (let i = 0; i < 3; i++) {
      const template = month + i;
      const row = {
        month: template > 12 ? template - 12 : template,
        year: template > 12 ? year + 1 : year,
      };
      nextList.push(row);
    }
    const nextColumns: any[] = nextList.map((item, index) => {
      const month = item.month;
      const row = {
        headerName: `${month}月PSI`,
        children: [
          {
            field: `productionN${index + 1}`, headerName: `${month}月生产规划`, width: 120,
            cellRendererFramework: CustomOperateCellRenderComponent,
            cellRendererParams: {
              customTemplate: this.clickBtn,
              field: `productionN${index + 1}`,
              type: 3,
            },
          },
          {
            field: `forecastN${index + 1}`, headerName: `${month}月分销`, width: 120,
            cellRendererFramework: CustomOperateCellRenderComponent,
            cellRendererParams: {
              customTemplate: this.clickBtn,
              field: `forecastN${index + 1}`,
              type: 3,
            },
          },
          {
            field: `onhandN${index + 1}`, headerName: `月底价值链库存`, width: 140,
            cellRendererFramework: CustomOperateCellRenderComponent,
            cellRendererParams: {
              customTemplate: this.clickBtn,
              field: `onhandN${index + 1}`,
              type: 3,
            },
          },
          {
            field: `inventoryRatioN${index + 1}_`, headerName: `库存周转`, width: 140,
            cellRendererFramework: CustomOperateCellRenderComponent,
            cellRendererParams: {
              customTemplate: this.clickBtn,
              field: `inventoryRatioN${index + 1}_`,
              type: 3,
            },
          },
        ],
      };
      return row;
    });

    this.restColumns[0].children.forEach(item => {
      item.cellRendererFramework = CustomOperateCellRenderComponent;
      item.cellRendererParams = {
        customTemplate: this.clickBtn,
        field: item.field,
        type: 2,
      };
    });

    columns = [
      ...columns,
      ...monthColumns,
      ...this.restColumns,
      ...nextColumns,
    ];
    this.columns = columns;

    console.log('columns', this.columns);
  }

  monAverageChange(event) {
    this.gridData = this.createData(this.gridData);
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
      isNewProduct: null,
      item: { value: '', text: '', },
      itemId: null,
      monAverage: [],
      divisionName: null,
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      this.setLoading(false);
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
      this.gridData = this.createData(data);
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
    });
  }

  createData(data: any[] = []): any[] {
    const result = deepCopy(data);
    const monAverage = this.queryParams.values.monAverage;
    const monAverageColumn = this.columns.find(item => item.field === 'monAverage');
    if (monAverageColumn) {
      monAverageColumn.headerName = '月均分销' + (monAverage.length ? '(过去几个月)' : '(近三个月)');
    }
    this.gridApi && this.gridApi.setColumnDefs(this.columns);

    result.forEach(row => {
      let average: any;
      let count = 0;
      if (!monAverage.length) {
        count = row.monthSaleL1 * 1 + row.monthSaleL2 * 1 + row.monthSaleL3 * 1;
        average = Math.round(count / 3);
      } else {
        for (let i = 0; i < monAverage.length; i++) {
          const di = monAverage[i];
          const monIndex = this.monAverageOptions.findIndex((item) => item.value === di);
          // const monthSalesNData = Number(row['monthSalesN' + (6 - monIndex)]);
          const monthSalesNData = Number(row['monthSaleL' + (monIndex + 1)]);
          count += monthSalesNData;
        }
        average = Math.round(count / monAverage.length);
      }
      row.monAverage = average;
      for (let i = 0; i < 3; i++) {
        row[`inventoryRatioN${i + 1}_`] = Number(average) ? Math.round(row[`onhandN${i + 1}`] / average * 30) : 0;
      }
    });
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
  expColumnsOptions: any[] = [
    { field: 'isNewProduct', options: this.isNewProductOptions, },
  ];
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
  showChartsDialog(dataItem: any, type: number) {
    this.modal.create(
      HeadquartersPsiChartDialogComponent,
      {
        data: dataItem,
        type,
      },
      {
        size: 'xl',
      },
    ).subscribe(res => {})
  }
}
