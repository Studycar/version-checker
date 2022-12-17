import { _HttpClient } from '@delon/theme';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { ItemCycleTimeEditService } from '../edit.service';
@Component({
  selector: 'materialmanagement-itemcycletime-view',
  templateUrl: './view.component.html',
  providers: [ItemCycleTimeEditService],
})
export class MaterialmanagementItemcycletimeViewComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '物料', '物料描述', '周期类型', '天数', '生效日期', '失效日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料', columnIndex: 2, constraint: { notNull: true } },
      { field: 'attribute1', title: '物料描述', columnIndex: 3, constraint: { notNull: false } },
      { field: 'cycleTimeType', title: '周期类型', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'cycleTime', title: '天数', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'enableDate', title: '生效日期', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'disableDate', title: '失效日期', columnIndex: 7, constraint: { notNull: false, } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料', width: 150, locked: false },
    { field: 'attribute1', title: '物料描述', width: 200, locked: false },
    { field: 'cycleTimeType', title: '周期类型', width: 200, locked: false },
    { field: 'cycleTime', title: '天数', width: 150, locked: false },
    { field: 'enableDate', title: '生效日期', width: 100, locked: false },
    { field: 'disableDate', title: '失效日期', width: 150, locked: false },
    { field: 'attribute5', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    /*tempData.forEach(x => {
      x.enableDate = new Date(x.enableDate);
      if (x.disableDate != null) { x.disableDate = new Date(x.disableDate); }
      //x.disableDate = new Date(x.disableDate);
    }
    );*///editService
    this.editService.Import(tempData).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        if (res.data != null && res.data.length > 0)
        this.excelexport.export(res.data);
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: ItemCycleTimeEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
