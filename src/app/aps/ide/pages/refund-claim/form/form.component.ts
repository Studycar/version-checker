import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-refund-claim-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeRefundClaimFormComponent implements OnInit {
  constructor(
    public ndtSrv: NavigateDataTransferService,
    private queryService: QueryService,
  ) {}
  @ViewChild('f', { static: true }) f: NgForm;

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  // businessTypeOptions = []
  // payTypeOptions = []
  // payStatusOptions = []
  currencyOptions = []
  // personnelOptions = []
  // yesNoOptions = []
  // refundStateOptions = []
  // orgReflectOptions = []

  // 初始化
  ngOnInit(): void {
    this.loadOptions()
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      // 'PS_REFUND_STATE': this.refundStateOptions,
      // 'PS_PAY_STATUS': this.payStatusOptions,
      'PS_CURRENCY': this.currencyOptions,
      // 'PS_PERSONNEL': this.personnelOptions,
      // 'PS_YES_NOT': this.yesNoOptions,
      // 'PS_REFUND_TYPE': this.businessTypeOptions,
      // 'PS_PAY_TYPE': this.payTypeOptions,
      // 'PS_ORG_REFLECT': this.orgReflectOptions,
    });
  }

  // 保存
  save(value: any) {
  }

}