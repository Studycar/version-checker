import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { InvoiceOrderQueryService } from "../../query.service";


@Component({
  selector: 'planschedule-hw-invoice-order-detailed-edit',
  templateUrl: './edit.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderDetailedEditWasteComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  salesOrderTypeOptions: any = []; // PS_SALES_ORDER_TYPE
  currencyOptions: any = []; // PS_CURRENCY
  cklbOptions: any = []; // PS_INVOICE_CKLB
  detailedStateOptions: any[] = []; // PS_INVOICE_DETAILED_STATE
  plantOptions: any[] = []; 
  cusCode: string = '';
  plantCode: string = '';
  invoiceBillState: string = '';
  cklb: string = '';
  cklbRemarks: string = '';
  @ViewChild('f', { static: true }) f: NgForm;

  // 绑定销售订单
  public gridViewSaleOrderDetaileds: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsSaleOrderDetaileds: any[] = [
    {
      field: 'salesOrderCode',
      width: 120,
      title: '销售订单号'
    },
    {
      field: 'detailedNum',
      width: 120,
      title: '明细行号'
    },
    {
      field: 'salesOrderDetailedState',
      width: 120,
      title: '明细状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cklb',
      width: 120,
      title: '出库类别',
    },
    {
      field: 'cklbRemarks',
      width: 120,
      title: '出库类别说明',
    },
    {
      field: 'plantCode',
      width: 120,
      title: '工厂'
    },
    {
      field: 'cusOrderCode',
      width: 120,
      title: '客户订单号'
    },
    {
      field: 'orderDate',
      width: 120,
      title: '下单日期'
    },
    {
      field: 'contractCode',
      width: 120,
      title: '合同号',
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因',
    },
    {
      field: 'stockCode',
      width: 120,
      title: '存货编码',
    },
    {
      field: 'stockName',
      width: 120,
      title: '存货名称',
    },
    {
      field: 'distributionWarehouse',
      width: 120,
      title: '配送公仓'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '批号'
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种'
    },
    {
      field: 'standardsType',
      width: 120,
      title: '规格型号',
    },
    {
      field: 'steelStandart',
      width: 120,
      title: '钢材规格尺寸',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      title: '单位',
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量',
    },
    {
      field: 'taxPrice',
      width: 120,
      title: '含税价',
    },
    {
      field: 'fixedPrice',
      width: 120,
      title: '限价'
    },
    {
      field: 'money',
      width: 120,
      title: '金额',
    },
    {
      field: 'taxRate',
      width: 120,
      title: '税率'
    },
    {
      field: 'taxAmount',
      width: 120,
      title: '税额',
    },
    {
      field: 'coatingUpCode',
      width: 120,
      title: '面膜编码'
    },
    {
      field: 'coatingUpName',
      width: 120,
      title: '面膜描述'
    },
    {
      field: 'coatingDownCode',
      width: 120,
      title: '底膜编码'
    },
    {
      field: 'coatingDownName',
      width: 120,
      title: '底膜描述'
    },
    {
      field: 'paper',
      width: 120,
      title: '垫纸',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      title: '含税金额',
    },
    {
      field: 'processingReq',
      width: 120,
      title: '加工要求'
    },
    {
      field: 'plantCode',
      width: 120,
      title: '工厂',
    },
    {
      field: 'sample',
      width: 120,
      title: '样本'
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
    },
    {
      field: 'label',
      width: 120,
      title: '标签规格'
    },
    {
      field: 'grade',
      width: 120,
      title: '等级',
    },
    {
      field: 'plannedDeliveryDate',
      width: 120,
      title: '计划交期'
    },
    {
      field: 'thickness',
      width: 120,
      title: '实厚',
    },
    {
      field: 'unitWeigthKg',
      width: 120,
      title: '单重（KG）'
    },
    {
      field: 'weigthKg',
      width: 120,
      title: '重量（KG）',
    },
    {
      field: 'priceByWeight',
      width: 120,
      title: '按重量计价',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'priceKg',
      width: 120,
      title: '价格（KG）'
    },
    {
      field: 'deliveryMethod',
      width: 120,
      title: '提货方式'
    },
    {
      field: 'packingMethod',
      width: 120,
      title: '装箱方式',
    },
    {
      field: 'pickWarehouse',
      width: 120,
      title: '提货仓库'
    },
    {
      field: 'basePrice',
      width: 120,
      title: '基价'
    },
    {
      field: 'remarks',
      width: 120,
      title: '备注'
    },
    {
      field: 'depositRatio',
      width: 120,
      title: '定金比率'
    },
    {
      field: 'deposit',
      width: 120,
      title: '定金'
    },
    {
      field: 'description',
      width: 120,
      title: '内部说明'
    },
    {
      field: 'cusAddress',
      width: 120,
      title: '客户地址'
    },
    {
      field: 'toleranceThickness',
      width: 120,
      title: '厚度下工差'
    },
    {
      field: 'poundsLost',
      width: 120,
      title: '已输磅重'
    },
    {
      field: 'warehouse',
      width: 120,
      title: '仓库'
    },
    {
      field: 'location',
      width: 120,
      title: '仓位'
    },
    {
      field: 'width',
      width: 120,
      title: '实宽',
    },
    {
      field: 'poundWeugthKg',
      width: 120,
      title: '磅重（KG）'
    },
    {
      field: 'lilunWeigthKg',
      width: 120,
      title: '理重（KG）',
    },
    {
      field: 'markUp',
      width: 120,
      title: '加价',
    },
    {
      field: 'processFee',
      width: 120,
      title: '加工费',
    },
    {
      field: 'specialMarkup',
      width: 120,
      title: '特殊加价',
    },
    {
      field: 'subsectionState',
      width: 120,
      title: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'rewinding',
      width: 120,
      title: '是否重卷',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      title: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'transportType',
      width: 120,
      title: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'coilInnerDia',
      width: 120,
      title: '钢卷内径',
    },
    {
      field: 'packType',
      width: 120,
      title: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'prodType',
      width: 120,
      title: '形式',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'fullVolume',
      width: 120,
      title: '是否重卷',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'slittingQuantity',
      width: 120,
      title: '分条数量',
    },
    {
      field: 'cccd',
      width: 120,
      title: '超长超短',
    },
    {
      field: 'cusGrade',
      width: 120,
      title: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'settleStyle',
      width: 120,
      title: '结算方式',
    },
    {
      field: 'salesStrategy',
      width: 120,
      title: '销售策略',
    },
  ];
  salesOrderDetailOptions = {
    1: { 'PS_SALES_ORDER_DETAILED_STATE': []},
    2: { 'PS_YES_NOT': []},
    3: { 'PS_SUBSECTION_STATE': []},
    4: { 'PS_TRANSPORT_TYPE': []},
    5: { 'PS_PACK_TYPE': []},
    6: { 'PS_CUS_GRADE': []},
    7: { 'PS_PROD_TYPE': []},
  }

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: InvoiceOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getDetailedOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      // this.i.detailedNum = 'FHDD' + this.queryService.formatDateTime(new Date()).replace(/[-:\s]/g, '');
      this.i.state = '10';
      this.i.plantCode = this.plantCode;
      this.i.cklb = this.cklb;
      this.i.cklbRemarks = this.cklbRemarks;
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_INVOICE_CKLB': this.cklbOptions,
      'PS_INVOICE_DETAILED_STATE': this.detailedStateOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      invoiceFlag: 'N',
      quantity: this.i.poundsLost
    });
    this.queryService.saveDetailed(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 销售订单弹出查询
   * @param {any} e
   */
   public searchSalesOrderDetaileds(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadSalesOrderDetaileds(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  salesOrder: any = {};
  salesOrderDetail: any = {};
  /**
   * 加载销售订单明细
   * @param {string} salesOrderCode  销售订单号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadSalesOrderDetaileds(
    salesOrderCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService.getSalesOrderDetailedByStateWaste({
      plantCode: this.plantCode,
      salesOrderCode: salesOrderCode,
      salesOrderState: '40',
      saleFlag: 'N',
      cusCode: this.cusCode,
      filterBatchCode: true,
      cklb: this.cklb,
      pageIndex: pageIndex,
      pageSize: pageSize,
    }).subscribe(res => {
      this.gridViewSaleOrderDetaileds.data = res.data.content;
      this.gridViewSaleOrderDetaileds.total = res.data.totalElements;
    });
  }

  setSalesOrder(data) {
    this.salesOrder.salesOrderCode = data.salesOrderCode;
    this.salesOrder.salesOrderType = data.salesOrderType;
    this.salesOrder.salesman = data.salesman;
    this.salesOrder.department = data.department;
    this.salesOrder.departmentCode = data.departmentCode; // 部门编码
    this.salesOrder.cusCode = data.cusCode;
    this.salesOrder.cusAbbreviation = data.cusAbbreviation;
    this.salesOrder.currency = data.currency;
  }

  setSalesOrderDetail(data) {
    // this.salesOrderDetail.salesOrderType = data.salesOrderType;
    this.salesOrderDetail.salesOrderNum = data.detailedNum;
    this.salesOrderDetail.contractCode = data.contractCode;
    this.salesOrderDetail.stockCode = data.stockCode;
    this.salesOrderDetail.stockName = data.stockName;
    this.salesOrderDetail.unit = data.unitOfMeasure;
    this.salesOrderDetail.unitCode = data.unitCode; // 单位编码
    this.salesOrderDetail.batchNum = data.batchNum;
    this.salesOrderDetail.steelType = data.steelType;
    this.salesOrderDetail.steelStandart = data.steelStandart;
    this.salesOrderDetail.surface = data.surface;
    this.salesOrderDetail.grade = data.grade;
    this.salesOrderDetail.distributionWarehouse = data.distributionWarehouse;
    this.salesOrderDetail.distributionWarehouseCode = data.distributionWarehouseCode; // 配送公仓编码
    this.salesOrderDetail.quantity = data.quantity;
    this.salesOrderDetail.taxPrice = data.taxPrice;
    this.salesOrderDetail.fixedPrice = data.fixedPrice;
    this.salesOrderDetail.money = data.money;
    this.salesOrderDetail.taxRate = data.taxRate;
    this.salesOrderDetail.taxAmount = data.taxAmount;
    this.salesOrderDetail.coating = data.coating;
    this.salesOrderDetail.amountIncludingTax = data.amountIncludingTax;
    this.salesOrderDetail.place = data.plantCode;
    this.salesOrderDetail.poundWeigthKg = data.poundWeigthKg;
    this.salesOrderDetail.lilunWeigthKg = data.lilunWeigthKg;
    this.salesOrderDetail.poundsLost = data.poundsLost;
    this.salesOrderDetail.label = data.label;
    this.salesOrderDetail.warehouse = data.pickWarehouse;
    this.salesOrderDetail.whCode = data.whCode; // 仓库编码
    this.salesOrderDetail.location = data.location;
    this.salesOrderDetail.thickness = data.thickness;
    this.salesOrderDetail.weigth = data.weigth;
    this.salesOrderDetail.unitWeigthKg = data.unitWeigthKg;
    this.salesOrderDetail.weigthKg = data.weigthKg;
    this.salesOrderDetail.priceByWeight = data.priceByWeight;
    this.salesOrderDetail.priceKg = data.priceKg;
    this.salesOrderDetail.heatNum = data.heatNum;
    this.salesOrderDetail.deliveryMethod = data.deliveryMethod;
    this.salesOrderDetail.packingMethod = data.packingMethod;
    this.salesOrderDetail.basePrice = data.basePrice;
    this.salesOrderDetail.markUp = data.markUp;
    this.salesOrderDetail.exchangeRate = data.exchangeRate;
    this.salesOrderDetail.remarks = data.remarks;
    this.salesOrderDetail.issueOrderCode = data.issueOrderCode;
    this.salesOrderDetail.shippingAddress = data.distributionWarehouse;
    this.salesOrderDetail.coatingUpCode = data.coatingUpCode;
    this.salesOrderDetail.coatingDownCode = data.coatingDownCode;
    this.salesOrderDetail.paper = data.paper;
    this.i = Object.assign({}, this.i, this.salesOrder, this.salesOrderDetail);
  }

  onRowSelectSalesOrderDetailed(e) {
    this.queryService.getSalesOrder({
      plantCode: this.plantCode,
      salesOrderCode: e.Row.salesOrderCode,
      saleFlag: 'N',
      cusCode: this.cusCode,
      cklb: this.cklb,
      pageIndex: 1,
      pageSize: 1
    }).subscribe(res => {
      if(res.data.content.length > 0) {
        this.setSalesOrder(res.data.content[0]);
        this.setSalesOrderDetail(e.Row);
      } else {
        this.initData();
        this.msgSrv.info(this.appTranslationService.translate('此销售订单号无效'));
      }
    });
  }

  onSalesOrderTextChanged(e) {
    this.i.salesOrderCode = e.Text.trim();
    if(this.i.salesOrderCode !== '') {
      this.queryService.getSalesOrder({
        plantCode: this.plantCode,
        salesOrderCode: this.i.salesOrderCode,
        cusCode: this.cusCode,
        cklb: this.cklb,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length === 0) {
          this.initData();
          this.msgSrv.info(this.appTranslationService.translate('此销售订单号无效'));
        } else {
          this.setSalesOrder(res.data.content[0]);
          this.queryService.getSalesOrderDetailedByStateWaste({
            plantCode: this.plantCode,
            salesOrderCode: this.salesOrder.salesOrderCode,
            salesOrderState: '40',
            filterBatchCode: true,
            cusCode: this.cusCode,
            cklb: this.cklb,
            pageIndex: 1,
            pageSize: 1,
          }).subscribe(res => {
            if(res.data.content.length > 0) {
              this.setSalesOrderDetail(res.data.content[0]);
            } else {
              this.initData();
              this.msgSrv.info(this.appTranslationService.translate('此销售订单号没有对应的明细'));
            }
          });
        }
      })
    } else {
      this.initData();
    }
  }

  initData() {
    this.i = {
      id: this.i.id,
      detailedNum: this.i.detailedNum,
      state: this.i.state,
      invoiceBillCode: this.i.invoiceBillCode,
      collectionAgreement: this.i.collectionAgreement,
      plantCode: this.i.plantCode
    };
    this.salesOrder = {};
    this.salesOrderDetail = {};
  }
}