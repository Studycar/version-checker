import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ConcurrentDefineService } from '../../../../modules/generated_module/services/concurrent-define-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-define-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestConcurrentDefineEditComponent implements OnInit {
  list_app: any = [];
  list_node: any = [];
  list_manager_type: any = [];
  i: any;
  iClone: any;
  Param: any;
  @ViewChild('sf', {static: false}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      userConcurrentManangerName: { type: 'string', title: this.appTranslationService.translate('管理器名称') },
      concurrentManangerName: { type: 'string', title: this.appTranslationService.translate('管理器代码') },
      applicationId: {
        type: 'string', title: this.appTranslationService.translate('应用模块') ,
        enum: [],
        ui: {
          widget: 'select',
        },
      },
      managerType: {
        type: 'string', title: this.appTranslationService.translate('管理器类型') ,
        enum: [],
        ui: {
          widget: 'select',
        },
      },
      nodeName: {
        type: 'string', title: this.appTranslationService.translate('主要节点') ,
        enum: [],
        default: '',
        ui: {
          widget: 'select',
        },
      },
      nodeName2: {
        type: 'string', title: this.appTranslationService.translate('备用节点') ,
        enum: [],
        default: '',
        ui: {
          widget: 'select',
        },
      },
      targetProcesses: { type: 'integer', title: this.appTranslationService.translate('进程数量') , minimum: 1, default: 1 },
      sleepSeconds: { type: 'integer', title: this.appTranslationService.translate('休眠时间') , minimum: 1, default: 1 },
      description: { type: 'string', title: this.appTranslationService.translate('说明') , default: '' },
      enabledFlag: { type: 'boolean', title: this.appTranslationService.translate('启用') , default: true },
      defaultFlag: { type: 'boolean', title: this.appTranslationService.translate('默认管理器') },
      enableDebug: { type: 'boolean', title: this.appTranslationService.translate('启用调试') },
    },
    required: ['userConcurrentManangerName', 'concurrentManangerName', 'applicationId', 'managerType', 'targetProcesses', 'sleepSeconds'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },

    $description: {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private concurrentDefineService: ConcurrentDefineService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.i = this.Param.obj;
    this.iClone = Object.assign({}, this.i);
    this.concurrentDefineService.GetAppliaction().subscribe(result => {
      result.data.forEach(d => {
        this.list_app.push({
          label: d.applicationName,
          value: d.applicationId,
        });
      });
      this.schema.properties.applicationId.enum = this.list_app;
      this.sf.refreshSchema();
    });

    this.commonQueryService.GetLookupByTypeNew('FND_CONC_MANAGER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.list_manager_type.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
      this.schema.properties.managerType.enum = this.list_manager_type;
      this.sf.refreshSchema();
    });

    this.concurrentDefineService.GetNodes().subscribe(result => {
      result.data.forEach(d => {
        this.list_node.push({
          label: d.nodeName,
          value: d.nodeName,
        });
      });
      this.schema.properties.nodeName.enum = this.list_node;
      this.schema.properties.nodeName2.enum = this.list_node;
      this.sf.refreshSchema();
    });

    // 设置某个字段在修改状态下不可编辑，在新增状态下可以编辑
    if (!this.Param.opertype) {
      this.schema.properties.concurrentManangerName.readOnly = true;
      this.schema.properties.managerType.readOnly = true;
      // tslint:disable-next-line:triple-equals
      if (this.i.managerType != '3') {
        this.schema.properties.targetProcesses.readOnly = true;
      }
      this.i.managerType = this.i.managerType.toString();
      this.i.enabledFlag = this.i.enabledFlag === 'Y';
      this.i.defaultFlag = this.i.defaultFlag === 'Y';
      this.i.enableDebug = this.i.enableDebug === 'Y';
    }
  }

  /*ManagerTypeChange(value: any) {
    if (value !== '3') {
      this.i.TARGET_PROCESSES = '1';
      this.schema.properties.TARGET_PROCESSES.readOnly = true;
    } else {
      this.schema.properties.TARGET_PROCESSES.readOnly = false;
    }
  }*/

  save(value: any) {
    // tslint:disable-next-line:triple-equals
    if (value.managerType != '3' && value.targetProcesses > 1) {
      this.msgSrv.info('管理器类型不是内部管理器时, 进程数量必须等于1');
      return;
    }
    const params = Object.assign({}, value);
    if (this.Param.opertype) {
      params.id = null;
    } else {
      params.id = this.i.id;
    }
    params.managerType = Number(params.managerType);
    params.enabledFlag = params.enabledFlag === true ? 'Y' : 'N';
    params.defaultFlag = params.defaultFlag === true ? 'Y' : 'N';
    params.enableDebug = params.enableDebug === true ? 'Y' : 'N';

    this.concurrentDefineService.Edit(params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.Param.IsRefresh = true;
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
