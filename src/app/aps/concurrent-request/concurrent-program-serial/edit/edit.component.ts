import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ConcurrentProgramManageService } from '../../../../modules/generated_module/services/concurrent-program-manage-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-serial-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestConcurrentProgramSerialEditComponent implements OnInit {
  title: string;
  i: any;
  iClone: any;
  torunconcurrentprogramidArray: any[] = [];
  applicationIDArray: any[] = [];
  incompatibilitytypeArray: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private concurrentProgramManageService: ConcurrentProgramManageService,
    private commonQueryService: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.title = !this.i.id ? '新增信息' : '编辑信息';
    this.iClone = Object.assign({}, this.i);
    // 绑定程序
    this.concurrentProgramManageService.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applicationIDArray.push({
          label: d.applicationName,
          value: d.applicationId,
        });
      });
    });

    // 绑定不兼容
    this.concurrentProgramManageService.GetConcProg().subscribe(result => {
      result.data.forEach(d => {
        this.torunconcurrentprogramidArray.push({
          label: d.userConcurrentProgramName,
          value: d.concurrentProgramId,
        });
      });
    });

    // 绑定不兼容类型
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_INCOMPATIBILITY_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.incompatibilitytypeArray.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

  }

  save() {
    this.concurrentProgramManageService.saveSerial(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
