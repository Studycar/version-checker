import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../queryService.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-supply-cap-customized-import',
  templateUrl: './import.component.html',
  providers: [QueryService],
})
export class ProductSellBalanceSopSupplyCapCustomizedImportComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '月份', '物料编码', '物料描述', '供应商编码', '供应商名称', '供货比例(%)', '模具数量', '日产能', '月开工天数(天)'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'currentMonth', title: '月份', columnIndex: 2, constraint: { notNull: true } },
      { field: 'itemCode', title: '物料编码', columnIndex: 3, constraint: { notNull: true } },
      { field: 'itemDesc', title: '物料描述', columnIndex: 4, constraint: { notNull: false } },
      { field: 'vendorNumber', title: '供应商编码', columnIndex: 5, constraint: { notNull: true } },
      { field: 'vendorName', title: '供应商名称', columnIndex: 6, constraint: { notNull: false } },
      { field: 'percent', title: '供货比例(%)', columnIndex: 7, constraint: { notNull: false } },
      { field: 'mouldNum', title: '模具数量', columnIndex: 8, constraint: { notNull: true } },
      { field: 'capacity', title: '日产能', columnIndex: 9, constraint: { notNull: true } },
      { field: 'workDay', title: '月开工天数(天)', columnIndex: 10, constraint: { notNull: true } },
    ]
  };

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 120, locked: false },
    { field: 'currentMonth', title: '月份', width: 120, locked: false },
    { field: 'itemCode', title: '物料编码', width: 120, locked: false },
    { field: 'itemDesc', title: '物料描述', width: 120, locked: false },
    { field: 'vendorNumber', title: '供应商编码', width: 120, locked: false },
    { field: 'vendorName', title: '供应商名称', width: 120, locked: false },
    { field: 'percent', title: '供货比例(%)', width: 120, locked: false },
    { field: 'mouldNum', title: '模具数量', width: 120, locked: false },
    { field: 'capacity', title: '日产能', width: 120, locked: false },
    { field: 'workDay', title: '月开工天数(天)', width: 120, locked: false },
    { field: 'errorMsg', title: '错误信息', width: 200, locked: false },
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.queryService.importSopSupplyCapCustomized(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        if (res.extra != null && res.extra.length > 0) {
          this.excelexport.export(res.extra);
        }
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
