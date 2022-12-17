import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-pro-logo',
  templateUrl: './logo.component.html',
  styles: [
    `
      .logo-collapsed {
        position: relative;
        left: 60px;
      }

      ::ng-deep .alain-pro__sider-logo img {
        width: 171px;
        height: 18px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProLogoComponent {

  @Input() collapsed: boolean = false; // 菜单栏是否收起
  get name() {
    return this.setting.app.name;
  }

  constructor(private setting: SettingsService) {}
}
