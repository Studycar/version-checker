import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { EditService } from '../../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-register-sourcesys-edit',
  templateUrl: './edit.component.html',
  providers: [EditService]
})
export class ApiRegisterSourceSysEditComponent implements OnInit {
  i: any;
  iClone: any;
  isModify = false;
  dbTypeOptions: any[] = [];

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
    this.editService.GetLookupByTypeRef('API_DB_TYPE', this.dbTypeOptions);
    if (this.i.id !== null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.editService.querySources(this.i).subscribe(result => {
        this.i = result.data[0];
        this.iClone = Object.assign({}, this.i);
      });
    }
  }

  save(value: any) {
    this.editService.saveSource(this.i).subscribe(res => {
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
}
