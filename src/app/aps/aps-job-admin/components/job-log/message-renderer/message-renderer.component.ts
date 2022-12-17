import { Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'message-renderer',
  templateUrl: './message-renderer.component.html',
  styleUrls: ['./message-renderer.component.css'],
})
export class MessageRendererComponent implements ICellRendererAngularComp {
  msgModal: NzModalRef;
  message;

  constructor(private modal: NzModalService) {
  }

  agInit(params: any): void {
    this.message = params.value;
  }

  refresh(): boolean {
    return false;
  }

  showMessage(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.msgModal = this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzMask: false,
    });
  }

  close(): void {
    this.msgModal.destroy();
  }


}
