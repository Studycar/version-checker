import { _HttpClient } from '@delon/theme';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { SafeStockEditService } from '../edit.service';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-safestock-view',
  templateUrl: './view.component.html',
  providers: [SafeStockEditService],
})
export class DemandOrderManagementSafestockViewComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '物料', '物料描述', '最小数量', '最大数量', '生效日期', '失效日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料', columnIndex: 2, constraint: { notNull: true } },
      { field: 'descriptionsCn', title: '物料描述', columnIndex: 3, constraint: { notNull: false } },
      { field: 'minQuantity', title: '最小数量', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'maxQuantity', title: '最大数量', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'startTime', title: '生效日期', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'endTime', title: '失效日期', columnIndex: 7, constraint: { notNull: false, } }
    ],
  };

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料', width: 150, locked: false },
    { field: 'descriptionsCn', title: '物料描述', width: 200, locked: false },
    { field: 'minQuantity', title: '最小数量', width: 200, locked: false },
    { field: 'maxQuantity', title: '最大数量', width: 150, locked: false },
    { field: 'startTime', title: '生效日期', width: 100, locked: false },
    { field: 'endTime', title: '失效日期', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    tempData.forEach(item => {
      item.minQuantity = Number(item.minQuantity);
      item.maxQuantity = Number(item.maxQuantity);
      item.startTime = formatDate(new Date(item.startTime), 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
      if (item.endTime) {
        item.endTime = formatDate(new Date(item.endTime), 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
      }
    });
    this.editService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('导入成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        if (res.data && res.data.length) {
          this.excelexport.export(res.data);
        }
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: SafeStockEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
