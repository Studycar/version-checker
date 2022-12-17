import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'injection-molding-changeover-time-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class InjectionMoldingChangeoverTimeImportComponent implements OnInit {

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService,
  ) { }

  impColumns = {
    columns: ['工厂', '换型类型', '模具编码', '颜色类型从', '颜色类型至', '时间（H）', '是否有效'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'switchType', title: '换型类型', columnIndex: 2, constraint: { notNull: true } },
      { field: 'mouldCode', title: '模具编码', columnIndex: 3, constraint: { notNull: false } },
      { field: 'colorTypeFrom', title: '颜色类型从', columnIndex: 4, constraint: { notNull: false } },
      { field: 'colorTypeTo', title: '颜色类型至', columnIndex: 5, constraint: { notNull: false } },
      { field: 'switchTime', title: '时间（H）', columnIndex: 6, constraint: { norNull: true } },
      { field: 'enableFlag', title: '是否有效', columnIndex: 7, constraint: { notNull: true } }
    ]
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'switchType', title: '换型类型', width: 150, locked: false },
    { field: 'mouldCode', title: '模具编码', width: 150, locked: false },
    { field: 'colorTypeFrom', title: '颜色类型从', width: 180, locked: false },
    { field: 'colorTypeTo', title: '颜色类型至', width: 180, locked: false },
    { field: 'switchTime', title: '时间（H）', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  ngOnInit() {
  }

  excelDataProcess(tempData: any[]) {
    this.queryService.importFile(tempData).subscribe(res => {
      if (res.code === 200) {
        if (!res.data) {
          this.msgSrv.error(this.appTranslationService.translate('文件数据有误，请查看报错文件！'));
          this.excelexport.export(res.data.ExtraDataList);
        } else {
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '导入成功！'));
          this.modal.destroy(true);
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
