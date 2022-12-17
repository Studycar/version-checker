import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { guid } from '@progress/kendo-angular-dateinputs/dist/es2015/util';

@Component({
  selector: 'layout-pro-qrcode',
  template: `
    <div class="alain-pro__header-item" nz-dropdown [nzDropdownMenu]="menu">
      <i nz-icon [nzType]="'qrcode'" theme="outline"></i>
    </div>
    <nz-dropdown-menu nzPlacement="bottomRight" #menu="nzDropdownMenu">
      <div class="d-flex align-items-center">
        <img src="{{ loginQrCodeUrl }}" alt="二维码" height="180"/>
      </div>
    </nz-dropdown-menu>
  `,
  styles: [
      `
      .login-block-qrcode {
        width: 220px;
        height: 220px;
        display: inline-block;
        clip-path: inset(10px 5px 5px 10px);
        margin-top: -25px;
      }
    `,
  ],
})
export class LayoutProWidgetqrCodeComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
  }

  clientCode = guid().replace(/-/gi, '');
  // clientCode = 'a421a309-a8a7-4afd-8c1e-d41cd634e339';
  hasDestroy = false; // 是否已经销毁此组件
  loginQrCodeUrl_Template =
    '/afs/servermobileservice/qrcodeservice/getwxloginqrcode?uname=';
  loginQrCodeUrl = this.loginQrCodeUrl_Template;

  ngOnInit(): void {
    // mock
    this.tokenService.change().subscribe((res: any) => {
      this.settings.setUser(res);
      if (res !== undefined && res !== null && res.name !== undefined) {
        this.loginQrCodeUrl = this.loginQrCodeUrl_Template + res.name;
      }
    });
    // mock
    // const token = this.tokenService.get() || {
    //   token: 'nothing',
    //   name: 'Admin',
    //   avatar: './assets/logo-color.svg',
    //   email: '888888@qq.com',
    // };
    // this.tokenService.set(token);
  }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
