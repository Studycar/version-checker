import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService, } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'maintain-annual-parameters-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class MaintainAnnualParametersImportComponent implements OnInit {
  headers: any = {};
  loading: boolean = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { }

  ngOnInit(): void {
    let _token = localStorage.getItem('_token');
    if (_token) {
      const _tokenObj = JSON.parse(_token);
      this.headers = { Authorization: `Bearer ${_tokenObj.token}`};
    }
  }

  handleChange(event) {
    if (event.type === 'progress') {
      this.loading = true;
    }
    if (event.type === 'success') {
      this.loading = false;
      const res = event.file.response;
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '导入成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '导入失败'));
      }
    }
    if (event.type === 'error') {
      this.loading = false;
    }
  }

  close() {
    this.modal.destroy();
  }
}
