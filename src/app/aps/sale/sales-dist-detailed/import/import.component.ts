import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { SalesDistDetailedQueryService } from "../query.service";


@Component({
  selector: 'sales-dist-detailed-import',
  templateUrl: './import.component.html',
  providers: [SalesDistDetailedQueryService]
})
export class SalesDistDetailedImportComponent implements OnInit {

  options;
  isCurrent: Boolean = false; // 是否现货
  stockSaleFlag: string = 'Y';
  currTitle = '现货分货导入';
  title = '分货明细导入';
  currImportTempPath = '../../../../../assets/tmp/template/现货分货导入模板.xlsx';
  importTempPath = '../../../../../assets/tmp/template/未分货明细-已分货明细-已开单明细导入模板.xlsx'; // 导入模板
  
  currImpColumns = {
    columns: ['工厂', '分货类型', '客户简称', '运输方式', '目的地', '厚薄料', '批号', '产品大类', '加价', '特殊加价', '基价'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'distType', title: '分货类型', columnIndex: 1, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'cusAbbreviation', title: '客户简称', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'transportType', title: '运输方式', columnIndex: 6, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'place', title: '目的地', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'houbo', title: '厚薄料', columnIndex: 6, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'batchCode', title: '批号', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'productCategory', title: '产品大类', columnIndex: 6, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'markUp', title: '加价', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'specialMarkup', title: '特殊加价', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'basePrice', title: '基价', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'stockSaleFlag', title: '销售标识', columnIndex: 6, default: this.stockSaleFlag },
    ]
  };

  currExpColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'distType', title: '分货类型', width: 150, locked: false },
    { field: 'cusAbbreviation', title: '客户简称', width: 150, locked: false },
    { field: 'transportType', title: '运输方式', width: 150, locked: false },
    { field: 'place', title: '目的地', width: 150, locked: false },
    { field: 'houbo', title: '厚薄料', width: 150, locked: false },
    { field: 'batchCode', title: '批号', width: 150, locked: false },
    { field: 'productCategory', title: '产品大类', width: 150, locked: false },
    { field: 'markUp', title: '加价', width: 150, locked: false },
    { field: 'specialMarkup', title: '特殊加价', width: 150, locked: false },
    { field: 'basePrice', title: '基价', width: 150, locked: false },
    { field: 'attribute1', title: '错误', width: 150, locked: false },
  ];
  
  impColumns = {
    columns: ['工厂', '分货类型', '运输方式', '目的地', '厚薄料', '批号', '分行客户订单号', '加价', '特殊加价', '基价'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'distType', title: '分货类型', columnIndex: 1, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'transportType', title: '运输方式', columnIndex: 6, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'place', title: '目的地', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'houbo', title: '厚薄料', columnIndex: 6, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'batchCode', title: '批号', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'branchCusOrderCode', title: '分行客户订单号', columnIndex: 4, constraint: { notNull: true } },
      { field: 'markUp', title: '加价', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'specialMarkup', title: '特殊加价', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'basePrice', title: '基价', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'stockSaleFlag', title: '销售标识', columnIndex: 6, default: this.stockSaleFlag },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'distType', title: '分货类型', width: 150, locked: false },
    { field: 'transportType', title: '运输方式', width: 150, locked: false },
    { field: 'place', title: '目的地', width: 150, locked: false },
    { field: 'houbo', title: '厚薄料', width: 150, locked: false },
    { field: 'batchCode', title: '批号', width: 150, locked: false },
    { field: 'branchCusOrderCode', title: '分行客户订单号', width: 150, locked: false },
    { field: 'markUp', title: '加价', width: 150, locked: false },
    { field: 'specialMarkup', title: '特殊加价', width: 150, locked: false },
    { field: 'basePrice', title: '基价', width: 150, locked: false },
    { field: 'attribute1', title: '错误', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [
    { field: 'distType', options: [] },
    { field: 'houbo', options: [] },
    { field: 'transportType', options: [] },
    { field: 'productCategory', options: [] },
  ];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    // tempData = tempData.map(d => {
    //   const makeOption = this.options.distDetailedStateOptions.find(o => o.value === '40');
    //   if(!makeOption || d.distDetailedState !== makeOption.label) {
    //     const distOption = this.options.distDetailedStateOptions.find(o => o.value === '20');
    //     return Object.assign({}, d, {
    //       distDetailedState: distOption ? distOption.label : '已分货'
    //     });
    //   }
    // });
    this.queryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        if (errData.length > 0) {
          this.excelexport.export(errData);
          this.msgSrv.info(this.appTranslationService.translate(`导入成功${tempData.length}条，导入失败${errData.length}条，请查看导出信息`));
        } else {
          this.msgSrv.success(this.appTranslationService.translate("导入成功"));
          this.modal.close(true);
        }
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
    private queryService: SalesDistDetailedQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    if(this.isCurrent) {
      this.stockSaleFlag = 'N';
      this.importTempPath = this.currImportTempPath;
      this.impColumns = this.currImpColumns;
      this.expColumns = this.currExpColumns;
      this.title = this.currTitle;
    }
    const stockSaleFlagIndex = this.impColumns.paramMappings.findIndex(col => col.field === 'stockSaleFlag');
    this.impColumns.paramMappings[stockSaleFlagIndex].default = this.stockSaleFlag;
    this.loadOptions();
  }

  loadOptions() {
    // 分货类型
    this.commonImportService.setSequence(this.impColumns, 'distType', this.options.distTypeOptions);
    // 厚薄料
    this.commonImportService.setSequence(this.impColumns, 'houbo', this.options.materialOptions);
    // 运输方式
    this.commonImportService.setSequence(this.impColumns, 'transportType', this.options.transportTypeOptions);
    if (this.isCurrent) {
      // 产品大类
      this.commonImportService.setSequence(this.impColumns, 'productCategory', this.options.productCategoryOptions);
    }
    this.expColumnsOptions[0].options = this.options.distTypeOptions;
    this.expColumnsOptions[1].options = this.options.materialOptions;
    this.expColumnsOptions[2].options = this.options.transportTypeOptions;
    this.expColumnsOptions[3].options = this.options.productCategoryOptions;
  }

  close() {
    this.modal.destroy();
  }

}
