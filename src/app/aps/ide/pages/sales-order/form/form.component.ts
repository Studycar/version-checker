import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-sales-order-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeSalesOrderFormComponent implements OnInit {
  constructor(
    private ndtSrv: NavigateDataTransferService
  ) {

  }

  flowType: 'highPrice' | 'specialPrice' | '' = '';
  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  @ViewChild('f', { static: true }) f: NgForm;

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(() => this.formDataChange.emit());
    const { flowType } = this.ndtSrv.getData()
    if (flowType) {
      this.flowType = flowType
    }
  }

}