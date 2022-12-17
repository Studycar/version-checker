import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { SalesDistDetailedQueryService } from "../query.service";

@Component({
  selector: 'sales-dist-detailed-edit',
  templateUrl: './edit.component.html',
  providers: [SalesDistDetailedQueryService]
})
export class SalesDistDetailedEditComponent implements OnInit {
  isModify: Boolean = false;
  isQuanSatisfied: Boolean = true; // 数量是否满足条件
  isCurrent: Boolean = false; // 是否现货
  quantitySy; // 合同待分货量
  i: any = {};
  iClone: any = {};
  distTypeOptions: any = []; // PS_DIST_TYPE
  distDetailedStateOptions: any = [];  // PS_DIST_DETAILED_STATE
  productCategoryOptions: any[] = [];
  productCategoryOptions1: any[] = [];
  transportTypeOptions: any[] = [];
  pricingTypeOptions: any[] = [];
  YesNoOptions: any[] = [];
  prodTypeOptions: any[] = [];
  subsectionStateOptions: any[] = [];
  materialOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  formatterPrecision6 = (value: number | string) => value ? decimal.roundFixed(Number(value), 6) : value;
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

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
      field: 'area',
      width: 120,
      title: '送货区域',
    },
    {
      field: 'ranges',
      width: 120,
      title: '送货范围',
    },
  ];

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
    {
      field: 'underpaymentQuantity',
      width: 120,
      title: '欠货重量',
    },
    {
      field: 'underpaymentAmount',
      width: 120,
      title: '欠货数量',
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

  // 绑定调拨单明细
  // 绑定调拨单明细
  public gridViewTransfersDetail: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsTransfersDetail: any[] = [
    {
      field: 'code',
      width: 120,
      title: '调拨单号'
    },
    {
      field: 'pono',
      width: 120,
      title: '调拨单行号'
    },
    {
      field: 'state',
      width: 120,
      title: '调拨单行状态',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '批号',
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量',
    },
    {
      field: 'taxPrice',
      width: 120,
      title: '单价',
    },
    {
      field: 'money',
      width: 120,
      title: '金额',
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
      field: 'unit',
      width: 120,
      title: '单位',
    },
    {
      field: 'steelStandart',
      width: 120,
      title: '规格尺寸'
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'grade',
      width: 120,
      title: '等级',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'thickness',
      width: 120,
      title: '实厚'
    },
    {
      field: 'cwar',
      width: 120,
      title: '货位'
    },
    {
      field: 'weigth',
      width: 120,
      title: '实宽'
    },
    {
      field: 'grossWeight',
      width: 120,
      title: '毛重'
    },
    {
      field: 'length',
      width: 120,
      title: '长度'
    },
    {
      field: 'qualityInformation',
      width: 120,
      title: '品质信息'
    },
    {
      field: 'coating',
      width: 120,
      title: '保护材料',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'batchNumRemarks',
      width: 120,
      title: '批号备注'
    },
    {
      field: 'haulWay',
      width: 120,
      title: '运输路线'
    },
    {
      field: 'transportationEnterprise',
      width: 120,
      title: '目的地'
    },
  ];
  transferDetailedOptions = {
    1: { 'PS_CONTRACT_STEEL_TYPE': [] },
    2: { 'PS_CONTRACT_SURFACE': [] },
    3: { 'PS_GRADE': [] },
    4: { 'PS_ALLOT_DETAILED_STATE': [] },
    5: { 'PS_COATING': [] },
  }

  // 绑定现有量表
  public gridViewOnhands: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsOnhands: any[] = [
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
      field: 'itemDescription',
      title: '物料描述',
      width: '100'
    },
    {
      field: 'standardType',
      title: '规格型号',
      width: '100'
    },
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
    {
      field: 'distributionWarehouse',
      title: '配送公仓',
      width: '100'
    },
    {
      field: 'spec',
      title: '钢材规格尺寸',
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
      field: 'paper',
      title: '表面保护',
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
      field: 'coatingUpCode',
      title: '面膜存货编码',
      width: '150'
    },
    {
      field: 'coatingUpDesc',
      title: '面膜存货描述',
      width: '150'
    },
    {
      field: 'coatingDownCode',
      title: '底膜存货编码',
      width: '150'
    },
    {
      field: 'coatingDownDesc',
      title: '底膜存货描述',
      width: '150'
    },
    {
      field: 'actHeight',
      title: '实厚',
      width: '100'
    },
    {
      field: 'unitWeight',
      title: '单重（KG）',
      width: '100'
    },
    {
      field: 'originalWeight',
      title: '重量（KG）',
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
      field: 'rewinding',
      title: '是否重卷',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,5).label'
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
    {
      field: 'prodType',
      title: '形式',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
  ];
  onhandOptions = {
    1: { 'PS_CONTRACT_STEEL_TYPE': [] },
    2: { 'PS_CONTRACT_SURFACE': [] },
    3: { 'PS_GRADE': [] },
    4: { 'PS_SUBSECTION_STATE': [] },
    5: { 'PS_YES_NOT': [] },
    6: { 'PS_PACK_TYPE': [] },
    7: { 'PS_PROD_TYPE': [] },
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
      title: '金额',
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
      field: 'signingDate',
      width: 120,
      title: '签订日期',
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

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: SalesDistDetailedQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.quantitySy = this.i.quantitySy;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      this.i.distDetailedState = '10';
      this.i.taxRate = 13;
      this.i.basePrice = 0;
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_DIST_TYPE': this.distTypeOptions,
      'PS_DIST_DETAILED_STATE': this.distDetailedStateOptions,
      'HOUBO': this.materialOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
    });
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
    this.queryService.GetLookupByType('PS_PRODUCT_CATEGORY').subscribe(res => {
      if(res.Success && res.Extra.length > 0) {
        res.Extra.forEach(d => {
          if(this.productCategoryOptions.findIndex(o => o.value === d.lookupCode) > -1) {
            this.productCategoryOptions1.push({
              label: d.meaning,
              value: d.lookupCode,
              attribute1: d.attribute1,
              attribute2: d.attribute2,
            });
          }
        });
      }
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    if(this.i.branchCusOrderCode || this.isCurrent) {
      this.i.distDetailedState = '20';
    }
    if(this.isModify && this.iClone.contractCode) {
      this.queryService.save(this.i).subscribe(res => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      this.queryService.combineQuantity(this.i, this.quantitySy, this.productCategoryOptions1).then(() => {
        this.queryService.save(this.i).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('保存成功'));
            this.modal.close(true);
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        })
      });
    }
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
   * @param {string} cusOrderCode  客户订单号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
   public loadCustomerOrders(
    branchCusOrderCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getBranchCustomerOrder({
        branchCusOrderCode: branchCusOrderCode,
        prodType: this.i.prodType,
        isCanDist: true,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewBranchCustomOrders.data = res.data.content;
        this.gridViewBranchCustomOrders.total = res.data.totalElements;
      });
  }

  onCustomerOrderTextChanged(e) {
    this.i.branchCusOrderCode = e.Text.trim();
    if(this.i.branchCusOrderCode !== '') {
      this.queryService
      .getBranchCustomerOrder({
        branchCusOrderCode: this.i.branchCusOrderCode,
        isCanDist: true,
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
    this.i.branchCusOrderCode = data.branchCusOrderCode;
    this.i.productCategory = data.productCategory;
    this.i.cusCode = data.cusCode;
    this.i.cusAbbreviation = data.cusAbbreviation;
  }

  clearCusOrder() {
    this.i.branchCusOrderCode = null;
    this.i.productCategory = null;
    this.i.cusCode = null;
    this.i.cusAbbreviation = null;
  }
  
  searchSalesOrders(e) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadSalesOrder(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载销售订单
   * @param {string} salesOrderCode  销售订单号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
   public loadSalesOrder(
    salesOrderCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getSalesOrderDetailed({
        detailedNum: salesOrderCode,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewSaleOrderDetaileds.data = res.data.content;
        this.gridViewSaleOrderDetaileds.total = res.data.totalElements;
      });
  }

  onSaleOrderTxetChanged(e) {
    this.i.salesOrderCode = e.Text.trim();
    if(this.i.salesOrderCode !== '') {
      this.queryService
      .getSalesOrderDetailed({
        detailedNum: this.i.salesOrderCode,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveSalesOrder(res.data.content[0]);
        } else {
          this.clearSalesOrder();
          this.msgSrv.info(this.appTranslationService.translate('销售订单号无效'));
        }
      });
    } else {
      this.clearSalesOrder();
    }
  }

  onRowSelectSalesOrders(e) {
    this.saveSalesOrder(e.Row);
  }

  saveSalesOrder(data) {
    this.i.salesOrderCode = data.detailedNum;
  }

  clearSalesOrder() {
    this.i.salesOrderCode = null;
  }
  
  searchTransferOrders(e) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadTransferOrder(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载调拨单
   * @param {string} pono  调拨单行号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
   public loadTransferOrder(
    pono: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getTransferOrderDetail({
        pono: pono,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewTransfersDetail.data = res.data.content;
        this.gridViewTransfersDetail.total = res.data.totalElements;
      });
  }

  onTransferTxetChanged(e) {
    this.i.transferOrderCode = e.Text.trim();
    if(this.i.transferOrderCode !== '') {
      this.queryService
      .getTransferOrderDetail({
        pono: this.i.transferOrderCode,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveTransferOrder(res.data.content[0]);
        } else {
          this.clearTransferOrder();
          this.msgSrv.info(this.appTranslationService.translate('调拨单行号无效'));
        }
      });
    } else {
      this.clearTransferOrder();
    }
  }

  onRowSelectTransferOrders(e) {
    this.saveTransferOrder(e.Row);
  }

  saveTransferOrder(data) {
    this.i.transferOrderCode = data.pono;
  }

  clearTransferOrder() {
    this.i.transferOrderCode = null;
  }

  /**
   * 现有量弹出查询
   * @param {any} e
   */
   public searchOnhands(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadOnhands(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载现有量
   * @param {string} batchCode  批号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadOnhands(
    batchCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getOnhands({
        // plantCode: this.plantCode,
        batchCode: batchCode,
        filterFlag: true,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewOnhands.data = res.data.content;
        this.gridViewOnhands.total = res.data.totalElements;
      });
  }

  onOnhandTextChanged(e: any) {
    this.i.batchCode = e.Text.trim();
    if(this.i.batchCode !== '') {
      this.queryService
      .getOnhands({
        // plantCode: this.plantCode,
        batchCode: this.i.batchCode,
        filterFlag: true,
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveOnhands(res.data.content[0]);
        } else {
          this.clearOnhands();
          this.msgSrv.info(this.appTranslationService.translate('批号或存货名称无效'));
        }
      });
    } else {
      this.clearOnhands();
    }
  }

  onHandsSelect(e) {
    this.saveOnhands(e.Row);
  }

  onhandData: any = {};
  saveOnhands(data) {
    delete data.sqlMap;
    delete data.hasAdmin;
    console.log('data', data)
    this.i = Object.assign({}, this.i, data, {
      id: this.isModify ? this.i.id : null,
      warehouseCode: data.whCode,
      warehouseName: data.whName,
      onHandQuantitiesId: data.id,
      pricingType: data.pricingType || this.i.pricingType,
      prodType: data.prodType || this.i.prodType,
      entrustedProcessing: data.entrustedProcessing || this.i.entrustedProcessing,
      realWhCode: data.subinventoryCode,
      unitOfWeight: data.unitOfMeasure,
      unitCodeWeight: data.unitCode,
      coatingUpName: data.coatingUpDesc,
      coatingDownName: data.coatingDownDesc,
      unitName: data.unitOfMeasure,
      theoreticalWeight: data.lilunWeigthKg,
    });
    this.onhandData = data;
    this.generateAmountIncludingTax();
  }

  clearOnhands() {
    for(let key in this.onhandData) {
      if(this.i.hasOwnProperty(key) && !['pricingType', 'prodType', 'entrustedProcessing'].includes(key)) {
        this.i[key] = null;
      }
    }
    this.i.warehouseCode = '';
    this.i.warehouseName = '';
    this.i.theoreticalWeight = '';
    this.i.onHandQuantitiesId = '';
    this.generateAmountIncludingTax();
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
    this.queryService
      .getDistributions({
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
    this.saveWares(e.Row);
  }

  onWaresTextChanged(event: any) {
    const warehouse = event.Text.trim();
    if(warehouse !== '') {
      this.queryService
      .getDistributions({
        warehouse: warehouse,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveWares(res.data.content[0]);
        } else {
          this.clearWares();
          this.msgSrv.warning(this.appTranslationService.translate('配送仓库无效'))
        }
      });
    } else {
      this.clearWares();
    }
  }

  saveWares(data) {
    this.i.place = data.warehouse;
  }

  clearWares() {
    this.i.place = '';
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
   * 加载客户
   * @param {string} contractCode  合同号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadContracts(
    contractCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.productCategory) {
      this.msgSrv.warning(this.appTranslationService.translate(this.isCurrent ? '请先选择产品大类' : '请先选择分行客户订单'));
      return;
    }
    if(this.isCurrent && !this.i.cusCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择客户'));
      return;
    }
    this.queryService
      .getContracts({
        contractCode: contractCode,
        contractState: '30',
        cusCode: this.i.cusCode,
        plantCode: this.i.plantCode,
        steelType: this.i.steelGrade,
        categoryCode: this.i.productCategory,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewContracts.data = res.data.content;
        this.gridViewContracts.total = res.data.totalElements;
      });
  }

  ContractTextChanged(event: any) {
    if(!this.i.productCategory) {
      this.msgSrv.warning(this.appTranslationService.translate(this.isCurrent ? '请先选择产品大类' : '请先选择分行客户订单'));
      this.clearContract();
      return;
    }
    if(this.isCurrent && !this.i.cusCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择客户'));
      return;
    }
    this.i.contractCode = event.Text.trim();
    if(this.i.contractCode !== '') {
      this.queryService
      .getContracts({
        contractCode: this.i.contractCode,
        contractState: '30',
        cusCode: this.i.cusCode,
        plantCode: this.i.plantCode,
        steelType: this.i.steelGrade,
        categoryCode: this.i.productCategory,
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('合同号无效'));
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
    this.i.basePrice = decimal.div(data.basePrice, 1000);
    this.generateFixedPrice();
    this.quantitySy = data.quantitySy;
  }

  clearContract() {
    this.i.contractCode = null;
    this.i.basePrice = 0;
    this.generateFixedPrice();
    this.quantitySy = null;
  }

  // 税率更新时：更新无税金额
  taxRateChange() {
    this.generateMoney();
  }

  // 计算限价：基价 + 加价 + 特殊加价
  generateFixedPrice() {
    const basePrice = this.i.basePrice || 0;
    const markup = this.i.markUp || 0;
    const specialMarkup = this.i.specialMarkup || 0;
    this.i.fixedPrice = decimal.roundFixed(decimal.add(basePrice, markup, specialMarkup), 6);
    // 限价更新时：更新含税金额、含税价
    this.generateAmountIncludingTax();
    this.generateTaxPrice();
    this.f.control.markAsDirty();
  }

  // 计算含税价：等于限价，可编辑
  generateTaxPrice() {
    this.i.taxPrice = decimal.roundFixed(this.i.fixedPrice, 6);
    this.f.control.markAsDirty();
  }

  amountIncludingTax; // 保存含税金额精确结果
  // 计算含税金额：限价 * 数量
  generateAmountIncludingTax() {
    const fixedPrice = this.i.fixedPrice || 0;
    switch (this.i.pricingType) {
      case '10':
        const avaQuantity = this.i.avaQuantity || 0;
        this.i.amountIncludingTax = decimal.mul(avaQuantity, fixedPrice); // 限价 * 现有量
        break;
    
      case '20':
        const theoreticalWeight = this.i.theoreticalWeight || 0;
        this.i.amountIncludingTax = decimal.mul(theoreticalWeight, fixedPrice); // 限价 * 理重
        break;
    
      case '30':
        const weight = this.i.weight || 0;
        this.i.amountIncludingTax = decimal.mul(weight, fixedPrice); // 限价 * 净重
        break;
    
      default:
        break;
    }
    this.amountIncludingTax = this.i.amountIncludingTax;
    this.i.amountIncludingTax = decimal.roundFixed(this.i.amountIncludingTax, 2);
    // 含税金额更新时：更新税额、金额
    this.generateTaxAmount();
    this.generateMoney();
    this.f.control.markAsDirty();
  }

  // 计算无税金额：含税金额 / (1+(税率/100))
  generateMoney() {
    const amountIncludingTax = this.amountIncludingTax || 0;
    const taxRate = this.i.taxRate || 13;
    this.i.money = decimal.roundFixed(decimal.div(amountIncludingTax, decimal.add(1, decimal.div(taxRate, 100))), 2);
    // 无税金额更新时：更新税额
    this.generateTaxAmount();
    this.f.control.markAsDirty();
  }

  // 计算税额：含税金额 - 无税金额，保留两位小数
  generateTaxAmount() {
    const money = this.i.money || 0;
    const amountIncludingTax = this.i.amountIncludingTax || 0;
    this.i.taxAmount = decimal.roundFixed(decimal.minus(amountIncludingTax, money), 2);
    this.f.control.markAsDirty();
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
      plantCode: this.i.plantCode,
      cusAbbreviation: cusAbbreviation,
      pageIndex: PageIndex,
      pageSize: PageSize,
      isCusCodeNotNull: true
    })
    .subscribe(res => {
      this.gridViewCustoms.data = res.data.content;
      this.gridViewCustoms.total = res.data.totalElements;
    });
  }

  //  行点击事件， 给参数赋值
  onRowSelectCustoms(e: any) {
    this.setCus(e.Row);
  }

  setCus(data) {
    this.i.cusCode = data.cusCode;
    this.i.cusAbbreviation = data.cusAbbreviation;
  }

  clearCus() {
    this.i.cusCode = '';
    this.i.cusAbbreviation = '';
    this.clearContract();
  }

  onPopupSelectTextChanged(event: any) {
    const cusAbbreviation = event.Text.trim();
    if(cusAbbreviation !== '') {
      this.queryService
      .getCustoms({
        plantCode: this.i.plantCode,
        cusAbbreviation: cusAbbreviation,
        isCusCodeNotNull: true
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.setCus(res.data.content[0]);
        } else {
          this.clearCus();
          this.msgSrv.info(this.appTranslationService.translate('该客户简称无效！'))
        }
      });
    } else {
      this.clearCus();
    }
  }
}