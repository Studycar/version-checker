import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { OperationManageService } from '../../../../modules/generated_module/services/operation-manage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-operationmanage-edit',
  templateUrl: './edit.component.html',
})
export class ProcessScheduleOperationmanageEditComponent implements OnInit {
  record: any = {};
  i: any;
  plantoptions: any[] = [];
  title: String = '新增';
  Istrue: boolean = false;
  IsCopy: boolean = false;
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private querydata: OperationManageService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.Istrue = true;
      //复制的功能
      if (this.i.Type === 'copy') {
        this.IsCopy = true;
      }
      this.querydata.GetById(this.i.id).subscribe(res => {
        this.i = res.data;

      });

    }

    this.LoadData();

  }

  save() {
    if (this.i.id !== null&&this.IsCopy === false) {
      this.querydata.Edit(this.i).subscribe(res => {
        if (res.code===200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.querydata.SaveForNew(this.i).subscribe(res => {
        console.log(res)
        if (res.code===200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  LoadData() {
    this.querydata.GetPlant().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    if (this.i.id != null) {
      this.querydata.GetById(this.i.id).subscribe(res => {
        this.i = res.Extra;
      });
    } else {
      this.i = {
        Id: null,
        plantCode: null,
        processCode: null,
        description: null,
        enableFlag: null
      };


    }
  }
}
