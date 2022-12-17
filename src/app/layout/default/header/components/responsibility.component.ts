import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { StartupService } from '@core/startup/startup.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  selector: 'header-responsibility',
  template: `
    <div class="alain-default__nav-item" nz-dropdown [nzDropdownMenu]="menu">
      <span title="切换职责">
        <i class="anticon anticon-team"></i>
      </span>
    </div>
    <nz-dropdown-menu nzTrigger="click" nzPlacement="bottomRight" #menu="nzDropdownMenu">
      <ul nz-menu nzSelectable>
        <li nz-menu-item *ngFor="let responsibility of responsibilities"
          (click)="change(responsibility.RESP_ID)">{{responsibility.RESP_NAME}}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
})
export class HeaderResponsibilityComponent implements OnInit {
  responsibilities: any[] = [];

  constructor(
    public settings: SettingsService,
    private router: Router,
    private startupSrv: StartupService,
    private appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  ngOnInit(): void {
    this.startupSrv.getUserResponsibility().then(res => {
      if (res.data.length > 0) {
        res.data.forEach(d => {
          this.responsibilities.push({
            RESP_NAME: d.respsName,
            RESP_ID: d.id,
          });
        });
      }
    });
  }

  change(respid: string) {
    if (document.forms.length > 0) {
      this.msgSrv.error('请先关闭所有已打开的界面再重试!');
      return;
    }
    this.appConfigService.setRespCode(respid);
    this.startupSrv.loadMenu();
  }
}
