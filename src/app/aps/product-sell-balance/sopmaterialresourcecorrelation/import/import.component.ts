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
export class MaterialResourceImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '计划组', '资源维度', '维度类型', '物料编码', '是否有效'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'scheduleGroupCode', title: '计划组', columnIndex: 2, constraint: { notNull: true } },
      { field: 'divisionName', title: '资源维度', columnIndex: 3, constraint: { notNull: true } },
      { field: 'divisionType', title: '维度类型', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料编码', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'enableFlag', title: '是否有效', columnIndex: 6, constraint: { notNull: true, } }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 150, locked: false },
    { field: 'divisionName', title: '资源维度', width: 150, locked: false },
    { field: 'divisionType', title: '维度类型', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.commonQueryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        if (res.data != null && res.data.length > 0)
          this.excelexport.export(res.data);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
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
