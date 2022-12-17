import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-annual-credit-line-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeAnnualCreditLineFormComponent implements OnInit {
  constructor(
    public ndtSrv: NavigateDataTransferService,
    public queryService: QueryService,
  ) {

  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();
  plantOptions: any[] = [];
  cusGradeOptions: any[] = [];

  // 测试用的下拉列表，可删除
  selectOptions: { label: any, value: any, [key: string]: any }[] = [];
  @ViewChild('f', { static: true }) f: NgForm;

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    this.loadOptions();
    // 填充发起页面传过来的年度信用额度
    const { annualCreditApply, annualCreditApplyDate, attribute1 } = this.ndtSrv.getData();
    if (annualCreditApply) {
      this.formData.annualCreditApply = annualCreditApply;
    }
    if (annualCreditApplyDate) {
      this.formData.annualCreditApplyDate = annualCreditApplyDate;
    }
    if (attribute1) {
      this.formData.attribute1 = attribute1;
    }
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefZip({
      'PS_CUS_GRADE': this.cusGradeOptions
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  // 保存
  save(value: any) {
  }

}