import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WorkerManagementRoutingModule } from './worker-management-routing.module';

import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { BaseModule } from '../../modules/base_module/base.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

import { WorkerManagementSkillComponent } from './skill/skill.component';
import { WorkerManagementSkillEditComponent } from './skill/edit/edit.component';
import { WorkerManagementPostsComponent } from './posts/posts.component';
import { WorkerManagementPostsEditComponent } from './posts/edit/edit.component';
import { WorkerManagementPostsCertificateComponent } from './posts/posts-certificate/posts-certificate.component';
import { WorkerManagementPostsCertificateEditComponent } from './posts/posts-certificate/edit/edit.component';
import { WorkerManagementPostsSkillComponent } from './posts/posts-skill/posts-skill.component';
import { WorkerManagementPostsSkillEditComponent } from './posts/posts-skill/edit/edit.component';

const COMPONENTS = [
  WorkerManagementSkillComponent,
  WorkerManagementPostsComponent,
  WorkerManagementPostsCertificateComponent,
  WorkerManagementPostsSkillComponent
];
const COMPONENTS_NOROUNT = [
  WorkerManagementSkillEditComponent,
  WorkerManagementPostsEditComponent,
  WorkerManagementPostsCertificateEditComponent,
  WorkerManagementPostsSkillEditComponent
];

@NgModule({
  imports: [SharedModule, WorkerManagementRoutingModule, ExcelExportModule, BaseModule, GeneratedModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class WorkerManagementModule { }
