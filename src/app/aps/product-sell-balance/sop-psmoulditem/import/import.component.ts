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
import { PsMouldItemManageService } from 'app/modules/generated_module/services/psmould-item.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-psmoulditem-import',
  templateUrl: './import.component.html',
  // providers: []
})
export class SopPsMouldItemImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '模具编码', '物料', '模具优先级', '单位小时产出'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'resourceCode', title: '模具编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'itemId', title: '物料', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'itemMouldPriority', title: '模具优先级', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'uph', title: '单位小时产出', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'sopFlag', title: '参与S&OP', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'scheduleFlag', title: '是否参与排产', columnIndex: 7, constraint: { notNull: true, } },
      // { field: 'ROW_NUM', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'resourceCode', title: '模具编码', width: 200, locked: false },
    { field: 'itemId', title: '物料', width: 200, locked: false },
    { field: 'itemMouldPriority', title: '模具优先级', width: 200, locked: false },
    { field: 'uph', title: '单位小时产出', width: 200, locked: false },
    { field: 'sopFlag', title: '参与S&OP', width: 200, locked: false },
    { field: 'scheduleFlag', title: '是否参与排产', width: 200, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];

  whetherOptions: any[] = [];
  expColumnsOptions: any[] = [{ field: 'sopFlag', options: this.whetherOptions }
    , { field: 'scheduleFlag', options: this.whetherOptions }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.psMouldItemManageService.importData(tempData).subscribe(res => {
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
    public psMouldItemManageService: PsMouldItemManageService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
    this.getWhetherOptions();
  }

  close() {
    this.modal.destroy();
  }
  getWhetherOptions() {
    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.whetherOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }
}
