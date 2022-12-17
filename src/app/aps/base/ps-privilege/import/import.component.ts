import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {UserManagerManageService} from '../../../../modules/generated_module/services/user-manager-manage-service';
import {BasePsPrivilegeEditService} from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-user-privilege-import',
  templateUrl: './import.component.html',
  providers: [BasePsPrivilegeEditService],
})
export class BaseUserPrivilegeImportComponent implements OnInit {

  impColumns = {
    columns: ['用户名*', '工厂*', '计划组', '资源', '工单修改*', '工单发放*', '是否发送邮件', '接收消息类型'],
    paramMappings: [
      { field: 'userName', title: '用户名', columnIndex: 1, constraint: { notNull: true } },
      { field: 'plantCode', title: '工厂', columnIndex: 2, constraint: { notNull: true } },
      { field: 'scheduleGroupCode', title: '计划组', columnIndex: 3, constraint: { notNull: false } },
      { field: 'resourceCode', title: '资源', columnIndex: 4, constraint: { notNull: false } },
      { field: 'modifyPrivilageFlag', title: '工单修改', columnIndex: 5, constraint: { notNull: true } },
      { field: 'publishPrivilageFlag', title: '工单发放', columnIndex: 6, constraint: { notNull: true } },
      { field: 'sendEmailFlag', title: '是否发送邮件', columnIndex: 7, constraint: { notNull: false } },
      { field: 'receiveMsgType', title: '接收消息类型', columnIndex: 8, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'userName', title: '用户名', width: 100, locked: false },
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 200, locked: false },
    { field: 'resourceCode', title: '资源', width: 100, locked: false },
    { field: 'modifyPrivilageFlag', title: '工单修改', width: 200, locked: false },
    { field: 'publishPrivilageFlag', title: '工单发放', width: 300, locked: false },
    { field: 'sendEmailFlag', title: '是否发送邮件', width: 200, locked: false },
    { field: 'receiveMsgType', title: '接收消息类型', width: 200, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.basePsPrivilegeEditService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.extra));
        if (res.data != null && res.data.length > 0) {
           this.excelexport.export(res.data);
        }
        // 导入完以后，关闭当前窗口
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
    public basePsPrivilegeEditService: BasePsPrivilegeEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
