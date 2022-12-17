import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../queryService';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class SupplierCapacityImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '产能颗粒度', '产能维度', '供应商编码', '供应商地点编码', '月度产能', '开始时间', '结束时间'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'divisionType', title: '产能颗粒度', columnIndex: 2, constraint: { notNull: true } },
      { field: 'divisionValue', title: '产能维度', columnIndex: 3, constraint: { notNull: true } },
      { field: 'vendorNumber', title: '供应商编码', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'capacity', title: '月度产能', columnIndex: 5, constraint: { notNull: true } },
      { field: 'startDate', title: '开始时间', columnIndex: 6, constraint: { notNull: true } },
      { field: 'endDate', title: '结束时间', columnIndex: 7, constraint: { notNull: true } },
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'divisionType', title: '产能颗粒度', width: 150, locked: false },
    { field: 'divisionValue', title: '产能维度', width: 150, locked: false },
    { field: 'vendorNumber', title: '供应商编码', width: 150, locked: false },
    { field: 'capacity', title: '月度产能', width: 150, locked: false },
    { field: 'startDate', title: '开始时间', width: 150, locked: false },
    { field: 'endDate', title: '结束时间', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.commonQueryService.Import(tempData).subscribe(res => {
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
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
