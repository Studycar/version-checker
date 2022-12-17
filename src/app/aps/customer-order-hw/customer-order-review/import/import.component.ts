import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderReviewQueryService } from "../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [CustomerOrderReviewQueryService]
})
export class CustomerOrderReviewImportComponent implements OnInit {

  plantOptions = [];
  plantCodeList = [];
  options: any = {};
  
  impColumns = {
    columns: ['工厂', '产品大类', '形式', '加工类型', '钢种', '表面', '厚度(>=)', '厚度(<)', '厚度递增步长', '字尾', '宽度(>=)', 
    '宽度(<)', '宽度递增步长', '长度(>=)', '长度(<)', '硬度', '光泽度', '延伸率', '铁损', '磁感', '钢卷内径'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'productCategory', title: '产品大类', columnIndex: 2, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'prodType', title: '形式', columnIndex: 2, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'processingType', title: '加工类型', columnIndex: 2, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'steelType', title: '钢种', columnIndex: 3, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'surface', title: '表面', columnIndex: 5, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'standardsDown', title: '厚度(>=)', columnIndex: 5, constraint: { notNull: true, isNumber: true, precision: 2 } },
      { field: 'standardsUp', title: '厚度(<)', columnIndex: 5, constraint: { notNull: true, isNumber: true, precision: 2 } },
      { field: 'standardsStep', title: '厚度递增步长', columnIndex: 5, constraint: { notNull: true } },
      { field: 'standardsTail', title: '字尾', columnIndex: 5, constraint: { notNull: true } },
      { field: 'widthDown', title: '宽度(>=)', columnIndex: 6, constraint: { notNull: true } },
      { field: 'widthUp', title: '宽度(<)', columnIndex: 6, constraint: { notNull: true } },
      { field: 'widthStep', title: '宽度递增步长', columnIndex: 6, constraint: { notNull: true } },
      { field: 'lengthDown', title: '长度(>=)', columnIndex: 6, constraint: { notNull: false } },
      { field: 'lengthUp', title: '长度(<)', columnIndex: 6, constraint: { notNull: false } },
      { field: 'hardness', title: '硬度', columnIndex: 9, constraint: { notNull: false, } },
      { field: 'gloss', title: '光泽度', columnIndex: 10, constraint: { notNull: false, } },
      { field: 'elongation', title: '延伸率', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'ironLoss', title: '铁损', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'magnetoreception', title: '磁感', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'coilInnerDia', title: '钢卷内径', columnIndex: 11, constraint: { notNull: false, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'productCategory', title: '产品大类', width: 150, locked: false },
    { field: 'prodType', title: '形式', width: 150, locked: false },
    { field: 'processingType', title: '加工类型', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false },
    { field: 'surface', title: '表面', width: 150, locked: false },
    { field: 'standardsDown', title: '厚度(>=)', width: 150, locked: false },
    { field: 'standardsUp', title: '厚度(<)', width: 150, locked: false },
    { field: 'standardsStep', title: '厚度递增步长', width: 150, locked: false },
    { field: 'standardsTail', title: '字尾', width: 150, locked: false },
    { field: 'widthDown', title: '宽度(>=)', width: 150, locked: false },
    { field: 'widthUp', title: '宽度(<)', width: 150, locked: false },
    { field: 'widthStep', title: '宽度递增步长', width: 150, locked: false },
    { field: 'lengthDown', title: '长度(>=)', width: 150, locked: false },
    { field: 'lengthUp', title: '长度(<)', width: 150, locked: false },
    { field: 'hardness', title: '硬度', width: 150, locked: false },
    { field: 'gloss', title: '光泽度', width: 150, locked: false },
    { field: 'elongation', title: '延伸率', width: 150, locked: false },
    { field: 'ironLoss', title: '铁损', width: 150, locked: false },
    { field: 'magnetoreception', title: '磁感', width: 150, locked: false },
    { field: 'coilInnerDia', title: '钢卷内径', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    this.queryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        this.excelexport.export(res.data);
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderReviewQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private commonImportService: CommonImportService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit() {
    this.loadOptions();
    // 加工类型
    this.commonImportService.setSequence(this.impColumns, 'processingType', this.options.processingTypeOptions);
    // 产品大类
    this.commonImportService.setSequence(this.impColumns, 'productCategory', this.options.productCategoryOptions);
    // 计划
    this.commonImportService.setSequence(this.impColumns, 'processingType', this.options.processingTypeOptions);
    // 钢种
    this.commonImportService.setSequence(this.impColumns, 'steelType', this.options.contractSteelTypeOptions);
    // 形式
    this.commonImportService.setSequence(this.impColumns, 'prodType', this.options.prodTypeOptions);
    // 表面
    this.commonImportService.setSequence(this.impColumns, 'surface', this.options.contractSurfaceOptions);
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

}
