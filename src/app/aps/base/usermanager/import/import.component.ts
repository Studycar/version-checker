import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {UserManagerManageService} from '../../../../modules/generated_module/services/user-manager-manage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-user-manager-import',
  templateUrl: './import.component.html',
  providers: [UserManagerManageService],
})
export class BaseUsermanagerImportComponent implements OnInit {

  impColumns = {
    columns: ['用户名*', '密码*', '真实姓名', '手机号', '邮箱地址', '部门', '默认工厂', '生效日期*', '内外销'],
    paramMappings: [
      { field: 'userName', title: '用户名', columnIndex: 1, constraint: { notNull: true } },
      { field: 'basePassword', title: '密码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'userPassword', title: '密码', columnIndex: 3, constraint: { notNull: true } },
      { field: 'description', title: '真实姓名', columnIndex: 4, constraint: { notNull: false } },
      { field: 'phoneNumber', title: '手机号', columnIndex: 5, constraint: { notNull: false } },
      { field: 'emailAddress', title: '邮箱地址', columnIndex: 6, constraint: { notNull: false } },
      { field: 'attribute5', title: '部门', columnIndex: 7, constraint: { notNull: true } },
      { field: 'defaultPlantCode', title: '默认工厂', columnIndex: 8, constraint: { notNull: false } },
      { field: 'startDate', title: '生效日期', columnIndex: 9, constraint: { notNull: true } },
      { field: 'endDate', title: '失效日期', columnIndex: 10, constraint: { notNull: false } },
      { field: 'salesType', title: '内外销', columnIndex: 11, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'userName', title: '用户名', width: 100, locked: false },
    { field: 'basePassword', title: '密码', width: 200, locked: false },
    { field: 'userPassword', title: '密码', width: 200, locked: false },
    { field: 'description', title: '真实姓名', width: 100, locked: false },
    { field: 'phoneNumber', title: '手机号', width: 200, locked: false },
    { field: 'emailAddress', title: '邮箱地址', width: 300, locked: false },
    { field: 'attribute5', title: '部门', width: 200, locked: false },
    { field: 'defaultPlantCode', title: '默认工厂', width: 200, locked: false },
    { field: 'startDate', title: '生效日期', width: 200, locked: false },
    { field: 'endDate', title: '失效日期', width: 200, locked: false },
    { field: 'salesType', title: '内外销', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    console.log(tempData);
    tempData.forEach(obj => {
      obj.startDate = obj.startDate.replace(/\//g, '-') + ' 00:00:00';
      console.log('输出开始日期' + obj.startDate);
      // tslint:disable-next-line:triple-equals
      if (obj.endDate == null || obj.endDate == '') {
        obj.endDate = null;
      } else {
        obj.endDate = obj.endDate.replace(/\//g, '-') + ' 00:00:00';
      }
    });
    this.userManagerManageService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.extra));
        if (res.data != null && res.data.length > 0) {
           this.excelexport.export(res.data);
        }
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
    public userManagerManageService: UserManagerManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
