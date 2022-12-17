import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { BasePriceQueryService } from "../query.service";


@Component({
  selector: 'base-price-import',
  templateUrl: './import.component.html',
  providers: [BasePriceQueryService]
})
export class BasePriceImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['工厂', '存货名称', '钢种大类', '钢种', '表面', '形式', '基价加价', '发布日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'stockName', title: '存货名称', columnIndex: 2, constraint: { notNull: true } },
      { field: 'steelSortDesc', title: '钢种大类', columnIndex: 2, constraint: { notNull: true } },
      { field: 'steelTypeDesc', title: '钢种', columnIndex: 2, constraint: { notNull: true } },
      { field: 'surfaceDesc', title: '表面', columnIndex: 2, constraint: { notNull: true } },
      { field: 'prodTypeDesc', title: '形式', columnIndex: 4, constraint: { notNull: true } },
      { field: 'basePrice', title: '基价加价', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'publishDate', title: '发布日期', columnIndex: 6, type: 'dateTime', constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'stockName', title: '存货名称', width: 150, locked: false },
    { field: 'steelSortDesc', title: '钢种大类', width: 150, locked: false },
    { field: 'steelTypeDesc', title: '钢种', width: 150, locked: false },
    { field: 'surfaceDesc', title: '表面', width: 150, locked: false },
    { field: 'prodTypeDesc', title: '形式', width: 150, locked: false },
    { field: 'basePrice', title: '基价加价', width: 150, locked: false },
    { field: 'publishDate', title: '发布日期', width: 150, locked: false },
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
    private queryService: BasePriceQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'steelType', this.options.steelTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'plantCode', this.options.plantOptions);
    // this.commonImportService.setSequence(this.impColumns, 'processingType', this.options.processingTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'cusGrade', this.options.cusGradeOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
