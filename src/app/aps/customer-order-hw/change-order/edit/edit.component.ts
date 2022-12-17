import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { decimal } from '@shared';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { CustomerChangeOrderQueryService } from '../query.service';

@Component({
  selector: 'customer-change-order-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerChangeOrderQueryService]
})
export class CustomerChangeOrderEditComponent implements OnInit {

   /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  isWeightRequired: boolean = false;
  isQuantityRequired: boolean = false;
  i: any; 
  iClone: any;
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  serialNum: string = ''; // 流水号

  cusOrderStateOptions: any = []; 
  planOptions: any = [];
  contractSteelTypeOptions: any = [];
  salesOrderTypeOptions: any = [];
  changeReasonOptions: any = [];
  contractSurfaceOptions: any = [];
  productCategoryOptions: any = [];
  processingTypeOptions: any[] = [];
  prodTypeOptions: any[] = [];
  cusOrderTypeOptions: any[] = [];
  subsectionStateOptions: any = []; // PS_SUBSECTION_STATE
  transportTypeOptions: any = []; // PS_TRANSPORT_TYPE
  unitOptions: any = []; // PS_ITEM_UNIT
  packTypeOptions: any = []; // PS_PACK_TYPE
  YesNoOptions: any = [];
  paperOptions: any = [];
  gongchaOptions: any = [];
  settleStyleOptions: any = [];
  pricingTypeOptions: any = [];

  plantOptions: any = [];
  @ViewChild('f', { static: true })f: NgForm;

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

  // 绑定分行客户订单
  public gridViewBranchCustomOrders: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsBranchCustomOrders: any[] = [
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
      title: '工厂',
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
      field: 'unit',
      width: 120,
      title: '数量单位',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      title: '重量单位',
      valueFormatter: 'ctx.optionsFind(value,12).label',
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
  branchCusOrderOptions = {
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
      field: 'stockCode',
      title: '产品编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '产品名称',
      width: '100'
    },
    {
      field: 'stockDesc',
      title: '产品描述',
      width: '100'
    },
    {
      field: 'labelDesc',
      title: '标签描述',
      width: '100'
    }
  ];

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerChangeOrderQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.serialNum = this.queryService.generateSerial(3);
    if(this.i.id) {
      this.isModify = true;
      this.queryService.get(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.saveCusOrder(Object.assign({}, this.i, {branchCusOrderCode: this.i.cusOrderCode}));
        }
      })
    } else {
      this.i.changeOrderState = '10';
      this.i.orderMonth = new Date();
      this.i.changeOrderDate = new Date();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CHANGE_ORDER_STATE': this.cusOrderStateOptions,
      'PS_PLAN': this.planOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_CUS_ORDER_TYPE': this.cusOrderTypeOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_SETTLE_STYLE': this.settleStyleOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_CHANGE_REASON': this.changeReasonOptions,
      'PS_SURFACE_PROTECT': this.paperOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  }

  generateChangeOC(cusOrderCode) {
    // this.i.changeOrderCode = cusOrderCode + '-' + this.serialNum;
  }

  prodTypeChange(e) {
    if(this.i.prodType === 'JC') {
      // 卷材：重量、重量单位必填，数量、数量单位非必填
      this.isWeightRequired = true;
      this.isQuantityRequired = false;
      this.i.quantity = this.cusOrderData.quantity;
      this.i.unit = this.cusOrderData.unit;
    } else {
      // 板材：重量、重量单位或数量、数量单位要求必填一组，在保存时提示
      this.isWeightRequired = false;
      this.isQuantityRequired = false;
    }
  }
  
  save(value) {
    const params = Object.assign({}, this.i, {
      changeOrderDate: this.queryService.formatDate(this.i.changeOrderDate),
      cusDeliveryDate: this.queryService.formatDate(this.i.cusDeliveryDate),
      orderMonth: this.queryService.formatDateTime2(this.i.orderMonth, 'yyyy-MM'),
      standards: decimal.roundFixed(Number(this.i.standards), 2),
    })
    this.queryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // 规格尺寸形式：规格*宽度*长度
  generateStandardsType() {
    const standards = this.formatterPrecision(this.i.standards) || 0;;
    const width = this.i.width || 0;
    const prodLength = Number(this.i.prodLength) || 'C';
    this.i.standardsType = `${standards}*${width}*${prodLength}`;
  }  

  /**
   * 客户订单弹出查询
   * @param {any} e
   */
   public searchCusOrders(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCusOrders(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载客户订单
   * @param {string} cusOrderCode  客户订单编码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
   public loadCusOrders(
    cusOrderCode: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getBranchCustomerOrder({
        branchCusOrderCode: cusOrderCode,
        isCanChange: true, // 只显示可变更状态
        bindFlag: 'N',
        pageIndex: PageIndex,
        pageSize: PageSize
      })
      .subscribe(res => {
        this.gridViewBranchCustomOrders.data = res.data.content;
        this.gridViewBranchCustomOrders.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelectCusOrder(e: any) {
    this.saveCusOrder(e.Row);
    this.generateChangeOC(e.Value);
  }

  cusOrderData: any = {};
  saveCusOrder(data) {
    this.cusOrderData.cusOrderCode = data.branchCusOrderCode;
    this.cusOrderData.cusOrderType = data.cusOrderType;
    this.cusOrderData.itemCode = data.itemCode;
    this.cusOrderData.productCategory = data.productCategory;
    this.cusOrderData.cusAbbreviation = data.cusAbbreviation;
    this.cusOrderData.cusCode = data.cusCode;
    this.cusOrderData.plan = data.plan;
    this.cusOrderData.steelType = data.steelType;
    this.cusOrderData.prodType = data.prodType;
    this.cusOrderData.stockCode = data.stockCode;
    this.cusOrderData.stockName = data.stockName;
    this.cusOrderData.coatingUpCode = data.coatingUpCode;
    this.cusOrderData.coatingUpName = data.coatingUpName;
    this.cusOrderData.coatingDownCode = data.coatingDownCode;
    this.cusOrderData.coatingDownName = data.coatingDownName;
    this.cusOrderData.paper = data.paper || null;
    this.cusOrderData.salesOrderType = data.salesOrderType || null;
    this.cusOrderData.standards = data.standards;
    this.cusOrderData.width = data.width;
    this.cusOrderData.prodLength = data.prodLength;
    this.cusOrderData.quantity = data.quantity;
    this.cusOrderData.coating = data.coating;
    this.cusOrderData.boxQuantity = data.boxQuantity;
    this.cusOrderData.packingQuantuty = data.packingQuantuty;
    this.cusOrderData.cusDeliveryDate = data.cusDeliveryDate;
    this.cusOrderData.processingReq = data.processingReq;
    this.cusOrderData.tolerance = data.tolerance;
    this.cusOrderData.processingType = data.processingType;
    this.cusOrderData.surface = data.surface;
    this.cusOrderData.hardness = data.hardness;
    this.cusOrderData.plannedDeliveryDate = data.plannedDeliveryDate;
    this.cusOrderData.orderMonth = data.orderMonth;
    this.cusOrderData.plantCode = data.plantCode;
    this.cusOrderData.salesStrategy = data.salesStrategy;
    this.cusOrderData.standardsType = data.standardsType;
    this.cusOrderData.elongation = data.elongation;
    this.cusOrderData.gloss = data.gloss;
    this.cusOrderData.ironLoss = data.ironLoss;
    this.cusOrderData.magnetoreception = data.magnetoreception;
    this.cusOrderData.subsectionState = data.subsectionState;
    this.cusOrderData.coilInnerDia = data.coilInnerDia;
    this.cusOrderData.transportType = data.transportType;
    this.cusOrderData.fullVolume = data.fullVolume;
    this.cusOrderData.entrustedProcessing = data.entrustedProcessing;
    this.cusOrderData.trmming = data.trmming;
    this.cusOrderData.unit = data.unit;
    this.cusOrderData.unitOfMeasure = data.unitOfMeasure;
    this.cusOrderData.weight = data.weight;
    this.cusOrderData.packType = data.packType;
    this.cusOrderData.sampleNum = data.sampleNum;
    this.cusOrderData.slittingQuantity = data.slittingQuantity;
    this.cusOrderData.settlestyle = data.settlestyle;
    this.cusOrderData.pricingType = data.pricingType;
    this.cusOrderData.pickUp = data.pickUp;
    this.cusOrderData.urgent = data.urgent;
    this.cusOrderData.coilState = data.coilState;
    this.cusOrderData.coilBatchNum = data.coilBatchNum;
    this.cusOrderData.plannedDeliveryDate = data.plannedDeliveryDate;
    Object.assign(this.i, this.cusOrderData);
  }
  
  // 客户订单带出来的数据是否有更改，更改才能保存
  isCusOrderDataChange() {
    const dateKey = ['cusDeliveryDate','plannedDeliveryDate'];
    const monthKey = ['orderMonth'];
    for(let key in this.cusOrderData) {
      if(dateKey.indexOf(key) > -1) {
        if(this.queryService.formatDate(this.cusOrderData[key]) !== this.queryService.formatDate(this.i[key])) {
          return true;
        }
      } else if(monthKey.indexOf(key) > -1) {
        if(this.queryService.formatDateTime2(this.cusOrderData[key], 'yyyy-MM') !== this.queryService.formatDateTime2(this.i[key], 'yyyy-MM')) {
          return true;
        }
      } else if(this.cusOrderData[key] !== this.i[key]) {
        return true;
      }
    }
    return false;
  }

  onCusOrderTextChanged(event) {
    this.i.cusOrderCode = event.Text.trim();
    if(this.i.cusOrderCode !== '') {
      this.queryService
      .getBranchCustomerOrder({
        branchCusOrderCode: this.i.cusOrderCode,
        isCanChange: true, // 只显示可变更状态
        bindFlag: 'N', // 只显示未绑定绑定
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveCusOrder(res.data.content[0]);
        } else {
          this.clearCusOrder();
          this.msgSrv.info(this.appTranslationService.translate('分行客户订单编码无效'));
        }
      });
    } else {
      this.clearCusOrder();
    }
    this.generateChangeOC(this.i.cusOrderCode);
  }

  clearCusOrder() {
    this.cusOrderData.cusOrderCode = '';
    this.cusOrderData.cusOrderType = null;
    this.cusOrderData.itemCode = '';
    this.cusOrderData.productCategory = null;
    this.cusOrderData.cusAbbreviation = '';
    this.cusOrderData.cusCode = '';
    this.cusOrderData.plan = null;
    this.cusOrderData.steelType = null;
    this.cusOrderData.prodType = null;
    this.cusOrderData.stockCode = '';
    this.cusOrderData.stockName = '';
    this.cusOrderData.coatingUpCode = '';
    this.cusOrderData.coatingUpName = '';
    this.cusOrderData.coatingDownCode = '';
    this.cusOrderData.coatingDownName = '';
    this.cusOrderData.paper = null;
    this.cusOrderData.salesOrderType = null;
    this.cusOrderData.standards = '';
    this.cusOrderData.width = '';
    this.cusOrderData.prodLength = '';
    this.cusOrderData.quantity = '';
    this.cusOrderData.coating = null;
    this.cusOrderData.boxQuantity = '';
    this.cusOrderData.packingQuantuty = '';
    this.cusOrderData.cusDeliveryDate = null;
    this.cusOrderData.processingReq = '';
    this.cusOrderData.tolerance = '';
    this.cusOrderData.processingType = null;
    this.cusOrderData.surface = null;
    this.cusOrderData.hardness = '';
    this.cusOrderData.plannedDeliveryDate = null;
    this.cusOrderData.orderMonth = null;
    this.cusOrderData.plantCode = null;
    this.cusOrderData.salesStrategy = '';
    this.cusOrderData.standardsType = '';
    this.cusOrderData.elongation = '';
    this.cusOrderData.gloss = '';
    this.cusOrderData.ironLoss = '';
    this.cusOrderData.magnetoreception = '';
    this.cusOrderData.subsectionState = null;
    this.cusOrderData.coilInnerDia = '';
    this.cusOrderData.transportType = null;
    this.cusOrderData.fullVolume = null;
    this.cusOrderData.entrustedProcessing = null;
    this.cusOrderData.trmming = null;
    this.cusOrderData.unit = null;
    this.cusOrderData.unitOfMeasure = null;
    this.cusOrderData.weight = '';
    this.cusOrderData.packType = null;
    this.cusOrderData.sampleNum = '';
    this.cusOrderData.slittingQuantity = '';
    this.cusOrderData.settlestyle = null;
    Object.assign(this.i, this.cusOrderData);
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
    this.saveCustomer(e.Row);
  }

  saveCustomer(data) {
    this.i.cusAbbreviation = data.cusAbbreviation;
    this.i.cusCode = data.cusCode;
  }

  clearCustomer() {
    this.i.cusAbbreviation = '';
    this.i.cusCode = '';
  }

  onPopupSelectTextChanged(event: any) {
    this.i.cusAbbreviation = event.Text.trim();
    if(this.i.cusAbbreviation == '') { 
      this.clearCustomer();
      return; 
    } else {
      this.queryService
      .getCustoms({
        cusAbbreviation: this.i.cusAbbreviation,
        isCusCodeNotNull: true,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveCustomer(res.data.content[0]);
        } else {
          this.msgSrv.error(this.appTranslationService.translate('客户简称无效'))
          this.clearCustomer();
        }
      });
    }
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
   * 加载存货
   * @param {string} stockCode  存货编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadStocks(
    stockCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getProductions({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
      });
  }

  onStockTextChanged(e: any, type?: 'Up' | 'Down') {
    const stockCode = e.Text.trim();
    if(stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveStocks(res.data.content[0], type);
        } else {
          this.clearStocks(type);
          this.msgSrv.info(this.appTranslationService.translate('存货编码无效'));
        }
      });
    } else {
      this.clearStocks(type);
    }
  }

  onStocksSelect(e, type?: 'Up' | 'Down') {
    this.saveStocks(e.Row, type);
  }

  saveStocks(data, type?: 'Up' | 'Down') {
    if(!type) {
      // 保存存货编码、名称
      this.i.stockCode = data.stockCode;
      this.i.stockName = data.stockName;
    } else {
      // 保存面膜/底膜存货编码、描述
      this.i[`coating${type}Code`] = data.stockCode;
      this.i[`coating${type}Name`] = data.stockDesc;
      this.i[`${type.toLowerCase()}LabelDesc`] = data.labelDesc;
    }
  }

  clearStocks(type?: 'Up' | 'Down') {
    if(!type) {
      // 清空存货编码、名称
      this.i.stockCode = '';
      this.i.stockName = '';
    } else {
      // 清空面膜/底膜存货编码、描述
      this.i[`coating${type}Code`] = '';
      this.i[`coating${type}Name`] = '';
      this.i[`${type.toLowerCase()}LabelDesc`] = '';
    }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

}
