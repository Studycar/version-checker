import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';
import { retry } from 'rxjs/operators';

interface SelectOption {
  label: string
  value: string
  [key: string]: any
}

@Component({
  selector: 'ide-customer-detail-info-change-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCustomerDetailInfoChangeFormComponent implements OnInit {
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
  plantOptions = [];
  cusStateOptions = [];
  cusGradeOptions = [];
  cusTypeOptions = [];
  yesNoOptions = [];
  domesticOptions = [];
  currencyOptions = [];
  regionOptions = [];
  columns = [];

  ngOnInit(): void {
    this.getColumns();
    this.loadOptions();
    this.resolveAnnexes();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CUSTOMER_STATUS': this.cusStateOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions,
      'PS_CUS_DOMESTIC': this.domesticOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_CUS_REGION': this.regionOptions,
      'PS_YES_NOT': this.yesNoOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  // 获取动态列
  getColumns() {
    this.queryService.GetLookupByType('PS_CUS_CUSTOMIZATION').subscribe(res => {
      if(res.Success && res.Extra.length > 0) {
        this.columns.splice(this.columns.length - 4, 0, ...res.Extra.map(d => ({
          field: d.lookupCode,
          headerName: d.meaning,
        })));
        this.f.form.updateValueAndValidity();
      }
    })
  }

  // 处理附件列表
  resolveAnnexes() {
    try {
      if (this.formData.annex) {
        const fileMap = JSON.parse(this.formData.annex)
        for (const key in fileMap) {
          const value = fileMap[key]
          if (typeof value === 'object') {
            this.fileList.push({ id: value.id, name: value.fileName })
          } else {
            this.fileList.push({ id: key, name: value })
          }
        }
      }
    } catch (e) {}
  }
}