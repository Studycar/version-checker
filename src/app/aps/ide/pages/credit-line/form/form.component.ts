import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-credit-line-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCreditLineFormComponent implements OnInit {
  constructor(
    public ndtSrv: NavigateDataTransferService,
  ) {

  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  // 测试用的下拉列表，可删除
  selectOptions: { label: any, value: any, [key: string]: any }[] = [];
  @ViewChild('f', { static: true }) f: NgForm;

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    // 填充发起页面传过来的临时额度
    const { temCredit } = this.ndtSrv.getData()
    if (temCredit) {
      this.formData.temCredit = temCredit
    }
  }

  // 保存
  save(value: any) {
  }

}