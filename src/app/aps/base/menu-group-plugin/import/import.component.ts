import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {BaseMenuGroupPluginEditService} from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menu-group-import',
  templateUrl: './import.component.html',
  providers: [BaseMenuGroupPluginEditService],
})
export class BaseMenuGroupImportComponent implements OnInit {

  impColumns = {
    columns: ['菜单组编码*', '菜单组名称*', '应用模块*', '语言', '生效日期'],
    paramMappings: [
      { field: 'menuGroupCode', title: '菜单组编码', columnIndex: 1, constraint: { notNull: true } },
      { field: 'menuGroupName', title: '菜单组名称', columnIndex: 1, constraint: { notNull: true } },
      { field: 'applicationCode', title: '应用模块', columnIndex: 2, constraint: { notNull: true } },
      { field: 'language', title: '语言', columnIndex: 3, constraint: { notNull: true } },
      { field: 'startDate', title: '生效日期', columnIndex: 4, constraint: { notNull: true } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'menuGroupCode', title: '菜单组编码', width: 300, locked: false },
    { field: 'menuGroupName', title: '菜单组名称', width: 300, locked: false },
    { field: 'applicationCode', title: '应用模块', width: 300, locked: false },
    { field: 'language', title: '语言', width: 200, locked: false },
    { field: 'startDate', title: '生效日期', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    tempData.forEach(obj => {
       obj.startDate = obj.startDate.replace(/\//g, '-') + ' 00:00:00';
    });
    this.menuGroupPluginEditService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          /*if (res.data != null && res.data.length > 0) {
            this.excelexport.export(res.data);
          }*/
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
    public menuGroupPluginEditService: BaseMenuGroupPluginEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
