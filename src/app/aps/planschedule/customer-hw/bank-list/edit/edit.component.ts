import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BankListQueryService } from '../query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-bank-list-edit',
  templateUrl: './edit.component.html',
  providers: [BankListQueryService]
})
export class CustomerBankListEditComponent implements OnInit {
  customer: any = {};
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  yesOrNoOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  isChanging: Boolean = false; // 是否操作变更

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: BankListQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if (this.i.id) {
      this.isModify = true;
      this.queryService.getOne(this.i.id).subscribe(res => {
        if (res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      this.i.taxNum = this.customer.taxNum;
      this.i.accountName = this.customer.cusName;
      this.i.defaultFlag = '0';
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_YES_NOT': this.yesOrNoOptions,
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
    });
    if(!this.isChanging) {
      this.queryService.save(params).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    } else {
      this.modal.close(params);
    }
  }
}