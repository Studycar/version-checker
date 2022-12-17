/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-08-01 17:49:16
 * @LastEditors: Zwh
 * @LastEditTime: 2018-08-01 17:49:16
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ExecutablesManageService } from '../../../../modules/generated_module/services/executables-manage-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-executables-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestExecutablesEditComponent implements OnInit {

  applicationArray: any[] = [];
  execMethodArray: any[] = [];
  editObj: any = {};
  param: any;
  Istrue = false;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private executablesManageService: ExecutablesManageService,
  ) { }

  ngOnInit(): void {
    if (this.param.operType === '编辑') {
      this.Istrue = true;
      this.editObj = this.clone(this.param.i) ;
    } else {
      this.Istrue = false;
    }
    this.executablesManageService.GetBaseApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applicationArray.push({
          label: d.applicationName,
          value: d.applicationId,
        });
      });
    });

    this.execMethodArray.push({ label: 'Dynamic Link Library', value: 'D' });
    this.execMethodArray.push({ label: 'Host', value: 'H' });
    this.execMethodArray.push({ label: 'PL/SQL Procedure', value: 'I' });
    this.execMethodArray.push({ label: 'WebService', value: 'W' });
    this.execMethodArray.push({ label: 'Request Set', value: 'R' });
  }

  save() {
    // tslint:disable-next-line:whitespace
    if (this.param.operType === '编辑') {
      // value.ID = this.param.i.Id;
      this.executablesManageService.Update(this.param.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.param.IsRefresh = true;
          this.modal.close();
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.executablesManageService.Insert(this.param.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.param.IsRefresh = true;
          this.modal.close();
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.param.i = this.clone(this.editObj);
  }

  // object克隆
  public clone(obj: any): any {
    return deepCopy(obj);
  }

}
