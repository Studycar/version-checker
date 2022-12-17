///<reference path="components/gantt/gantt.component.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import {OverlayModule} from '@angular/cdk/overlay';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonChartModule } from '@delon/chart';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { NgZorroAntdModule, NzAddOnModule } from 'ng-zorro-antd';
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
import { NgxEchartsModule } from 'ngx-echarts';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';
import '@progress/kendo-angular-intl/locales/es/all';
import '@progress/kendo-angular-intl/locales/zh/all';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { ColorPickerModule } from 'ngx-color-picker';
import { InGridRowKeyDirective } from 'app/modules/base_module/components/grid-key.directive';
import { LangsComponent } from './components/langs/langs.component';
import { PRO_SHARED_COMPONENTS } from 'app/layout/pro';
import { ScrollbarDirective } from './components/scrollbar/scrollbar.directive';
import { MyGridStateDirective } from 'app/modules/base_module/components/grid-state.directive';
import { InAgGridRowKeyDirective } from 'app/modules/base_module/components/custom-aggrid-key.directive';
import { MyAgGridStateDirective } from 'app/modules/base_module/components/custom-aggrid-state.directive';
import { GanttComponent } from './components/gantt/gantt.component';
import { NzSubmenuForkComponent } from '@shared/components/menufork/nz-submenu-fork.component';
import { TabAggridStateDirective } from '@shared/directive/tab-ag-state/tab-aggrid-state.directive';
import { AutoHeightDirective } from '../modules/base_module/components/auto-height.directive';
import { RestoreScrollDirective } from '@shared/directive/resotre-scroll/restore-scroll.directive';
import { UpdateColorCellDirective } from '@shared/directive/update-color-cell/update-color-cell.directive';
import { PickerColorComponent } from '@shared/components/picker-color/picker-color.component';
import { GanttComponent as NewGanttComponent } from './components/ganttChart/gantt.component';
// import { ModalPlusModule } from './directive/modal-plus';
import { ModalPlusModule } from './components/modal-plus/modal-plus.module';
import { AdaptiveFullScreenDirective } from './directive/adaptive-full-screen/adaptive-full-screen.directive';
import { ExpandOrContractDirective } from './directive/expand-or-contract.directive';
// import { FlexibleModalComponent } from './components/modal-plus/flexible-modal/flexible-modal.component';
// import { ModalPlusDemoComponent } from './components/modal-plus-demo/modal-plus-demo.component';
// @ts-ignore
// import { WaterMarkerModule } from 'cc-water-marker';
import { ClipboardModule } from 'ngx-clipboard';
import { DebounceClickDirective } from './directive/debounce/debounce-click.directive';

const THIRDMODULES = [
  NgZorroAntdModule,
  NzAddOnModule,
  UEditorModule,
  NgxTinymceModule,
  GridModule,
  DropDownsModule,
  DialogModule,
  DateInputsModule,
  IntlModule,
  ExcelExportModule,
  PopupModule,
  InputsModule,
  ColorPickerModule,
  NgxEchartsModule,
  ModalPlusModule,
  ClipboardModule,
  // WaterMarkerModule,
];
// endregion

const COMPONENTS_ENTRY = [
  LangsComponent,
  GanttComponent,
  NewGanttComponent,
  // FlexibleModalComponent,
  // ModalPlusDemoComponent,
];
// region: your componets & directives
const COMPONENTS = [
  NzSubmenuForkComponent,
  PickerColorComponent,
  ...COMPONENTS_ENTRY,
  ...PRO_SHARED_COMPONENTS,
];
const DIRECTIVES = [
  InGridRowKeyDirective,
  InAgGridRowKeyDirective,
  ScrollbarDirective,
  MyGridStateDirective,
  MyAgGridStateDirective,
  AutoHeightDirective,
  TabAggridStateDirective,
  RestoreScrollDirective,
  UpdateColorCellDirective,
  AdaptiveFullScreenDirective,
  ExpandOrContractDirective,
  DebounceClickDirective,
];

// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    OverlayModule,
    TranslateModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  entryComponents: COMPONENTS_ENTRY,
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {
}
