import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlanscheduleHWCustomerService } from '../../query.service';
import { _HttpClient } from '@delon/theme';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';

@Component({
  selector: 'temp-credit',
  templateUrl: './temp-credit.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerTempCreditComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryService: PlanscheduleHWCustomerService,
    private appTranslationService: AppTranslationService,
    private ideSubmitService: IdeSubmitService
  ) {

  }

  i: any;

  // 初始化
  ngOnInit(): void {
    this.i = {
      ...this.i,
      temCredit: '',
      attribute1: '',
    }
  }

  save() {
    if (!this.i.temCredit) {
      return this.msgSrv.error(this.appTranslationService.translate('临时额度不能为0或空'));
    }
    const item = this.i
    const params = {
      id: item.id,
      // temCredit: item.temCredit,
      attribute1: item.attribute1
    };
    this.queryService.saveForm(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
        this.goToIdeFlow()
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  goToIdeFlow() {
    this.ideSubmitService.navigate('ideCreditLine', {
      getFormParams: {
        url: this.queryService.getByIdUrl,
        method: 'GET',
        params: { id: this.i.id }
      },
      temCredit: this.i.temCredit
    })
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

}