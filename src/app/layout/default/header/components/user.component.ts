import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown [nzDropdownMenu]="menu">
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <nz-dropdown-menu nzPlacement="bottomRight" #menu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
        <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
      </div>
    </nz-dropdown-menu>
  `,
})
export class HeaderUserComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
  }

  ngOnInit(): void {
    this.tokenService.change().subscribe((res: any) => {
      this.settings.setUser(res);
    });
    // mock
    const token = this.tokenService.get() || {
      token: 'nothing',
      name: 'Admin',
      avatar: './assets/logo-color.svg',
      email: '888888@qq.com',
    };
    this.tokenService.set(token);
  }

  logout() {
    this.tokenService.clear();
    localStorage.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
