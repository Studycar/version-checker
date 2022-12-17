import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ConcurrentProgramManageService } from '../../../../modules/generated_module/services/concurrent-program-manage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-copyto',
  templateUrl: './copyto.component.html',
})
export class ConcurrentRequestConcurrentProgramCopytoComponent implements OnInit {

  applicationArray: any[] = [];
  i: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private concurrentProgramManageService: ConcurrentProgramManageService
  ) { }

  ngOnInit(): void {
    // 绑定应用程序
    this.concurrentProgramManageService.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applicationArray.push({
          label: d.applicationName,
          value: d.applicationId,
        });
      });
    });
  }

  save() {
    const params = Object.assign({}, this.i);
    params.serial = this.i.serial ? 'Y' : 'N';
    params.parameter = this.i.parameter ? 'Y' : 'N';
    this.concurrentProgramManageService.Copy(params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('复制成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }

    });
  }

  close() {
    this.modal.destroy();
  }
}
