import { Component, OnInit, ViewChild } from "@angular/core";
import { decimal } from "@shared";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderQueryService } from "../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [CustomerOrderQueryService]
})
export class CustomerOrderImportComponent implements OnInit {

  plantOptions = [];
  plantCodeList = [];
  options: any = {};
  unitOfMeasureOptions: any = [{
    label: '吨',
    value: '003'
  }];
  
  impColumns = {
    columns: ['订单类型', '物料编码', '产品大类', '下单日期', '订单月份', '客户简称', '计划', '钢种', '形式', '存货名称', '面膜存货编码', '底膜存货编码', '表面保护', '销售类型'
      , '规格', '宽度', '长度', '数量', '箱数', '装箱张数', '客户交期', '加工要求', '公差', '是否自提', '是否客订'
      , '加工类型', '表面', '硬度', '米数', '工厂', '急要', '变更', '销售策略', '延伸率', '光泽度', '铁损', '磁感'
      , '分卷状态', '钢卷内径', '计价方式', '标签规格', '钢卷状态', '计划交期', '来料批号', '运输方式', '是否整卷', '是否受托', '是否切边', '数量单位', '重量单位', '重量', '包装方式', '样本编号', '分条数量', '结算方式'],
    paramMappings: [
      { field: 'cusOrderType', title: '订单类型', columnIndex: 1, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'itemCode', title: '物料编码', columnIndex: 2, constraint: { notNull: false, } },
      { field: 'productCategory', title: '产品大类', columnIndex: 3, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'orderDate', title: '下单日期', columnIndex: 4, type: 'date', constraint: { notNull: true, } },
      { field: 'orderMonth', title: '订单月份', columnIndex: 23, type: 'month', constraint: { notNull: true, } },
      { field: 'cusAbbreviation', title: '客户简称', columnIndex: 5, constraint: { notNull: true } },
      { field: 'plan', title: '计划', columnIndex: 6, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'steelType', title: '钢种', columnIndex: 7, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'prodType', title: '形式', columnIndex: 8, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'stockName', title: '存货名称', columnIndex: 9, constraint: { notNull: true, } },
      { field: 'coatingUpCode', title: '面膜存货编码', columnIndex: 9, constraint: { notNull: false, } },
      { field: 'coatingDownCode', title: '底膜存货编码', columnIndex: 9, constraint: { notNull: false, } },
      { field: 'paper', title: '表面保护', columnIndex: 10, default: '无', constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'salesOrderType', title: '销售类型', columnIndex: 10, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'standards', title: '规格', columnIndex: 11, constraint: { notNull: true, isNumber: true, precision: 2 } },
      { field: 'width', title: '宽度', columnIndex: 12, constraint: { notNull: true, } },
      { field: 'prodLength', title: '长度', columnIndex: 13, constraint: { notNull: true, } },
      { field: 'quantity', title: '数量', columnIndex: 14, constraint: { notNull: false, func: this.verify.bind(this) } },
      { field: 'unit', title: '数量单位', columnIndex: 41, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'unitOfMeasure', title: '重量单位', columnIndex: 42, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'weight', title: '重量', columnIndex: 43, constraint: { notNull: false, }, },
      { field: 'boxQuantity', title: '箱数', columnIndex: 15, constraint: { notNull: false, } },
      { field: 'packingQuantuty', title: '装箱张数', columnIndex: 16, constraint: { notNull: false, } },
      { field: 'cusDeliveryDate', title: '客户交期', columnIndex: 17, type: 'date', constraint: { notNull: true, } },
      { field: 'processingReq', title: '加工要求', columnIndex: 18, constraint: { notNull: false, } },
      { field: 'tolerance', title: '公差', columnIndex: 19, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'pickUp', title: '是否自提', columnIndex: 20, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'cusOrder', title: '是否客订', columnIndex: 21, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'processingType', title: '加工类型', columnIndex: 22, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'surface', title: '表面', columnIndex: 23, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'hardness', title: '硬度', columnIndex: 24, constraint: { notNull: true, } },
      { field: 'meterNum', title: '米数', columnIndex: 25, constraint: { notNull: false, } },
      { field: 'plantCode', title: '工厂', columnIndex: 26, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'urgent', title: '急要', columnIndex: 27, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'isChange', title: '变更', columnIndex: 28, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'salesStrategy', title: '销售策略', columnIndex: 29, constraint: { notNull: false, }, },
      // { field: 'standardsType', title: '规格尺寸', columnIndex: 30, constraint: { notNull: false, }, },
      { field: 'elongation', title: '延伸率', columnIndex: 31, constraint: { notNull: false, }, },
      { field: 'gloss', title: '光泽度', columnIndex: 32, constraint: { notNull: false, }, },
      { field: 'ironLoss', title: '铁损', columnIndex: 33, constraint: { notNull: false, }, },
      { field: 'magnetoreception', title: '磁感', columnIndex: 34, constraint: { notNull: false, }, },
      { field: 'subsectionState', title: '分卷状态', columnIndex: 35,
        default: '20', 
        constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'coilInnerDia', title: '钢卷内径', columnIndex: 36, constraint: { notNull: false, }, },
      { field: 'pricingType', title: '计价方式', columnIndex: 35,
        default: '20', 
        constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'labelSpecs', title: '标签规格', columnIndex: 36, constraint: { notNull: false, }, },
      { field: 'coilState', title: '钢卷状态', columnIndex: 36, constraint: { notNull: false, }, },
      { field: 'plannedDeliveryDate', title: '计划交期', columnIndex: 36, type: 'date', constraint: { notNull: false, }, },
      { field: 'coilBatchNum', title: '来料批号', columnIndex: 36, constraint: { notNull: false, }, },
      { field: 'transportType', title: '运输方式', columnIndex: 37, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'fullVolume', title: '是否整卷', columnIndex: 38, default: '1', constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'entrustedProcessing', title: '是否受托', columnIndex: 39, default: '0', constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'trmming', title: '是否切边', columnIndex: 40, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'packType', title: '包装方式', columnIndex: 44, 
        default: '330', 
        constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'sampleNum', title: '样本编号', columnIndex: 45, constraint: { notNull: false, }, },
      { field: 'slittingQuantity', title: '分条数量', columnIndex: 46, constraint: { notNull: false, },},
      { field: 'settlestyle', title: '结算方式', columnIndex: 47, constraint: { notNull: false, }, sequence: [], sequenceValue: [] } ,
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'cusOrderType', title: '订单类型', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false },
    { field: 'productCategory', title: '产品大类', width: 150, locked: false },
    { field: 'orderDate', title: '下单日期', width: 150, locked: false },
    { field: 'orderMonth', title: '订单月份', width: 150, locked: false },
    { field: 'cusAbbreviation', title: '客户简称', width: 150, locked: false },
    { field: 'plan', title: '计划', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false },
    { field: 'prodType', title: '形式', width: 150, locked: false },
    { field: 'stockName', title: '存货名称', width: 150, locked: false },
    { field: 'coatingUpCode', title: '面膜存货编码', width: 150, locked: false },
    { field: 'coatingDownCode', title: '底膜存货编码', width: 150, locked: false },
    { field: 'paper', title: '表面保护', width: 150, locked: false },
    { field: 'salesOrderType', title: '销售类型', width: 150, locked: false },
    { field: 'standards', title: '规格', width: 150, locked: false },
    { field: 'width', title: '宽度', width: 150, locked: false },
    { field: 'prodLength', title: '长度', width: 150, locked: false },
    { field: 'quantity', title: '数量', width: 150, locked: false },
    { field: 'boxQuantity', title: '箱数', width: 150, locked: false },
    { field: 'packingQuantuty', title: '装箱张数', width: 150, locked: false },
    { field: 'cusDeliveryDate', title: '客户交期', width: 150, locked: false },
    { field: 'processingReq', title: '加工要求', width: 150, locked: false },
    { field: 'tolerance', title: '公差', width: 150, locked: false },
    { field: 'pickUp', title: '是否自提', width: 150, locked: false },
    { field: 'cusOrder', title: '是否客订', width: 150, locked: false },
    { field: 'processingType', title: '加工类型', width: 150, locked: false },
    { field: 'surface', title: '表面', width: 150, locked: false },
    { field: 'hardness', title: '硬度', width: 150, locked: false },
    { field: 'meterNum', title: '米数', width: 150, locked: false },
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'urgent', title: '急要', width: 150, locked: false },
    { field: 'isChange', title: '变更', width: 150, locked: false },
    { field: 'salesStrategy', title: '销售策略', width: 150, locked: false },
    { field: 'standardsType', title: '规格尺寸', width: 150, locked: false },
    { field: 'elongation', title: '延伸率', width: 150, locked: false },
    { field: 'gloss', title: '光泽度', width: 150, locked: false },
    { field: 'ironLoss', title: '铁损', width: 150, locked: false },
    { field: 'magnetoreception', title: '磁感', width: 150, locked: false },
    { field: 'subsectionState', title: '分卷状态', width: 150, locked: false },
    { field: 'pricingType', title: '计价方式', width: 150, locked: false },
    { field: 'labelSpecs', title: '标签规格', width: 150, locked: false },
    { field: 'coilState', title: '钢卷状态', width: 150, locked: false },
    { field: 'plannedDeliveryDate', title: '计划交期', width: 150, locked: false },
    { field: 'coilBatchNum', title: '来料批号', width: 150, locked: false },
    { field: 'coilInnerDia', title: '钢卷内径', width: 150, locked: false },
    { field: 'transportType', title: '运输方式', width: 150, locked: false },
    { field: 'fullVolume', title: '是否整卷', width: 150, locked: false },
    { field: 'entrustedProcessing', title: '是否受托', width: 150, locked: false },
    { field: 'trmming', title: '是否切边', width: 150, locked: false },
    { field: 'unit', title: '数量单位', width: 150, locked: false },
    { field: 'unitOfMeasure', title: '重量单位', width: 150, locked: false },
    { field: 'weight', title: '重量', width: 150, locked: false },
    { field: 'packType', title: '包装方式', width: 150, locked: false },
    { field: 'sampleNum', title: '样本编号', width: 150, locked: false },
    { field: 'slittingQuantity', title: '分条数量', width: 150, locked: false },
    { field: 'settlestyle', title: '结算方式', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    tempData = this.dataFormatter(tempData);
    this.queryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        this.excelexport.export(res.data);
        if(res.data.length < tempData.length) {
          this.modal.close(true);
        }
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // 订单类型
    this.commonImportService.setSequence(this.impColumns, 'cusOrderType', this.options.cusOrderTypeOptions);
    // 加工类型
    this.commonImportService.setSequence(this.impColumns, 'processingType', this.options.processingTypeOptions);
    // 产品大类
    this.commonImportService.setSequence(this.impColumns, 'productCategory', this.options.productCategoryOptions);
    // 计划
    this.commonImportService.setSequence(this.impColumns, 'plan', this.options.planOptions);
    // 钢种
    this.commonImportService.setSequence(this.impColumns, 'steelType', this.options.contractSteelTypeOptions);
    // 形式
    this.commonImportService.setSequence(this.impColumns, 'prodType', this.options.prodTypeOptions);
    // 表面保护
    this.commonImportService.setSequence(this.impColumns, 'paper', this.options.paperOptions);
    // 销售类型
    this.commonImportService.setSequence(this.impColumns, 'salesOrderType', this.options.salesOrderTypeOptions);
    // 是否自提
    this.commonImportService.setSequence(this.impColumns, 'pickUp', this.options.YesNoOptions);
    // 是否客订
    this.commonImportService.setSequence(this.impColumns, 'cusOrder', this.options.YesNoOptions);
    // 表面
    this.commonImportService.setSequence(this.impColumns, 'surface', this.options.contractSurfaceOptions);    
    // 急要
    this.commonImportService.setSequence(this.impColumns, 'urgent', this.options.YesNoOptions);
    // 变更
    this.commonImportService.setSequence(this.impColumns, 'isChange', this.options.YesNoOptions);
    // 分卷状态
    this.commonImportService.setSequence(this.impColumns, 'subsectionState', this.options.subsectionStateOptions);
    // 计价方式
    this.commonImportService.setSequence(this.impColumns, 'pricingType', this.options.pricingTypeOptions);
    // 运输方式
    this.commonImportService.setSequence(this.impColumns, 'transportType', this.options.transportTypeOptions);
    // 是否整卷
    this.commonImportService.setSequence(this.impColumns, 'fullVolume', this.options.YesNoOptions);
    // 是否受托
    this.commonImportService.setSequence(this.impColumns, 'entrustedProcessing', this.options.YesNoOptions);
    // 是否切边
    this.commonImportService.setSequence(this.impColumns, 'trmming', this.options.YesNoOptions);
    // 单位
    this.commonImportService.setSequence(this.impColumns, 'unit', this.options.unitOptions);
    // 重量单位
    this.commonImportService.setSequence(this.impColumns, 'unitOfMeasure', this.unitOfMeasureOptions);
    // 包装方式
    this.commonImportService.setSequence(this.impColumns, 'packType', this.options.packTypeOptions);
    // 结算方式
    this.commonImportService.setSequence(this.impColumns, 'settlestyle', this.options.settleStyleOptions);
    // 公差
    this.commonImportService.setSequence(this.impColumns, 'tolerance', this.options.gongchaOptions);
  }


  loadOptions() {
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        })
      });
      console.log(this.plantOptions);
      // 工厂
      this.commonImportService.setSequence(this.impColumns, 'plantCode', this.plantOptions);
      console.log(this.impColumns);
    });
  }

  close() {
    this.modal.destroy();
  }

  verify(columns, item) {
    const data = this.commonImportService.getColumnValue(columns, item, ['unit', 'quantity', 'prodType', 'weight', 'unitOfMeasure']);
    let errMsg = '';
    if(data.prodType === '卷材') {
      // 卷材：重量、重量单位必填，数量、数量单位非必填
      if(this.isNull(data.unitOfMeasure) || this.isNull(data.weight)) {
        errMsg = '【形式】为卷材，【重量】、【重量单位】不能为空！';
      }
    } else {
      // 板材：重量、重量单位或数量、数量单位要求必填一组，在保存时提示
      if((this.isNull(data.unitOfMeasure) || this.isNull(data.weight)) && (this.isNull(data.unit) || this.isNull(data.quantity))) {
        errMsg = '【形式】为板材，【重量】、【重量单位】或【数量】、【数量单位】要求必填一组';
      }
    }
    return errMsg;
  }

  isNull(value) {
    return (value || '') === '';
  }

  dataFormatter(tempData) {
    const data = [];
    tempData.forEach(d => {
      data.push(Object.assign({}, d, {
        standardsType: this.generateStandardsType(d),
      }))
    })
    return data;
  }

  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;
  // 规格尺寸形式：规格*宽度*长度
  generateStandardsType(data) {
    const standards = this.formatterPrecision(data.standards) || 0;
    const width = data.width || 0;
    const prodLength = Number(data.prodLength) || 'C';
    return `${standards}*${width}*${prodLength}`;
  }

}
