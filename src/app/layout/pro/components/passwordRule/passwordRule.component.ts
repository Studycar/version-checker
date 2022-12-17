import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalHelper, SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { PasswordRuleRuleChooseComponent } from './rule-choose/rule-choose.component';


@Component({
  selector: 'password-rule',
  templateUrl: 'passwordRule.component.html',
})
export class PasswordRuleComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    private modal: ModalHelper,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
  }

  ruleChoose() {
    this.modal.static(PasswordRuleRuleChooseComponent, null, 'lg').subscribe();
  }
}
