import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
// import 'ag-grid-enterprise';
import { SharedModule } from '@shared/shared.module';
import { BaseModule as BaseModules } from '../../modules/base_module/base.module';
import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { BaseRoutingModule } from './base-routing.module';
import { BaseLookupCodeComponent } from './lookup-code/lookup-code.component';
import { BaseMenumanagerEditComponent } from './menumanager/edit/edit.component';
import { BaseFunctionmanagerEditComponent } from './functionmanager/edit/edit.component';
import { BaseMenuGroupPluginEditComponent } from './menu-group-plugin/edit/edit.component';
import { BaseChildmenuallocateEditComponent } from './childmenuallocate/edit/edit.component';
import { BaseMessageEditComponent } from './message/edit/edit.component';
import { BaseMessageComponent } from './message/message.component';
import { BaseBaserespmanagerComponent } from './baserespmanager/baserespmanager.component';
import { BaseBaserespmanagerEditComponent } from './baserespmanager/edit/edit.component';
import { BaseMenuGroupPluginChildComponent } from './menu-group-plugin-child/menu-group-plugin-child.component';
import { BaseMenuGroupPluginChildEditComponent } from './menu-group-plugin-child/edit/edit.component';
// import { BaseUserrespComponent } from './userresp/userresp.component';
// import { BaseUserrespEditComponent } from './userresp/edit/edit.component';
// import { BaseUserrespViewComponent } from './userresp/view/view.component';
// import { BaseUsermanagerComponent } from './usermanager/usermanager.component';

import { BaseUsermanagerEditComponent } from './usermanager/edit/edit.component';

// import { BaseUsermanagerAttachComponent } from './usermanager/attachinfo/attach.component';
import { BaseUsermanagerInitComponent } from './usermanager/initpassword/init.component';

// import { BaseUsermanagerrespComponent } from './usermanagerresp/usermanagerresp.component';

import { BaseUsermanagerrespEditComponent } from './usermanagerresp/edit/edit.component';

import { BaseBaserespmanagerchildComponent } from './baserespmanagerchild/baserespmanagerchild.component';
import { BaseBaserespmanagerchildEditComponent } from './baserespmanagerchild/edit/edit.component';
import { BaseResprequestgroupComponent } from './resprequestgroup/resprequestgroup.component';
import { BaseResprequestgroupEditComponent } from './resprequestgroup/edit/edit.component';
import { BasePsPrivilegeComponent } from './ps-privilege/ps-privilege.component';
import { BasePsPrivilegeEditComponent } from './ps-privilege/edit/edit.component';
import { BaseLookupCodeDetailComponent } from './lookup-code/detail/lookup-code-detail.component';
import { BaseLookupCodeEditComponent } from './lookup-code/edit/edit.component';
import { TranslatorComponent } from './translator/translator.component';
import { TranslatorEditComponent } from './translator/edit/edit.component';
import { TranslatorAgCodeComponent } from './translator/translator-ag.component';
import { LastQueryComponent } from './lastquery/lastquery.component';
import { BaseBaseparameterComponent } from './baseparameter/baseparameter.component';
import { BaseBaseparameterEditComponent } from './baseparameter/edit/edit.component';
import { BaseBaseparameterViewComponent } from './baseparameter/view/view.component';
import { BaseBaseparameterViewEditComponent } from './baseparameter/view-edit/view-edit.component';
import { BaseBillNoRuleComponent } from './bill-no-rule/bill-no-rule.component';
import { BaseBillNoRuleEditComponent } from './bill-no-rule/edit/edit.component';
import { BaseBillNoRecordViewComponent } from './bill-no-rule/view/bill-no-record-view/bill-no-record-view.component';
import { ColorManagerComponent } from './colormanager/colormanager.component';
import { ColorManagerEditComponent } from './colormanager/edit/edit.component';
import { BasePsbomComponent } from './psbom/psbom.component';
import { BasePsbomViewComponent } from './psbom/view/view.component';
import { BaseDataexceptionComponent } from './dataexception/dataexception.component';
import { BaseDataexceptionEditComponent } from './dataexception/edit/edit.component';
import { BaseDataexceptionViewComponent } from './dataexception/view/view.component';
import { BaseDataexceptionConfigComponent } from './dataexception/config/config.component';
import { BaseDataexceptionCalculateComponent } from './dataexception/calculate/calculate.component';
import { BaseMessageAgComponent } from './message/message-ag.component';
import { BaseLookupAgCodeComponent } from './lookup-code/lookupcode-ag.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BaseUsermanagerAgComponent } from './usermanager/usermanager-ag.component';
import { BaseFunctionmanagerAgComponent } from './functionmanager/functionmanager.ag.component';
import { BaseUsermanagerrespAgComponent } from './usermanagerresp/usermanagerresp-ag.component';
import { BaseMenumanagerAgComponent } from './menumanager/menumanager-ag.component';
import { BaseChildmenuallocateAgComponent } from './childmenuallocate/childmenuallocate-ag.component';
import { FormsModule } from '@angular/forms';
import { BaseMenuGroupPluginAgComponent } from './menu-group-plugin/menu-group-plugin-ag.component';
import { BasePsPrivilegeAgComponent } from './ps-privilege/ps-privilege-ag.component';
import { BaseBillNoRuleAgComponent } from './bill-no-rule/bill-no-rule-ag.component';
import { DelonUtilModule } from '@delon/util';
import { BaseMessageprofileComponent } from './messageprofile/messageprofile.component';
import { BaseMessageprofileEditComponent } from './messageprofile/edit/edit.component';
import { BaseMessageRuleEditComponent } from './messageprofile/rule-edit/rule-edit.component';
import { AgDatePickerComponent } from './lookup-code/detail/ag-date-picker.component';
import { AgFormCellComponent } from './lookup-code/detail/ag-form-cell.component';
import { AgInnerTextComponent } from './lookup-code/detail/ag-inner-text.component';
import { AddLookCodeComponent } from './lookup-code/detail/add-look-code/add-look-code.component';
import { LookCodeDetailService } from './lookup-code/detail/look-code-detail.service';
import { BaseFunctionmanagerDetailComponent } from './functionmanager/detail/detail.component';
import { BaseFunctionmanagerDetailConfigComponent } from './functionmanager/detail/config/config.component';
import { MakeDataComponent } from './make-data/make-data.component';
import { BaseUsermanagerImportComponent} from './usermanager/import/import.component';
import { BaseUserRespImportComponent} from './usermanagerresp/import/import.component';
import { BaseUserPrivilegeImportComponent} from './ps-privilege/import/import.component';
import { BaseRespsBImportComponent} from './baserespmanager/import/import.component';
import { BaseMenuImportComponent } from './menumanager/import/import.component';
import {BaseMenuGroupImportComponent} from './menu-group-plugin/import/import.component';
import {BaseLookUpCodeImportComponent} from './lookup-code/import/import.component';
import {BaseParameterImportComponent} from './baseparameter/import/import.component';
import {TranslatorImportComponent} from './translator/import/import.component';


const COMPONENTS = [
  BaseLookupCodeComponent,
  BaseLookupAgCodeComponent,
  BaseMessageComponent,
  BaseMessageAgComponent,
  BaseMenumanagerAgComponent,
  BaseMenuGroupPluginAgComponent,
  BaseMenuGroupPluginChildComponent,
  BaseChildmenuallocateAgComponent,
  BaseBaserespmanagerComponent,
  // BaseUserrespComponent,
  // BaseUsermanagerComponent,
  BaseUsermanagerAgComponent,
  // BaseUsermanagerrespComponent,
  BaseUsermanagerrespAgComponent,
  BaseBaserespmanagerchildComponent,
  BaseResprequestgroupComponent,
  BasePsPrivilegeComponent,
  BasePsPrivilegeAgComponent,
  TranslatorComponent,
  TranslatorAgCodeComponent,
  LastQueryComponent,
  BaseBaseparameterComponent,
  BaseBillNoRuleComponent,
  BaseBillNoRuleAgComponent,
  ColorManagerComponent,
  BasePsbomComponent,
  BaseDataexceptionComponent,
  BaseFunctionmanagerAgComponent,
  BaseMessageprofileComponent,
  BaseUsermanagerImportComponent,
  BaseUserRespImportComponent,
  BaseUserPrivilegeImportComponent,
  BaseRespsBImportComponent,
  BaseMenuImportComponent,
  BaseMenuGroupImportComponent,
  BaseLookUpCodeImportComponent,
  BaseParameterImportComponent,
  TranslatorImportComponent
];

const COMPONENTS_NOROUNT = [
  BaseMessageEditComponent,
  BaseMenumanagerEditComponent,
  BaseMenuGroupPluginEditComponent,
  BaseMenuGroupPluginChildEditComponent,
  BaseFunctionmanagerEditComponent,
  BaseChildmenuallocateEditComponent,
  BaseBaserespmanagerEditComponent,
  // BaseUserrespEditComponent,
  // BaseUserrespViewComponent,
  BaseUsermanagerEditComponent,
  // BaseUsermanagerAttachComponent,
  BaseUsermanagerInitComponent,
  BaseUsermanagerrespEditComponent,
  BaseBaserespmanagerchildEditComponent,
  BaseResprequestgroupEditComponent,
  BasePsPrivilegeEditComponent,
  BaseLookupCodeDetailComponent,
  BaseLookupCodeEditComponent,
  TranslatorEditComponent,
  BaseBaseparameterEditComponent,
  BaseBaseparameterViewComponent,
  BaseBaseparameterViewEditComponent,
  BaseBillNoRuleEditComponent,
  BaseBillNoRecordViewComponent,
  ColorManagerEditComponent,
  BasePsbomViewComponent,
  BaseDataexceptionEditComponent,
  BaseDataexceptionViewComponent,
  BaseDataexceptionConfigComponent,
  BaseDataexceptionCalculateComponent,
  BaseMessageprofileEditComponent,
  BaseMessageRuleEditComponent,
  AgDatePickerComponent,
  AgFormCellComponent,
  AgInnerTextComponent,
  AddLookCodeComponent,
  BaseFunctionmanagerDetailComponent,
  BaseFunctionmanagerDetailConfigComponent,
  MakeDataComponent,
  BaseUsermanagerImportComponent,
  BaseUserRespImportComponent,
  BaseUserPrivilegeImportComponent,
  BaseRespsBImportComponent,
  BaseMenuImportComponent,
  BaseMenuGroupImportComponent,
  BaseLookUpCodeImportComponent,
  BaseParameterImportComponent,
  TranslatorImportComponent
];

@NgModule({
  imports: [
    SharedModule,
    BaseRoutingModule,
    GeneratedModule,
    FormsModule,
    BaseModules,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    DelonUtilModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [LookCodeDetailService],
})
export class BaseModule {
}
