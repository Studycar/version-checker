import { Component, OnInit } from '@angular/core';
import { CommonFlowPageContext } from '../common-flow-page-context.component';

@Component({
    selector: 'ide-customer-status-submit',
    templateUrl: './ide-customer-status.component.html',
})
export class IdeCustomerStatusComponent extends CommonFlowPageContext implements OnInit {
  constructor() {
    super();
  }

  // to be deleted 之前后台要求更换流程表单 id，从客户主表 id 更换为状态变更记录 id，现在暂时不需要的
  // addFormData(callback?: () => void) {
  //   // 首次提交需要先调用后台接口生成客户信息变更记录
  //   if (!this.instanceId && this.submitUrl) {
  //     this.ideSubmitService.submit(this.submitUrl, this.submitMethod, this.submitParams).subscribe(res => {
  //       if(res.code === 200) {
  //         const payload = Object.assign({}, this.formData, {
  //           formCode: this.formCode,
  //           id: res.data
  //         });
  //         this.ideSubmitService.saveFormData(payload).subscribe(res1 => {
  //           if(res1.code === 200) {
  //             // 填写返回参数信息
  //             this.setFormData(res1.data);
  //             this.flow.postFlowFrame();
  //             callback && callback();
  //           }
  //         });
  //       }
  //     });
  //   }
  //   // 二次提交则直接保存表单即可
  //   else {
  //     const payload = Object.assign({}, this.formData, {
  //       formCode: this.formCode
  //     });
  //     this.ideSubmitService.saveFormData(payload).subscribe(res => {
  //       if(res.code === 200) {
  //         // 填写返回参数信息
  //         this.setFormData(res.data);
  //         this.flow.postFlowFrame();
  //         callback && callback();
  //       }
  //     });
  //   }
  // }

}