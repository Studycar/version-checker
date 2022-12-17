import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonImportService } from 'app/modules/base_module/services/common-import.service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { DemandclearupnoticeService } from 'app/modules/generated_module/services/demandclearupnotice-service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pp-req-order-import',
  templateUrl: './import.component.html',
  // providers: []
})
export class PpReqOrderImportComponent implements OnInit {

  options;

  impColumns = {
    columns: ['工厂', '产品编码', '产品描述', '产品大类', '需求订单号', '需求订单行号', '订单版本', '需求数量', '需求日期',
      // '承诺日期', 
      '需求说明', '切边标识', '产品表面', '产品规格', '产品宽', '产品长', '钢种',
      '面膜编码', '面膜描述', '底膜编码', '底膜描述', '表面保护', '是否受托', '计价方式', '标签规格'],

    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'stockCode', title: '产品编码', columnIndex: 20, constraint: { notNull: true, } },
      { field: 'stockName', title: '产品描述', columnIndex: 30, constraint: { notNull: false, } },
      { field: 'productCategoryDesc', title: '产品大类', columnIndex: 40, constraint: { notNull: true, } },
      { field: 'reqNumber', title: '需求订单号', columnIndex: 50, constraint: { notNull: true, } },
      { field: 'reqLineNum', title: '需求订单行号', columnIndex: 60, constraint: { notNull: true, } },
      { field: 'reqVersion', title: '订单版本', columnIndex: 70, constraint: { notNull: false, } },
      { field: 'reqQty', title: '需求数量', columnIndex: 80, constraint: { notNull: true, } },
      //  { field: 'unitOfMeasureDesc', title: '订单单位', columnIndex: 90, constraint: { notNull: true, } },
      { field: 'reqDate', title: '需求日期', columnIndex: 100, type: 'date', constraint: { notNull: true, } },
      // { field: 'promiseDate', title: '承诺日期', columnIndex: 110, type: 'date', constraint: { notNull: false, } },
      { field: 'reqComment', title: '需求说明', columnIndex: 120, constraint: { notNull: false, } },
      { field: 'needSideCutDesc', title: '切边标识', columnIndex: 130, constraint: { notNull: true, } },
      { field: 'surfaceDesc', title: '产品表面', columnIndex: 140, constraint: { notNull: true, } },
      { field: 'standards', title: '产品规格', columnIndex: 150, constraint: { notNull: true, isNumber: true, precision: 2 } },
      { field: 'width', title: '产品宽', columnIndex: 160, constraint: { notNull: true, } },
      { field: 'length', title: '产品长', columnIndex: 165, constraint: { notNull: false, } },
      { field: 'steelTypeDesc', title: '钢种', columnIndex: 170, constraint: { notNull: true, } },
      { field: 'coatingUpCode', title: '面膜编码', columnIndex: 20, constraint: { notNull: false, } },
      { field: 'coatingUpName', title: '面膜描述', columnIndex: 30, constraint: { notNull: false, } },
      { field: 'coatingDownCode', title: '底膜编码', columnIndex: 20, constraint: { notNull: false, } },
      { field: 'coatingDownName', title: '底膜描述', columnIndex: 30, constraint: { notNull: false, } },
      { field: 'paperDesc', title: '表面保护', columnIndex: 30, constraint: { notNull: false, } },
      { field: 'entrustedProcessingDesc', title: '是否受托', columnIndex: 30, constraint: { notNull: false, } },
      { field: 'pricingTypeDesc', title: '计价方式', columnIndex: 30, constraint: { notNull: true, } },
      { field: 'labelSpecs', title: '标签规格', columnIndex: 30, constraint: { notNull: false, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: true },
    { field: 'stockCode', title: '产品编码', width: 150, locked: true },
    { field: 'stockName', title: '产品描述', width: 150, locked: false },
    { field: 'productCategoryDesc', title: '产品大类', width: 150, locked: false },
    { field: 'reqNumber', title: '需求订单号', width: 150, locked: false },
    { field: 'reqLineNum', title: '需求订单行号', width: 150, locked: false },
    { field: 'reqVersion', title: '订单版本', width: 150, locked: false },
    { field: 'reqQty', title: '需求数量', width: 150, locked: false },
    // { field: 'unitOfMeasureDesc', title: '订单单位', width: 150, locked: false },
    { field: 'reqDate', title: '需求日期', width: 150, locked: false },
    // { field: 'promiseDate', title: '承诺日期', width: 150, locked: false },
    { field: 'reqComment', title: '需求说明', width: 150, locked: false },
    { field: 'needSideCutDesc', title: '切边标识', width: 150, locked: false },
    { field: 'surfaceDesc', title: '产品表面', width: 150, locked: false },
    { field: 'standards', title: '产品规格', width: 150, locked: false },
    { field: 'width', title: '产品宽', width: 150, locked: false },
    { field: 'length', title: '产品长', width: 150, locked: false },
    { field: 'steelTypeDesc', title: '钢种', width: 150, locked: false },
    { field: 'coatingUpCode', title: '面膜编码', width: 150, locked: false },
    { field: 'coatingUpName', title: '面膜描述', width: 150, locked: false },
    { field: 'coatingDownCode', title: '底膜编码', width: 150, locked: false },
    { field: 'coatingDownName', title: '底膜描述', width: 150, locked: false },
    { field: 'paperDesc', title: '表面保护', width: 150, locked: false },
    { field: 'entrustedProcessingDesc', title: '是否受托', width: 150, locked: false },
    { field: 'pricingTypeDesc', title: '计价方式', width: 150, locked: false },
    { field: 'labelSpecs', title: '标签规格', width: 150, locked: false },
    { field: 'errorMessage', title: '错误', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    const errData = [];
    this.queryService.importData(tempData).subscribe(res => {
      if (res.code === 200) {
        if (errData.length > 0) {
          this.excelexport.export(errData);
          this.msgSrv.info(this.appTranslationService.translate(`导入成功${tempData.length}条，导入失败${errData.length}条，请查看导出信息`));
        } else {
          this.msgSrv.success(this.appTranslationService.translate('导入成功'));
          this.modal.close(true);
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        this.excelexport.export(res.data);
        if (res.data.length < tempData.length) {
          this.modal.close(true);
        }
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: DemandclearupnoticeService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'plantCode', this.options.plantOptions);
    // this.commonImportService.setSequence(this.impColumns, 'processingType', this.options.processingTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'packType', this.options.packTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'entrustedProcessing', this.options.YesNoOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
