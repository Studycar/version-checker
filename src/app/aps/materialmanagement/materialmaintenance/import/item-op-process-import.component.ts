import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../../material-process/query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-op-process-import',
  templateUrl: './item-op-process-import.component.html',
  providers: [QueryService],
})
export class ItemOperationProcessImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '物料编码', '上游工序', '下游工序', '提前期相关性', '提前期（小时）', '单位用量', '工序版本'],
    paramMappings: [
      { field: 'PLANT_CODE', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'ITEM_CODE', title: '物料编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'PROCESS_CODE', title: '上游工序', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'NEXT_PROCESS_CODE', title: '下游工序', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'RELATION_TYPE', title: '提前期相关性', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'LEAD_TIME', title: '提前期（小时）', columnIndex: 6, constraint: { notNull: false } },
      { field: 'USAGE', title: '单位用量', columnIndex: 7, constraint: { notNull: false } },
      { field: 'TECH_VERSION', title: '工序版本', columnIndex: 8, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 80, locked: false },
    { field: 'ITEM_CODE', title: '物料编码', width: 100, locked: false },
    { field: 'PROCESS_CODE', title: '上游工序', width: 80, locked: false },
    { field: 'NEXT_PROCESS_CODE', title: '下游工序', width: 80, locked: false },
    { field: 'RELATION_TYPE', title: '提前期相关性', width: 80, locked: false },
    { field: 'LEAD_TIME', title: '提前期（小时）', width: 80, locked: false },
    { field: 'USAGE', title: '单位用量', width: 80, locked: false },
    { field: 'TECH_VERSION', title: '工序版本', width: 80, locked: false },
    { field: 'ErrorMsg', title: '错误信息', width: 150, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.editService.Import(tempData).subscribe(res => {
      if (res.Success) {
        if (res.Extra != null) {
          if (res.Extra.length > 0) {
            this.msgSrv.error(this.appTranslationService.translate(res.Message));
            this.excelexport.export(res.Extra);
          } else {
            this.msgSrv.success(this.appTranslationService.translate(res.Message));
          }
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
