import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-stage-program',
  templateUrl: './add-stage-program.component.html',
  styleUrls: ['./add-stage-program.component.css']
})
export class AddStageProgramComponent implements OnInit {
  i: any = {};
  param: any;
  paramList: any[] = [];
  editObj: any = {};

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private requestSetsService: RequestSetsService) { }

  ngOnInit(): void {
    if (this.param.Istrue === true) {
      this.editObj = this.clone(this.param.i);
      this.i = this.param.i;
    }

    this.paramList.length = 0;
    this.requestSetsService.QueryConcPrograms().subscribe(result => {
      result.data.content.forEach(d => {
        this.paramList.push({
          label: d.userConcurrentProgramName,
          value: d.concurrentProgramId,
        });
      });
    });
  }

  save() {
    if (this.param.operType === '新增') {
      this.i.requestSetProgramId = null;
    }
    this.i.requestSetId = this.param.i.requestSetId;
    this.i.requestSetStageId = this.param.i.requestSetStageId;
    this.i.requestSetProgramId = this.param.i.requestSetProgramId;
    this.requestSetsService.SaveStageProgram(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(res.msg);
        this.param.IsRefresh = true;
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  // object克隆
  public clone(obj: any): any {
    return deepCopy(obj);
  }

  clear() {
    this.i = this.clone(this.editObj);
  }
}
