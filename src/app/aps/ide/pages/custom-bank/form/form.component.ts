import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { decimal } from '@shared';

@Component({
  selector: 'ide-custom-bank-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCustomBankFormComponent implements OnInit, OnChanges {
  constructor(
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    public pro: BrandService,
    public modal: ModalHelper,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public ndtSrv: NavigateDataTransferService
  ) {
  }

  columns = [
    {
      field: 'accountNum',
      width: 120,
      headerName: '银行账号',
    },
    {
      field: 'accountName',
      width: 120,
      headerName: '账号名称',
    },
    {
      field: 'branch',
      width: 120,
      headerName: '开户银行',
    },
    {
      field: 'bankArchives',
      width: 120,
      headerName: '银行档案',
    },
    {
      field: 'branchId',
      width: 130,
      headerName: '联行号',
    },
    {
      field: 'branchIdSec',
      width: 120,
      headerName: '联行号II（中银专用）',
    },
    {
      field: 'province',
      width: 120,
      headerName: '省/自治区',
    },
    {
      field: 'city',
      width: 120,
      headerName: '市/县',
    },
    {
      field: 'cbbDepId',
      width: 120,
      headerName: '机构号',
    },
    {
      field: 'defaultFlag',
      width: 120,
      headerName: '默认银行',
      valueFormatter: value => this.optionsFind(value, 1).label
    },
  ];

  yesOrNoOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNoOptions;
        break;
    }
    const option = options.find(x => x.value === value) || { label: value };
    return option;
  }
  @Input() formData: any = {

  };
  @Output() formDataChange = new EventEmitter<any>();
  realPrice = 0;
  formDataHead: any = {};
  formDataBody = [];

  // 测试用的下拉列表，可删除
  @ViewChild('f', { static: true }) f: NgForm;
  materialOptions: { label: string, value: string, [key: string]: any }[] = [];

  // 初始化
  ngOnInit(): void {
    this.loadOptions()
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    this.initData();
  }

  initData() {
    if(this.formData) {
      if(this.formData.body) {
        if(typeof this.formData.body === 'string') {
          this.formData.body = JSON.parse(this.formData.body);
          this.formDataBody = [...this.formDataBody, ...this.formData.body];
        } else {
          this.formData.body.forEach(d => {
            this.formDataBody = [...this.formDataBody, d];
          });
        }
      }
      this.formData = Object.assign({}, this.formData, {
        body: JSON.stringify(this.formDataBody)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  toNumber(num) {
    return Number(num) || 0
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefZip({
      'PS_YES_NOT': this.yesOrNoOptions,
    });
  }

  // 保存
  save(value: any) {
  }
}