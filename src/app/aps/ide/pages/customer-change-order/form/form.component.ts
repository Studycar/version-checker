import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ide-customer-change-order-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCustomerChangeOrderFormComponent implements OnInit {
  constructor(
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
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
    this.loadOptitons();
  }

  // 加载搜索项
  loadOptitons() {
  }

  // 保存
  save(value: any) {
  }

}