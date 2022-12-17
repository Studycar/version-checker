import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-stage-prog-args',
  templateUrl: './add-stage-prog-args.component.html',
  styleUrls: ['./add-stage-prog-args.component.css']
})
export class AddStageProgArgsComponent implements OnInit {

  defaultTypeList: any[] = [];
  i: any;
  editObj: any = {};
  param: any;
  @ViewChild('sf', { static: true }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      columnSeqNum: { type: 'string', title: this.appTranslationService.translate('序号') },
      userPromptName: { type: 'string', title: this.appTranslationService.translate('提示') },
      sharedParameterName: { type: 'string', title: this.appTranslationService.translate('共享参数') },
      defaultType: {
        type: 'string', title: this.appTranslationService.translate('默认类型'), enum: [],
        ui: {
          widget: 'select',
          allowClear: true
        },
        default: ''
      },
      defaultValue: { type: 'string', title: this.appTranslationService.translate('默认值') },
    },
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    }
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

    this.defaultTypeList.push({
      label: 'SQL Statement',
      value: 'S',
    });
    this.defaultTypeList.push({
      label: 'Constant',
      value: 'C',
    });
    this.schema.properties.defaultType.enum = this.defaultTypeList;
    this.schema.properties.columnSeqNum.readOnly = true;
    this.schema.properties.userPromptName.readOnly = true;
  }

  save(value: any) {
    value.updateFlag = 'Y';
    this.requestSetsService.saveRequestSetProgArgs(value).subscribe(res => {
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
