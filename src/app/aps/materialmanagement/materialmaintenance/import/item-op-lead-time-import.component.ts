import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { OperationLeadTimeService } from 'app/modules/generated_module/services/operation-leadtime-service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-op-lead-time-import',
  templateUrl: './item-op-lead-time-import.component.html',
  providers: [OperationLeadTimeService],
})
export class ItemOperationLeadTimeImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '类别', '物料编码', '上游工序', '下游工序', '提前期相关性', '提前期（小时）'],
    paramMappings: [
      { field: 'PLANT_CODE', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'CATEGORY', title: '类别', columnIndex: 2, constraint: { notNull: true } },
      { field: 'ITEM_CODE', title: '物料编码', columnIndex: 3, constraint: { notNull: true } },
      { field: 'UPSTREAM_PROCESS_CODE', title: '上游工序', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'DOWNSTREAM_PROCESS_CODE', title: '下游工序', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'RELATION_TYPE', title: '提前期相关性', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'LEAD_TIME', title: '提前期（小时）', columnIndex: 7, constraint: { notNull: true, } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false },
    { field: 'CATEGORY', title: '类别', width: 150, locked: false },
    { field: 'ITEM_CODE', title: '物料编码', width: 200, locked: false },
    { field: 'UPSTREAM_PROCESS_CODE', title: '上游工序', width: 200, locked: false },
    { field: 'DOWNSTREAM_PROCESS_CODE', title: '下游工序', width: 150, locked: false },
    { field: 'RELATION_TYPE', title: '提前期相关性', width: 100, locked: false },
    { field: 'LEAD_TIME', title: '提前期（小时）', width: 150, locked: false },
    { field: 'ATTRIBUTE1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.editService.Import(tempData).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message));
        if (res.Extra != null && res.Extra.length > 0)
          this.excelexport.export(res.Extra);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: OperationLeadTimeService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
