import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { InvoiceOrderDetailWasteComponent } from './detail/detail.component';
import { InvoiceOrderEditWasteComponent } from './edit/edit.component';
import { InvoiceOrderImportWasteComponent } from './import/import.component';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';
import { InvoiceOrderQueryService } from './query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'invoice-order',
  templateUrl: './invoice-order.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderWasteComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
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
      field: 'contractCode',
      width: 120,
      title: '合同编号'
    },
    {
      field: 'contractState',
      width: 120,
      title: '合同状态',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'contractType',
      width: 120,
      title: '合同类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'affiliatedContract',
      width: 120,
      title: '所属合同'
    },
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'attribute4',
      title: '客户简称',
      width: '100'
    },
    {
      field: 'signingDate',
      width: 120,
      title: '签订日期',
    },
    {
      field: 'affiliatedMonth',
      width: 120,
      title: '合同所属月份'
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
    },
    {
      field: 'standards',
      width: 120,
      title: '规格',
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
    },
    {
      field: 'basePrice',
      width: 120,
      title: '基价'
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量（张）'
    },
    {
      field: 'weightTon',
      width: 120,
      title: '重量（吨）'
    },
    {
      field: 'money',
      width: 120,
      title: '金额'
    },
    {
      field: 'remarks',
      width: 120,
      title: '锁价备注'
    },
    {
      field: 'deposit',
      width: 120,
      title: '锁价定金'
    },
    {
      field: 'depositRatio',
      width: 120,
      title: '定金比例（%）'
    },
    {
      field: 'plantCode',
      width: 200,
      title: '供方',
    },
    {
      field: 'prodName',
      width: 120,
      title: '产品名称',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'quantityDj',
      width: 120,
      title: '合同已分货量'
    },
    {
      field: 'quantitySy',
      width: 120,
      title: '合同待分货量'
    },
    {
      field: 'surfaceState',
      width: 120,
      title: '表面状态'
    },
    {
      field: 'deliveryDate',
      width: 120,
      title: '交货日期'
    },
    {
      field: 'deliveryPlace',
      width: 120,
      title: '交货地点'
    },
    {
      field: 'cusContractCode',
      width: 120,
      title: '客户合同号'
    },
    {
      field: 'signPlace',
      width: 120,
      title: '签订地点'
    },
    {
      field: 'amountWithoutTax',
      width: 120,
      title: '未税金额货款'
    },
    {
      field: 'taxAmount',
      width: 120,
      title: '税额'
    },
    {
      field: 'attribute3',
      width: 120,
      title: '存货编码'
    },
    {
      field: 'attribute5',
      width: 120,
      title: '等级'
    },
    // {
    //   field: 'rebateMarkup',
    //   width: 120,
    //   title: '返利加价'
    // },
    {
      field: 'material',
      width: 120,
      title: '厚/薄料',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'changeRemarks',
      width: 120,
      title: '变更备注'
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因'
    },
  ];
  customersOptions = {
    3: { 'PS_CONTRACT_STATE': [] },
    4: { 'PS_CONTRACT_TYPE': [] },
    5: { 'HOUBO': [] },
    6: { 'PS_PROD_NAME': [] },
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
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
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
      field: 'remarks',
      width: 120,
      headerName: '备注',
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
  invoiceStateOptions: any[] = [];
  currencyOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.invoiceStateOptions;
        break;
      case 2:
        options = this.currencyOptions;
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
          textField: 'attribute4', 
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
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
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
    const params:any = { ...this.queryParams.values };
    params.invoiceBillDate = this.queryService.formatDate(this.queryParams.values.dateRange[0]);
    params.endInvoiceBillDate = this.queryService.formatDate(this.queryParams.values.dateRange[1]);
    delete params.dateRange;
    params.cusCode = this.queryParams.values.cusCode.value;
    return {
      ...params,
      invoiceFlag: 'N',
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      InvoiceOrderEditWasteComponent,
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
      InvoiceOrderImportWasteComponent,
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
      InvoiceOrderDetailWasteComponent,
      {
        invoiceBillCode: dataItem.invoiceBillCode,
        cusCode: dataItem.cusCode,
        plantCode: dataItem.plantCode,
        invoiceBillState: dataItem.invoiceBillState,
        cklb: dataItem.cklb,
        cklbRemarks: dataItem.cklbRemarks,
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
      .getWasteContracts({
        plantCode: this.queryParams.values.plantCode,
        attribute4: cusAbbreviation,
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
    this.queryParams.values.cusCode.text = e.Row.attribute4;
  }

  onCustomsTextChanged(event: any) {
    const cusAbbreviation = event.Text.trim();
    if(cusAbbreviation == '') { 
      this.queryParams.values.cusCode = { value:'', text:'' };
      return; 
    } else {
      this.queryService
      .getWasteContracts({
        plantCode: this.queryParams.values.plantCode,
        attribute4: cusAbbreviation,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.queryParams.values.cusCode.value = res.data.content[0].cusCode;
          this.queryParams.values.cusCode.text = res.data.content[0].attribute4;
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
