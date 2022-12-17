/**
 * 在弹层模板中使用，替换头部
 * 用法：<div *modalPlusHeader>...</div>
 */

import { Directive, Optional, TemplateRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Directive({
  selector: '[modalPlusHeader]',
  exportAs: 'modalPlusHeader'
})
export class ModalPlusHeaderDirective {
  constructor(@Optional() private nzModalRef: NzModalRef, public templateRef: TemplateRef<{}>) {
    if (this.nzModalRef) {
      const instance = this.nzModalRef.getInstance();
      if (typeof instance.setHeaderWithTemplate === 'function') {
        this.nzModalRef.getInstance().setHeaderWithTemplate(this.templateRef);
      }
    }
  }
}
