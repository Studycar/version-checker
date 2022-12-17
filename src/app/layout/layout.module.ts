import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderI18nComponent } from './default/header/components/i18n.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { HeaderResponsibilityComponent } from './default/header/components/responsibility.component';
import { HeaderFactoryComponent } from './default/header/components/factory.component';
import { SettingDrawerComponent } from './default/setting-drawer/setting-drawer.component';
import { SettingDrawerItemComponent } from './default/setting-drawer/setting-drawer-item.component';
import { PRO_ENTRYCOMPONENTS, PRO_COMPONENTS } from './pro/index';

// passport
import { LayoutPassportComponent } from './passport/passport.component';
import { ResetPasswordComponent } from './pro/components/resetPassword/resetPassword.component';
import { PasswordTwiceSameDirective } from './pro/components/resetPassword/passwordTwiceSame.directive';
import { CheckPassWordDirective } from './pro/components/resetPassword/checkPassWord.directive';
import { PasswordFormatDirective } from './pro/components/resetPassword/password-format.directive';
import { BaseModule } from 'app/modules/base_module/base.module';
import { KeyboardShortcutLazyComponent } from './pro/components/guide/keyboard-shortcut.component';

const SETTINGDRAWER = [
  SettingDrawerComponent,
  SettingDrawerItemComponent,
  PRO_ENTRYCOMPONENTS,
  ResetPasswordComponent,
];
const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  HeaderComponent,
  SidebarComponent,
  PRO_COMPONENTS,
  KeyboardShortcutLazyComponent,
  ResetPasswordComponent,
  ...SETTINGDRAWER,
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  HeaderResponsibilityComponent,
  HeaderFactoryComponent,
];

const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [SharedModule, BaseModule],
  providers: [],
  entryComponents: SETTINGDRAWER,
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT,
    PasswordTwiceSameDirective,
    CheckPassWordDirective,
    PasswordFormatDirective,
  ],
  exports: [...COMPONENTS, ...PASSPORT],
})
export class LayoutModule {}
