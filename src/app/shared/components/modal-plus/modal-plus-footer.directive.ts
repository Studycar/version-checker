/**
 * 在弹层模板中使用，替换底部
 * 用法：<div *modalPlusFooter>...</div>
 */

import { Directive, Optional, TemplateRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Directive({
  selector: '[modalPlusFooter]',
  exportAs: 'modalPlusFooter'
})
export class ModalPlusFooterDirective {
  constructor(@Optional() private nzModalRef: NzModalRef, public templateRef: TemplateRef<{}>) {
    if (this.nzModalRef) {
      const instance = this.nzModalRef.getInstance();
      if (typeof instance.setFooterWithTemplate === 'function') {
        this.nzModalRef.getInstance().setFooterWithTemplate(this.templateRef);
      }
    }
  }
}
