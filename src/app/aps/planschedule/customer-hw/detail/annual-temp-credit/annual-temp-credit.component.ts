import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlanscheduleHWCustomerService } from '../../query.service';
import { _HttpClient } from '@delon/theme';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';

@Component({
  selector: 'annual-temp-credit',
  templateUrl: './annual-temp-credit.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerAnnualTempCreditComponent implements OnInit {
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
  plantOptions: any[] = [];
  cusGradeOptions: any[] = [];

  // 初始化
  ngOnInit(): void {
    this.i = {
      ...this.i,
      annualCreditApplyDate: this.queryService.formatDateTime(new Date()),
      annualCreditApply: '',
      attribute1: '',
    };
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefZip({
      'PS_CUS_GRADE': this.cusGradeOptions
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  save() {
    if (!this.i.annualCreditApply) {
      return this.msgSrv.error(this.appTranslationService.translate('申请年度信用额度不能为0或空'));
    }
    this.modal.close(true);
    this.goToIdeFlow();
  }

  goToIdeFlow() {
    this.queryService.getById(this.i.id).subscribe(res => {
      if(res.code === 200) {
        if(res.data.annualCreditOngoing !== '1') {
          this.ideSubmitService.navigate('ideAnnualCreditLine', {
            getFormParams: {
              url: this.queryService.getByIdUrl,
              method: 'GET',
              params: { id: this.i.id }
            },
            attribute1: this.i.attribute1,
            annualCreditApply: this.i.annualCreditApply,
            annualCreditApplyDate: this.i.annualCreditApplyDate
          });
        } else {
          this.msgSrv.error(this.appTranslationService.translate('客户年度信用审批不能重复发起！'));
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '获取不到客户最新信息'));
      }
    })
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

}