import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { deepCopy } from '@delon/util';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-sets-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestRequestSetsEditComponent implements OnInit {
  list_app: any = [];
  editObj: any = {};
  i: any;
  param: any;
  isModify = false;
  @ViewChild('sf', { static: false }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      requestSetName: {
        type: 'string',
        title: this.appTranslationService.translate('请求集代码'),
      },
      userRequestSetName: {
        type: 'string',
        title: this.appTranslationService.translate('请求集名称'),
        default: '',
      },
      applicationId: {
        type: 'string',
        title: this.appTranslationService.translate('应用模块'),
        enum: [],
        ui: {
          widget: 'select',
        },
      },
      enabledFlag: {
        type: 'string',
        title: this.appTranslationService.translate('启用'),
        enum: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
        default: 'Y',
        ui: {
          widget: 'select',
        },
      },
      description: {
        type: 'string',
        title: this.appTranslationService.translate('说明'),
        default: '',
      },
    },
    required: ['requestSetName', 'userRequestSetName', 'applicationId'],
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $DESCRIPTION: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private requestSetsService: RequestSetsService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.i = this.param.i;
    this.editObj = this.clone(this.param.i);
    this.requestSetsService.GetAppliaction().subscribe(result => {
      result.data.content.forEach(d => {
        this.list_app.push({
          label: d.applicationName,
          value: d.id,
        });
      });
      this.schema.properties.applicationId.enum = this.list_app;
      this.sf.refreshSchema();
    });

    // 设置某个字段在修改状态下不可编辑，在新增状态下可以编辑
    if (this.param.operType !== '新增') {
      this.isModify = true;
      this.schema.properties.requestSetName.readOnly = true;
      this.schema.properties.applicationId.readOnly = true;
    }
  }

  save(value: any) {
    if (this.param.operType === '新增') {
      value.requestSetId = null;
    } else {
      value.requestSetId = this.i.requestSetId;
    }

    this.requestSetsService.Edit(value).subscribe(res => {
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
