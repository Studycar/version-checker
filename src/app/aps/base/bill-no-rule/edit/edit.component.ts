/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:29
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-15 10:08:26
 * @Note: ...
 */
import { Component, OnInit } from '@angular/core';
import { BaseBillNoRuleService } from '../base-bill-no-rule-service.service';
import { BaseBillNoRuleDto } from '../dtos/base-bill-no-rule-dto';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [BaseBillNoRuleService]
})
export class BaseBillNoRuleEditComponent implements OnInit {

  curBillNoRule: BaseBillNoRuleDto;
  ruleCodes: any[];
  ruleDateFormats: any[];
  addFlag: boolean;

  constructor(private billNoRuleService: BaseBillNoRuleService,
    private commonQueryService: CommonQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private modal: NzModalRef) { }

  ngOnInit() {
    this.initRuleCodes();
    this.initRuleDateFormats();

    if (this.curBillNoRule.id === undefined) {
      this.addFlag = true;
      this.curBillNoRule.noDigits = 1;
      this.curBillNoRule.sort = '1';
      this.curBillNoRule.active = true;
    } else {
      if (this.curBillNoRule.active) {
        this.curBillNoRule.active = true;
      } else {
        this.curBillNoRule.active = false;
      }
    }
  }

  private initRuleCodes() {
    this.commonQueryService.GetLookupByType('FND_BILLNO_RULE').subscribe(result => {
      if (result.Success) {
        this.ruleCodes = [];
        result.Extra.forEach(d => {
          this.ruleCodes.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
        if (this.curBillNoRule.id === undefined && this.ruleCodes && this.ruleCodes.length > 0) {
          this.curBillNoRule.code = this.ruleCodes[0].value;
          this.curBillNoRule.name = this.ruleCodes[0].label;
        }
      }
    });
  }

  private initRuleDateFormats() {
    this.commonQueryService.GetLookupByType('FND_BILLNO_RULE_DTAEFORMART').subscribe(result => {
      if (result.Success) {
        this.ruleDateFormats = [];
        result.Extra.forEach(d => {
          this.ruleDateFormats.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
        if (this.curBillNoRule.id === undefined && this.ruleDateFormats && this.ruleDateFormats.length > 0) {
          this.curBillNoRule.dateFormat = this.ruleDateFormats[0].value;
        }
      }
    });
  }

  save() {
    this.billNoRuleService.Save(this.curBillNoRule).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  codeChange(event: any) {
    this.curBillNoRule.name = this.ruleCodes.find(rule => rule.value === event).label;
  }

  close() {
    this.modal.destroy();
  }
}
