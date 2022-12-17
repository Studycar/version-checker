import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { InventoryCalculationService } from '../inventory-calculation.service';

@Component({
  selector: 'app-inventory-calculation-import',
  templateUrl: './import.component.html',
  providers: [InventoryCalculationService]
})
export class InventoryCalculationImportComponent implements OnInit {

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private queryService: InventoryCalculationService,
  ) { }

  @ViewChild('excelExport', { static: true }) excelExport: CustomExcelExportComponent;
  impColumns = {
    columns: ['工厂', '类别', '类别值', '描述', '目标周转天数', '目标服务水平%', '经济批量', '最小生产批量', '质检周期', '波动系数', '工厂分配比例', '采购频次', '生效日期', '失效日期'],
    paramMappings: [
      { field: 'PLANT_CODE', title: '工厂', columnIndex: 1, constraint: { notNull: true }, },
      { field: 'SOURCE_TYPE', title: '类别', columnIndex: 2, constraint: { notNull: true }, },
      { field: 'SOURCE_CODE', title: '类别值', columnIndex: 3, constraint: { notNull: true }, },
      { field: 'SOURCE_DESC', title: '描述', columnIndex: 4, constraint: { notNull: false }, },
      { field: 'TARGET_TURNOVER_DAYS', title: '目标周转天数', columnIndex: 5, constraint: { notNull: false }, },
      { field: 'TARGET_SVRVICE_LEVEL', title: '目标服务水平%', columnIndex: 6, constraint: { notNull: false }, },
      { field: 'ECONOMIC_BATCH', title: '经济批量', columnIndex: 7, constraint: { notNull: false }, },
      { field: 'MIN_PRODUCTION_BATCH', title: '最小生产批量', columnIndex: 8, constraint: { notNull: false }, },
      { field: 'QULITY_LEAD_TIME', title: '质检周期', columnIndex: 9, constraint: { notNull: false }, },
      { field: 'FLUCTUATION_COEFFICIENT', title: '波动系数', columnIndex: 10, constraint: { notNull: false }, },
      { field: 'SPLIT_RATIO', title: '工厂分配比例', columnIndex: 11, constraint: { notNull: false }, },
      { field: 'PURCHASE_FREQUENCY', title: '采购频次', columnIndex: 12, constraint: { notNull: false }, },
      { field: 'START_DATE', title: '生效日期', columnIndex: 13, constraint: { notNull: true }, },
      { field: 'END_DATE', title: '失效日期', columnIndex: 14, constraint: { notNull: true }, },
    ]
  };
  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false, },
    { field: 'SOURCE_TYPE', title: '类别', width: 150, locked: false, },
    { field: 'SOURCE_CODE', title: '类别值', width: 150, locked: false, },
    { field: 'SOURCE_DESC', title: '描述', width: 150, locked: false, },
    { field: 'TARGET_TURNOVER_DAYS', title: '目标周转天数', width: 150, locked: false, },
    { field: 'TARGET_SVRVICE_LEVEL', title: '目标服务水平%', width: 150, locked: false, },
    { field: 'ECONOMIC_BATCH', title: '经济批量', width: 150, locked: false, },
    { field: 'MIN_PRODUCTION_BATCH', title: '最小生产批量', width: 150, locked: false, },
    { field: 'QULITY_LEAD_TIME', title: '质检周期', width: 150, locked: false, },
    { field: 'FLUCTUATION_COEFFICIENT', title: '波动系数', width: 150, locked: false, },
    { field: 'SPLIT_RATIO', title: '工厂分配比例', width: 150, locked: false, },
    { field: 'PURCHASE_FREQUENCY', title: '采购频次', width: 150, locked: false, },
    { field: 'START_DATE', title: '生效日期', width: 150, locked: false, },
    { field: 'END_DATE', title: '失效日期', width: 150, locked: false, },
    { field: 'ATTRIBUTE1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];

  ngOnInit() {
  }

  excelDataProcess(tempData: any[]) {
    this.queryService.planParameterImport(tempData).subscribe(res => {
      if (res.Success && res.Extra && res.Extra.length === 0) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Extra));
        if (res.Extra && res.Extra.length > 0) {
          this.excelExport.export(res.Extra);
        }
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
