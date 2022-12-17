import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkerManagementSkillComponent } from './skill/skill.component';
import { WorkerManagementSkillEditComponent } from './skill/edit/edit.component';
import { WorkerManagementPostsComponent } from './posts/posts.component';
import { WorkerManagementPostsEditComponent } from './posts/edit/edit.component';
import { WorkerManagementPostsCertificateComponent } from './posts/posts-certificate/posts-certificate.component';
import { WorkerManagementPostsCertificateEditComponent } from './posts/posts-certificate/edit/edit.component';
import { WorkerManagementPostsSkillComponent } from './posts/posts-skill/posts-skill.component';
import { WorkerManagementPostsSkillEditComponent } from './posts/posts-skill/edit/edit.component';

const routes: Routes = [
  { path: 'skill', component: WorkerManagementSkillComponent },
  { path: 'posts', component: WorkerManagementPostsComponent },
  { path: 'postsCertificate', component: WorkerManagementPostsCertificateComponent },
  { path: 'postsSkill', component: WorkerManagementPostsSkillComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerManagementRoutingModule { }
