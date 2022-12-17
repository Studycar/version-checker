import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-pp-demand-data-interface-import',
  templateUrl: './import.component.html',
  providers: [PsItemRoutingsService],
})
export class MaterialmanagementProdlineItemsImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '物料编码', '计划组', '资源', '速率类型', '速率', '优先级', '参与排产标识', '参与选线标识', '工艺版本'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'scheduleGroupCode', title: '计划组', columnIndex: 3, constraint: { notNull: true } },
      { field: 'resourceCode', title: '资源', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'rateType', title: '速率类型', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'rate', title: '速率', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'batchQty', title: '批次数量', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'priority', title: '优先级', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'scheduleFlag', title: '参与排产标识', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'selectResourceFlag', title: '参与选线标识', columnIndex: 11, constraint: { notNull: true, } },
      { field: 'techVersion', title: '工艺版本', columnIndex: 12, constraint: { notNull: false, } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 200, locked: false },
    { field: 'resourceCode', title: '资源', width: 200, locked: false },
    { field: 'rateType', title: '速率类型', width: 150, locked: false },
    { field: 'rate', title: '速率', width: 100, locked: false },
    { field: 'batchQty', title: '批次数量', width: 100, locked: false },
    { field: 'priority', title: '优先级', width: 150, locked: false },
    { field: 'processCode', title: '工序号', width: 200, locked: false },
    { field: 'scheduleFlag', title: '参与排产标识', width: 200, locked: false },
    { field: 'selectResourceFlag', title: '参与选线标识', width: 200, locked: false },
    { field: 'techVersion', title: '工艺版本', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {

    this.editService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.extra));
        if (res.data != null && res.data.length > 0)
          this.excelexport.export(res.data);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.extra));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
