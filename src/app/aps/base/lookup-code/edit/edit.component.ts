import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { LookupCodeManageService } from '../../../../modules/generated_module/services/lookup-code-manage-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-lookupcode-edit',
  templateUrl: './edit.component.html',
})
export class BaseLookupCodeEditComponent implements OnInit {
  title: String = '编辑';
  languageOptions: any[] = [];
  applicationOptions: any[] = [];
  record: any = {};
  i: any;
  iClone: any;
  CurLng: any;
  isModify = false;
  @ViewChild('sf', {static: true}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      lookupTypeCode: {
        type: 'string',
        title: '编码类型'
      },
      meaning: {
        type: 'string',
        title: '编码名称'
      },
      applicationCode: {
        type: 'string', title: '应用模块', ui: 'select',
        enum: []
      },
      description: {
        type: 'string',
        title: '描述',
      },
      language: {
        type: 'string',
        title: '语言',
        ui: 'select',
        enum: []
      }
    },
    required: ['lookupTypeCode', 'applicationCode', 'language'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private lookupCodeManageService: LookupCodeManageService
  ) { }

  ngOnInit(): void {
    if (this.i.id == null) {
      this.title = '新增';
      this.i.LNG = this.CurLng; // 给当前默认的登录语言
    } else {
      this.schema.properties.lookupTypeCode.readOnly = true;
      this.schema.properties.meaning.readOnly = true;
      this.schema.properties.applicationCode.readOnly = true;
      this.schema.properties.language.readOnly = true;
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    }
    this.loadData();
  }

  loadData() {
    this.schema.properties.applicationCode.enum = this.applicationOptions;
    this.schema.properties.language.enum = this.languageOptions;
    /* 初始化应用程序 */
    /*
    this.applicationOptions.length = 0;
    this.lookupCodeManageService.GetAppliaction().subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.APPLICATION_NAME,
          value: d.APPLICATION_ID
        });
      });
      this.schema.properties.APPLICATION_CODE.enum = this.applicationOptions;
      this.sf.refreshSchema();
    });
    */

    /*初始化编辑数据*/
    /*
    if (this.i.id != null) {
      this.lookupCodeManageService.Get(this.i.id).subscribe(resultMes => {
        if (resultMes.Extra !== undefined && resultMes.Extra.length > 0) {
          const d = resultMes.Extra[0];
          // this.i = d;
          this.i = {
            id: d.id,
            TYPECODE: d.TYPECODE,
            MEANING: d.MEANING,
            APPLICAIONID: Number(d.APPLICATIONID),
            DESCRIPTION: d.DESCRIPTION,
            LNG: d.LNG
          };
        }
      });
    }
    */
  }
  save(value: any) {
    if (this.i.id != null) {
      value.id = this.i.id;
    } else {
      value.id = null;
    }
    if (this.i.id === null) {
      this.lookupCodeManageService.Save(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(res.msg || '保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.lookupCodeManageService.Update(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(res.msg || '更新成功');
          this.modal.close(true);

        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
