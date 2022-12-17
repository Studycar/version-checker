import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { StartupService } from '@core/startup/startup.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  selector: 'layout-pro-responsibility',
  template: `
    <div class="alain-pro__header-item" nz-dropdown [nzDropdownMenu]="menu">
      <i class="anticon anticon-team"></i>
    </div>
    <nz-dropdown-menu nzPlacement="bottomRight" #menu="nzDropdownMenu">
      <ul nz-menu nzSelectable>
        <li
          nz-menu-item
          *ngFor="let responsibility of responsibilities"
          (click)="change(responsibility.RESP_ID)"
          [class.ant-dropdown-menu-item-selected]="responsibility.RESP_ID === appConfigService.getRespCode()"
        >
          {{ responsibility.RESP_NAME }}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
})
export class LayoutProResponsibilityComponent implements OnInit {
  responsibilities: any[] = [];

  constructor(
    public settings: SettingsService,
    private router: Router,
    private startupSrv: StartupService,
    private appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  ngOnInit(): void {
    this.startupSrv.getUserResponsibility().then(res => {
      if (res && res.data.length > 0) {
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
    console.log(this.reuseTabService.curUrl, 'this.reuseTabService.curUrl.');
    /**jianl 这里不能判断>0，经过测试发现当只打开首页，这里也会是1的*/
    // if (this.reuseTabService.count > 0) {
    //   this.msgSrv.error('请先关闭所有已打开的界面并回到首页再重试!');
    //   return;
    // } else if (
    //   this.reuseTabService.count === 0 &&
    //   this.reuseTabService.curUrl.indexOf('dashboard') === -1
    // ) {
    //   this.msgSrv.error('请先关闭所有已打开的界面并回到首页再重试!');
    //   return;
    // }
    this.appConfigService.setActiveRespCode(respid);
    this.startupSrv.loadMenu();
    this.reuseTabService.clear();
    window.location.reload();
    // this.router.navigate(['/']);
  }
}
