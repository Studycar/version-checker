import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { MarkupElementQueryService } from "../query.service";



@Component({
  selector: 'markup-element-import',
  templateUrl: './import.component.html',
  providers: [MarkupElementQueryService]
})
export class MarkupElementImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['加价维度', '工厂', '产品大类'],
    paramMappings: [
      { field: 'markupElement', title: '加价维度', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'plantCode', title: '工厂', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'productCategory', title: '产品大类', columnIndex: 3, constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'markupElement', title: '加价维度', width: 150, locked: false },
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'productCategory', title: '产品大类', width: 150, locked: false },
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
    private queryService: MarkupElementQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'markupElement', this.options.markupOptions);
    // this.commonImportService.setSequence(this.impColumns, 'plantCode', this.options.plantOptions);
    // this.commonImportService.setSequence(this.impColumns, 'productCategory', this.options.productCategoryOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
