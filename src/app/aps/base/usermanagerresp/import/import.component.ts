import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {UserManagerManageService} from '../../../../modules/generated_module/services/user-manager-manage-service';
import {QueryService} from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-user-resp-import',
  templateUrl: './import.component.html',
  providers: [QueryService],
})
export class BaseUserRespImportComponent implements OnInit {

  impColumns = {
    columns: ['用户名*', '职责代码*', '生效日期*', '失效日期'],
    paramMappings: [
      { field: 'userName', title: '用户名', columnIndex: 1, constraint: { notNull: true } },
      { field: 'respsCode', title: '职责代码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'startDate', title: '生效日期', columnIndex: 3, constraint: { notNull: false } },
      { field: 'endDate', title: '失效日期', columnIndex: 4, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'userName', title: '用户名', width: 200, locked: false },
    { field: 'respsCode', title: '职责代码', width: 300, locked: false },
    { field: 'startDate', title: '生效日期', width: 300, locked: false },
    { field: 'endDate', title: '失效日期', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    tempData.forEach(obj => {
      obj.startDate = obj.startDate.replace(/\//g, '-') + ' 00:00:00';
      console.log('输出时间日期：' + obj.startDate);
      // tslint:disable-next-line:triple-equals
      if (obj.endDate == null || obj.endDate == '') {
        obj.endDate = null;
      } else {
        obj.endDate = obj.endDate.replace(/\//g, '-') + ' 00:00:00';
      }
    });
    this.userRespService.importUserResp(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      // 导入完以后，关闭当前窗口
      this.modal.close();
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public userRespService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
