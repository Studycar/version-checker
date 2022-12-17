import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-managers-edit',
  templateUrl: './edit.component.html',
})
export class ConcurrentRequestConcurrentManagersEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      no: { type: 'string', title: this.appTranslationService.translate('编号') },
      owner: { type: 'string', title: this.appTranslationService.translate('姓名'), maxLength: 15 },
      callNo: { type: 'number', title: this.appTranslationService.translate('调用次数') },
      href: { type: 'string', title: this.appTranslationService.translate('链接'), format: 'uri' },
      description: { type: 'string', title: this.appTranslationService.translate('描述'), maxLength: 140 },
    },
    required: ['owner', 'callNo', 'href', 'description'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string',
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
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    if (this.record.id > 0)
      this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
