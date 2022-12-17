import { Component, OnInit } from '@angular/core';
import { BaseBillNoRuleService } from '../../base-bill-no-rule-service.service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { BaseBillNoRuleRecordOutputDto } from '../../dtos/base-bill-no-rule-record-output-dto';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bill-no-record-view',
  templateUrl: './bill-no-record-view.component.html',
  styleUrls: ['./bill-no-record-view.component.css'],
  providers: [BaseBillNoRuleService]
})
export class BaseBillNoRecordViewComponent implements OnInit {

  public tableHeadList: Array<string> = [
    '',
    '规则编码',
    '规则名称',
    '格式',
    '最大号'];

  private ruleId: string;

  public billNoRuleRecordList: Array<BaseBillNoRuleRecordOutputDto>;

  constructor(private billNoRuleService: BaseBillNoRuleService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private modal: NzModalRef) { }

  ngOnInit() {
    this.billNoRuleRecordList = new Array<BaseBillNoRuleRecordOutputDto>();
    this.billNoRuleService.GetRecords(this.ruleId).subscribe(res => {
      if (res.code === 200) {
        this.billNoRuleRecordList = res.data;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
