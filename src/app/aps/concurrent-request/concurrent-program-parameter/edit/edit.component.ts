import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ConcurrentProgramManageService } from '../../../../modules/generated_module/services/concurrent-program-manage-service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-parameter-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestConcurrentProgramParameterEditComponent implements OnInit {
  i: any;
  iClone: any;
  param: any;
  concurrent_program_id: any;
  FLEX_VALUE_SET_ID_array: any[] = [];
  RANGE_CODE_array: any[] = [
    { label: 'High', value: 'H' },
    { label: 'Low', value: 'L' }
  ];
  DEFAULT_TYPE_array: any[] = [
    { label: 'SQL Statement', value: 'S' },
    { label: 'CONSTANT', value: 'C' }
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public concurrentProgramManageService: ConcurrentProgramManageService,
  ) { }

  ngOnInit(): void {

    this.i = Object.assign({}, this.param.i);
    this.iClone = Object.assign({}, this.i);
    this.concurrent_program_id = this.i.concurrentProgramId;
    this.i.confictFlag = this.i.confictFlag === 'Y';
    this.i.enabledFlag = this.i.enabledFlag === 'Y';
    this.i.requiredFlag = this.i.requiredFlag === 'Y';
    this.i.displayFlag = this.i.displayFlag === 'Y';
    this.concurrentProgramManageService.GetFlexValueSets().subscribe(result => {
      result.data.forEach(d => {
        this.FLEX_VALUE_SET_ID_array.push({
          label: d.flexValueSetName,
          value: d.id,
        });
      });
    });
    //

    // 绑定范围
    /*this.concurrentProgramManageService.GetRegion().subscribe(result => {
      result.Extra.forEach(d => {
        this.RANGE_CODE_array.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });*/
    //

    // 绑定默认值
    /*this.concurrentProgramManageService.GetDefaultType().subscribe(result => {
      result.Extra.forEach(d => {
        this.DEFAULT_TYPE_array.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });*/
    //
  }

  save() {
    const params = Object.assign({}, this.i);
    params.confictFlag = params.confictFlag ? 'Y' : 'N';
    params.enabledFlag = params.enabledFlag ? 'Y' : 'N';
    params.requiredFlag = params.requiredFlag ? 'Y' : 'N';
    params.displayFlag = params.displayFlag ? 'Y' : 'N';
    this.concurrentProgramManageService.saveParameter(params).subscribe(res => {
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
