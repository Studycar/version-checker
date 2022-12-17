import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiRegisterComponent } from './register/register.component';
import { ApiReportReceiveComponent } from './report/receive.component';
import { ApiDisplayComponent } from './display/display.component';
import { ApiDisplayConfigComponent } from './displayconfig/displayconfig.component';

const routes: Routes = [
  { path: 'register', component: ApiRegisterComponent },
  { path: 'rpt-receive', component: ApiReportReceiveComponent },
  { path: 'display', component: ApiDisplayComponent },
  { path: 'displayconfig', component: ApiDisplayConfigComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiRoutingModule { }
