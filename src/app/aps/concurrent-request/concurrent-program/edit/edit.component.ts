import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ConcurrentProgramManageService } from '../../../../modules/generated_module/services/concurrent-program-manage-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestConcurrentProgramEditComponent implements OnInit {

  record: any = {};
  i: any;
  iClone: any;
  param: any;
  prgDisable = false;
  IsRequestSet = false;
  applicationArray: any[] = [];
  executableArray: any[] = [];
  concurrentArray: any[] = [];
  outPutFileTypeArray: any[] = [];


  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private concurrentProgramManageService: ConcurrentProgramManageService,
    public commonQueryService: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.i = Object.assign({}, this.param.i);
    this.i.enabledFlag = this.i.enabledFlag === 'Y';
    this.iClone = Object.assign({}, this.i);

    // 绑定应用程序
    this.concurrentProgramManageService.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applicationArray.push({
          label: d.applicationName,
          value: d.applicationId,
        });
      });
    });

    // 绑定可执行名称
    this.concurrentProgramManageService.GetExecutableData().subscribe(result => {
      result.data.forEach(d => {
        this.executableArray.push({
          label: d.executableName,
          value: d.id,
        });
      });
    });

    // 绑定输出格式
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_OUTPUT_FILE_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.outPutFileTypeArray.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // 绑定请求类型
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_REQUEST_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.concurrentArray.push({
          label: d.meaning,
          value: d.lookupCodeId,
        });
      });
    });

    if (this.param.operType === '编辑') {
      this.IsRequestSet = this.param.i.requestSetFlag === 'Y';
      this.prgDisable = true;
    } else {
      this.prgDisable = false;
    }
  }

  save() {
    const params = Object.assign({}, this.i);
    params.enabledFlag = params.enabledFlag ? 'Y' : 'N';
    this.concurrentProgramManageService.save(params).subscribe(res => {
      if (res.code === 200) {
        this.param.IsRefresh = true;
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
