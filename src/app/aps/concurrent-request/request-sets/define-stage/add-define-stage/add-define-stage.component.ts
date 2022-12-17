import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-define-stage',
  templateUrl: './add-define-stage.component.html',
  styleUrls: ['./add-define-stage.component.css']
})
export class AddDefineStageComponent implements OnInit {
  i: any;
  param: any;
  editObj: any = {};
  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      displaySequence: { type: 'integer', title: this.appTranslationService.translate('序号') },
      stageName: { type: 'string', title: this.appTranslationService.translate('阶段'), default: '' },
      description: { type: 'string', title: this.appTranslationService.translate('说明'), default: '' },
    },
    required: ['displaySequence', 'stageName'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private requestSetsService: RequestSetsService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    if (this.param.Istrue === true) {
      this.editObj = this.clone(this.param.i);
    }
    this.i = this.param.i;
  }

  save(value: any) {
    if (this.param.operType === '新增') {
      value.requestSetStageId = null;
    }
    this.requestSetsService.EditRequestStage(value).subscribe(res => {
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
