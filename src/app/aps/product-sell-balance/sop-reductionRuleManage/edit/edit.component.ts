import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { ProductSellBalanceForecastService } from '../../product-sell-balance-forecast.service';
import { SopReductionRuleManageService } from '../../../../modules/generated_module/services/SopReductionRuleManage-service.';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-reductionRuleManage-edit',
  templateUrl: './edit.component.html',
})
export class SopReductionRuleManageEditComponent implements OnInit {
  title: String = '编辑';
  i = {
    ID: '',
    CONSUME_CODE: '',
    CONSUMER_PRIORITY: '',
    CONSUME_PRODUCTION: '',
    CONSUME_CUSTOMER: ''
  };

  public consumeProductionOption: any[] = [];
  public sopConsumeOption: any[] = [];
  public MoTypeOptions: any[] = [];
  public CustomerOptions = [
    {label : '客户编码', value: '客户编码'},
    {label : '业务区域', value: '业务区域'},
    {label : '业务大区', value: '业务大区'},
    {label : '总部', value: '总部'},
  ];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private innerService: ProductSellBalanceForecastService,
    public appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private sopReductionRuleManageService: SopReductionRuleManageService
  ) { }

  ngOnInit(): void {
    if (this.i.ID == null) {
      this.title = '新增';
    } else {
      this.title = '编辑';
    }
    this.loadData();
  }
  loadData() {

  }

  save(value?: any) {
    const obj = {
      CONSUME_CODE: this.i.CONSUME_CODE,
      CONSUMER_PRIORITY: this.i.CONSUMER_PRIORITY,
      CONSUME_PRODUCTION: this.i.CONSUME_PRODUCTION,
      CONSUME_CUSTOMER: this.i.CONSUME_CUSTOMER
    };
    this.sopReductionRuleManageService.Save(obj).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message || '保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
        this.modal.close(true);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
  }
}
