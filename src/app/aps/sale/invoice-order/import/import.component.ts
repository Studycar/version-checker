import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { InvoiceOrderQueryService } from "../query.service";


@Component({
  selector: 'invoice-order-import',
  templateUrl: './import.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['发货单号', '批号', '收款协议'],
    paramMappings: [
      { field: 'invoiceBillCode', title: '发货单号', columnIndex: 1, constraint: { notNull: true } },
      { field: 'batchNum', title: '批号', columnIndex: 4, constraint: { notNull: true } },
      { field: 'collectionAgreement', title: '收款协议', columnIndex: 5, constraint: { notNull: false, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'invoiceBillCode', title: '发货单号', width: 150, locked: false },
    { field: 'batchNum', title: '批号', width: 150, locked: false },
    { field: 'collectionAgreement', title: '收款协议', width: 150, locked: false },
    { field: 'attribute1', title: '错误', width: 150, locked: false },
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
    private queryService: InvoiceOrderQueryService,
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
