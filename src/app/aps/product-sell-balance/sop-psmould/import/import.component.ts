/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-09-17 10:22:51
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-21 09:59:42
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { PsMouldManageService } from 'app/modules/generated_module/services/psmould.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-psmould-import',
  templateUrl: './import.component.html',
  // providers: []
})
export class SopPsMouldImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '模具编码',  '模具描述'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'mouldCode', title: '模具编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'descriptions', title: '模具描述', columnIndex: 3, constraint: { notNull: true, } },
 // { field: 'ROW_NUM', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'mouldCode', title: '模具编码', width: 200, locked: false },
    { field: 'descriptions', title: '模具描述', width: 200, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.psMouldManageService.importData(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('导入成功'));
      } else {
        this.msgSrv.info(this.appTranslationService.translate(res.msg || '导入失败'));
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
    public psMouldManageService: PsMouldManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
