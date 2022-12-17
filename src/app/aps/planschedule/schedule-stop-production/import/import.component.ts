import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { ScheduleStopProductionService } from '../schedule-stop-production.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-mutex-check-import',
  templateUrl: './import.component.html',
  providers: [ScheduleStopProductionService],
})
export class ScheduleStopProductionImportComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '资源编码', '最长持续时间(H)', '停产处理时间(H)', '停产处理方式', '停产处理成本', '是否有效', '属性组'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'resourceCode', title: '资源编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'maxDuration', title: '最长持续时间(H)', columnIndex: 3, constraint: { notNull: true } },
      { field: 'dealTime', title: '停产处理时间(H)', columnIndex: 4, constraint: { notNull: true } },
      { field: 'dealMethod', title: '停产处理方式', columnIndex: 5, constraint: { notNull: false } },
      { field: 'dealCost', title: '停产处理成本', columnIndex: 6, constraint: { notNull: false } },
      { field: 'enableFlag', title: '是否有效', columnIndex: 7, constraint: { notNull: true } },
      { field: 'attribute2', title: '属性组', columnIndex: 8, constraint: { notNull: false } }]
  };

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 120, locked: false },
    { field: 'resourceCode', title: '资源编码', width: 120, locked: false },
    { field: 'maxDuration', title: '最长持续时间(H)', width: 150, locked: false },
    { field: 'dealTime', title: '停产处理时间(H)', width: 150, locked: false },
    { field: 'dealMethod', title: '停产处理方式', width: 150, locked: false },
    { field: 'dealCost', title: '停产处理成本', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 120, locked: false },
    { field: 'attribute2', title: '属性组', width: 200, locked: false },
    { field: 'failMessage', title: '错误信息', width: 200, locked: false }
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: ScheduleStopProductionService,
    private appTranslationService: AppTranslationService
  ) {
    
   }

  ngOnInit(): void {
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.editService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        if (res.data != null && res.data.length > 0)
          this.excelexport.export(res.data);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
