import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { SalesOrderQueryService } from "../query.service";
import { SalesOrderDetailEditWasteComponent } from "./edit/edit.component";
import { SalesOrderDetailSpecialPriceWasteComponent } from "./special-price/special-price.component";

@Component({
  selector: 'planschedule-hw-sales-order-detail',
  templateUrl: './detail.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderDetailWasteComponent extends CustomBaseContext implements OnInit {
  packTypeOptions: any = []; 
  salesOrderDetailedStateOptions: any = [];  // PS_SALES_ORDER_DETAILED_STATE
  subsectionStateOptions: any = [];
  plantOptions: any = [];
  cusGradeOptions: any = []; 
  prodTypeOptions: any = []; 
  YesNoOptions: any = []; // PS_YES_NOT
  transportTypeOptions: any = []; 
  salesOrderCode = null;

  cusCode: string = '';
  cusAbbreviation: string = '';
  productCategory: string = '';
  plantCode: string = '';
  cklb: string = '';
  cklbRemarks: string = '';
  salesOrder: any = {};

  count = 0;
  summaryQuantity = 0;
  summaryMoney = 0;

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: SalesOrderQueryService,
    public http: _HttpClient,
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
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单号'
    },
    {
      field: 'detailedNum',
      width: 120,
      headerName: '明细行号'
    },
    {
      field: 'salesOrderDetailedState',
      width: 120,
      headerName: '明细状态',
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
      field: 'plantCode',
      width: 120,
      headerName: '工厂'
    },
    // {
    //   field: 'cusOrderCode',
    //   width: 120,
    //   headerName: '客户订单号'
    // },
    // {
    //   field: 'orderDate',
    //   width: 120,
    //   headerName: '下单日期'
    // },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同号',
    },
    {
      field: 'reason',
      width: 120,
      headerName: '驳回原因',
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
      field: 'distributionWarehouse',
      width: 120,
      headerName: '配送公仓'
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '批号'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种'
    },
    {
      field: 'standardsType',
      width: 120,
      headerName: '规格型号',
    },
    {
      field: 'steelStandart',
      width: 120,
      headerName: '钢材规格尺寸',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '单位',
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
      headerName: '面膜编码'
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜描述'
    },
    {
      field: 'coatingDownCode',
      width: 120,
      headerName: '底膜编码'
    },
    {
      field: 'coatingDownName',
      width: 120,
      headerName: '底膜描述'
    },
    {
      field: 'paper',
      width: 120,
      headerName: '垫纸',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额',
    },
    // {
    //   field: 'processingReq',
    //   width: 120,
    //   headerName: '加工要求'
    // },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'sample',
      width: 120,
      headerName: '样本'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
    },
    {
      field: 'label',
      width: 120,
      headerName: '标签规格'
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
    },
    // {
    //   field: 'plannedDeliveryDate',
    //   width: 120,
    //   headerName: '计划交期'
    // },
    {
      field: 'thickness',
      width: 120,
      headerName: '实厚',
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
      field: 'priceByWeight',
      width: 120,
      headerName: '按重量计价',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'priceKg',
      width: 120,
      headerName: '价格（KG）'
    },
    {
      field: 'deliveryMethod',
      width: 120,
      headerName: '提货方式'
    },
    // {
    //   field: 'packingMethod',
    //   width: 120,
    //   headerName: '装箱方式',
    // },
    {
      field: 'pickWarehouse',
      width: 120,
      headerName: '提货仓库'
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基价'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注'
    },
    {
      field: 'depositRatio',
      width: 120,
      headerName: '定金比率'
    },
    {
      field: 'deposit',
      width: 120,
      headerName: '定金'
    },
    {
      field: 'description',
      width: 120,
      headerName: '内部说明'
    },
    {
      field: 'cusAddress',
      width: 120,
      headerName: '客户地址'
    },
    {
      field: 'toleranceThickness',
      width: 120,
      headerName: '厚度下工差'
    },
    {
      field: 'poundsLost',
      width: 120,
      headerName: '已输磅重'
    },
    {
      field: 'warehouse',
      width: 120,
      headerName: '仓库'
    },
    {
      field: 'location',
      width: 120,
      headerName: '仓位'
    },
    {
      field: 'width',
      width: 120,
      headerName: '实宽',
    },
    {
      field: 'poundWeugthKg',
      width: 120,
      headerName: '磅重（KG）'
    },
    {
      field: 'lilunWeigthKg',
      width: 120,
      headerName: '理重（KG）',
    },
    {
      field: 'markUp',
      width: 120,
      headerName: '加价',
    },
    {
      field: 'processFee',
      width: 120,
      headerName: '加工费',
    },
    {
      field: 'specialMarkup',
      width: 120,
      headerName: '特殊加价',
    },
    {
      field: 'subsectionState',
      width: 120,
      headerName: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'rewinding',
      width: 120,
      headerName: '是否重卷',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      headerName: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    // {
    //   field: 'transportType',
    //   width: 120,
    //   headerName: '运输方式',
    //   valueFormatter: 'ctx.optionsFind(value,4).label'
    // },
    {
      field: 'coilInnerDia',
      width: 120,
      headerName: '钢卷内径',
    },
    {
      field: 'packType',
      width: 120,
      headerName: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    // {
    //   field: 'fullVolume',
    //   width: 120,
    //   headerName: '是否重卷',
    //   valueFormatter: 'ctx.optionsFind(value,2).label'
    // },
    // {
    //   field: 'slittingQuantity',
    //   width: 120,
    //   headerName: '分条数量',
    // },
    {
      field: 'cccd',
      width: 120,
      headerName: '超长超短',
    },
    // {
    //   field: 'cusGrade',
    //   width: 120,
    //   headerName: '客户等级',
    //   valueFormatter: 'ctx.optionsFind(value,6).label'
    // },
    // {
    //   field: 'settleStyle',
    //   width: 120,
    //   headerName: '结算方式',
    // },
    // {
    //   field: 'salesStrategy',
    //   width: 120,
    //   headerName: '销售策略',
    // },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesOrderDetailedStateOptions;
        break;
      case 2:
        options = this.YesNoOptions;
        break;
      case 3:
        options = this.subsectionStateOptions;
        break;
      case 4:
        options = this.transportTypeOptions;
        break;
      case 5:
        options = this.packTypeOptions;
        break;
      case 6:
        options = this.cusGradeOptions;
        break;
      case 7:
        options = this.prodTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'salesOrderCode', title: '销售订单号', ui: { type: UiType.text } },
      { field: 'detailedNum', title: '销售订单明细行号', ui: { type: UiType.text } },
      { field: 'salesOrderDate', title: '订单日期', ui: { type: UiType.date } },
      // { field: 'salesOrderType', title: '销售类型', ui: { type: UiType.select, options: this.salesOrderTypeOptions } },
      { field: 'cusCode', title: '客户编码', ui: { type: UiType.text, } }, // 改成搜索框
      { field: 'salesman', title: '业务员', ui: { type: UiType.text, } },  // 改成搜索框
      // { field: 'cusType', title: '客户类型', ui: { type: UiType.select, options: this.cusTypeOptions } },
      { field: 'contractCode', title: '合同号', ui: { type: UiType.text } }, // 改成搜索框
      { field: 'batchNum', title: '批号', ui: { type: UiType.text } }, // 改成搜索框
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      salesOrderCode: '',
      detailedNum: '',
      salesOrderDate: '',
      // salesOrderType: null,
      cusCode: '',
      cusAbbreviation: '',
      salesman: '',
      // cusType: null,
      contractCode: '',
      batchNum: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      salesOrderCode: this.salesOrderCode,
      detailedNum: '',
      salesOrderDate: '',
      // salesOrderType: null,
      cusCode: '',
      cusAbbreviation: '',
      salesman: '',
      // cusType: null,
      contractCode: '',
      batchNum: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryParams.values.salesOrderCode = this.salesOrderCode;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_SALES_ORDER_DETAILED_STATE': this.salesOrderDetailedStateOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryDetailUrl, method: 'GET' }
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
      this.dataPreFilter.bind(this)
    )
  }

  dataPreFilter(res) {
    if(res.extra) {
      this.summaryQuantity = res.extra.summaryQuantity || 0;
      this.summaryMoney = res.extra.summaryMoney || 0;
      this.count = res.extra.count || 0;
    } else {
      this.summaryQuantity = 0;
      this.summaryMoney = 0;
      this.count = 0;
    }
    return res;
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.salesOrderDate = this.queryService.formatDate(this.queryParams.values.salesOrderDate);
    params.saleFlag = 'N';
    params.export = isExport;
    if(!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  add(dataItem?: any) {
    this.modalHelper.static(
      SalesOrderDetailEditWasteComponent, {
        i: dataItem === undefined ? { id: null } : dataItem,
        salesOrderCode: this.salesOrderCode,
        cusCode: this.cusCode,
        cusAbbreviation: this.cusAbbreviation,
        productCategory: this.productCategory,
        plantCode: this.plantCode,
        cklb: this.cklb,
        cklbRemarks: this.cklbRemarks,
      }
    ).subscribe(value => {
      if(value) {
        this.query();
      }
    });
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

  showChangeDetail(dataItem) {
    this.modalHelper.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryDetailChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_sales_order_detailed_modify_record',
          myAgGridRowKey: 'PS_SALES_ORDER_DETAILED_MODIFY_RECORD',
        },
        queryParamsValue: {
          salesOrderDetailedId: dataItem.id,
        },
        exportFileName: '销售订单明细',
        tableColumns: this.columns.filter(col => col.colId === undefined),
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  expColumnsOptions: any[] = [
    { field: 'salesOrderDetailedState', options: this.salesOrderDetailedStateOptions },
    { field: 'priceByWeight', options: this.YesNoOptions },
    { field: 'subsectionState', options: this.subsectionStateOptions },
    { field: 'rewinding', options: this.YesNoOptions },
    { field: 'entrustedProcessing', options: this.YesNoOptions },
    { field: 'transportType', options: this.transportTypeOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'fullVolume', options: this.YesNoOptions },
    { field: 'paper', options: this.YesNoOptions },
    { field: 'cusGrade', options: this.cusGradeOptions },
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

  showSpecialPriceModal(dataItem) {
    this.modalHelper.static(
      SalesOrderDetailSpecialPriceWasteComponent,
      {
        id: dataItem.id
      }
    ).subscribe(() => {})
  }
}