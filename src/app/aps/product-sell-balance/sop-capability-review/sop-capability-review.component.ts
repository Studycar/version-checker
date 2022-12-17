import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService } from 'ng-zorro-antd';
import { deepCopy } from '@delon/util';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService, HttpMethod } from 'app/modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { SupplierService } from 'app/modules/generated_module/services/supplier-service';
import { ProductSellBalanceCapabilityService } from '../product-sell-balance-capability.service';
import { SopCapabilityReviewDemandComponent } from './sop-capability-review-demand/sop-capability-review-demand.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { AppAgGridStateService } from 'app/modules/base_module/services/app-ag-gridstate-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-capability-review',
  templateUrl: './sop-capability-review.component.html',
  styleUrls: ['./sop-capability-review.component.css']
})
export class SopCapabilityReviewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public gridStateKey = 'sop-capability-review';
  public plantOptions: any[] = []; // 工厂
  public viewSuppliers: GridDataResult = { data: [], total: 0 }; // 供应商
  public viewBuyers: GridDataResult = { data: [], total: 0 }; // 采购员
  public matchManagerOptions: any[] = []; // 配套员
  public capacityTypeOptions: any[] = []; // 产能颗粒度
  public viewDimension: GridDataResult = { data: [], total: 0 }; // 维度值
  public viewItems: GridDataResult = { data: [], total: 0 }; // 物料

  public gridOptions2 = Object.assign(this.gridOptions, { pagination: false });

  public columnsItems: any[] = [
    { field: 'itemCode', title: '物料', width: '100' },
    { field: 'descriptionsCn', title: '物料描述', width: '100' }
  ];
  public columnsVendors: any[] = [
    { field: 'vendorNumber', title: '供应商编码', width: '100' },
    { field: 'vendorName', title: '供应商名称', width: '100' }
  ];
  public columnsBuyer: any[] = [
    { field: 'employeeNumber', title: '采购员编码', width: '100' },
    { field: 'fullName', title: '采购员名称', width: '100' }
  ];
  public columnsResourceDivision: any[] = [
    { field: 'divisionName', title: '维度名', width: '100' },
    { field: 'divisionDesc', title: '描述', width: '100' }
  ];
  public columnsCategories: any[] = [
    { field: 'categoryCode', title: '采购分类', width: '100' },
    { field: 'descriptions', title: '采购小类', width: '100' }
  ];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'reviewMonth', title: '检讨月份', required: true, ui: { type: UiType.monthPicker, format: 'yyyy-MM' } },
      {
        field: 'vendorNumber', title: '供应商',
        ui: {
          type: UiType.popupSelect, gridView: this.viewSuppliers, valueField: 'vendorNumber', textField: 'vendorNumber',
          columns: this.columnsVendors, eventNo: 3
        }
      },
      {
        field: 'buyer', title: '采购员',
        ui: {
          type: UiType.popupSelect, gridView: this.viewBuyers, valueField: 'employeeNumber', textField: 'fullName',
          columns: this.columnsBuyer, eventNo: 4
        }
      },
      { field: 'matchManager', title: '配套员', ui: { type: UiType.select, options: this.matchManagerOptions } },
      {
        field: 'divisionType',
        title: '产能颗粒度',
        ui: {
          type: UiType.select, options: this.capacityTypeOptions,
          ngModelChange: function () {
            // this.queryParams.values.divisionType = '';
            this.viewDimension.data = [];
            this.viewDimension.total = 0;
          }
        }
      },
      {
        field: 'divisionValue', title: '维度值',
        ui: {
          type: UiType.popupSelect,
          gridView: this.viewDimension,
          valueField: '',
          textField: '',
          columns: [],
          eventNo: 5,
          nzLoading: false
        }
      },
      {
        field: 'itemCodeStart', title: '物料编码从',
        ui: {
          type: UiType.popupSelect, gridView: this.viewItems, valueField: 'itemCode', textField: 'itemCode',
          columns: this.columnsItems, eventNo: 1, nzLoading: false
        }
      },
      {
        field: 'itemCodeEnd',
        title: '物料编码至',
        ui: {
          type: UiType.popupSelect, gridView: this.viewItems, valueField: 'itemCode', textField: 'itemCode',
          columns: this.columnsItems, eventNo: 2, nzLoading: false
        }
      }
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      reviewMonth: '',
      vendorNumber: { value: '', text: '' },
      buyer: { value: '', text: '' },
      matchManager: '',
      divisionType: '',
      divisionValue: { value: '', text: '' },
      itemCodeStart: { value: '', text: '' },
      itemCodeEnd: { value: '', text: '' },
    },
  };

  public columns = [];
  public origin_columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: { customTemplate: null }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    {
      field: 'divisionType', headerName: '产能颗粒度', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.divisionTypeFormatter(value)'
    },
    { field: 'divisionName', headerName: '维度名称', menuTabs: ['filterMenuTab'] },
    {
      field: 'demandPeriod', headerName: '月份', valueFormatter: 'ctx.demandDateFormatter(value)', menuTabs: ['filterMenuTab']
    },
    { field: 'vendorNumber', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    { field: 'pcVendors.vendorShortName', headerName: '供应商名称', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'unit', headerName: '单位' },
    { field: 'purchaseCategory', headerName: '采购分类', menuTabs: ['filterMenuTab'] },
    { field: 'supplyRatio', headerName: '供货比例', menuTabs: ['filterMenuTab'] },
    { field: 'onhand', headerName: '库存现有量', menuTabs: ['filterMenuTab'] }
  ];

  constructor(
    private commonQueryService: CommonQueryService,
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private capabilityService: ProductSellBalanceCapabilityService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private supplierService: SupplierService,
    private appAgGridStateService: AppAgGridStateService,
    public appGridStateService: AppGridStateService) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      commonQuerySrv: capabilityService,
      appAgGridStateService: appAgGridStateService,
      appGridStateService: appGridStateService
    });
    console.log('SopCapabilityReviewComponent....');
    // 重写基类属性值（必须要禁用，不禁用的话，会印象复制功能，没办法单元格复制）
    // this.gridOptions.suppressRowClickSelection = false;
  }

  ngOnInit() {
    this.origin_columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.gridData = [];
    this.headerNameTranslate(this.origin_columns);
    this.cloneQueryParams();
    this.init();
  }

  /**
   * grid加载完毕回调事件
   */
  gridLoadCallback() {
    super.gridLoadCallback();
    this.columns = deepCopy(this.origin_columns);
    (<any>this.gridApi).setColumnDefs(this.columns);
    this.agGridStateReset(this.gridStateKey);
  }

  /**
   * 初始化
   */
  protected init(): void {
    /** 工厂 */
    this.capabilityService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    // 获取服务器时间
    this.queryParams.values.reviewMonth = this.capabilityService.formatDateTime2(this.commonQueryService.addMonths(new Date(), 1), 'yyyy-MM');

    // 获取配套员
    this.capabilityService.getMatchManager({ matchManager: '' }).subscribe(rsp => {
      rsp.data.forEach(element => {
        this.matchManagerOptions.push({
          label: element,
          value: element
        });
      });
    });

    // 产品颗粒度
    this.capabilityService.GetLookupByType('SOP_CAPACITY_TYPE').subscribe(rsp => {
      rsp.Extra.forEach(item => {
        this.capacityTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }

  /**
    * 查询供应商
    * @param e
    */
  public searchVendors(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;

    this.supplierService.getVendorPageList(e.SearchValue || '', '', PageIndex, e.PageSize).subscribe(res => {
      this.viewSuppliers.data = res.data.content;
      this.viewSuppliers.total = res.data.totalElements;
    });
  }

  /**
   * 查询采购员
   * @param e
   */
  public searchBuyer(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;

    this.supplierService.getBuyerPageList(e.SearchValue || '', PageIndex, e.PageSize).subscribe(res => {
      this.viewBuyers.data = res.data.content;
      this.viewBuyers.total = res.data.totalElements;
    });
  }

  /**
   * 查询维度值
   */
  public searchDivisionValue(e: any) {
    if (!this.queryParams.values.plantCode || this.queryParams.values.plantCode === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    const PageSize = e.PageSize;
    const item = this.queryParams.defines.find(it => it.field === 'divisionValue');
    item.ui.nzLoading = true;
    console.log(this.queryParams.values.divisionType, 'this.queryParams.values.divisionType');
    // 物料
    if (this.queryParams.values.divisionType === '1') {
      this.commonQueryService.getUserPlantItemPageList(
        this.queryParams.values.plantCode, e.SearchValue, '', PageIndex, PageSize, '', 2).subscribe(res => {
          item.ui.textField = 'itemCode';
          item.ui.valueField = 'itemId';
          item.ui.columns = this.columnsItems;
          this.viewDimension.data = res.data.content;
          this.viewDimension.total = res.data.totalElements;
          item.ui.nzLoading = false;
        });
    } else if (this.queryParams.values.divisionType === '2') {
      // 类别
      this.capabilityService.getSopresourceDivision({
        plantCode: this.queryParams.values.plantCode,
        pageIndex: PageIndex,
        pageSize: PageSize
      }).subscribe(res => {
        item.ui.textField = 'divisionName';
        item.ui.valueField = 'divisionName';
        item.ui.columns = this.columnsResourceDivision;
        this.viewDimension.data = res.data.content;
        this.viewDimension.total = res.data.totalElements;
        item.ui.nzLoading = false;
      });
    } else if (this.queryParams.values.divisionType === '3') {
      // 类别
      this.capabilityService.queryItemCategories({
        categorySetCode: '采购分类',
        plantCode: this.queryParams.values.plantCode,
        pageIndex: PageIndex,
        pageSize: PageSize
      }).subscribe(res => {
        item.ui.textField = 'descriptions';
        item.ui.valueField = 'descriptions';
        item.ui.columns = this.columnsCategories;
        this.viewDimension.data = res.data.content;
        this.viewDimension.total = res.data.totalElements;
        item.ui.nzLoading = false;
      });
    } else {
      item.ui.nzLoading = false;
      this.msgSrv.warning(this.appTranslationService.translate('请先选择产能颗粒度！'));
    }
  }

  /**
   * 物料起始
   * @param e
   */
  public searchItemsFrom(e: any) {
    if (!this.queryParams.values.plantCode || this.queryParams.values.plantCode === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems({
      PLANT_CODE: this.queryParams.values.plantCode,
      ITEM_CODE: e.SearchValue,
      PageIndex: PageIndex,
      PageSize: e.PageSize
    });
  }

  /**
   * 物料结束
   * @param e 
   */
  public searchItemsTo(e: any) {
    if (!this.queryParams.values.plantCode || this.queryParams.values.plantCode === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems({
      PLANT_CODE: this.queryParams.values.plantCode,
      ITEM_CODE: e.SearchValue,
      PageIndex: PageIndex,
      PageSize: e.PageSize
    });
  }

  /**
   * 加载物料
   */
  public loadItems({ PLANT_CODE = '', ITEM_CODE = '', PageIndex = 1, PageSize = 10 }) {
    const items = ['itemCodeStart', 'itemCodeEnd'];
    this.setQueryFormUILoading(items, true);
    this.commonQueryService.getUserPlantItemPageList(
      PLANT_CODE || '',
      ITEM_CODE || '',
      '',
      PageIndex,
      PageSize
    ).subscribe(res => {
      this.viewItems.data = res.data.content;
      this.viewItems.total = res.data.totalElements;
      this.setQueryFormUILoading(items, false);
    });
  }

  /**
   * 导出
   */
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    const action = {
      url: '/api/sop/sopcapabilityreview/querySopCapabilityReview',
      method: HttpMethod.get
    };

    this.capabilityService.exportAction(
      action,
      this.getqueryParams(),
      this.excelexport,
      this,
      rsp => {
        const rspDto = new ActionResponseDto();
        this.respDataHandle(rsp.Result);
        this.expColumns = this.getExportColumns();
        rspDto.Extra = rsp.Result;
        console.log(rspDto);
        return rspDto;
      }
    );
  }

  /**
   * 根据当前的grid-columns数组，生成导出列
   */
  public getExportColumns() {
    const expColumns = [];
    this.columns.forEach(it => {
      expColumns.push({
        field: it.field,
        title: it.headerName,
        width: 200,
        locked: false
      });
    });
    console.log('getExportColumns:');
    console.log(expColumns);
    return expColumns;
  }

  /**
   * 查询数据
   */
  public query() {
    super.query();
    this.queryCommon();
  }

  /**
   * 查询公共方法
   */
  public queryCommon() {
    const params = this.getqueryParams();
    if (params === null) return;
    this.capabilityService.loadGridViewNew(
      {
        url: '/api/sop/sopcapabilityreview/querySopCapabilityReview',
        method: HttpMethod.get
      },
      params,
      this.context,
      result => {
        // 数据预处理
        console.log('pre dill with:');
        console.log(result);
        return result;
      },
      () => {
        this.respDataHandle(this.gridData);
        // this.headerNameTranslate(this.columns);
        // 必须要set空一次，再set，才能更新列名
        (<any>this.gridApi).setColumnDefs([]);
        (<any>this.gridApi).setColumnDefs(this.columns);
        // 重置个性化
        this.agGridStateReset(this.gridStateKey);
      },
    );
  }

  /**
   * 构造查询参数
   */
  public getqueryParams(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      divisionType: this.queryParams.values.divisionType,
      divisionName: this.queryParams.values.divisionValue.value,
      reviewMonth: this.capabilityService.formatDateTime2(this.queryParams.values.reviewMonth, 'yyyy-MM'),
      vendorNumber: this.queryParams.values.vendorNumber.value,
      buyer: this.queryParams.values.buyer.value,
      matchManager: this.queryParams.values.matchManager,
      itemCodeStart: this.queryParams.values.itemCodeStart.value,
      itemCodeEnd: this.queryParams.values.itemCodeEnd.value,
      isExport: true
    };
  }

  /**
   * 服务器返回数据的后处理
   */
  respDataHandle(data: any) {
    console.log('respDataHandle:');
    console.log(data);
    // 查询之后回调的方法
    if (data !== undefined && data !== null && data.length > 0) {
      // 先构造列
      const m_n_month_values = data[0].mnMonthValueList;
      if (m_n_month_values !== undefined && m_n_month_values !== null && m_n_month_values.length > 0) {
        this.columns = deepCopy(this.origin_columns);
        // 查询月份
        let monthIndex = new Date(this.queryParams.values.reviewMonth).getMonth() + 1;
        // 替换M月份的列名
        const columnFields = [
          { field: 'assigned', headerName: '月分配' },
          { field: 'capability', headerName: '月产能' },
          { field: 'gap', headerName: '月缺口' },
          { field: 'loadRate', headerName: '月负荷度(%)' }
        ];
        columnFields.forEach(item => {
          const headerName =
            monthIndex + this.appTranslationService.translate(item.headerName);
          item.headerName = headerName;
          this.columns.push(item);
        });

        console.log('m_n_month_values:');
        console.log(m_n_month_values);

        // 遍历每一个月份的列，动态构造
        let columnIndex = 0;
        m_n_month_values.forEach(item => {
          monthIndex++;
          this.columns.push({
            field: 'MNMonthValue_assigned' + columnIndex,
            headerName: monthIndex + this.appTranslationService.translate('月分配')
          });
          this.columns.push({
            field: 'MNMonthValue_capability' + columnIndex,
            headerName: monthIndex + this.appTranslationService.translate('月产能')
          });
          this.columns.push({
            field: 'MNMonthValue_gap' + columnIndex,
            headerName: monthIndex + this.appTranslationService.translate('月缺口')
          });
          this.columns.push({
            field: 'MNMonthValue_loadRate' + columnIndex,
            headerName: monthIndex + this.appTranslationService.translate('月负荷度(%)')
          });
          columnIndex++;
        });
      }

      // 再构造数据
      console.log('old this.gridData:');
      console.log(data);
      this.configGridData(data);
    } else {
      // 恢复原有的列
      this.columns = deepCopy(this.origin_columns);
    }
    console.log('new this.gridData:');
    console.log(data);
    console.log(this.columns);
  }

  /**
   * 重新配置grid的列值
   * 主要是把M_N_MONTH_INVENTORY数组的数据拷贝出来
   */
  configGridData(data: any) {
    data.forEach(rowData => {
      let columnIndex = 0;
      const m_n_month_values = rowData.mnMonthValueList;
      m_n_month_values.forEach(item => {
        for (const pro in item) {
          rowData['MNMonthValue_' + pro + columnIndex] = item[pro];
        }
        columnIndex++;
      });
    });
  }

  /**
   * 格式化需求日期
   * @param value
   */
  public demandDateFormatter(value) {
    return this.capabilityService.formatDateTime2(value, 'yyyy-MM');
  }

  public divisionTypeFormatter(value) {
    if (this.capacityTypeOptions.find(x => x.value === value)) {
      return this.capacityTypeOptions.find(x => x.value === value).label;
    }

    return value;
  }

  /**
   * 追溯需求来源
   */
  public viewDemandDetails(dataItem: any) {
    console.log('viewDemandDetails()');
    console.log(dataItem);
    const winTitle = this.appTranslationService.translate('追溯来源明细');
    const queryParams = this.getqueryParams();
    queryParams.title = winTitle;
    if (this.gridApi === undefined || this.gridApi === null) return;
    // const rows = this.gridApi.getSelectedRows();
    const rows = [dataItem];
    if (rows === undefined || rows === null || rows.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选中对应的检讨记录！'),
      );
      return;
    }
    queryParams.itemId = rows[0].itemId;
    queryParams.plantCode = rows[0].plantCode;
    this.modal.static(SopCapabilityReviewDemandComponent, { q: queryParams }, 'lg').subscribe(rsp => {
      if (rsp) {
        this.query();
      }
    });
  }

  /**
   * 页码变换
   * @param event
   */
  public onPageChanged(event: any): void { }
}
