import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { CustomerChangeOrderQueryService } from '../query.service';

@Component({
  selector: 'customer-change-order-approve',
  templateUrl: './approve.component.html',
  providers: [CustomerChangeOrderQueryService]
})
export class CustomerChangeOrderApproveComponent implements OnInit {
  id: string; 
  i: any = {};

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerChangeOrderQueryService,
    public http: _HttpClient,
    private ideSubmitService: IdeSubmitService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if (this.i.attribute1) {
      this.i.attribute1 = ''
    }
    // if(this.id) {
    //   this.queryService.getForm(this.id).subscribe(res => {
    //     if(res.code === 200) {
    //       this.i = res.data;
    //     }
    //   })
    // }
  }

  submit() {
    this.queryService.saveForm(this.i).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.close();
        this.goToIdeFlow()
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  goToIdeFlow() {
    this.ideSubmitService.navigate('ideCustomerChangeOrder', {
      getFormParams: {
        url: this.queryService.getUrl,
        method: 'GET',
        params: { id: this.id }
      },
    })
  }

  close() {
    this.modal.destroy();
  }

}
