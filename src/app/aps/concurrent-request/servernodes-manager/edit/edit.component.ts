import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ServerNodesManageService } from '../../../../modules/generated_module/services/servernodes-manager-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-servernodes-manager-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestServernodesManagerEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  Param: any;
  schema: SFSchema = {
    properties: {
      nodeName: { type: 'string', title: this.appTranslationService.translate('节点') },
      platformCode: { type: 'string', title: this.appTranslationService.translate('平台'), default: '' },
      serverAddress: { type: 'string', title: this.appTranslationService.translate('IP'), format: 'regex', pattern: '^(((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?))$|^(([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4})$' },
      supportCp: {
        type: 'string', title: this.appTranslationService.translate('支持并发'),
        enum: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }],
        default: 'N',
        ui: {
          widget: 'select',
        },
      },
      concurrentPriority: { type: 'number', title: this.appTranslationService.translate('并发优先级'), default: 0 },
      primaryNode: {
        type: 'string', title: this.appTranslationService.translate('主节点'),
        enum: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }],
        default: 'N',
        ui: {
          widget: 'select',
        },
      },
      description: { type: 'string', title: this.appTranslationService.translate('说明'), default: '' },
    },
    required: ['nodeName', 'serverAddress', 'platformCode'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private serverNodesManageService: ServerNodesManageService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.i = this.Param.obj;
    this.iClone = Object.assign({}, this.i);
    // 设置某个字段在修改状态下不可编辑，在新增状态下可以编辑
    /*if (this.i.opertype) {
      this.schema.properties.NODE_NAME.readOnly = false;
    } else {
      this.schema.properties.NODE_NAME.readOnly = true;
    }*/

    // if (this.record.id > 0)
    //  this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    this.serverNodesManageService.Edit(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.Param.IsRefresh = true;
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
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
