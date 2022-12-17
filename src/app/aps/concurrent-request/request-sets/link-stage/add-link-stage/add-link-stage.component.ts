import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-link-stage',
  templateUrl: './add-link-stage.component.html',
  styleUrls: ['./add-link-stage.component.css']
})
export class AddLinkStageComponent implements OnInit {
  stageList: any[] = [];
  i: any;
  editObj: any = {};
  param: any;

  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      successLink: {
        type: 'string', title: this.appTranslationService.translate('成功'), enum: [],
        ui: {
          widget: 'select',
          allowClear: true,
        }, default: ''
      },
      warningLink: {
        type: 'string', title: this.appTranslationService.translate('警告'), ui: {
          widget: 'select',
          allowClear: true,
        }, default: ''
      },
      errorLink: {
        type: 'string', title: this.appTranslationService.translate('错误'), ui: {
          widget: 'select',
          allowClear: true,
        }, default: ''
      },
    },
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
      this.i = this.param.i;
    }


    this.param.data.forEach(d => {
      this.stageList.push({
        label: d.stageName,
        value: d.requestSetStageId
      });
    });

    this.schema.properties.successLink.enum = this.stageList;
    this.schema.properties.warningLink.enum = this.stageList;
    this.schema.properties.errorLink.enum = this.stageList;
  }

  save(value: any) {
    this.requestSetsService.UpdateRequestSetStagesLink(value).subscribe(res => {
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
