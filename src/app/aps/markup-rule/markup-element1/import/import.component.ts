import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { MarkupElement1QueryService } from "../query.service";

@Component({
  selector: 'markup-element1-import',
  templateUrl: './import.component.html',
  providers: [MarkupElement1QueryService]
})
export class MarkupElement1ImportComponent implements OnInit {

  options;

  impColumns = {
    columns: ['工厂', '产品大类', '钢种', '厚度(>=)', '厚度(<)', '宽度(>=)', '宽度(<)',
      '0.5及以下薄料加价', '0.4及以下薄料加价', '形式', '受托加工', '厚度加价', '宽度加价', '垫纸加价', 
      '重卷加价', '下差', '厚度基础加价', '平板加价', '生效日期', '失效日期'],


    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'productCategoryDesc', title: '产品大类', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'steelTypeDesc', title: '钢种', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'thicknessDown', title: '厚度(>=)', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'thicknessUp', title: '厚度(<)', columnIndex: 5, constraint: { notNull: true, } },
      // { field: 'thicknessStep', title: '厚度递增步长', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'widthDown', title: '宽度(>=)', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'widthUp', title: '宽度(<)', columnIndex: 8, constraint: { notNull: true, } },
      // { field: 'widthStep', title: '宽度递增步长', columnIndex: 9, constraint: { notNull: true, } },
      { field: 'belowFive', title: '0.5及以下薄料加价', columnIndex: 10, constraint: { notNull: false, } },
      { field: 'belowFour', title: '0.4及以下薄料加价', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'prodTypeDesc', title: '形式', columnIndex: 12, constraint: { notNull: true, } },
      { field: 'entrustedProcessingDesc', title: '受托加工', columnIndex: 13, constraint: { notNull: true, } },
      { field: 'thicknessMarkup', title: '厚度加价', columnIndex: 14, constraint: { notNull: false, } },
      { field: 'widthMarkup', title: '宽度加价', columnIndex: 15, constraint: { notNull: false, } },
      { field: 'paperMarkup', title: '垫纸加价', columnIndex: 16, constraint: { notNull: false, } },
      { field: 'rewindingMarkup', title: '重卷加价', columnIndex: 18, constraint: { notNull: false, } },
      { field: 'lowerDifference', title: '下差', columnIndex: 19, constraint: { notNull: false, } },
      { field: 'thicknessBaseMarkup', title: '厚度基础加价', columnIndex: 20, constraint: { notNull: false, } },
      { field: 'flatMarkup', title: '平板加价', columnIndex: 21, constraint: { notNull: false, } },
      { field: 'startDate', title: '生效日期', columnIndex: 22, type: 'date', constraint: { notNull: true, } },
      { field: 'endDate', title: '失效日期', columnIndex: 23, type: 'date', constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'productCategoryDesc', title: '产品大类', width: 150, locked: false },
    { field: 'steelTypeDesc', title: '钢种', width: 150, locked: false },
    { field: 'thicknessDown', title: '厚度(>=)', width: 150, locked: false },
    { field: 'thicknessUp', title: '厚度(<)', width: 150, locked: false },
    { field: 'thicknessStep', title: '厚度递增步长', width: 150, locked: false },
    { field: 'widthDown', title: '宽度(>=)', width: 150, locked: false },
    { field: 'widthUp', title: '宽度(<)', width: 150, locked: false },
    { field: 'widthStep', title: '宽度递增步长', width: 150, locked: false },
    { field: 'belowFive', title: '0.5及以下薄料加价', width: 150, locked: false },
    { field: 'belowFour', title: '0.4及以下薄料加价', width: 150, locked: false },
    { field: 'prodTypeDesc', title: '形式', width: 150, locked: false },
    { field: 'entrustedProcessingDesc', title: '受托加工', width: 150, locked: false },
    { field: 'thicknessMarkup', title: '厚度加价', width: 150, locked: false },
    { field: 'widthMarkup', title: '宽度加价', width: 150, locked: false },
    { field: 'paperMarkup', title: '垫纸加价', width: 150, locked: false },
    { field: 'rewindingMarkup', title: '重卷加价', width: 150, locked: false },
    { field: 'lowerDifference', title: '下差', width: 150, locked: false },
    { field: 'thicknessBaseMarkup', title: '厚度基础加价', width: 150, locked: false },
    { field: 'flatMarkup', title: '平板加价', width: 150, locked: false },
    { field: 'startDate', title: '生效日期', width: 150, locked: false },
    { field: 'endDate', title: '失效日期', width: 150, locked: false },
    { field: 'errorMessage', title: '错误', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
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
    private queryService: MarkupElement1QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'plantCode', this.options.plantOptions);
    // this.commonImportService.setSequence(this.impColumns, 'productCategory', this.options.productCategoryOptions);
    // this.commonImportService.setSequence(this.impColumns, 'steelType', this.options.steelTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'cusGrade', this.options.cusGradeOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
