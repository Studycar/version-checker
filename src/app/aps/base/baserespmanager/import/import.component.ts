import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {RespmanagerService} from '../../../../modules/generated_module/services/respmanager-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-resp-b-import',
  templateUrl: './import.component.html',
  providers: [RespmanagerService],
})
export class BaseRespsBImportComponent implements OnInit {

  impColumns = {
    columns: ['职责代码*', '应用模块*', '生效日期*', '失效日期', '语言*', '职责名称*', '描述'],
    paramMappings: [
      { field: 'respsCode', title: '职责代码', columnIndex: 1, constraint: { notNull: true } },
      { field: 'applicationCode', title: '应用模块', columnIndex: 2, constraint: { notNull: true } },
      { field: 'startDate', title: '生效日期', columnIndex: 3, constraint: { notNull: true } },
      { field: 'endDate', title: '失效日期', columnIndex: 4, constraint: { notNull: false } },
      { field: 'language', title: '语言', columnIndex: 5, constraint: { notNull: true } },
      { field: 'respsName', title: '职责名称', columnIndex: 6, constraint: { notNull: true } },
      { field: 'description', title: '描述', columnIndex: 7, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'respsCode', title: '职责代码', width: 200, locked: false },
    { field: 'applicationCode', title: '应用模块', width: 300, locked: false },
    { field: 'startDate', title: '生效日期', width: 300, locked: false },
    { field: 'endDate', title: '失效日期', width: 300, locked: false },
    { field: 'language', title: '语言', width: 200, locked: false },
    { field: 'respsName', title: '职责名称', width: 300, locked: false },
    { field: 'description', title: '描述', width: 400, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    tempData.forEach(obj => {
      // 日期格式替换
      obj.startDate = obj.startDate.replace(/\//g, '-') + ' 00:00:00';
      console.log('输出日期：' + obj.startDate);
      // tslint:disable-next-line:triple-equals
      if (obj.endDate == null || obj.endDate == '') {
        obj.endDate = null;
      } else {
        obj.endDate = obj.endDate.replace(/\//g, '-') + ' 00:00:00';
      }
    });

    // 执行导入
    this.respmanagerService.imports(tempData).subscribe(res => {
      console.log('输出职责信息：' + res);
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
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
    public respmanagerService: RespmanagerService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
