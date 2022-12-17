import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, ModalHelper, SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ResetPasswordComponent } from '../resetPassword/resetPassword.component';
import { environment } from '@env/environment';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  selector: 'layout-pro-user',
  templateUrl: 'user.component.html',
})
export class LayoutProWidgetUserComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    private router: Router,
    private modal: ModalHelper,
    private menuSrv: MenuService,
    public appconfig: AppConfigService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
  }

  activePlantDesc: string = '';
  ngOnInit(): void {
    this.appconfig.activePlantObs.subscribe(x => {
      this.activePlantDesc = x.descriptions;
    })
    // mock
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
    localStorage.removeItem('menus');
    localStorage.removeItem('active_resp_code');
    localStorage.removeItem('resp_code');
    this.menuSrv.clear();
    // this.router.navigateByUrl(environment.logout_url);
    location.href = environment.logout_url;
  }

  resetPassword() {
    this.modal.static(ResetPasswordComponent, null, 'lg').subscribe();
  }
}
