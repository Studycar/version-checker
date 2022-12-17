import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { EditService } from '../../edit.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-register-view-import',
  templateUrl: './import.component.html',
  providers: [EditService]
})
export class ApiRegisterViewImportComponent implements OnInit {
  apiCode = '';
  impColumns = {
    columns: ['字段编码', '字段名称', '字段类型', '是否必填', '接口表字段'],
    paramMappings: [
      { field: 'code', title: '字段编码', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'name', title: '字段名称', columnIndex: 2, constraint: { notNull: true } },
      { field: 'type', title: '字段类型', columnIndex: 3, constraint: { notNull: true } },
      { field: 'boolNotNull', title: '是否必填', columnIndex: 4, constraint: { notNull: true } },
      { field: 'tableField', title: '接口表字段', columnIndex: 5 },
      { field: 'rowNumber', title: '行号', default: 1 }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'code', title: '字段编码', width: 120, locked: false },
    { field: 'name', title: '字段名称', width: 120, locked: false },
    { field: 'type', title: '字段类型', width: 120, locked: false },
    { field: 'boolNotNull', title: '是否必填', width: 120, locked: false },
    { field: 'tableField', title: '接口表字段', width: 120, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    tempData.forEach(t => { t.boolNotNull = t.boolNotNull === 'TRUE' ? true : false; });
    this.editService.importData(tempData, this.apiCode).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        if (res.extra != null && res.extra.length > 0)
          this.excelexport.export(res.extra);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: EditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
