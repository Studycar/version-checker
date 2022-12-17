import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLookupCodeComponent } from './lookup-code/lookup-code.component';
import { BaseMessageComponent } from './message/message.component';
import { BaseBaserespmanagerComponent } from './baserespmanager/baserespmanager.component';
import { BaseMenuGroupPluginChildComponent } from './menu-group-plugin-child/menu-group-plugin-child.component';
// import { BaseUsermanagerComponent } from './usermanager/usermanager.component';
// import { BaseUsermanagerrespComponent } from './usermanagerresp/usermanagerresp.component';
import { BaseBaserespmanagerchildComponent } from './baserespmanagerchild/baserespmanagerchild.component';
import { BaseResprequestgroupComponent } from './resprequestgroup/resprequestgroup.component';
import { BasePsPrivilegeComponent } from './ps-privilege/ps-privilege.component';
import { TranslatorComponent } from './translator/translator.component';
import { TranslatorAgCodeComponent } from './translator/translator-ag.component';
import { LastQueryComponent } from './lastquery/lastquery.component';
import { BaseBaseparameterComponent } from './baseparameter/baseparameter.component';
import { BaseBillNoRuleComponent } from './bill-no-rule/bill-no-rule.component';
import { ColorManagerComponent } from './colormanager/colormanager.component';
import { BasePsbomComponent } from './psbom/psbom.component';
import { BaseDataexceptionComponent } from './dataexception/dataexception.component';
import { BaseMessageAgComponent } from './message/message-ag.component';
import { BaseLookupAgCodeComponent } from './lookup-code/lookupcode-ag.component';
import { BaseUsermanagerAgComponent } from './usermanager/usermanager-ag.component';
import { BaseFunctionmanagerAgComponent } from './functionmanager/functionmanager.ag.component';
import { BaseUsermanagerrespAgComponent } from './usermanagerresp/usermanagerresp-ag.component';
import { BaseMenumanagerAgComponent } from './menumanager/menumanager-ag.component';
import { BaseChildmenuallocateAgComponent } from './childmenuallocate/childmenuallocate-ag.component';
import { BaseMenuGroupPluginAgComponent } from './menu-group-plugin/menu-group-plugin-ag.component';
import { BasePsPrivilegeAgComponent } from './ps-privilege/ps-privilege-ag.component';
import { BaseBillNoRuleAgComponent } from './bill-no-rule/bill-no-rule-ag.component';
import { BaseMessageprofileComponent } from './messageprofile/messageprofile.component';
import { MakeDataComponent } from './make-data/make-data.component';

const routes: Routes = [
  { path: 'lookup-code', component: BaseLookupAgCodeComponent },
  { path: 'message', component: BaseMessageAgComponent },
  { path: 'menumanager', component: BaseMenumanagerAgComponent },
  { path: 'menu-group-plugin', component: BaseMenuGroupPluginAgComponent },
  { path: 'functionmanager', component: BaseFunctionmanagerAgComponent },
  { path: 'childmenuallocate', component: BaseChildmenuallocateAgComponent },
  { path: 'baserespmanager', component: BaseBaserespmanagerComponent },
  { path: 'menu-group-plugin-child', component: BaseMenuGroupPluginChildComponent },
  { path: 'usermanager', component: BaseUsermanagerAgComponent },
  { path: 'usermanagerresp', component: BaseUsermanagerrespAgComponent },
  { path: 'baserespmanagerchild', component: BaseBaserespmanagerchildComponent },
  { path: 'resprequestgroup', component: BaseResprequestgroupComponent },
  { path: 'ps-privilege', component: BasePsPrivilegeAgComponent },
  { path: 'translator', component: TranslatorAgCodeComponent },
  { path: 'lastquery', component: LastQueryComponent },
  { path: 'baseparameter', component: BaseBaseparameterComponent },
  { path: 'billnorule', component: BaseBillNoRuleAgComponent },
  { path: 'colormanager', component: ColorManagerComponent },
  { path: 'psbom', component: BasePsbomComponent },
  { path: 'dataexception', component: BaseDataexceptionComponent },
  { path: 'messageprofile', component: BaseMessageprofileComponent },
  { path: 'make-data', component: MakeDataComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
