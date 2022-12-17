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
  selector: 'ide-customer-info-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCustomerInfoFormComponent implements OnInit {
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
  plantOptions: SelectOption[] = [];
  // cusStateOptions: SelectOption[] = [];
  cusGradeOptions: SelectOption[] = [];
  cusTypeOptions: SelectOption[] = [];

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    this.loadOptions()
    this.resolveAnnexes();
  }

  loadOptions() {
    // this.queryService.GetLookupByTypeRef('PS_CUSTOMER_STATUS', this.cusStateOptions);
    this.queryService.GetLookupByTypeRefAll({
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    });
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
    
  // onClickAnnex(annex) {
  //   if (annex.id) {
  //     this.ossFileService.download(annex.id, annex.name);
  //   }
  // }

}