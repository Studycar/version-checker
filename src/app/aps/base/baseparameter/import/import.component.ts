import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {RespmanagerService} from '../../../../modules/generated_module/services/respmanager-service';
import {BaseParameterService} from '../../../../modules/generated_module/services/base-parameter-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-parameter-import',
  templateUrl: './import.component.html',
  providers: [BaseParameterService],
})
export class BaseParameterImportComponent implements OnInit {

  impColumns = {
    columns: ['参数编码*', '参数名称*', '应用模块*', '参数描述', '系统级别生效*', '事业部级别生效*', '组织级别生效*', '职责级别生效*', '用户级别生效*', '生效日期*', '失效日期', '语言*'],
    paramMappings: [
      { field: 'parameterCode', title: '参数编码', columnIndex: 1, constraint: { notNull: true } },
      { field: 'parameterName', title: '参数名称', columnIndex: 2, constraint: { notNull: true } },
      { field: 'applicationCode', title: '应用模块', columnIndex: 3, constraint: { notNull: true } },
      { field: 'description', title: '参数描述', columnIndex: 4, constraint: { notNull: false } },
      { field: 'sysEnabledFlag', title: '系统级别生效', columnIndex: 5, constraint: { notNull: true } },
      { field: 'regEnabledFlag', title: '事业部级别生效', columnIndex: 6, constraint: { notNull: true } },
      { field: 'plantEnabledFlag', title: '组织级别生效', columnIndex: 7, constraint: { notNull: true } },
      { field: 'respEnabledFlag', title: '职责级别生效', columnIndex: 8, constraint: { notNull: true } },
      { field: 'userEnabledFlag', title: '用户级别生效', columnIndex: 9, constraint: { notNull: true } },
      { field: 'startDate', title: '生效日期', columnIndex: 10, constraint: { notNull: true } },
      { field: 'endDate', title: '失效日期', columnIndex: 11, constraint: { notNull: false } },
      { field: 'language', title: '语言', columnIndex: 12, constraint: { notNull: true } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'parameterCode', title: '参数编码', width: 300, locked: false },
    { field: 'parameterName', title: '参数名称', width: 400, locked: false },
    { field: 'applicationCode', title: '应用模块', width: 300, locked: false },
    { field: 'description', title: '参数描述', width: 400, locked: false },
    { field: 'sysEnabledFlag', title: '系统级别生效', width: 200, locked: false },
    { field: 'regEnabledFlag', title: '事业部级别生效', width: 200, locked: false },
    { field: 'plantEnabledFlag', title: '组织级别生效', width: 200, locked: false },
    { field: 'respEnabledFlag', title: '职责级别生效', width: 200, locked: false },
    { field: 'userEnabledFlag', title: '用户级别生效', width: 200, locked: false },
    { field: 'startDate', title: '生效日期', width: 300, locked: false },
    { field: 'endDate', title: '失效日期', width: 300, locked: false },
    { field: 'language', title: '语言', width: 200, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    tempData.forEach(obj => {
      // @ts-ignore
      obj.startDate = obj.startDate.replace(/\//g, '-') + ' 00:00:00';
      // tslint:disable-next-line:triple-equals
      if (obj.endDate == null || obj.endDate == '') {
        obj.endDate = null;
      } else {
        // @ts-ignore
        obj.endDate = obj.endDate.replace(/\//g, '-') + ' 00:00:00';
      }
    });
    this.baseParameterService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
        console.log('输出信息:' + res);
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
    public baseParameterService: BaseParameterService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
