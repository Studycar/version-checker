import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConcurrentRequestExecutablesComponent } from './executables/executables.component';
import { ConcurrentRequestConcurrentManagersComponent } from './concurrent-managers/concurrent-managers.component';
import { ConcurrentRequestServernodesManagerComponent } from './servernodes-manager/servernodes-manager.component';
import { ConcurrentRequestRequestGroupsComponent } from './request-groups/request-groups.component';
import { ConcurrentRequestConcurrentDefineComponent } from './concurrent-define/concurrent-define.component';
import { ConcurrentRequestRequestSubmitQueryComponent } from './request-submit-query/request-submit-query.component';
import { BaseApplicationComponent } from './base-application/base-application.component';
import { BaseFlexValueSetsComponent } from './base-flex-value-sets/base-flex-value-sets.component';
import { ConcurrentRequestConcurrentProgramComponent } from './concurrent-program/concurrent-program.component';
import { ConcurrentRequestConcurrentProgramUploadComponent } from './concurrent-program-upload/concurrent-program-upload.component';
import { ConcurrentRequestRequestSetsComponent } from './request-sets/request-sets.component';

const routes: Routes = [

  { path: 'executables', component: ConcurrentRequestExecutablesComponent },
  { path: 'concurrent-managers', component: ConcurrentRequestConcurrentManagersComponent },
  { path: 'servernodes-manager', component: ConcurrentRequestServernodesManagerComponent },
  { path: 'request-groups', component: ConcurrentRequestRequestGroupsComponent },
  { path: 'concurrent-define', component: ConcurrentRequestConcurrentDefineComponent },
  { path: 'request-submit-query', component: ConcurrentRequestRequestSubmitQueryComponent },
  { path: 'base-application', component: BaseApplicationComponent },
  { path: 'base-flex-value-sets', component: BaseFlexValueSetsComponent },
  { path: 'concurrent-program', component: ConcurrentRequestConcurrentProgramComponent },
  { path: 'concurrent-program-upload', component: ConcurrentRequestConcurrentProgramUploadComponent },
  { path: 'request-sets', component: ConcurrentRequestRequestSetsComponent, data: { title: '请求集' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConcurrentRequestRoutingModule { }
