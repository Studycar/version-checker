import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {LookupCodeManageService} from '../../../../modules/generated_module/services/lookup-code-manage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-look-up-code-import',
  templateUrl: './import.component.html',
  providers: [LookupCodeManageService],
})
export class BaseLookUpCodeImportComponent implements OnInit {

  impColumns = {
    columns: ['编码类型*', '编码名称', '应用模块*', '语言', '描述'],
    paramMappings: [
      { field: 'lookupTypeCode', title: '编码类型', columnIndex: 1, constraint: { notNull: true } },
      { field: 'meaning', title: '编码名称', columnIndex: 1, constraint: { notNull: false } },
      { field: 'applicationCode', title: '应用模块', columnIndex: 2, constraint: { notNull: true } },
      { field: 'language', title: '语言', columnIndex: 3, constraint: { notNull: true } },
      { field: 'description', title: '描述', columnIndex: 4, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'lookupTypeCode', title: '菜单组编码', width: 300, locked: false },
    { field: 'meaning', title: '菜单组名称', width: 300, locked: false },
    { field: 'applicationCode', title: '应用模块', width: 300, locked: false },
    { field: 'language', title: '语言', width: 200, locked: false },
    { field: 'description', title: '生效日期', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.lookupCodeManageService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
          console.log('输出信息：' + res.msg);
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          /*if (res.data != null && res.data.length > 0) {
            this.excelexport.export(res.data);
          }*/
          this.modal.close();
      } else {
          this.msgSrv.error(res.msg);
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public lookupCodeManageService: LookupCodeManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
