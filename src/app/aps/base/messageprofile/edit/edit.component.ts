import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MessageProfileService } from 'app/modules/generated_module/services/message-profile-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-messageprofile-edit',
  templateUrl: './edit.component.html',
})
export class BaseMessageprofileEditComponent implements OnInit {

  record: any = {};
  i: any;
  title: String = '新增';
  msgTypeOptions: any[] = [];
  msgLevelOptions: any[] = [];
  msgRoleOptions: any[] = [];
  readOnly: boolean;
  Istrue: boolean;
  yesOrNo: any[] = [];
  isModify = true;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public querydata: MessageProfileService,
    public appservice: AppConfigService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit(): void {
    if (this.i.Id !== null) {
      this.isModify = true;
      this.readOnly = true;
      this.Istrue = true;
    } else {
      this.readOnly = false;
      this.Istrue = false;
      this.isModify = false;
    }
    this.loadData();
  }

  private loadData() {
    this.querydata.GetMessageType().subscribe(result => {
      this.msgTypeOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.msgTypeOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.querydata.GetMSGLEVEL().subscribe(result => {
      this.msgLevelOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.msgLevelOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.querydata.GetMSGROLE().subscribe(result => {
      this.msgRoleOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.msgRoleOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });
    if (this.i.Id !== null) {
      this.querydata.GetById(this.i.Id).subscribe(res => {
        this.i = res.Extra;
      });
    } else {
      this.title = '新增';
    }

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });
  }

  save() {
    if (this.i.Id !== null) {
      this.querydata.EditData(this.i).subscribe(res => {
        if (res.Success === true) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.querydata.SaveForNew(this.i).subscribe(res => {
        if (res.Success === true) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

}
