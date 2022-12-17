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
  selector: 'ide-cur-contract-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeCurContractFormComponent implements OnInit, OnChanges {
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
      field: 'steelType',
      headerName: '钢种',
    },
    {
      field: 'realPrice',
      headerName: '当日开盘价+返利加价',
    },
    {
      field: 'basePrice',
      headerName: '合同基价/单价',
    },
    {
      field: 'weight',
      headerName: '合同重量',
    },
    {
      field: 'money',
      headerName: '合同金额',
    },
    {
      field: 'remarks',
      headerName: '备注',
    }
  ];

  zdzColumns = [
    {
      field: 'steelType',
      headerName: '钢种',
    },
    {
      field: 'standardType',
      headerName: '规格型号',
    },
    {
      field: 'basePrice',
      headerName: '合同基价/单价',
    },
    {
      field: 'quantity',
      headerName: '数量（个）',
    },
    {
      field: 'money',
      headerName: '合同金额',
    },
    {
      field: 'remarks',
      headerName: '备注',
    }
  ];

  tableColumns: any[] = [];

  @Input() formData: any = {

  };
  @Output() formDataChange = new EventEmitter<any>();
  realPrice = 0;
  formDataHead: any = {};
  formDataBody = [];

  // 测试用的下拉列表，可删除
  @ViewChild('f', { static: true }) f: NgForm;
  plantOptions: any[] = [];

  // 初始化
  ngOnInit(): void {
    this.loadOptions()
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    this.initData();
  }

  initData() {
    const { contractCode, businessType, formCode } = this.ndtSrv.getData();
    if(this.formData) {
      if(this.formData.head) {
        this.formDataHead = this.formData.head;
        delete this.formData.head;
      } else {
        this.formDataHead = this.formData;
      }
      if(this.formDataHead.categoryCode === '70') { this.tableColumns = this.zdzColumns; }
      else { this.tableColumns = this.columns; }
      if(this.formData.body) {
        if(typeof this.formData.body === 'string') {
          this.formData.body = JSON.parse(this.formData.body);
          this.formDataBody = [...this.formDataBody, ...this.formData.body];
        } else {
          this.formData.body.forEach(d => {
            this.formDataBody = [...this.formDataBody, {
              steelType: d.steelType,
              standardType: d.standardType,
              basePrice: d.basePrice,
              weight: d.weight,
              quantity: d.quantity,
              money: d.money,
              remarks: d.remarks,
              realPrice: decimal.add(d.rebateMarkup, d.sameDayBasePrice),
            }];
          });
        }
      }
      this.formData = Object.assign({}, this.formData, this.formDataHead, {
        body: JSON.stringify(this.formDataBody)
      });
      if (contractCode) {
        this.formData.contractCode = contractCode;
      }
      if (businessType) {
        this.formData.businessType = businessType;
        this.formData.formCodeType = businessType;
      }
      if (formCode) {
        this.formData.formCode = formCode;
      }
    }
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
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  // 保存
  save(value: any) {
  }
}