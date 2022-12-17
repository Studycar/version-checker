import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonImportService } from 'app/modules/base_module/services/common-import.service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { MarkupHbpLrQueryService } from '../query.service';


@Component({
  selector: 'markup-hbp-lr-import',
  templateUrl: './import.component.html',
  providers: [MarkupHbpLrQueryService]
})
export class MarkupHbpLrImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['工厂', '产地', '钢种', '冷热加价', '黑白皮加价', '生效日期', '失效日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'place', title: '产地', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'steelType', title: '钢种', columnIndex: 3, constraint: { notNull: true, sequence: [], sequenceValue: [] } },
      { field: 'lrMarkup', title: '冷热加价', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'hbpMarkup', title: '黑白皮加价', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'startDate', title: '生效日期', columnIndex: 6, type: 'date', constraint: { notNull: true, } },
      { field: 'endDate', title: '失效日期', columnIndex: 7, type: 'date', constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'place', title: '产地', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false },
    { field: 'lrMarkup', title: '冷热加价', width: 150, locked: false },
    { field: 'hbpMarkup', title: '黑白皮加价', width: 150, locked: false },
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
          this.msgSrv.success(this.appTranslationService.translate('导入成功'));
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
    private queryService: MarkupHbpLrQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    this.commonImportService.setSequence(this.impColumns, 'steelType', this.options.steelTypeOptions);
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
