import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CustomerComplaintQueryService } from "../../query.service";
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';
import * as moment from 'moment';

@Component({
  selector: 'customer-complaint-detail-rectify',
  templateUrl: './rectify.component.html',
  providers: [CustomerComplaintQueryService],
})
export class CustomerComplaintDetailRectifyComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private queryService: CustomerComplaintQueryService,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    private ideSubmitService: IdeSubmitService
  ) {

  }

  loading = false;
  isModify = false;
  i: any;
  iClone: any;

  // 初始化
  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.i = Object.assign({}, this.i);
      this.iClone = Object.assign({}, this.i);
    }
    this.loadData();
  }

  // 加载搜索项
  loadData() {
  }

  // 保存
  save(value: any) {
    if (!this.i.id) {
      return this.msgSrv.error(this.appTranslationService.translate('明细 ID 为空'))
    }
    const params = Object.assign({}, this.i, {
      planDate: this.queryService.formatDateTime2(this.i.planDate, 'yyyy-MM-dd HH:mm:ss')
    })
    this.queryService.rectify(params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

  disabledStartDate(date: Date) {
    return date.getTime() < (new Date().setHours(0, 0, 0, 0));
  }

  onUserChange(e) {
    this.i.userResponsility = e.value;
    this.i.userOrgId = e.userOrgId;
  }

  getUserList = (value, pageIndex, pageSize) => this.queryService.getUsersPage(value, pageIndex, pageSize, true);

}