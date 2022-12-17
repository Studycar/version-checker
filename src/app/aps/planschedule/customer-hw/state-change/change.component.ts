import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../query.service";

@Component({
  selector: 'planschedule-hw-customer-state-change',
  templateUrl: './change.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerStateChangeComponent implements OnInit {

  cusStateNewLabel: string = '';
  switchValue: boolean = false;
  stateChange: any = {
    id: '',
    cusCode: '',
    reason: '',
    cusStateNew: ''
  };

  constructor(
    private modal: NzModalRef,
    private editService: PlanscheduleHWCustomerService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public router: Router,
    private ideSubmitService: IdeSubmitService
  ) { }
  
  ngOnInit() {
    if(this.stateChange.cusStateNew === '70') {
      this.switchValue = false;
    } else {
      this.switchValue = true;
    }
  }

  submit(value) {
    this.modal.close(true);
    this.ideSubmitService.navigate('ideCustomerStatus', {
      getFormParams: {
        url: this.editService.getFullByIdUrl,
        method: 'GET',
        params: {
          id: this.stateChange.id,
        }
      },
      reason: this.stateChange.reason,
      cusStateNew: this.stateChange.cusStateNew
      // to be deleted 暂时不需要新增状态变更记录
      // submitParams: {
      //   url: this.editService.setCusStateUrl,
      //   method: 'POST',
      //   params: {
      //     cusCode: this.stateChange.cusCode,
      //     reason: this.stateChange.reason,
      //     cusStateNew: this.stateChange.cusStateNew
      //   }
      // }
    })
  }

  close() {
    this.modal.destroy();
  }
}