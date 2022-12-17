import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-register-edit',
  templateUrl: './edit.component.html',
  providers: [EditService]
})
export class ApiRegisterEditComponent implements OnInit {
  i: any;
  iClone: any;
  isModify = false;
  typeOptions: any[] = [];
  enableOptions: any[] = [];
  sendFlagOptions: any[] = [];
  tableOptions: any[] = [];
  sourceOptions: any[] = [];
  pushOptions: any[] = [];
  apiTypeOptions: any[] = [];
  defaultApiType = 'WebApi';
  isdblink = false;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.editService.GetLookupByTypeRef('API_REGISTER_ENTITY_TYPE', this.typeOptions);
    this.editService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    this.editService.GetLookupByTypeRef('API_REGISTER_SEND_FLAG', this.sendFlagOptions);
    this.editService.GetLookupByTypeRef('API_REGISTER_PUSH_FLAG', this.pushOptions);
    this.editService.GetLookupByTypeRef('API_REGISTER_API_TYPE', this.apiTypeOptions);

    this.editService.querySources({}).subscribe(result => {
      this.sourceOptions.length = 0;
      result.data.forEach(d => {
        this.sourceOptions.push({
          label: d.sourceCode,
          value: d.sourceCode,
        });
      });
    });

    this.editService.getPiTables().subscribe(result => {
      this.tableOptions.length = 0;
      result.data.forEach(d => {
        this.tableOptions.push({
          label: d.tableName,
          value: d.tableName,
        });
      });
    });

    if (this.i.id !== null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.editService.get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.i.apiTableList = [this.i.apiTable];
        this.iClone = Object.assign({}, this.i);
        this.apiTypeChange(this.i.apiType);
      });
    } else {
      this.i.apiType = this.defaultApiType;
      this.i.enableFlag = 'Y';
      this.i.sendFlag = 'N';
      this.i.pushFlag = 'Y';
      this.i.entityType = '1';
      this.i.logFlag = 'Y';
      this.i.fullFlag = 'N';
    }
  }

  save(value: any) {
    this.i.apiTable = this.i.apiTableList[0];
    this.editService.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
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
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
  // 接口方式类型切换
  apiTypeChange(event) {
    if (event === 'DBLink') {
      this.isdblink = true;
      this.i.sendFlag = 'N';
      this.i.pushFlag = 'N';
      this.i.entityType = '2';
    } else {
      this.isdblink = false;
    }
  }
}
