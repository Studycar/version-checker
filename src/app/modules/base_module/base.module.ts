import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TransPipe } from './pipes/trans-pipe';
import { AppApiService } from './services/app-api-service';
import { AppConfigService } from './services/app-config-service';
import { AppTranslationService } from './services/app-translation-service';
import { FormSubmitButtonComponent } from './components/form-submit-button.component';
import { FormValidationMessagesComponent } from './components/form-validation-messages.component';
import { FormTextComponent } from './components/form-text.component';
import { FormHiddenComponent } from './components/form-hidden.component';
import { FormDropdownComponent } from './components/form-dropdown.component';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { CustomExcelExportComponent } from './components/custom-excel-export.component';
import { CustomXlsxFileSelectComponent } from './components/custom-xlsxfile-select.component';
import { CustomFormQueryComponent } from './components/custom-form-query.component';
import { PopupSelectComponent } from './components/popup-select.component';
import { AppGridStateService } from './services/app-gridstate-service';
import { GridContextMenuComponent } from './components/grid-context-menu.component';
import { CustomSelectLookupComponent } from './components/custom-select-lookup.component';
import { GridLookUpComponent } from './components/grid-lookup.component';
import { CustomTreeSelectComponent } from './components/custom-tree-select.component';
import { CustomFunctionButtonComponent } from './components/custom-function-button.component';
import { CustomFunctionButtonChangeComponent } from './components/custom-function-button-change.component';
import { CustomTreeViewComponent } from './components/custom-tree-view.component';
import { CustomFileUploadComponent } from './components/custom-file-upload.component';
import { CustomPagerComponent } from './components/custom-pager.component';
import { CustomOperateCellRenderComponent } from './components/custom-operatecell-render.component';
import { CustomButtonComponent } from './components/custom-button.component';
import { CustomDatePopupComponent } from './components/custom-date-popup.component';
import { AppHubMessageService } from './services/app-hubmessage-service';
import { AgNumberEditorComponent } from './components/ag-number-editor.component';
import { AgGridModule } from 'ag-grid-angular';
import { AppAgGridStateService } from './services/app-ag-gridstate-service';
import { AgNumberEditorComponent2 } from './components/ag-number-editor.component2';
import { BaseService } from './services/app-injector.service';
import { CustomAgCellRenderComponent } from './components/custom-agcell-render.component';
import { DragModalService } from './services/drag-modal.service';
import { CustomFormQueriesComponent } from './components/custom-form-queries/custom-form-queries.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { WorkbenchSettingComponent } from './components/workbench-setting/workbench-setting.component';
import { GridCustomLoadingComponent } from './components/grid-custom-loading/grid-custom-loading.component';
import { AngularFilterComponent } from './components/angular-filter/angular-filter.component';
import { AppCommonSelectComponent } from './components/app-common-select/app-common-select.component';
import { CustomFileExportMsgComponent } from './components/custom-file-export-msg.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppPopupSelectComponent } from './components/app-popup-select/app-popup-select.component';
import { UtilService } from './services/util.service';
import { BaseImportsService } from './services/base-imports.service';
import { ImportsModalComponent } from './components/imports-modal/imports-modal.component';
import { PopuSelectRequireValidatorDirective } from './validators/popu-select-require-validator-directive';
import { PlanscheduleHWChangeDetailComponent } from './components/change-detail/change-detail.component';
import { CommonImportService } from './services/common-import.service';
import { OssFileService } from './services/oss-file.service';
import { NzSelectServerComponent } from './components/select-server-search.component';
import { CommonUploadComponent } from './components/common-upload/common-upload.component';
import { AgRichSelectEditorComponent } from './components/cell-editors/ag-rich-select-editor.component';
import { StandardsTypeFilterComponent } from './components/angular-filter/standrads-type-filter/standrads-type-filter.component';
import { AgAntNumberEditorComponent } from './components/cell-editors/ag-ant-number-editor.component';
import { CustomTbSelectSumComponent } from './components/custom-tb-select-sum.component';
import { ImageViewerComponent } from './components/img-viewer/img-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ExcelExportModule,
    NgScrollbarModule,
    AgGridModule.withComponents([
      AgAntNumberEditorComponent,
      AgNumberEditorComponent,
      AgNumberEditorComponent2,
      AgRichSelectEditorComponent,
      GridCustomLoadingComponent,
      AngularFilterComponent,
      StandardsTypeFilterComponent,
    ]),
    OverlayModule,
  ],
  declarations: [
    FormValidationMessagesComponent,
    FormTextComponent,
    FormHiddenComponent,
    FormSubmitButtonComponent,
    FormDropdownComponent,
    TransPipe,
    CustomExcelExportComponent,
    CustomXlsxFileSelectComponent,
    CustomFormQueryComponent,
    PopupSelectComponent,
    CommonUploadComponent,
    NzSelectServerComponent,
    GridLookUpComponent,
    GridContextMenuComponent,
    CustomSelectLookupComponent,
    CustomTreeSelectComponent,
    CustomFunctionButtonComponent,
    CustomFunctionButtonChangeComponent,
    CustomTreeViewComponent,
    CustomFileUploadComponent,
    CustomPagerComponent,
    CustomOperateCellRenderComponent,
    CustomButtonComponent,
    CustomDatePopupComponent,
    AgAntNumberEditorComponent,
    AgNumberEditorComponent,
    AgNumberEditorComponent2,
    AgRichSelectEditorComponent,
    CustomAgCellRenderComponent,
    CustomFormQueriesComponent,
    WorkbenchSettingComponent,
    GridCustomLoadingComponent,
    AngularFilterComponent,
    StandardsTypeFilterComponent,
    AppCommonSelectComponent,
    CustomFileExportMsgComponent,
    AppPopupSelectComponent,
    ImportsModalComponent,
    PlanscheduleHWChangeDetailComponent,
    CustomTbSelectSumComponent,
    ImageViewerComponent,
  ],
  providers: [
    AppApiService,
    AppConfigService,
    AppTranslationService,
    AppGridStateService,
    AppHubMessageService,
    AppAgGridStateService,
    BaseService,
    DragModalService,
    BaseImportsService,
    UtilService,
    CommonImportService,
    OssFileService,
  ],
  exports: [
    FormValidationMessagesComponent,
    FormTextComponent,
    FormHiddenComponent,
    FormSubmitButtonComponent,
    FormDropdownComponent,
    TransPipe,
    CustomExcelExportComponent,
    CustomXlsxFileSelectComponent,
    CustomFormQueryComponent,
    PopupSelectComponent,
    CommonUploadComponent,
    NzSelectServerComponent,
    GridLookUpComponent,
    GridContextMenuComponent,
    CustomSelectLookupComponent,
    CustomTreeSelectComponent,
    CustomFunctionButtonComponent,
    CustomFunctionButtonChangeComponent,
    CustomTreeViewComponent,
    CustomFileUploadComponent,
    CustomPagerComponent,
    CustomOperateCellRenderComponent,
    CustomButtonComponent,
    CustomDatePopupComponent,
    CustomAgCellRenderComponent,
    CustomFormQueriesComponent,
    AppCommonSelectComponent,
    AppPopupSelectComponent,
    WorkbenchSettingComponent,
    CustomTbSelectSumComponent,
  ],
  entryComponents: [
    CustomDatePopupComponent,
    GridCustomLoadingComponent,
    CustomFileExportMsgComponent,
    ImportsModalComponent,
    PlanscheduleHWChangeDetailComponent,
    ImageViewerComponent,
  ],
})
export class BaseModule {}
