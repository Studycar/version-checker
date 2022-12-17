// #region widgets

import { LayoutProHeaderWidgetComponent } from './components/widget/widget.component';
import { LayoutProWidgetNotifyComponent } from './components/notify/notify.component';
import { LayoutProWidgetSearchComponent } from './components/search/search.component';
import { LayoutProWidgetUserComponent } from './components/user/user.component';
import { LayoutProWidgetqrCodeComponent } from './components/qrCode/qrCode.component';
import { LayoutProWidgetQuickComponent } from './components/quick/quick.component';
import { HeaderLeftComponent } from './components/header-left/header-left.component';

const PRO_WIDGETS = [
  LayoutProWidgetqrCodeComponent,
  LayoutProHeaderWidgetComponent,
  LayoutProWidgetNotifyComponent,
  LayoutProWidgetSearchComponent,
  LayoutProWidgetUserComponent,
  LayoutProWidgetQuickComponent,
];

// #endregion

// #region entry components

import { ProSettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { LayoutProWidgetQuickPanelComponent } from './components/quick/quick-panel.component';

export const PRO_ENTRYCOMPONENTS = [
  ProSettingDrawerComponent,
  LayoutProWidgetQuickPanelComponent,
  PasswordRuleRuleChooseComponent,
];

// #endregion

// #region components

import { LayoutProComponent } from './pro.component';
import { LayoutProMenuComponent } from './components/menu/menu.component';
import { LayoutProLogoComponent } from './components/logo/logo.component';
import { LayoutProHeaderComponent } from './components/header/header.component';
import { LayoutProFooterComponent } from './components/footer/footer.component';

export const PRO_COMPONENTS = [
  LayoutProComponent,
  LayoutProMenuComponent,
  LayoutProLogoComponent,
  LayoutProHeaderComponent,
  LayoutProFooterComponent,
  LayoutProFactoryComponent,
  LayoutProResponsibilityComponent,
  LayoutProGuideComponent,
  PasswordRuleComponent,
  HeaderLeftComponent,
  ...PRO_ENTRYCOMPONENTS,
  ...PRO_WIDGETS,
];

// #endregion

// #region shared components

import { ProPageGridComponent } from './components/page-grid/page-grid.component';
import { ProPageHeaderWrapperComponent } from './components/page-header-wrapper/page-header-wrapper.component';
import { LayoutProFactoryComponent } from './components/factory/factory.component';
import { LayoutProResponsibilityComponent } from './components/responsibility/responsibility.component';
import { PasswordRuleComponent } from './components/passwordRule/passwordRule.component';
import { PasswordRuleRuleChooseComponent } from './components/passwordRule/rule-choose/rule-choose.component';
import { LayoutProGuideComponent } from './components/guide/guide.component';

export const PRO_SHARED_COMPONENTS = [
  ProPageGridComponent,
  ProPageHeaderWrapperComponent,
];

// #endregion
