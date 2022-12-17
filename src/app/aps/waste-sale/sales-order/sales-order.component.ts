import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { WasteSaleService } from '../waste-sale.service';
import { SalesOrderDetailWasteComponent } from './detail/detail.component';
import { SalesOrderEditWasteComponent } from './edit/edit.component';
import { SalesOrderImportWasteComponent } from './import/import.component';
import { SalesOrderQueryService } from './query.service';

@Component({
  selector: 'sales-order',
  templateUrl: './sales-order.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderWasteComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public http: _HttpClient,
    private appconfig: AppConfigService,
    public queryService: SalesOrderQueryService,
    public wasteSaleService: WasteSaleService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  salesOrderTypeOptions: any = []; // PS_SALES_ORDER_TYPE
  salesOrderStateOptions: any = [];  // PS_SALES_ORDER_STATE
  currencyOptions: any = []; // PS_CURRENCY
  YesNoOptions: any = []; // PS_YES_NOT
  productCategoryOptions: any[] = [];
  plantOptions: any[] = [];
  isCompute: boolean = false;

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单号'
    },
    {
      field: 'salesOrderDate',
      width: 120,
      headerName: '订单日期'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注'
    },
    {
      field: 'salesOrderType',
      width: 120,
      headerName: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cklb',
      width: 120,
      headerName: '出库类别',
    },
    {
      field: 'cklbRemarks',
      width: 120,
      headerName: '出库类别说明',
    },
    {
      field: 'salesOrderState',
      width: 120,
      headerName: '销售订单状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'salesmanCode',
      width: 120,
      headerName: '业务员编码'
    },
    {
      field: 'salesman',
      width: 120,
      headerName: '业务员'
    },
    {
      field: 'departmentCode',
      width: 120,
      headerName: '部门编码',
    },
    {
      field: 'department',
      width: 120,
      headerName: '部门',
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称',
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'currency',
      width: 120,
      headerName: '币种',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'pickUp',
      width: 120,
      headerName: '是否自提',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'taxIncluded',
      width: 120,
      headerName: '是否含税',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'exchangeRate',
      width: 120,
      headerName: '汇率',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesOrderTypeOptions;
        break;
      case 2:
        options = this.salesOrderStateOptions;
        break;
      case 3:
        options = this.currencyOptions;
        break;
      case 4:
        options = this.YesNoOptions;
        break;
      case 6:
        options = this.productCategoryOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'salesOrderCode', title: '销售订单号', ui: { type: UiType.text } },
      // { field: 'detailedNum', title: '销售订单明细行号', ui: { type: UiType.text } },
      { field: 'dateRange', title: '订单日期', ui: { type: UiType.dateRange } },
      { field: 'salesOrderType', title: '销售类型', ui: { type: UiType.select, options: this.salesOrderTypeOptions } },
      { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text, } }, // 改成搜索框
      { field: 'salesman', title: '业务员', ui: { type: UiType.text, } },  // 改成搜索框
      { field: 'contractCode', title: '合同号', ui: { type: UiType.text } }, // 改成搜索框
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      salesOrderCode: '',
      detailedNum: '',
      dateRange: [],
      salesOrderType: null,
      cusAbbreviation: '',
      salesman: '',
      contractCode: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      salesOrderCode: '',
      detailedNum: '',
      dateRange: [],
      salesOrderType: null,
      cusAbbreviation: '',
      salesman: '',
      contractCode: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_SALES_ORDER_STATE': this.salesOrderStateOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
    const res = await this.queryService.GetLookupByTypeLang('PS_SALES_ORDER_TYPE', this.appconfig.getLanguage()).toPromise();
    this.wasteSaleService.getSaleType(res.Extra, this.salesOrderTypeOptions);
    await this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.salesOrderDate = this.queryService.formatDate(this.queryParams.values.dateRange[0]);
    params.endSalesOrderDate = this.queryService.formatDate(this.queryParams.values.dateRange[1]);
    delete params.dateRange;
    return {
      ...params,
      saleFlag: 'N',
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  isVisible: boolean = false;
  plantCode = null;
  productCategory = null;

  handleCancel() {
    this.isVisible = false;
    this.plantCode = null;
    this.productCategory = null;
  }

  handleOk() {
    if(this.isCompute) {
      this.queryService.compute(this.plantCode, this.productCategory).subscribe(res => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.isVisible = false;
          this.plantCode = null;
          this.productCategory = null;
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      this.queryService.task(this.plantCode, this.productCategory).subscribe(res => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.isVisible = false;
          this.plantCode = null;
          this.productCategory = null;
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }

  geneSaleContract() {
    this.isVisible = true;
    this.isCompute = false;
  }

  computePrice() {
    this.isVisible = true;
    this.isCompute = true;
  }

  examine(dataItem) {
    this.queryService.examine(dataItem.id).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('更新成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      SalesOrderImportWasteComponent,
      {
        options: {
          salesOrderTypeOptions: this.salesOrderTypeOptions,
          salesOrderStateOptions: this.salesOrderStateOptions,
          currencyOptions: this.currencyOptions,
          YesNoOptions: this.YesNoOptions,
        }
      },
      'md'
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  add(dataItem?: any) {
    this.modal.static(
      SalesOrderEditWasteComponent,
      {
        i: dataItem === undefined ? { salesOrderCode: null } : dataItem,
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }
  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 打开明细
   * @param dataItem 
   */
  showDetail(dataItem) {
    this.modal.static(
      SalesOrderDetailWasteComponent,
      {
        salesOrderCode: dataItem.salesOrderCode,
        cusCode: dataItem.cusCode,
        cusAbbreviation: dataItem.cusAbbreviation,
        productCategory: dataItem.productCategory,
        plantCode: dataItem.plantCode,
        cklb: dataItem.cklb,
        cklbRemarks: dataItem.cklbRemarks,
        salesOrder: dataItem,
      }
    ).subscribe(() => {})
  }

  /**
   * 打开修改记录
   * @param dataItem 
   */
  showChangeDetail(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_sales_order_modify_record',
          myAgGridRowKey: 'PS_SALES_ORDER_MODIFY_RECORD',
        },
        queryParamsValue: {
          salesOrderCode: dataItem.salesOrderCode,
        },
        exportFileName: '销售订单',
        tableColumns: this.columns.filter(col => col.colId === undefined),
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  expColumnsOptions: any[] = [
    { field: 'salesOrderState', options: this.salesOrderStateOptions },
    { field: 'salesOrderType', options: this.salesOrderTypeOptions },
    { field: 'pickUp', options: this.YesNoOptions },
    { field: 'taxIncluded', options: this.YesNoOptions },
    { field: 'currency', options: this.currencyOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }
}
