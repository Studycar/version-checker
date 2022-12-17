import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { ProcessFeeYesNoQueryService } from "../query.service";

@Component({
  selector: 'process-fee-yes-no-import',
  templateUrl: './import.component.html',
  providers: [ProcessFeeYesNoQueryService]
})
export class ProcessFeeYesNoImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['加价维度', '是否加工费'],
    paramMappings: [
      { field: 'markupElement', title: '加价维度', columnIndex: 1, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'processFee', title: '是否加工费', columnIndex: 2, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'markupElement', title: '加价维度', width: 150, locked: false },
    { field: 'processFee', title: '是否加工费', width: 150, locked: false },
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
    private queryService: ProcessFeeYesNoQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    this.commonImportService.setSequence(this.impColumns, 'markupElement', this.options.markupOptions);
    this.commonImportService.setSequence(this.impColumns, 'processFee', this.options.YesNoOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
