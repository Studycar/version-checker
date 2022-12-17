/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:02
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-06 15:18:24
 * @Note: ...
 */
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
export class DemandAnalysisImportComponent implements OnInit {

  impColumns = {
    columns: ['事业部', '需求分析维度', '维度值', '是否有效'],
    paramMappings: [
      { field: 'businessUnitCode', title: '事业部', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'divisionName', title: '需求分析维度', columnIndex: 2, constraint: { notNull: true } },
      { field: 'divisionValue', title: '维度值', columnIndex: 3, constraint: { notNull: true } },
      { field: 'enableFlag', title: '是否有效', columnIndex: 4, constraint: { notNull: true, } },
    ],
  };

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 150, locked: false },
    { field: 'divisionName', title: '需求分析维度', width: 150, locked: false },
    { field: 'divisionValue', title: '维度值', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.commonQueryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('导入成功'));
        this.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
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

  close(value: any) {
    this.modal.destroy(value);
  }
}
