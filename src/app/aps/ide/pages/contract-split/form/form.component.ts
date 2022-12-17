import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-contract-split-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeContractSplitFormComponent implements OnInit, OnChanges {
  constructor(
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    public ndtSrv: NavigateDataTransferService
  ) {

  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();
  realPrice = 0;
  sub: any = {}; // 子合同
  change: any = {}; // 变更协议

  // 测试用的下拉列表，可删除
  @ViewChild('f', { static: true }) f: NgForm;
  materialOptions: { label: string, value: string, [key: string]: any }[] = [];
  plantOptions: any[] = [];

  // 初始化
  ngOnInit(): void {
    this.loadOptions()
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    if(this.formData.sub) {
      if(typeof this.formData.sub === 'object') {
        this.sub = Object.assign({}, this.formData.sub, {
          realPrice: this.toNumber(this.formData.sub.sameDayBasePrice) + this.toNumber(this.formData.sub.rebateMarkup),
        });
        this.formData.id = this.sub.id; // 表单数据使用子合同id
        this.formData.sub = JSON.stringify(this.sub)
      } else if(this.formData.sub && typeof this.formData.sub === 'string') {
        this.sub = JSON.parse(this.formData.sub)
      }
    }
    if(this.formData.change) {
      if(typeof this.formData.change === 'object') {
        this.change = Object.assign({}, this.formData.change, {
          realPrice: this.toNumber(this.formData.change.sameDayBasePrice) + this.toNumber(this.formData.change.rebateMarkup)
        });
        this.formData.change = JSON.stringify(this.change)
      } else if(this.formData.change && typeof this.formData.change === 'string') {
        this.change = JSON.parse(this.formData.change)
      }
    } 
    this.formData.formCodeType = 'split';
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'formData') {
        const val = changes[propName].currentValue || {};
        this.realPrice = this.toNumber(val.sameDayBasePrice) + this.toNumber(val.rebateMarkup)
      }
    }
  }

  toNumber(num) {
    return Number(num) || 0
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'HOUBO': this.materialOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  // 保存
  save(value: any) {
  }

}