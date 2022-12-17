import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-mo-loss-import',
  templateUrl: './import.component.html',
  providers: [QueryService],
})
export class MaterialmanagementMoLossImportComponent implements OnInit {

  impColumns = {
    columns: ['事业部', '工厂', '值类别', '类别值', '固定损耗', '变动损耗(%)'],
    paramMappings: [
      { field: 'SCHEDULE_REGION_CODE', title: '事业部', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'PLANT_CODE', title: '工厂', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'CATEGORY', title: '值类别', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'CATEGORY_VALUES', title: '类别值', columnIndex: 4, constraint: { notNull: false, } },
      { field: 'CONSTANT_LOSS', title: '固定损耗', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'VARIABLE_LOSS', title: '变动损耗(%)', columnIndex: 6, constraint: { notNull: true, } },
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'SCHEDULE_REGION_CODE', title: '事业部', width: 150, locked: false },
    { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false },
    { field: 'CATEGORY', title: '值类别', width: 150, locked: false },
    { field: 'CATEGORY_VALUES', title: '类别值', width: 150, locked: false },
    { field: 'CONSTANT_LOSS', title: '固定损耗', width: 150, locked: false },
    { field: 'VARIABLE_LOSS', title: '变动损耗(%)', width: 150, locked: false },
    { field: 'ATTRIBUTE1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    console.log(tempData);
    this.queryService.ImportData(tempData).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message));
        if (res.Extra != null && res.Extra.length > 0) {
          this.excelexport.export(res.Extra);
        }
        this.modal.destroy(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
