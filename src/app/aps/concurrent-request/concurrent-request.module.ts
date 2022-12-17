import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { ConcurrentRequestRoutingModule } from './concurrent-request-routing.module';
import { ConcurrentRequestExecutablesComponent } from './executables/executables.component';
import { ConcurrentRequestExecutablesEditComponent } from './executables/edit/edit.component';
import { ConcurrentRequestConcurrentProgramComponent } from './concurrent-program/concurrent-program.component';
import { ConcurrentRequestConcurrentProgramEditComponent } from './concurrent-program/edit/edit.component';
import { ConcurrentRequestConcurrentManagersComponent } from './concurrent-managers/concurrent-managers.component';
import { ConcurrentRequestConcurrentManagersViewComponent } from './concurrent-managers/view/view.component';
import { ConcurrentRequestServernodesManagerEditComponent } from './servernodes-manager/edit/edit.component';
import { ConcurrentRequestServernodesManagerComponent } from './servernodes-manager/servernodes-manager.component';
import { ConcurrentRequestRequestGroupsEditComponent } from './request-groups/edit/edit.component';
import { ConcurrentRequestRequestGroupsViewComponent } from './request-groups/view/view.component';
import { ConcurrentRequestConcurrentDefineComponent } from './concurrent-define/concurrent-define.component';
import { ConcurrentRequestConcurrentRuleComponent } from './concurrent-define/concurrent-rule.component';
import { ConcurrentRequestConcurrentDefineViewComponent } from './concurrent-define/view/view.component';
import { ConcurrentRequestConcurrentDefineEditComponent } from './concurrent-define/edit/edit.component';
import { ConcurrentRequestRequestGroupsDetailComponent } from './request-groups/request-groups-detail.component';
import { ConcurrentRequestRequestGroupsComponent } from './request-groups/request-groups.component';
import { ConcurrentRequestConcurrentManagersEditComponent } from './concurrent-managers/edit/edit.component';
import { ConcurrentRequestConcurrentProgramCopytoComponent } from './concurrent-program/copyto/copyto.component';
import { ConcurrentRequestRequestSubmitQueryComponent } from './request-submit-query/request-submit-query.component';
import { ConcurrentRequestRequestSubmitQueryViewComponent } from './request-submit-query/view/view.component';
import { ConcurrentRequestSearchRequestComponent } from './request-submit-query/search-request/search-request.component';
import { ConcurrentRequestDiagnosisFormComponent } from './request-submit-query/diagnosis-form/diagnosis-form.component';
import { ConcurrentRequestSessionFormComponent } from './request-submit-query/session-form/session-form.component';
import { ConcurrentRequestViewrequestFormComponent } from './request-submit-query/viewrequest-form/viewrequest-form.component';
import { ConcurrentRequestSubmitNewRequestFormComponent } from './request-submit-query/submit-new-request-form/submit-new-request-form.component';
import { ConcurrentRequestSingleRequestFormComponent } from './request-submit-query/single-request-form/single-request-form.component';
import { ConcurrentRequestRequestSetsFormComponent } from './request-submit-query/request-sets-form/request-sets-form.component';
import { ConcurrentRequestPlanFormComponent } from './request-submit-query/plan-form/plan-form.component';
import { ConcurrentRequestPreviousRequestFormComponent } from './request-submit-query/previous-request-form/previous-request-form.component';
import { ConcurrentRequestParameterFormComponent } from './request-submit-query/parameter-form/parameter-form.component';
import { ConcurrentRequestPreviousRequestSetFormComponent } from './request-submit-query/previous-request-set-form/previous-request-set-form.component';
import { ConcurrentRequestLogFormComponent } from './request-submit-query/log-form/log-form.component';
import { BaseFlexValueSetsComponent } from './base-flex-value-sets/base-flex-value-sets.component';
import { BaseFlexValueSetsEditComponent } from './base-flex-value-sets/edit/edit.component';
import { BaseFlexValueSetsDetailComponent } from './base-flex-value-sets/detail/detail.component';
import { BaseApplicationComponent } from './base-application/base-application.component';
import { BaseApplicationEditComponent } from './base-application/edit/edit.component';
import { ConcurrentRequestConcurrentProgramSerialEditComponent } from './concurrent-program-serial/edit/edit.component';
import { ConcurrentRequestConcurrentProgramSerialComponent } from './concurrent-program-serial/concurrent-program-serial.component';
import { ConcurrentRequestConcurrentProgramParameterEditComponent } from './concurrent-program-parameter/edit/edit.component';
import { ConcurrentRequestConcurrentProgramParameterComponent } from './concurrent-program-parameter/concurrent-program-parameter.component';
import { ConcurrentRequestConcurrentProgramUploadComponent } from './concurrent-program-upload/concurrent-program-upload.component';
import { ConcurrentRequestRequestSetsComponent } from './request-sets/request-sets.component';
import { ConcurrentRequestRequestSetsEditComponent } from './request-sets/edit/edit.component';
import { ConcurrentRequestRequestSetsViewComponent } from './request-sets/view/view.component';
import { DefineStageComponent } from './request-sets/define-stage/define-stage.component';
import { LinkStageComponent } from './request-sets/link-stage/link-stage.component';
import { StageProgramComponent } from './request-sets/stage-program/stage-program.component';
import { StageProgArgsComponent } from './request-sets/stage-prog-args/stage-prog-args.component';
import { AddDefineStageComponent } from './request-sets/define-stage/add-define-stage/add-define-stage.component';
import { AddLinkStageComponent } from './request-sets/link-stage/add-link-stage/add-link-stage.component';
import { AddStageProgArgsComponent } from './request-sets/stage-prog-args/add-stage-prog-args/add-stage-prog-args.component';
import { AddStageProgramComponent } from './request-sets/stage-program/add-stage-program/add-stage-program.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BaseFlexValueSetsDetail2Component } from './base-flex-value-sets/detail2/detail2.component';
import { RequestSubmitQueryStatusComponent } from './request-submit-query/request-submit-query-status.component';


const COMPONENTS = [
  ConcurrentRequestExecutablesComponent,
  ConcurrentRequestConcurrentProgramComponent,
  ConcurrentRequestConcurrentManagersComponent,
  ConcurrentRequestServernodesManagerComponent,
  ConcurrentRequestConcurrentDefineComponent,
  ConcurrentRequestRequestGroupsComponent,
  ConcurrentRequestRequestSubmitQueryComponent,
  BaseApplicationComponent,
  BaseFlexValueSetsComponent,
  ConcurrentRequestConcurrentProgramSerialComponent,
  ConcurrentRequestConcurrentProgramParameterComponent,
  ConcurrentRequestConcurrentProgramUploadComponent,
  ConcurrentRequestRequestSetsComponent,
  RequestSubmitQueryStatusComponent];

const COMPONENTS_NOROUNT = [
  ConcurrentRequestExecutablesEditComponent,
  ConcurrentRequestConcurrentProgramEditComponent,
  ConcurrentRequestConcurrentProgramSerialComponent,
  ConcurrentRequestConcurrentProgramParameterComponent,
  ConcurrentRequestConcurrentManagersViewComponent,
  ConcurrentRequestServernodesManagerEditComponent,
  ConcurrentRequestRequestGroupsEditComponent,
  ConcurrentRequestRequestGroupsViewComponent,
  ConcurrentRequestConcurrentDefineViewComponent,
  ConcurrentRequestConcurrentDefineEditComponent,
  ConcurrentRequestRequestGroupsDetailComponent,
  ConcurrentRequestConcurrentManagersEditComponent,
  ConcurrentRequestConcurrentRuleComponent,
  ConcurrentRequestConcurrentProgramCopytoComponent,
  ConcurrentRequestSearchRequestComponent,
  ConcurrentRequestDiagnosisFormComponent,
  ConcurrentRequestSessionFormComponent,
  ConcurrentRequestViewrequestFormComponent,
  ConcurrentRequestSubmitNewRequestFormComponent,
  ConcurrentRequestSingleRequestFormComponent,
  ConcurrentRequestRequestSetsFormComponent,
  ConcurrentRequestPlanFormComponent,
  ConcurrentRequestParameterFormComponent,
  ConcurrentRequestPreviousRequestFormComponent,
  ConcurrentRequestRequestSubmitQueryViewComponent,
  ConcurrentRequestPreviousRequestSetFormComponent,
  ConcurrentRequestLogFormComponent,
  BaseApplicationEditComponent,
  BaseFlexValueSetsEditComponent,
  BaseFlexValueSetsDetailComponent,
  ConcurrentRequestConcurrentProgramEditComponent,
  ConcurrentRequestConcurrentProgramCopytoComponent,
  ConcurrentRequestConcurrentProgramSerialEditComponent,
  ConcurrentRequestConcurrentProgramParameterEditComponent,
  ConcurrentRequestRequestSetsEditComponent,
  ConcurrentRequestRequestSetsViewComponent,
  DefineStageComponent,
  LinkStageComponent,
  StageProgramComponent,
  StageProgArgsComponent,
  AddDefineStageComponent,
  AddLinkStageComponent,
  AddStageProgArgsComponent,
  AddStageProgramComponent,
  BaseFlexValueSetsDetail2Component,
  RequestSubmitQueryStatusComponent,
];

@NgModule({
  imports: [
    SharedModule,
    BaseModule,
    ConcurrentRequestRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ConcurrentRequestModule { }
