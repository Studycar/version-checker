import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { BaseTranslstorService } from '../../../../modules/generated_module/services/basetranslator-service';
import { BaseTranslatorInputDto } from '../../../../modules/generated_module/dtos/base-translator-input-dto';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'translator-edit',
  templateUrl: './edit.component.html',
})
export class TranslatorEditComponent implements OnInit {
  title: String = '编辑';
  languageOptions: any[] = [];
  applicationOptions: any[] = [];

  unitAll: any[] = [];
  CODEOptions: any[] = [];
  i: any;
  iClone: any;
  tag: any;
  LANGUAGEText: string;
  Istrue: Boolean;
  required: Boolean;
  isModify = false;
  CurLng: any;



  @ViewChild('sf', {static: true}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      languageCode: {
        type: 'string', title: '语言代码', ui:
        {
          widget: 'select',
          // change: (value: any) => this.getCODEText(value),
          emum: []
        },
      },
      devLanguageRd: {
        type: 'string', title: '原文',
      },
      translatedText: {
        type: 'string', title: '译文',
      },
    },
    required: ['languageCode', 'devLanguageRd'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 130,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public TranslstorService: BaseTranslstorService,
    public appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if (this.i.id == null) {
      this.title = this.appTranslationService.translate('新增');
      this.Istrue = false;
      this.i.languageCode = this.CurLng;
    } else {
      this.schema.properties.languageCode.readOnly = true;
      this.schema.properties.devLanguageRd.readOnly = true;
      this.Istrue = true;
      this.isModify = true;
      this.title = this.appTranslationService.translate('编辑');
      this.iClone = Object.assign({}, this.i);
    }
    this.loadData();
  }

  loadData() {
    this.schema.properties.languageCode.enum = this.CODEOptions;
    this.sf.refreshSchema();
  }

  save(item?: any) {
    const dto = {
      id: this.i.id,
      devLanguageId: this.i.devLanguageId,
      devLanguageRd: this.i.devLanguageRd,
      translatedText: this.i.translatedText,
      languageCode : this.i.languageCode,
      attribute1 : this.i.attribute1
    };

    if (this.i.operationFlag === 'Y') {
      this.TranslstorService.Save(dto).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
          this.modal.close(true);
        }
      });
    } else {
      this.TranslstorService.Update(dto).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '更新成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
          this.modal.close(true);
        }
      });
    }

  }

  close() {
    this.modal.destroy();
  }

  /**重置 */
  clear() {
    if (this.i.id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
