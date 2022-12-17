import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'submit-new-request-form',
  templateUrl: './submit-new-request-form.component.html',
  styleUrls: ['./submit-new-request-form.component.css']
})
export class ConcurrentRequestSubmitNewRequestFormComponent implements OnInit {
  i: any;
  radioValue: string;
  radStyle = {
    display: 'block',
    height: '25px',
    lineHeight: '25px'
  };

  constructor(private msgSrv: NzMessageService,
    private modal: NzModalRef, ) { }

  ngOnInit() {
    if (this.i.IsSingleRequest) {
      this.radioValue = 'S';
    }
  }

  Confrim() {
    if (this.radioValue === 'S') {
      this.i.IsSingleRequest = true;
    } else {
      this.i.IsSingleRequest = false;
    }
    this.i.IsSubmitRequest = true;
    this.modal.close(true);
  }

  close() {
    this.modal.destroy();
  }
}
