import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { SelectOption } from 'app/modules/base_module/components/custom-select-lookup.component';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-customer-status-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCustomerStatusFormComponent implements OnInit {
  constructor(
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private ndtSrv: NavigateDataTransferService
  ) {

  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  // 测试用的下拉列表，可删除
  plantOptions: { label: string, value: string, [key: string]: any }[] = [];
  cusStateOptions: SelectOption[] = [];
  fileList = [];
  
  @ViewChild('f', { static: true }) f: NgForm;

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    // 填充发起页面传过来的临时额度
    const { reason, cusStateNew } = this.ndtSrv.getData()
    if (reason) {
      this.formData.reason = reason;
    }
    if (cusStateNew) {
      this.formData.cusStateNew = cusStateNew;
    }
    this.loadOptions();
    // this.resolveAnnexes();
  }

  // 加载搜索项
  loadOptions() {
    this.queryService.GetLookupByTypeRef('PS_CUSTOMER_STATUS', this.cusStateOptions);
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