import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modelchangetime-import',
  templateUrl: './import.component.html',
  providers: [QueryService],
})
export class ModelChangeTimeImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '计划组', '资源', '换型类型', '因子(前)', '因子(后)', '换型时间(分钟)', '备注'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 10, constraint: { notNull: true } },
      { field: 'scheduleGroupCode', title: '计划组', columnIndex: 20, constraint: { notNull: true } },
      { field: 'resourceCode', title: '资源', columnIndex: 30, constraint: { notNull: true } },
      { field: 'categoryDesc', title: '换型类型', columnIndex: 40, constraint: { notNull: true } },
      { field: 'objectFrom', title: '因子(前)', columnIndex: 50, constraint: { notNull: true } },
      { field: 'objectTo', title: '因子(后)', columnIndex: 60, constraint: { notNull: true } },
      { field: 'switchTime', title: '换型时间(分钟)', columnIndex: 70, constraint: { notNull: true, isPositiveNumber: true } },
      { field: 'remark', title: '备注', columnIndex: 80, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 150, locked: false },
    { field: 'resourceCode', title: '资源', width: 150, locked: false },
    { field: 'categoryDesc', title: '换型类型', width: 150, locked: false },
    { field: 'objectFrom', title: '因子(前)', width: 150, locked: false },
    { field: 'objectTo', title: '因子(后)', width: 150, locked: false },
    { field: 'switchTime', title: '换型时间(分钟)', width: 150, locked: false },
    { field: 'remark', title: '备注', width: 150, locked: false },
    { field: 'errorMessage', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.queryService.import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '导入成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '导入失败'));
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
