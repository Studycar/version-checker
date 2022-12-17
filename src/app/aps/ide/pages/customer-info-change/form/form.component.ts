import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

interface SelectOption {
  label: string
  value: string
  [key: string]: any
}

@Component({
  selector: 'ide-customer-info-change-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCustomerInfoChangeFormComponent implements OnInit {
  constructor(
    private queryService: QueryService,
    public ndtSrv: NavigateDataTransferService,
  ) {

  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  // 测试用的下拉列表，可删除
  @ViewChild('f', { static: true }) f: NgForm;
  fileList = [];
  domesticOptions: SelectOption[] = [];
  currencyOptions: SelectOption[] = [];
  regionOptions: SelectOption[] = [];
  cusGradeOptions: SelectOption[] = [];
  cusTypeOptions: SelectOption[] = [];

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CUS_DOMESTIC': this.domesticOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_CUS_REGION': this.regionOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions
    });
  }

}