import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RequestGroupsService } from '../../../../modules/generated_module/services/request-groups-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-groups-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestRequestGroupsEditComponent implements OnInit {
  editObj: any = {};
  isModify = false;
  applications: any[] = [];
  i: any;
  Param: any;
  @ViewChild('sf', { static: false, }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      requestGroupName: { type: 'string', title: this.appTranslationService.translate('名称') },
      requestGroupCode: { type: 'string', title: this.appTranslationService.translate('代码') },
      applicationId: {
        type: 'string', title: this.appTranslationService.translate('应用'), ui: {
          widget: 'select'
        },
        enum: []
      },
      description: { type: 'string', title: this.appTranslationService.translate('说明') },
    },
    required: ['requestGroupName', 'requestGroupCode', 'applicationId'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    }
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private requestGroupsService: RequestGroupsService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    // debugger
    this.i = this.Param.obj;
    this.editObj = this.clone(this.Param.obj);

    if (this.Param.obj.id !== null) {
      this.isModify = true;
    }

    this.requestGroupsService.GetAppliaction().subscribe(result => {
      result.data.content.forEach(d => {
        this.applications.push({
          label: d.applicationName,
          value: d.id,
        });
      });

      this.schema.properties.applicationId.enum = this.applications;
      this.sf.refreshSchema();
    });
  }

  save(value: any) {
    if (this.Param.opertype) {
      value.id = null;
      this.requestGroupsService.insertBaseRequestGroups(value).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success(res.msg);
          this.Param.IsRefresh = true;
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      value.id = this.i.id;
      this.requestGroupsService.updateBaseRequestGroups(value).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success(res.msg);
          this.Param.IsRefresh = true;
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }
  
  // object克隆
  public clone(obj: any): any {
    return deepCopy(obj);
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = this.clone(this.editObj);
  }
}
