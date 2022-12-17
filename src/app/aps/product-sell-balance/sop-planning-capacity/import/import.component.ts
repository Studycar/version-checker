import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { SopPlanningCapacityService } from '../sop-planning-capacity.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-planning-capacity-import',
  templateUrl: './import.component.html',
  providers: [SopPlanningCapacityService],
})
export class ProductSellBalanceSopPlanningCapacityImportComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '内外销', '产能分类', '月份', '开工天数', '规划总量'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'salesType', title: '内外销', columnIndex: 2, constraint: { notNull: true } },
      { field: 'capacityCategory', title: '产能分类', columnIndex: 3, constraint: { notNull: true } },
      { field: 'currentMonth', title: '月份', columnIndex: 4, constraint: { notNull: true } },
      { field: 'workDays', title: '开工天数', columnIndex: 5, constraint: { notNull: true } },
      { field: 'totalPlanningQuantity', title: '规划总量', columnIndex: 6, constraint: { notNull: true } }]
  };

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 120, locked: false },
    { field: 'salesType', title: '内外销', width: 120, locked: false },
    { field: 'capacityCategory', title: '产能分类', width: 150, locked: false },
    { field: 'currentMonth', title: '月份', width: 150, locked: false },
    { field: 'workDays', title: '开工天数', width: 150, locked: false },
    { field: 'totalPlanningQuantity', title: '规划总量', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 200, locked: false }
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: SopPlanningCapacityService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.editService.import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      if (res.data != null && res.data.length > 0) {
        this.excelexport.export(res.data);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
