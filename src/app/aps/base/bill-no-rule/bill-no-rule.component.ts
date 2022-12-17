import { Component, OnInit } from '@angular/core';
import { BaseBillNoRuleService } from './base-bill-no-rule-service.service';
import { BaseBillNoRuleDto } from './dtos/base-bill-no-rule-dto';
import { BaseBillNoRuleEditComponent } from './edit/edit.component';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { BaseBillNoRecordViewComponent } from './view/bill-no-record-view/bill-no-record-view.component';

@Component({
  selector: 'bill-no-rule',
  templateUrl: './bill-no-rule.component.html',
  styleUrls: ['./bill-no-rule.component.css'],
  providers: [BaseBillNoRuleService]
})
export class BaseBillNoRuleComponent implements OnInit {

  billNoRuleList: Array<BaseBillNoRuleDto>;
  tableHeadList: Array<string> = [
    '',
    '规则编码',
    '规则名称',
    '前缀',
    '格式',
    '流水位数',
    '编码格式',
    '示例',
    '排序',
    '启用'];

  private curBillNoRule: BaseBillNoRuleDto;

  constructor(private billNoRuleService: BaseBillNoRuleService,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public translateservice: AppTranslationService,
    public modalService: NzModalService) { }

  ngOnInit() {
    this.GetRules();
  }

  Save(addFlag: boolean) {
    if (addFlag) {
      this.curBillNoRule = new BaseBillNoRuleDto();
    } else if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择要修改的数据'));
      return;
    }

    this.modal.static(BaseBillNoRuleEditComponent, { curBillNoRule: JSON.parse(JSON.stringify(this.curBillNoRule)) })
      .subscribe((value) => {
        if (value) {
          this.GetRules();
        } else {
          this.curBillNoRule = null;
        }
      });
  }

  Delete() {
    if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择要删除的数据'));
      return;
    } else {
      this.modalService.confirm({
        nzContent: this.translateservice.translate('确定要删除吗？'),
        nzOnOk: () => {
          this.billNoRuleService.Delete(this.curBillNoRule.id).subscribe(res => {
            this.msgSrv.success('删除成功');
            this.GetRules();
          });
        },
      });
    }
  }

  GetRules() {
    this.curBillNoRule = null;
    this.billNoRuleList = new Array<BaseBillNoRuleDto>();

    this.billNoRuleService.GetRules().subscribe(result => {
      this.billNoRuleList = result.Extra;
    });
  }

  GetRecords() {
    if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择工单生成规则'));
      return;
    }

    this.modal.static(BaseBillNoRecordViewComponent, { ruleId: this.curBillNoRule.id })
      .subscribe();
  }

  GetBillNoRule() {
    if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择工单生成规则'));
      return;
    }

    this.billNoRuleService.GetBillNoRule(this.curBillNoRule.code).subscribe(res => {
      this.msgSrv.success(res.data);
    });
  }

  ruleSelected(rule: BaseBillNoRuleDto) {
    this.curBillNoRule = rule;
  }
}
