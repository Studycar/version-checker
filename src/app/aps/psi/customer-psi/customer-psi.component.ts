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
import { NumberInputEditorComponent } from '../number-input.component';
import { deepCopy } from '@delon/util';
import { ModalHelper } from '@delon/theme';
import { CustomerPsiImportComponent } from './import/import.component';

@Component({
  selector: 'customer-psi',
  templateUrl: './customer-psi.component.html',
  providers: [QueryService]
})
export class CustomerPsiComponent extends CustomBaseContext implements OnInit {
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

  frameworkComponents = Object.assign(
    {},
    this.gridOptions.frameworkComponents,
    {
      numberInputRenderer: NumberInputEditorComponent,
    },
  );

  // 已修改行
  editedRows: any[] = [];

  columns: any[] = [];

  staticColumns = [
    { field: 'businessUnit', headerName: '事业部', pinned: 'left', width: 120, },
    { field: 'plantCode', headerName: '组织', pinned: 'left', width: 80, },
    { field: 'areaCode', headerName: '营销中心编码', pinned: 'left', width: 120, },
    { field: 'areaName', headerName: '营销中心', pinned: 'left', width: 100, },
  ];

  restColumns = [
    {
      headerName: '需求计划执行',
      children: [
        { field: 'monthForecastQty', headerName: '客户提报当月需求', editable: true, cellEditor: 'numberInputRenderer', width: 160, },
        { field: 'applicationQty', headerName: '提交订单量', width: 120, },
        { field: 'evaluatedQty', headerName: '已满足(已评审)', width: 140, },
        { field: 'apprProgress', headerName: '送审进度', width: 100, },
        { field: 'apprGap', headerName: '送审缺口', width: 100, },
      ],
    },
    {
      headerName: '当前订单情况',
      children: [
        { field: 'unTransAppr', headerName: '未结转未评审', width: 120, },
        { field: 'transAppr', headerName: '已结转未评审', width: 120, },
        { field: 'apprUndeli', headerName: '已评审未发货', width: 120, },
        { field: 'intranQty', headerName: '在途订单', width: 100, },
      ],
    },
    {
      headerName: '库存情况',
      children: [
        { field: 'onhandQty', headerName: '客户库存现有量', width: 140, },
        { field: 'intranTurnoverNum', headerName: '周转天数(在库)', width: 140, },
        { field: 'deteTurnoverNum', headerName: '周转天数(确定货源)', width: 160, },
        { field: 'sysTurnoverNum', headerName: '周转天数(含系统订单)', width: 160, },
      ]
    }
  ];

  buCodeOptions: any[] = [];
  organizationOptions: any[] = [];
  areaOptions: any[] = [];
  salesCategoryBigOptions: any[] = [];
  salesCategorySubOptions: any[] = [];
  monAverageOptions: any[] = [];

  // 客户
  gridViewCustomers: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsCustomers: any[] = [
    {
      field: 'customerNumber',
      title: '客户编码',
      width: '100',
    },
    {
      field: 'customerName',
      title: '客户名称',
      width: '100',
    },
  ];

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
    { label: '客户', value: 'customerShow', checked: true },
    { label: '商品', value: 'itemShow', checked: true },
    { label: '营销大类', value: 'salesCategoryBigShow', checked: true },
    { label: '营销小类', value: 'salesCategorySubShow', checked: true },
  ];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'plantCode', title: '组织', ui: { type: UiType.select, options: this.organizationOptions, eventNo: 2, }, required: true, },
      { field: 'demandDate', title: '月份', ui: { type: UiType.monthPicker, }, required: true, },
      { field: 'areaCode', title: '营销中心', ui: { type: UiType.select, options: this.areaOptions, } },
      { field: 'customer', title: '客户', ui: { type: UiType.popupSelect, valueField: 'customerNumber', textField: 'customerName', gridView: this.gridViewCustomers, columns: this.columnsCustomers, eventNo: 3, }, },
      { field: 'salesCategoryBig', title: '营销大类', ui: { type: UiType.select, options: this.salesCategoryBigOptions, eventNo: 7, } },
      { field: 'salesCategorySub', title: '营销小类', ui: { type: UiType.select, options: this.salesCategorySubOptions, } },
      { field: 'item', title: '商品编码', ui: { type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 4, extraEvent: { RowSelectEventNo: 5, }, }, },
      { field: 'monAverage', title: '月均分销', ui: { type: UiType.selectMultiple, options: this.monAverageOptions, eventNo: 6, } },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      demandDate: new Date(),
      areaCode: null,
      customer: { value: '', text: '', },
      salesCategoryBig: null,
      salesCategorySub: null,
      item: { value: '', text: '', },
      itemId: null,
      monAverage: [],
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
      if (item.value === 'customerShow') {
        const target = this.queryParams.defines.find(d => d.field === 'customer');
        target && (target.readonly = checked ? false : true);
        !checked && (this.queryParams.values.customer = { value: '', text: '' });
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
    this.getAreaOptions();
    this.getSalesCategoryBigOptions();
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

  // 获取营销中心列表
  getAreaOptions() {
    this.areaOptions.length = 0;
    this.queryService.getAreaOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.areaOptions.push({
          label: item.areaName,
          value: item.areaCode,
        });
      });
    });
  }

  searchCustomers(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustomers(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadCustomers(keyword: string, PageIndex: number, PageSize: number) {
    const params = {
      customerNumber: keyword,
      pageIndex: PageIndex,
      pageSize: PageSize,
      enableFlag: 'A',
    };
    this.queryService.getCustomersOptions(params).subscribe(res => {
      this.gridViewCustomers.data = res.data.content;
      this.gridViewCustomers.total = res.data.totalElements;
    });
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

  // 获取查询参数
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
    params.customerNumber = params.customer.value ? params.customer.value : null;
    params.customerName = params.customer.text ? params.customer.text : null;
    delete params.customer;
    params.itemCode = params.item.value ? params.item.value : null;
    if (!params.itemCode) params.itemId = null;
    delete params.item;
    const area = this.areaOptions.find(item => item.value === params.areaCode);
    params.areaName = params.areaCode ? (area ? area.label : null) : null;
    this.dimensionOptions.forEach(item => {
      if (item.value === 'customerShow') {
        params.customerShow = item.checked ? 'Y' : 'N';
      } else if (item.value === 'itemShow') {
        params.itemShow = item.checked ? 'Y' : 'N';
      } else if (item.value === 'salesCategoryBigShow') {
        params.salesCategoryBigShow = item.checked ? 'Y' : 'N';
      } else if (item.value === 'salesCategorySubShow') {
        params.salesCategorySubShow = item.checked ? 'Y' : 'N';
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
      if (item.value === 'customerShow') {
        if (item.checked) {
          columns.push({ field: 'customerName', headerName: '客户名称', pinned: 'left', width: 100, });
          columns.push({ field: 'customerNumber', headerName: '客户编码', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'itemShow') {
        if (item.checked) {
          columns.push({ field: 'itemCode', headerName: '商品编码', pinned: 'left', width: 100, });
          columns.push({ field: 'itemName', headerName: '商品名称', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'salesCategoryBigShow') {
        if (item.checked) {
          columns.push({ field: 'salesCategoryBig', headerName: '销售大类', pinned: 'left', width: 100, });
        }
      } else if (item.value === 'salesCategorySubShow') {
        if (item.checked) {
          columns.push({ field: 'salesCategorySub', headerName: '销售小类', pinned: 'left', width: 100, });
        }
      }
    });
    const monthColumns: any[] = [
      {
        headerName: '分销情况',
        children: [
          { field: 'monAverage', headerName: '月均销', width: 100, },
        ],
      },
    ];
    const monthList = [];
    for (let i = 5; i >= 0; i--) {
      const template = month - i;
      const row = {
        month: template < 1 ? 12 + template : template,
        year: template < 1 ? year - 1 : year,
        field: `monthSalesN${i + 1}`,
      }
      monthList.push(row);
    }

    monthList.forEach(item => {
      // 分销情况
      monthColumns[0].children.push({
        field: item.field,
        headerName: `${item.month}月分销`,
        width: 100,
      });
      // 月均分销列表
      const t = item.month < 10 ? `${item.year}-0${item.month}` : `${item.year}-${item.month}`;
      this.monAverageOptions.push({
        label: t,
        value: t,
      });
    });
    this.monAverageOptions.reverse();

    columns = [
      ...columns,
      ...this.restColumns,
      ...monthColumns,
    ];
    this.columns = columns;

    console.log('columns', this.columns);
  }

  monAverageChange(event) {
    this.gridData = this.createData(this.gridData);
  }

  query() {
    this.editedRows.length = 0;
    super.query();
    this.renderColumns();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: null,
      plantCode: null,
      demandDate: null,
      areaCode: null,
      customer: { value: '', text: '', },
      salesCategoryBig: null,
      salesCategorySub: null,
      item: { value: '', text: '', },
      itemId: null,
      monAverage: [],
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
      setTimeout(() => {
        this.onVirtualColumnsChanged(null);
      });
    });
  }

  createData(data: any[] = []): any[] {
    const result = deepCopy(data);
    const monAverage = this.queryParams.values.monAverage;
    result.forEach(row => {
      let average: any;
      let count = 0;
      if (!monAverage.length) {
        count = row.monthSalesN1 * 1 + row.monthSalesN2 * 1 + row.monthSalesN3 * 1;
        average = Math.round(count / 3);
      } else {
        for (let i = 0; i < monAverage.length; i++) {
          const di = monAverage[i];
          const monIndex = this.monAverageOptions.findIndex((item) => item.value === di);
          // const monthSalesNData = Number(row['monthSalesN' + (6 - monIndex)]);
          const monthSalesNData = Number(row['monthSalesN' + (monIndex + 1)]);
          count += monthSalesNData;
        }
        average = Math.round(count / monAverage.length);
      }
      row.monAverage = average;
      if (average) {
        // 周转天数（在库）=客户库存现有量/月均销
        row.intranTurnoverNum = Math.round(row.onhandQty * 1 / average);
        // 周转天数（确定货源）=（客户库存现有量+在途+已结转未评审+）/月均销
        row.deteTurnoverNum = Math.round((row.onhandQty * 1 + row.intranQty * 1 + row.transAppr * 1) / average);
        // 周转天数（含系统订单）=（客户库存现有量+在途+未结转未评审+已结转未评审+已评审未发货）/月均销
        row.sysTurnoverNum = Math.round(
          ( row.onhandQty * 1 +
            row.intranQty * 1 +
            row.unTransAppr * 1 +
            row.transAppr * 1 +
            row.apprUndeli * 1 ) / average
        );
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
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const columns = [
      { field: 'id', headerName: '序号', pinned: 'left', width: 120, },
      ...this.columns,
    ]
    this.expColumns = this.excelexport.setExportColumn(columns);
    const params = this.getQueryParams(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const exportData = this.createData(data);
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['客户提报当月需求'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#customerPSI');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  onCellValueChanged(event) {
    const data = event.node.data;
    if (!this.editedRows.map(item => item.id).includes(data.id)) {
      this.editedRows.push(data);
    }
  }

  // 保存
  save() {
    if (this.editedRows.length) {
      const queryDtoList = this.editedRows.map(item => ({
        id: item.id,
        monthForecastQty: item.monthForecastQty,
        monthPlanningQty: item.monthPlanningQty,
        applicationQty: item.applicationQty,
      }));

      const params = {
        queryDtoList,
      };

      this.setLoading(true);
      this.queryService.save(params).subscribe(res => {
        this.setLoading(false);
        if (res.code === 200) {
          this.editedRows.length = 0;
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败'));
        }
      });
    }
  }

  /**
   * 导入
   */
   public imports() {
    this.modal.static(CustomerPsiImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
