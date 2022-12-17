import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonImportService } from 'app/modules/base_module/services/common-import.service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { MarkupElement6QueryService } from '../query.service';


@Component({
  selector: 'markup-bzfs-import',
  templateUrl: './import.component.html',
  providers: [MarkupElement6QueryService]
})
export class MarkupElement6ImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['工厂', '存货名称', '钢种大类', '钢种', '表面', '是否受托', '包装方式', '计价单位', '包装方式加价', '生效日期', '失效日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'stockName', title: '存货名称', columnIndex: 2, constraint: { notNull: true } },
      { field: 'steelSortDesc', title: '钢种大类', columnIndex: 2, constraint: { notNull: true } },
      { field: 'steelTypeDesc', title: '钢种', columnIndex: 2, constraint: { notNull: true } },
      { field: 'surfaceDesc', title: '表面', columnIndex: 2, constraint: { notNull: true } },
      { field: 'entrustedProcessingDesc', title: '是否受托', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'packTypeDesc', title: '包装方式', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'unitDesc', title: '计价单位', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'bzfsMarkup', title: '包装方式加价', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'startDate', title: '生效日期', columnIndex: 6, type: 'date', constraint: { notNull: true, } },
      { field: 'endDate', title: '失效日期', columnIndex: 7, type: 'date', constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'stockName', title: '存货名称', width: 150, locked: false },
    { field: 'steelSortDesc', title: '钢种大类', width: 150, locked: false },
    { field: 'steelTypeDesc', title: '钢种', width: 150, locked: false },
    { field: 'surfaceDesc', title: '表面', width: 150, locked: false },
    { field: 'entrustedProcessingDesc', title: '是否受托', width: 150, locked: false },
    { field: 'packTypeDesc', title: '包装方式', width: 150, locked: false },
    { field: 'unitDesc', title: '计价单位', width: 150, locked: false },
    { field: 'bzfsMarkup', title: '包装方式加价', width: 150, locked: false },
    { field: 'startDate', title: '生效日期', width: 150, locked: false },
    { field: 'endDate', title: '失效日期', width: 150, locked: false },
    { field: 'errorMessage', title: '错误', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [
    { field: 'unit', options: [] },
  ];

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
    private queryService: MarkupElement6QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    this.commonImportService.setSequence(this.impColumns, 'unit', this.options.unitOptions);
    this.expColumnsOptions[0].options = this.options.unitOptions;
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
