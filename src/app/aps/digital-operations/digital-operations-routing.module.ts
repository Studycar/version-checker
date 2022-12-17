import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalOperationsUserPrivilageComponent } from './digital-operations-user-privilage/digital-operations-user-privilage.component';
import { DigitalOperationsFormDivisionComponent } from './digital-operations-form-division/digital-operations-form-division.component';

const routes: Routes = [
  {
    path: 'user-privilage',
    component: DigitalOperationsUserPrivilageComponent,
  },
  { path: 'form-division', component: DigitalOperationsFormDivisionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DigitalOperationsRoutingModule {}
