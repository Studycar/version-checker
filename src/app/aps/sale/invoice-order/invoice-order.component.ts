import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { InvoiceOrderDetailComponent } from './detail/detail.component';
import { InvoiceOrderEditComponent } from './edit/edit.component';
import { InvoiceOrderImportComponent } from './import/import.component';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';
import { InvoiceOrderQueryService } from './query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'invoice-order',
  templateUrl: './invoice-order.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public http: _HttpClient,
    private appconfig: AppConfigService,
    public queryService: InvoiceOrderQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  // 绑定客户
  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码'
    },
    {
      field: 'plantCode',
      width: 120,
      title: '所属公司'
    },
    {
      field: 'creditCus',
      width: 120,
      title: '信用单位'
    },
    {
      field: 'affiliatedCus',
      width: 120,
      title: '所属客户'
    },
    {
      field: 'cusState',
      width: 120,
      title: '客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusGrade',
      width: 120,
      title: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'cusType',
      width: 120,
      title: '客户类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'cusName',
      width: 120,
      title: '客户名称'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称'
    },
    {
      field: 'taxNum',
      width: 120,
      title: '税号'
    },
    {
      field: 'contact',
      width: 120,
      title: '联系人'
    },
    {
      field: 'region',
      width: 120,
      title: '地区分类',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'address',
      width: 120,
      title: '地址'
    },
    {
      field: 'telNum',
      width: 120,
      title: '联系电话'
    },
    {
      field: 'bank',
      width: 120,
      title: '开户银行'
    },
    {
      field: 'bankNum',
      width: 120,
      title: '银行账号'
    },
    {
      field: 'bankArchives',
      width: 120,
      title: '银行档案'
    },
    {
      field: 'initialCredit',
      width: 120,
      title: '客户初始额度'
    },
    {
      field: 'domestic',
      width: 120,
      title: '是否国内',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'currency',
      width: 120,
      title: '币种',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'credit',
      width: 120,
      title: '信用额度'
    },
    {
      field: 'zyQuota',
      width: 120,
      title: '占用额度'
    },
    {
      field: 'temCredit',
      width: 120,
      title: '临时信用额度'
    },
    {
      field: 'balance',
      width: 120,
      title: '账户余额'
    },
    {
      field: 'salesmanCode',
      width: 120,
      title: '业务员编码',
    },
    {
      field: 'salesman',
      width: 120,
      title: '业务员',
    },
    {
      field: 'departmentCode',
      width: 120,
      title: '部门编码',
    },
    {
      field: 'department',
      width: 120,
      title: '分管部门',
    },
    {
      field: 'creditControl',
      width: 120,
      title: '是否控制信用额度',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'tax',
      width: 120,
      title: '税率'
    },
    {
      field: 'disableTime',
      width: 120,
      title: '停用时间'
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因'
    },
  ];
  customersOptions = {
    1: { 'PS_CUSTOMER_STATUS': [] },
    2: { 'PS_CUS_GRADE': [] },
    3: { 'CUS_TYPE': [] },
    4: { 'PS_CUS_REGION': [] },
    5: { 'PS_CUS_DOMESTIC': [] },
    6: { 'PS_CURRENCY': [] },
    7: { 'PS_YES_NOT': [] },
  };

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
      field: 'invoiceBillCode',
      width: 120,
      headerName: '发货单号'
    },
    {
      field: 'invoiceBillDate',
      width: 120,
      headerName: '发货日期'
    },
    {
      field: 'invoiceBillState',
      width: 120,
      headerName: '发货单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
    },
    {
      field: 'cusName',
      width: 120,
      headerName: '客户名称'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'whCode',
      width: 120,
      headerName: '仓库编码',
    },
    {
      field: 'warehouse',
      width: 120,
      headerName: '仓库名称',
    },
    {
      field: 'carShipNo',
      width: 120,
      headerName: '车（船）号',
    },
    {
      field: 'salesman',
      width: 120,
      headerName: '业务员',
    },
    {
      field: 'exchangeRate',
      width: 120,
      headerName: '汇率',
    },
    {
      field: 'currency',
      width: 120,
      headerName: '币种',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'pricingType',
      width: 120,
      headerName: '计价方式',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'salesOrderType',
      width: 120,
      headerName: '销售类型',
    },
    {
      field: 'salesOrderTypeRemarks',
      width: 120,
      headerName: '销售类型说明',
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
      field: 'summaryQuantity',
      width: 120,
      headerName: '汇总数量',
    },
    {
      field: 'summaryMoney',
      width: 120,
      headerName: '汇总含税金额',
    },
    {
      field: 'summaryLiLunWeigthKg',
      width: 120,
      headerName: '汇总理重',
    },
    {
      field: 'haveContract',
      width: 120,
      headerName: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  invoiceStateOptions: any[] = [];
  currencyOptions: any[] = [];
  productCategoryOptions: any[] = [];
  plantOptions: any[] = [];
  prodTypeOptions: any[] = [];
  pricingTypeOptions: any[] = [];
  YesNoOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.invoiceStateOptions;
        break;
      case 2:
        options = this.currencyOptions;
        break;
      case 3:
        options = this.prodTypeOptions;
        break;
      case 4:
        options = this.pricingTypeOptions;
        break;
      case 5:
        options = this.YesNoOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'invoiceBillCode', title: '发货单号', ui: { type: UiType.text } },
      { field: 'invoiceBillState', title: '发货单状态', ui: { type: UiType.select, options: this.invoiceStateOptions } },
      { field: 'carShipNo', title: '车（船）号', ui: { type: UiType.text } },
      { field: 'dateRange', title: '发货日期', ui: { type: UiType.dateRange } },
      // 通过客户简称转化客户编码
      { field: 'cusCode', title: '客户简称', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'cusCode', 
          textField: 'cusAbbreviation', 
          name: 'cusCode',
          gridView: this.gridViewCustoms, 
          columns: this.columnsCustoms, 
          popOptions: this.customersOptions, 
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
            TextChangedEventNo: 3,
          }
        }  
      },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      invoiceBillCode: '',
      invoiceBillState: null,
      carShipNo: '',
      dateRange: [],
      cusCode: {value:'', text:''}
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      invoiceBillCode: '',
      invoiceBillState: null,
      carShipNo: '',
      dateRange: [],
      cusCode: {value:'', text:''}
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
      'PS_INVOICE_STATE': this.invoiceStateOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());

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
    params.invoiceBillDate = this.queryService.formatDate(this.queryParams.values.dateRange[0]);
    params.endInvoiceBillDate = this.queryService.formatDate(this.queryParams.values.dateRange[1]);
    params.cusCode = this.queryParams.values.cusCode.value;
    delete params.dateRange;
    params.invoiceFlag = 'Y';
    return {
      ...params,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  isVisible: boolean = false;
  plantCode = this.appconfig.getActivePlantCode();
  productCategory = null;
  handleOk() {
    this.queryService.task(this.plantCode, this.productCategory).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.isVisible = false;
        this.plantCode = this.appconfig.getActivePlantCode();
        this.productCategory = null;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
    this.productCategory = null;
  }

  add(dataItem?: any) {
    this.modal.static(
      InvoiceOrderEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
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

  examine(dataItem) {
    this.queryService.examine(dataItem.id).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg.replace(/;\n/g,'<br/>')), {
          nzDuration: 30000
        });
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      InvoiceOrderImportComponent,
      {
        options: {
        }
      },
      'md'
    ).subscribe((value) => {
      this.query();
    })
  }

  showDetail(dataItem) {
    this.modal.static(
      InvoiceOrderDetailComponent,
      {
        invoiceBillCode: dataItem.invoiceBillCode,
        cusCode: dataItem.cusCode,
        whCode: dataItem.whCode,
        plantCode: dataItem.plantCode,
        invoiceBillState: dataItem.invoiceBillState,
        cklb: dataItem.cklb,
        cklbRemarks: dataItem.cklbRemarks,
        haveContract: dataItem.haveContract,
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
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
          myAgGridState: 'ps_invoice_bill_history',
          myAgGridRowKey: 'PS_INVOICE_BILL_HISTORY',
        },
        queryParamsValue: {
          invoiceBillCode: dataItem.invoiceBillCode,
        },
        exportFileName: '发货单',
        tableColumns: [{
          field: 'zxdz',
          headerName: '执行动作',
          width: 100
        }, ...this.columns.filter(col => col.colId === undefined)],
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  /**
   * 客户弹出查询
   * @param {any} e
   */
   public searchCustoms(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustoms(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

 /**
   * 加载客户
   * @param {string} cusAbbreviation  客户简称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadCustoms(
    cusAbbreviation: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getCustoms({
        plantCode: this.queryParams.values.plantCode,
        cusAbbreviation: cusAbbreviation,
        isCusCodeNotNull: true,
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.queryParams.values.cusCode.value = e.Row.cusCode;
    this.queryParams.values.cusCode.text = e.Row.cusAbbreviation;
  }

  onCustomsTextChanged(event: any) {
    const cusAbbreviation = event.Text.trim();
    if(cusAbbreviation == '') { 
      this.queryParams.values.cusCode = { value:'', text:'' };
      return; 
    } else {
      this.queryService
      .getCustoms({
        plantCode: this.queryParams.values.plantCode,
        cusAbbreviation: cusAbbreviation,
        isCusCodeNotNull: true,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.queryParams.values.cusCode.value = res.data.content[0].cusCode;
          this.queryParams.values.cusCode.text = res.data.content[0].cusAbbreviation;
        } else {
          this.msgSrv.error(this.appTranslationService.translate('客户简称无效'))
          this.queryParams.values.cusCode = { value:'', text:'' };
        }
      });
    }
  }

  expColumnsOptions: any[] = [
    { field: 'invoiceBillState', options: this.invoiceStateOptions },
    { field: 'currency', options: this.currencyOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'pricingType', options: this.pricingTypeOptions },
    { field: 'haveContract', options: this.YesNoOptions },
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

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
