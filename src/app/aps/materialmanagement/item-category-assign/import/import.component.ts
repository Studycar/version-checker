/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:39
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-09 17:41:42
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class MaterialmanagementItemCategoryAssignImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '物料编码', '类别集', '类别'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'categorySetCode', title: '类别集', columnIndex: 3, constraint: { notNull: true } },
      { field: 'categoryCode', title: '类别', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'rowNumber', title: '行号', default: 1 }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'categorySetCode', title: '类别集', width: 150, locked: false },
    { field: 'categoryCode', title: '类别', width: 200, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.commonQueryService.Import(tempData).subscribe(res => {
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
