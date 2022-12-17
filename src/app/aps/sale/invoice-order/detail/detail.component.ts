import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { InvoiceOrderQueryService } from "../query.service";
import { InvoiceOrderDetailedEditComponent } from "./edit/edit.component";


@Component({
  selector: 'invoice-order-detail',
  templateUrl: './detail.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderDetailComponent extends CustomBaseContext implements OnInit {

  invoiceBillCode: string = '';
  cusCode: string = '';
  whCode: string = '';
  plantCode: string = '';
  invoiceBillState: string = '';
  cklb: string = '';
  cklbRemarks: string = '';
  haveContract: string = '';
  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: InvoiceOrderQueryService,
    public modalHelper: ModalHelper,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

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
      field: 'detailedNum',
      width: 120,
      headerName: '明细行号'
    },
    {
      field: 'state',
      width: 120,
      headerName: '明细状态',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
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
      field: 'salesOrderType',
      width: 120,
      headerName: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单号',
    },
    {
      field: 'salesOrderNum',
      width: 120,
      headerName: '销售订单行',
    },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同号',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'itemDescription',
      width: 120,
      headerName: '物料描述',
    },
    {
      field: 'standardType',
      width: 120,
      headerName: '规格型号',
    },
    {
      field: 'unit',
      width: 120,
      headerName: '重量单位',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '批号',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
    },
    {
      field: 'steelStandart',
      width: 120,
      headerName: '规格尺寸',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
    },
    {
      field: 'distributionWarehouse',
      width: 120,
      headerName: '目的地',
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '含税价',
    },
    {
      field: 'fixedPrice',
      width: 120,
      headerName: '限价'
    },
    {
      field: 'money',
      width: 120,
      headerName: '金额',
    },
    {
      field: 'taxRate',
      width: 120,
      headerName: '税率'
    },
    {
      field: 'taxAmount',
      width: 120,
      headerName: '税额',
    },
    {
      field: 'coatingUpCode',
      width: 120,
      headerName: '面膜存货编码'
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜存货描述'
    },
    {
      field: 'coatingDownCode',
      width: 120,
      headerName: '底膜存货编码'
    },
    {
      field: 'coatingDownName',
      width: 120,
      headerName: '底膜存货描述'
    },
    {
      field: 'paper',
      width: 120,
      headerName: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额',
    },
    {
      field: 'poundWeugthKg',
      width: 120,
      headerName: '毛重'
    },
    {
      field: 'lilunWeigthKg',
      width: 120,
      headerName: '理重',
    },
    {
      field: 'toleranceThickness',
      width: 120,
      headerName: '公差'
    },
    {
      field: 'poundsLost',
      width: 120,
      headerName: '已输磅重'
    },
    {
      field: 'label',
      width: 120,
      headerName: '标签规格'
    },
    {
      field: 'warehouse',
      width: 120,
      headerName: '仓库'
    },
    {
      field: 'thickness',
      width: 120,
      headerName: '实厚',
    },
    {
      field: 'weigth',
      width: 120,
      headerName: '实宽',
    },
    {
      field: 'unitWeigthKg',
      width: 120,
      headerName: '单重'
    },
    {
      field: 'weigthKg',
      width: 120,
      headerName: '净重',
    },
    {
      field: 'priceKg',
      width: 120,
      headerName: '价格'
    },
    {
      field: 'deliveryMethod',
      width: 120,
      headerName: '提货方式'
    },
    {
      field: 'packingMethod',
      width: 120,
      headerName: '装箱方式',
    },
    {
      field: 'thWarehouse',
      width: 120,
      headerName: '提货仓库'
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基价'
    },
    {
      field: 'markUp',
      width: 120,
      headerName: '加价'
    },
    {
      field: 'exchangeRate',
      width: 120,
      headerName: '汇率'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注'
    },
    {
      field: 'issueOrderCode',
      width: 120,
      headerName: '出库单号'
    },
    {
      field: 'collectionAgreement',
      width: 120,
      headerName: '收款协议'
    },
    {
      field: 'salesman',
      width: 120,
      headerName: '业务员'
    },
    {
      field: 'department',
      width: 120,
      headerName: '部门'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'baleNo',
      width: 120,
      headerName: '捆包号'
    },
    {
      field: 'specialMarkup',
      width: 120,
      headerName: '特殊加价'
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '数量单位'
    },
    {
      field: 'unitCode',
      width: 120,
      headerName: '单位编码'
    },
    {
      field: 'positionCode',
      width: 120,
      headerName: '库位编码'
    },
    {
      field: 'whCode',
      width: 120,
      headerName: '实体仓库编码'
    },
    {
      field: 'currency',
      width: 120,
      headerName: '币种',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'haveContract',
      width: 120,
      headerName: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间',
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人',
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间',
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人',
    },
  ];
  salesOrderTypeOptions: any[] = [];
  currencyOptions: any[] = [];
  cklbOptions: any[] = [];
  coatingOptions: any[] = [];
  detailedStateOptions: any[] = [];
  unitOptions: any[] = [];
  YesNoOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesOrderTypeOptions;
        break;
      case 2:
        options = this.currencyOptions;
        break;
      case 3:
        options = this.cklbOptions;
        break;
      case 4:
        options = this.detailedStateOptions;
        break;
      case 5:
        options = this.coatingOptions;
        break;
      case 6:
        options = this.unitOptions;
        break;
      case 7:
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
      { field: 'salesOrderCode', title: '销售订单号', ui: { type: UiType.text } },
      { field: 'stockCode', title: '存货编码', ui: { type: UiType.text } },
      { field: 'batchNum', title: '批号', ui: { type: UiType.text } },
      { field: 'state', title: '发货单明细行状态', ui: { type: UiType.select, options: this.detailedStateOptions } },
      { field: 'creationDateRange', title: '创建日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      invoiceBillCode: '',
      salesOrderCode: '',
      stockCode: '',
      batchNum: '',
      state: null,
      creationDateRange: [],
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      invoiceBillCode: this.invoiceBillCode,
      salesOrderCode: '',
      stockCode: '',
      batchNum: '',
      state: null,
      creationDateRange: [],
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryParams.values.invoiceBillCode = this.invoiceBillCode;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_INVOICE_CKLB': this.cklbOptions,
      'PS_INVOICE_DETAILED_STATE': this.detailedStateOptions,
      'PS_COATING': this.coatingOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'invoiceBillCode';
    // 需要统计的列数组
    const fields = ['lilunWeigthKg', 'weigthKg', 'quantity', 'amountIncludingTax', 'taxAmount', 'money'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  httpAction = { url: this.queryService.queryDetailedUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.creationDate =  this.queryService.formatDate(this.queryParams.values.creationDateRange[0]);
    params.endCreationDate =  this.queryService.formatDate(this.queryParams.values.creationDateRange[1]);
    delete params.creationDateRange;
    return {
      ...params,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  }

  add(dataItem?: any) {
    this.modalHelper.static(
      InvoiceOrderDetailedEditComponent,
      {
        i: dataItem === undefined ? { id: null, invoiceBillCode: this.invoiceBillCode } : dataItem,
        cusCode: this.cusCode,
        whCode: this.whCode,
        plantCode: this.plantCode,
        cklb: this.cklb,
        cklbRemarks: this.cklbRemarks,
        haveContract: this.haveContract,
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
    this.queryService.deleteDetailed(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
  
  /**
   * 打开修改记录
   * @param dataItem 
   */
   showChangeDetail(dataItem) {
    this.modalHelper.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryDetailChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_invoice_bill_detailed_history',
          myAgGridRowKey: 'PS_INVOICE_BILL_DETAILED_HISTORY',
        },
        queryParamsValue: {
          detailedNum: dataItem.detailedNum,
        },
        exportFileName: '发货单明细',
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

  expColumnsOptions: any[] = [
    { field: 'salesOrderType', options: this.salesOrderTypeOptions },
    { field: 'currency', options: this.currencyOptions },
    { field: 'cklb', options: this.cklbOptions },
    { field: 'state', options: this.detailedStateOptions },
    { field: 'coating', options: this.coatingOptions },
    { field: 'unit', options: this.unitOptions },
    { field: 'paper', options: this.YesNoOptions },
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
