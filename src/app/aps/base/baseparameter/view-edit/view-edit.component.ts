import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { BaseParameterService } from '../../../../modules/generated_module/services/base-parameter-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baseparameter-view-edit',
  templateUrl: './view-edit.component.html',
})
export class BaseBaseparameterViewEditComponent implements OnInit {
  record: any = {};
  m: any;
  mClone: any;
  k: any;
  leveloptions: any[] = [];
  public linkoptions: any[] = [];

  regoptions: any[] = [];
  respoptions: any[] = [];
  useroptions: any[] = [];
  plantoptions: any[] = [];
  title: String = '新增';

  isEdit = false;

  tag1: boolean;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private httpservice: BaseParameterService,
    private commonQuery: CommonQueryService,
    public appService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.tag1 = true;
    if (this.m.parameterValueId !== null) {
      this.isEdit = true;
      this.title = '编辑';
      this.httpservice.GetById1(this.m.parameterId, this.m.parameterValueId, this.m.language).subscribe(res => {
        this.levelchange(res.data.levelValue);
        this.m = res.data;
        this.mClone = Object.assign({}, this.m);
      });
    }
  }

  private loadData() {
    this.leveloptions = this.m.list;
  }

  levelchange(item: any) {
    this.m.linkId = null;
    this.callback1(item);
    this.linkoptions.length = 0;
    if (item === 1) {
      this.tag1 = false;
      this.linkoptions = [];
    } else if (item === 5) {
      this.linkoptions = this.useroptions;
    } else if (item === 2) {
      this.linkoptions = this.regoptions;
    } else if (item === 4) {
      this.linkoptions = this.respoptions;
    } else if (item === 3) {
      this.linkoptions = this.plantoptions;
    }
    console.log(this.linkoptions);
  }

  save() {
    if (this.m.parameterValueId !== null) {
      this.m.Id = this.m.parameterValueId;
      this.httpservice.Edit2(this.m).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else if (this.m.parameterValueId === null) {
      this.httpservice.SaveForNew1(this.m).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  callback1(value: any) {
    if (value === 1) {
      this.tag1 = false;
      this.linkoptions = [];
    } else if (value === 2) {
      this.regoptions.length = 0;
      this.commonQuery.GetAllScheduleRegion().subscribe(res => {
        res.data.forEach(element => {
          this.regoptions.push({
            label: element.scheduleRegionCode,
            value: element.id
          });
        });
      });
    } else if (value === 4) {
      this.respoptions.length = 0;
      this.commonQuery.Getdatauserresp(this.appService.getUserId()).subscribe(res => {
        res.data.forEach(element => {
          this.respoptions.push({
            label: element.respsName,
            value: element.id
          });
        });
      });
    } else if (value === 3) {
      this.plantoptions.length = 0;
      this.commonQuery.GetAllPlant().subscribe(res => {
        res.data.forEach(element => {
          this.plantoptions.push({
            label: element.plantCode,
            value: element.id
          });
        });
      });
    } else if (value === 5) {
      this.useroptions.length = 0;
      this.commonQuery.GetUserInfos().subscribe(res => {
        res.data.forEach(element => {
          this.useroptions.push({
            label: element.userName,
            value: element.userId
          });
        });
      });
    }
  }

  linkChange(value: any) {
    if (this.m.levelValue === 1) {

    } else if (this.m.levelValue === 2) {

    } else if (this.m.levelValue === 3) {

    } else if (this.m.levelValue === 4) {

    } else if (this.m.levelValue === 5) {

    }
  }

  clear() {
    this.m = Object.assign({}, this.mClone);
  }
}
