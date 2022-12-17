import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RespmanagerService } from '../../../../modules/generated_module/services/respmanager-service';
import { FunctionmanagerService } from '../../../../modules/generated_module/services/functionmanager-service';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-resprequestgroup-edit',
  templateUrl: './edit.component.html',
})
export class BaseResprequestgroupEditComponent implements OnInit {
  isModify = false;
  Istrue: boolean;
  menugroupids: any[] = [];
  record: any = {};
  i: any;
  requestgroupnames: any[] = [];
  applications: any[] = [];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private respmanagerService: RespmanagerService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  close() {
    this.modal.destroy();
  }

  save() {
    this.respmanagerService.EditRequestGroup(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }

    });
  }

  loadData() {
    /** 初始化请求名称 下拉框*/
    this.respmanagerService.GetRequestGroupName().subscribe(result => {
      console.log('loadData');
      console.log(result.code);
      result.data.forEach(d => {
        this.requestgroupnames.push({
          label: d.requestGroupName,
          value: d.id,
          tag: { applicationName: d.applicationName },
        });
      });

    });
    // console.log(this.requestgroupnames);
  }

  onRequestGroup() {
    this.requestgroupnames.forEach(element => {
      if (element.value === this.i.id) {
        this.i.applicationName = element.tag.applicationName;
      }
    });
  }

}

