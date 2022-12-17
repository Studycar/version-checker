import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-suppliercalendar-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformSuppliercalendarEditComponent implements OnInit {
  record: any = {};
  i: any;
  title: string;
  plantoptions: any[] = [];
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
  }

  save() {

  }

  close() {
    this.modal.destroy();
  }

  regionoptions(value: any) {


  }

  plantchange(value: any) {

  }
}
