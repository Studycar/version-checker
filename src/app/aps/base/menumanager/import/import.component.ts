import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {MenuQueryService} from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menu-import',
  templateUrl: './import.component.html',
  providers: [MenuQueryService],
})
export class BaseMenuImportComponent implements OnInit {

  impColumns = {
    columns: ['菜单名称', '应用模块', '语言', '功能', '菜单编码', '菜单类型', '窗口类型'],
    paramMappings: [
      { field: 'menuName', title: '菜单名称', columnIndex: 1, constraint: { notNull: true } },
      { field: 'applicationCode', title: '应用模块', columnIndex: 2, constraint: { notNull: true } },
      { field: 'language', title: '语言', columnIndex: 3, constraint: { notNull: true } },
      { field: 'functionName', title: '功能', columnIndex: 4, constraint: { notNull: true } },
      { field: 'menuCode', title: '菜单编码', columnIndex: 5, constraint: { notNull: true } },
      { field: 'menuType', title: '菜单类型', columnIndex: 6, constraint: { notNull: true } },
      { field: 'windowType', title: '窗口类型', columnIndex: 7, constraint: { notNull: true } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'menuName', title: '菜单名称', width: 200, locked: false },
    { field: 'applicationCode', title: '应用模块', width: 300, locked: false },
    { field: 'language', title: '语言', width: 300, locked: false },
    { field: 'functionName', title: '功能', width: 300, locked: false },
    { field: 'menuCode', title: '菜单编码', width: 200, locked: false },
    { field: 'menuType', title: '菜单类型', width: 300, locked: false },
    { field: 'windowType', title: '窗口类型', width: 400, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess (tempData: any[]) {
    this.menuQueryService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        /*if (res.data != null && res.data.length > 0) {
           this.excelexport.export(res.data);
        }*/
        // 导入完以后，关闭当前窗口
        this.modal.close();
      } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public menuQueryService: MenuQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
