import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobInfoComponent } from './components/job-info/job-info.component';
import { JobLogComponent } from './components/job-log/job-log.component';
import { ParameterPassComponent } from './components/job-info/perform-once/parameter-pass.component';
import { MessageRendererComponent } from './components/job-log/message-renderer/message-renderer.component';
import { RegistryListRendererComponent } from './components/job-group/registry-list-renderer/registry-list-renderer.component';
import { ApsJobAdminRoutingModule } from './aps-job-admin-routing.module';
import { JobGroupComponent } from './components/job-group/job-group.component';
import { EditJobGroupComponent } from './components/job-group/edit-job-group/edit-job-group.component';
import { EditJobInfoComponent } from './components/job-info/edit-job-info/edit-job-info.component';
import { StatusRendererComponent } from './components/job-info/status-renderer/status-renderer.component';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from '../../modules/base_module/components/custom-operatecell-render.component';
import { ApsJobAdminService } from './services/aps-job-admin.service';
import { JobInfoService } from './components/job-info/job-info.service';
import { JobGroupService } from './components/job-group/job-group.service';
import { JobLogService } from './components/job-log/job-log.service';

const COMPONENTS = [
  JobInfoComponent,
  JobLogComponent,
  JobGroupComponent,
];

const ENTRY_COMPONENTS = [
  StatusRendererComponent,
  ParameterPassComponent,
  EditJobInfoComponent,
  MessageRendererComponent,
  RegistryListRendererComponent,
  EditJobGroupComponent,
];


@NgModule({
  declarations: [...COMPONENTS, ...ENTRY_COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    GeneratedModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
    ApsJobAdminRoutingModule,
  ],
  entryComponents: [...ENTRY_COMPONENTS],
  providers: [ApsJobAdminService, JobInfoService, JobGroupService, JobLogService],
})
export class ApsJobAdminModule {
}
