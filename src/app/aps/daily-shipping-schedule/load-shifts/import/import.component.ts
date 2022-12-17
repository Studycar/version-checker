import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { LoadShiftsService } from '../load-shifts.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'load-shifts-import',
  templateUrl: './import.component.html',
  providers: [LoadShiftsService],
})
export class LoadShiftsImportComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '时段号', '班次开始时间'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'internal', title: '时段号', columnIndex: 2, constraint: { notNull: true } },
      { field: 'attribute2', title: '班次开始时间', columnIndex: 3, constraint: { notNull: true } }
    ],
  };

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'internal', title: '时段号', width: 150, locked: false },
    { field: 'attribute2', title: '班次开始时间', width: 200, locked: false },
    { field: 'attribute1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public loadShiftsService: LoadShiftsService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.loadShiftsService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.extra));
        if (res.data.content != null && res.data.content.length > 0)
          this.excelexport.export(res.data.content);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
