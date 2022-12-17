import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-mo-supply-relation-import',
  templateUrl: './import.component.html',
  providers: [QueryService],
})
export class MaterialmanagementMoSupplyRelationImportComponent implements OnInit {

  impColumns = {
    columns: ['事业部', '工厂', '值类别', '类别值', '供应类型', '供应子库'],
    paramMappings: [
      { field: 'scheduleRegionCode', title: '事业部', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'plantCode', title: '工厂', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'category', title: '值类别', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'categoryValues', title: '类别值', columnIndex: 4, constraint: { notNull: false, } },
      { field: 'supplyType', title: '供应类型', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'supplySubinventory', title: '供应子库', columnIndex: 6, constraint: { notNull: true, } },
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'scheduleRegionCode', title: '事业部', width: 150, locked: false },
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'category', title: '值类别', width: 150, locked: false },
    { field: 'categoryValues', title: '类别值', width: 150, locked: false },
    { field: 'supplyType', title: '供应类型', width: 150, locked: false },
    { field: 'supplySubinventory', title: '供应子库', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    console.log(tempData);
    this.queryService.ImportData(tempData).subscribe(res => {
      if (res.code === 200) {
        if (res.data != null && res.data.length > 0) {
          this.excelexport.export(res.data);
        }
        this.msgSrv.success(this.appTranslationService.translate(res.extra));
        this.modal.destroy(true);
      } else {
        if (res.data != null && res.data.length > 0) {
          this.excelexport.export(res.data);
        }
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
