import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { SalesOrderQueryService } from "../../query.service";

@Component({
  selector: 'planschedule-hw-sales-order-detail-edit',
  templateUrl: './edit.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderDetailEditComponent implements OnInit {
  isModify: boolean = false;
  isView: boolean = false; // 是否只查看
  i: any; 
  iClone: any;
  YesNoOptions: any = [];
  salesOrderDetailedStateOptions: any = [];
  plantOptions: any = [];

  salesOrderCode: string = '';
  cusCode: string = '';
  cusAbbreviation: string = '';
  productCategory: string = '';
  plantCode: string = '';
  cklb: string = '';
  cklbRemarks: string = '';
  formatterPrecision6 = (value: number | string) => value ? decimal.roundFixed(Number(value), 6) : value;
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  @ViewChild('f', { static: true }) f: NgForm;

  // 绑定分行客户订单
  public gridViewCustomOrders: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustomOrders: any[] = [
    {
      field: 'branchCusOrderCode',
      width: 120,
      title: '分行订单编码'
    },
    {
      field: 'cusOrderCode',
      width: 120,
      title: '订单编码'
    },
    {
      field: 'cusOrderState',
      width: 120,
      title: '订单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusOrderType',
      width: 120,
      title: '订单类型',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'itemCode',
      width: 120,
      title: '物料编码',
    },
    {
      field: 'productCategory',
      width: 120,
      title: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'orderDate',
      width: 120,
      title: '下单日期'
    },
    {
      field: 'orderMonth',
      width: 120,
      title: '订单月份'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称'
    },
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码'
    },
    {
      field: 'plan',
      width: 120,
      title: '计划',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'prodType',
      width: 120,
      title: '形式',
      valueFormatter: 'ctx.optionsFind(value,15).label',
    },
    {
      field: 'stockCode',
      width: 120,
      title: '存货编码'
    },
    {
      field: 'stockName',
      width: 120,
      title: '存货名称'
    },
    {
      field: 'coatingUpCode',
      width: 120,
      title: '面膜存货编码'
    },
    {
      field: 'coatingUpName',
      width: 120,
      title: '面膜存货描述'
    },
    {
      field: 'coatingDownCode',
      width: 120,
      title: '底膜存货编码'
    },
    {
      field: 'coatingDownName',
      width: 120,
      title: '底膜存货描述'
    },
    {
      field: 'paper',
      width: 120,
      title: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,18).label',
    },
    {
      field: 'salesOrderType',
      width: 120,
      title: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,16).label',
    },
    {
      field: 'bindindNum',
      width: 120,
      title: '合并序号'
    },
    {
      field: 'standards',
      width: 120,
      title: '规格'
    },
    {
      field: 'width',
      width: 120,
      title: '宽度'
    },
    {
      field: 'prodLength',
      width: 120,
      title: '长度'
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量'
    },
    {
      field: 'boxQuantity',
      width: 120,
      title: '箱数'
    },
    {
      field: 'packingQuantuty',
      width: 120,
      title: '装箱张数'
    },
    {
      field: 'cusDeliveryDate',
      width: 120,
      title: '客户交期'
    },
    {
      field: 'processingReq',
      width: 120,
      title: '加工要求'
    },
    {
      field: 'tolerance',
      width: 120,
      title: '公差',
      valueFormatter: 'ctx.optionsFind(value,17).label',
    },
    {
      field: 'pickUp',
      width: 120,
      title: '是否自提',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'cusOrder',
      width: 120,
      title: '是否客订',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'processingType',
      width: 120,
      title: '加工类型',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'hardness',
      width: 120,
      title: '硬度'
    },
    {
      field: 'plannedDeliveryDate',
      width: 120,
      title: '计划交期',
    },
    {
      field: 'meterNum',
      width: 120,
      title: '米数'
    },
    {
      field: 'plantCode',
      width: 120,
      title: '产地',
    },
    {
      field: 'urgent',
      width: 120,
      title: '急要',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'isChange',
      width: 120,
      title: '变更',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'coilState',
      width: 120,
      title: '钢卷状态',
    },
    {
      field: 'coilBatchNum',
      width: 120,
      title: '来料批号'
    },
    {
      field: 'deliveryQuantity',
      width: 120,
      title: '交货重量',
    },
    {
      field: 'deliveryDate',
      width: 120,
      title: '交货日期',
    },
    {
      field: 'salesStrategy',
      width: 120,
      title: '销售策略',
    },
    {
      field: 'standardsType',
      width: 120,
      title: '规格尺寸',
    },
    {
      field: 'elongation',
      width: 120,
      title: '延伸率',
    },
    {
      field: 'gloss',
      width: 120,
      title: '光泽度',
    },
    {
      field: 'ironLoss',
      width: 120,
      title: '铁损',
    },
    {
      field: 'magnetoreception',
      width: 120,
      title: '磁感',
    },
    {
      field: 'subsectionState',
      width: 120,
      title: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'coilInnerDia',
      width: 120,
      title: '钢卷内径',
    },
    {
      field: 'transportType',
      width: 120,
      title: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'fullVolume',
      width: 120,
      title: '是否整卷',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      title: '是否受托',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'trmming',
      width: 120,
      title: '是否切边',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'unitCode',
      width: 120,
      title: '数量单位编码',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      title: '数量单位',
    },
    {
      field: 'weight',
      width: 120,
      title: '重量',
    },
    {
      field: 'packType',
      width: 120,
      title: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,13).label',
    },
    {
      field: 'sampleNum',
      width: 120,
      title: '样本编号',
    },
    {
      field: 'settlestyle',
      width: 120,
      title: '结算方式',
      valueFormatter: 'ctx.optionsFind(value,14).label',
    },
    {
      field: 'slittingQuantity',
      width: 120,
      title: '分条数量',
    },
  ];
  customOrderOptions = {
    1: { 'PS_BRANCH_CUS_ORDER_STATE': [] },
    2: { 'PS_PLAN': [] },
    3: { 'PS_CONTRACT_STEEL_TYPE': [] },
    4: { 'PS_YES_NOT': [] },
    5: { 'PS_CONTRACT_SURFACE': [] },
    6: { 'PS_ORDER_STATE': [] },
    7: { 'PS_PRODUCT_CATEGORY': [] },
    8: { 'PS_CUS_ORDER_TYPE': [] },
    9: { 'PS_PROCESSING_TYPE': [] },
    10: { 'PS_SUBSECTION_STATE': [] },
    11: { 'PS_TRANSPORT_TYPE': [] },
    12: { 'PS_ITEM_UNIT': [] },
    13: { 'PS_PACK_TYPE': [] },
    14: { 'PS_SETTLE_STYLE': [] },
    15: { 'PS_PROD_TYPE': [] },
    16: { 'PS_SALES_ORDER_TYPE': [] },
    17: { 'GONGCHA': [] },
    18: { 'PS_SURFACE_PROTECT': [] },
  };

  // 绑定存货
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStocks: any[] = [
    {
      field: 'batchCode',
      title: '批号',
      width: '100'
    },
    {
      field: 'itemId',
      title: '存货编码',
      width: '100'
    },
    {
      field: 'skuName',
      title: '存货名称',
      width: '100'
    },
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    }, 
    {
      field: 'spec',
      title: '规格尺寸',
      width: '100'
    },
    {
      field: 'steelGrade',
      title: '钢种',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'standardsType',
      title: '规格型号',
      width: '100'
    },
    {
      field: 'unitName',
      title: '单位',
      width: '100'
    },
    {
      field: 'avaQuantity',
      title: '数量',
      width: '100'
    },
    {
      field: 'coating',
      title: '保护材料',
      width: '100'
    },
    {
      field: 'surface',
      title: '表面',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'grade',
      title: '等级',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'actHeight',
      title: '实厚',
      width: '100'
    },
    {
      field: 'unitWeight',
      title: '单重',
      width: '100'
    },
    {
      field: 'weight',
      title: '净重',
      width: '100'
    },
    {
      field: 'whName',
      title: '提货仓库',
      width: '100'
    },
    {
      field: 'subsectionState',
      title: '分卷状态',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'entrustedProcessing',
      title: '受托加工',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'coilInnerDia',
      title: '钢卷内径',
      width: '100'
    },
    {
      field: 'packType',
      title: '包装方式',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
  ];
  onhandOptions = {
    1: { 'PS_CONTRACT_STEEL_TYPE': [] },
    2: { 'PS_CONTRACT_SURFACE': [] },
    3: { 'PS_GRADE': [] },
    4: { 'PS_SUBSECTION_STATE': [] },
    5: { 'PS_YES_NOT': [] },
    6: { 'PS_PACK_TYPE': [] },
  }

  // 绑定合同
  public gridViewContracts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsContracts: any[] = [
    {
      field: 'contractCode',
      title: '合同号',
      width: '100'
    },
    {
      field: 'contractState',
      title: '合同状态',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'basePrice',
      title: '基价',
      width: '100'
    },
    {
      field: 'deposit',
      title: '定金',
      width: '100'
    },
    {
      field: 'money',
      title: '无税金额',
      width: '100'
    },
    {
      field: 'plantCode',
      title: '供方',
      width: '200',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'affiliatedMonth',
      title: '合同月份',
      width: '100'
    },
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'cusAbbreviation',
      title: '客户简称',
      width: '100'
    },
    {
      field: 'steelType',
      title: '钢种',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'rebate',
      title: '返利',
      width: '100'
    },
    {
      field: 'basePrice',
      title: '基价',
      width: '100'
    },
    {
      field: 'remarks',
      title: '备注',
      width: '100'
    },
    {
      field: 'quantitySy',
      title: '合同待分货量',
      width: '100'
    },
    {
      field: 'material',
      title: '厚/薄料',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
  ];
  contractOptions = {
    1: { 'PS_CONTRACT_STATE': [] },
    2: { 'PLANT_CODE': [] },
    3: { 'PS_CONTRACT_STEEL_TYPE': [] },
    4: { 'HOUBO': [] },
  };

  
  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'warehouse',
      width: 120,
      title: '配送仓库',
    },
    {
      field: 'place',
      width: 120,
      title: '配送地点',
    },
    {
      field: 'warehouse',
      width: 120,
      title: '配送仓库',
    },
    {
      field: 'place',
      width: 120,
      title: '配送地点',
    },
  ];

  constructor(
    private modal: NzModalRef,
    private editService: SalesOrderQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.editService.getDetailedOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.i.taxRate = this.i.taxRate || 13;
          this.generateFixedPrice();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    } else {
      // this.i.detailedNum = 'MX' + this.generateSalesOrderCode();
      this.i.plantCode = this.plantCode;
      this.i.taxRate = 13;
      this.i.cklb = this.cklb;
      this.i.cklbRemarks = this.cklbRemarks;
      this.i.highPriceState = '10';
      //获取客户地址
      this.editService.getCustoms({
        cusCode: this.cusCode,
        pageIndex: 1,
        pageSize: 1,
        isCusCodeNotNull: true
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.i.cusAddress = res.data.content[0].cusAddress;
          this.i.cusGrade = res.data.content[0].cusGrade;
        }
      })
    }
    this.loadOptions();
  }

  generateSalesOrderCode() {
    const today = new Date();
    const year = today.getFullYear().toString().slice(2);
    const month = today.getMonth() < 9 ? ('0' + (today.getMonth() + 1).toString()) : (today.getMonth() + 1).toString()
    const salesOrderCode = year + month + this.editService.generateSerial(5);
    return salesOrderCode;
  }

  loadOptions() {
    this.editService.GetLookupByTypeRefAll({
      'PS_SALES_ORDER_DETAILED_STATE': this.salesOrderDetailedStateOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    this.editService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  searchCustomerOrders(e) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustomerOrders(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载客户订单
   * @param {string} cusOrderCode  分行客户订单号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
   public loadCustomerOrders(
    cusOrderCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.editService
      .getBranchCustomerOrder({
        fuzzy: cusOrderCode,
        cusCode: this.cusCode,
        compareQuantity: true,
        productCategory: this.productCategory,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewCustomOrders.data = res.data.content;
        this.gridViewCustomOrders.total = res.data.totalElements;
      });
  }

  onCustomerOrderTextChanged(e) {
    const cusOrderCode = e.Text.trim();
    if(cusOrderCode !== '') {
      this.editService
      .getBranchCustomerOrder({
        fuzzy: cusOrderCode,
        cusCode: this.cusCode,
        compareQuantity: true,
        productCategory: this.productCategory,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveCusOrder(res.data.content[0]);
        } else {
          this.clearCusOrder();
          this.msgSrv.info(this.appTranslationService.translate('分行客户订单号无效'));
        }
      });
    } else {
      this.clearCusOrder();
    }
  }

  onRowSelectCustomerOrders(e) {
    this.saveCusOrder(e.Row);
  }

  saveCusOrder(data) {
    this.i.cusOrderCode = data.branchCusOrderCode;
    this.i.orderDate = data.orderDate;
    this.i.processingReq = data.processingReq;
    this.i.plannedDeliveryDate = data.plannedDeliveryDate;
    this.i.packingMethod = data.packingMethod || '';
    this.i.transportType = data.transportType || '';
    this.i.fullVolume = data.fullVolume;
    this.i.slittingQuantity = data.slittingQuantity;
    this.i.cusGrade = data.cusGrade;
    this.i.settleStyle = data.settleStyle;
    this.i.salesStrategy = data.salesStrategy;
  }

  clearCusOrder() {
    this.i.cusOrderCode = '';
    this.i.orderDate = '';
    this.i.processingReq = '';
    this.i.plannedDeliveryDate = '';
    this.i.packingMethod = '';
    this.i.transportType = '';
    this.i.fullVolume = '';
    this.i.slittingQuantity = '';
    this.i.cusGrade = '';
    this.i.settleStyle = '';
    this.i.salesStrategy = '';
  }

  /**
   * 存货弹出查询
   * @param {any} e
   */
   public searchStocks(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStocks(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载现有库存
   * @param {string} stockCode  批号、存货名称模糊查询
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadStocks(
    stockCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.editService
      .getOnhands({
        plantCode: this.plantCode,
        batchCode: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
      });
  }

  onStockTextChanged(e: any) {
    this.i.stockCode = e.Text.trim();
    if(this.i.stockCode !== '') {
      this.editService
      .getOnhands({
        plantCode: this.plantCode,
        batchCode: this.i.stockCode,
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveOnhands(res.data.content[0]);
        } else {
          this.clearOnhands();
          this.msgSrv.info(this.appTranslationService.translate('存货编码无效'));
        }
      });
    } else {
      this.clearOnhands();
    }
  }

  onHandsSelect(e) {
    this.saveOnhands(e.Row);
  }

  saveOnhands(data) {
    this.i.batchNum = data.batchCode;
    this.i.stockCode = data.itemId;
    this.i.stockName = data.skuName;
    this.i.steelStandart = data.spec || '';
    this.i.steelType = data.steelGrade || '';
    this.i.standardsType = data.standardsType;
    this.i.unitOfMeasure = data.unitName;
    this.i.unitCode = data.unitCode; // 单位编码
    this.i.quantity = data.avaQuantity;
    this.i.surface = data.surface || '';
    this.i.grade = data.grade || '';
    this.i.thickness = data.actHeight;
    this.i.unitWeigthKg = data.unitWeight;
    this.i.weigthKg = data.weight;
    this.i.pickWarehouse = data.whName; // 仓库名称
    this.i.whCode = data.whCode; // 仓库编码
    this.i.subsectionState = data.subsectionState;
    this.i.rewinding = data.rewinding;
    this.i.entrustedProcessing = data.entrustedProcessing;
    this.i.coilInnerDia = data.coilInnerDia;
    this.i.packType = data.packType;
    this.i.prodType = data.prodType;
    this.i.cccd = data.cccd;
    this.i.coatingUpCode = data.coatingUpCode;
    this.i.coatingDownCode = data.coatingDownCode;
    this.i.coatingUpName = data.coatingUpDesc;
    this.i.coatingDownName = data.coatingDownDesc;
    this.i.paper = data.paper || null;
    // 数量更新时：更新含税金额
    this.generateAmountIncludingTax();
  }

  clearOnhands() {
    this.i.batchNum = '';
    this.i.stockCode = '';
    this.i.stockName = '';
    this.i.steelStandart = '';
    this.i.steelType = '';
    this.i.standardsType = '';
    this.i.unitOfMeasure = '';
    this.i.quantity = '';
    this.i.surface = '';
    this.i.grade = '';
    this.i.thickness = '';
    this.i.unitWeigthKg = '';
    this.i.weigthKg = '';
    this.i.pickWarehouse = '';
    this.i.subsectionState = '';
    this.i.rewinding = '';
    this.i.entrustedProcessing = '';
    this.i.coilInnerDia = '';
    this.i.packType = '';
    this.i.prodType = '';
    this.i.cccd = '';
    this.i.coatingUpCode = '';
    this.i.coatingDownCode = '';
    this.i.coatingUpName = '';
    this.i.coatingDownName = '';
    this.i.paper = null;
    // 数量更新时：更新含税金额
    this.generateAmountIncludingTax();
  }

  /**
   * 合同弹出查询
   * @param {any} e
   */
   public searchContracts(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadContracts(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载合同
   * @param {string} attribute1  工厂、钢种模糊搜索
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadContracts(
    attribute1: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.editService
      .getContracts({
        plantCode: this.plantCode,
        attribute1: attribute1,
        cusCode: this.cusCode,
        attribute2: '110', // 过滤合同状态：已完成
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewContracts.data = res.data.content;
        this.gridViewContracts.total = res.data.totalElements;
      });
  }

  ContractTextChanged(event: any) {
    this.i.attribute1 = event.Text.trim();
    if(this.i.attribute1 !== '') {
      this.editService
      .getContracts({
        plantCode: this.plantCode,
        attribute1: this.i.attribute1,
        cusCode: this.cusCode,
        attribute2: '110', // 过滤合同状态：已完成
        pageIndex: 1,
        pageSize: 10
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('搜索条件无效'));
          this.clearContract();
        } else {
          this.saveContract(res.data.content[0])
        }
      });
    } else {
      this.clearContract();
    }
  }

  onRowSelectContracts(e) {
    this.saveContract(e.Row);
  }

  saveContract(data) {
    this.i.contractCode = data.contractCode;
    this.i.basePrice = decimal.roundFixed(decimal.div(data.basePrice, 1000), 6);
    // 基价更新时：更新限价
    this.generateFixedPrice();
  }

  clearContract() {
    this.i.contractCode = '';
    this.i.basePrice = '';
    // 基价更新时：更新限价
    this.generateFixedPrice();
  }

  // 税率更新时：更新无税金额
  taxRateChange() {
    this.generateMoney();
  }

  // 计算限价：基价 + 加价 + 特殊加价
  generateFixedPrice() {
    // const basePrice = this.i.basePrice || 0;
    // const markup = this.i.markUp || 0;
    // const specialMarkup = this.i.specialMarkup || 0;
    // this.i.fixedPrice = decimal.roundFixed(decimal.add(basePrice, markup, specialMarkup), 6);
    // // 限价更新时：更新含税金额、含税价
    // this.generateAmountIncludingTax();
    // this.generateTaxPrice();
    // this.f.control.markAsDirty();
  }

  // 计算含税价：等于限价，可编辑
  generateTaxPrice() {
    // this.i.taxPrice = decimal.roundFixed(this.i.fixedPrice, 6);
    // this.f.control.markAsDirty();
  }

  // 计算含税金额：限价 * 数量
  generateAmountIncludingTax() {
    // const fixedPrice = this.i.fixedPrice || 0;
    // const quantity = this.i.quantity || 0;
    // this.i.amountIncludingTax = decimal.roundFixed(decimal.mul(quantity, fixedPrice), 2);
    // // 含税金额更新时：更新税额、金额
    // this.generateTaxAmount();
    // this.generateMoney();
    // this.f.control.markAsDirty();
  }

  // 计算无税金额：含税金额 / (1+(税率/100))
  generateMoney() {
    // const amountIncludingTax = this.i.amountIncludingTax || 0;
    // const taxRate = this.i.taxRate || 13;
    // this.i.money = decimal.roundFixed(decimal.div(amountIncludingTax, decimal.add(1, decimal.div(taxRate, 100))), 2);
    // // 无税金额更新时：更新税额
    // this.generateTaxAmount();
    // this.f.control.markAsDirty();
  }

  // 计算税额：含税金额 - 无税金额，保留两位小数
  generateTaxAmount() {
    // const money = this.i.money || 0;
    // const amountIncludingTax = this.i.amountIncludingTax || 0;
    // this.i.taxAmount = decimal.roundFixed(decimal.minus(amountIncludingTax, money), 2);
    // this.f.control.markAsDirty();
  }

  /**
   * 仓库弹出查询
   * @param {any} e
   */
   public searchWares(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWares(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} warehouse  仓库
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
    warehouse: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂'));
      return;
    }
    this.editService
      .getDistributions({
        plantCode: this.i.plantCode,
        warehouse: warehouse,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any) {
    this.i.distributionWarehouse = e.Row.warehouse;
  }

  onWaresTextChanged(event: any) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂'));
      return;
    }
    const warehouse = event.Text.trim();
    if(warehouse !== '') {
      this.editService
      .getDistributions({
        plantCode: this.i.plantCode,
        warehouse: warehouse,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.i.distributionWarehouse = res.data.content[0].warehouse;
        } else {
          this.i.distributionWarehouse = '';
          this.msgSrv.warning(this.appTranslationService.translate('配送仓库无效'))
        }
      });
    } else {
      this.i.distributionWarehouse = '';
    }
  }

  save(value) {
    this.i.salesOrderCode = this.salesOrderCode;
    this.i.salesOrderDetailedState = '10';
    const params = Object.assign({}, this.i, {
      orderDate: this.editService.formatDate(this.i.orderDate),
    });
    this.editService.detailSave(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  close() {
    this.modal.destroy();
  }
}