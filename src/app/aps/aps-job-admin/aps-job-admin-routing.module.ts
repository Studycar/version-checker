import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { JobLogComponent } from './components/job-log/job-log.component';
import { JobGroupComponent } from './components/job-group/job-group.component';
import { JobInfoComponent } from './components/job-info/job-info.component';

export const routes: Routes = [

  /** 任务管理 */
  { path: 'job-info', component: JobInfoComponent},

  /** 执行器管理 */
  { path: 'job-group', component: JobGroupComponent},

  /** 调度日志 */
  { path: 'job-log', component: JobLogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApsJobAdminRoutingModule {
}
