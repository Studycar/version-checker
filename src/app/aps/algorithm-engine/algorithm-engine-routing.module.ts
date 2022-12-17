

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlgorithmEngineMidDWCategoriesComponent } from './mid-dw-categories/mid-dw-categories.component';
import { AlgorithmEngineMidDWDatasetEntitiesComponent } from './mid-dw-dataset-entities/mid-dw-dataset-entities.component';
import { AlgorithmEngineMidItemResultComponent } from './mid-item-result/mid-item-result.component';
import { AlgorithmEngineMidProjectsComponent } from './mid-projects/mid-projects.component';
import { AlgorithmEngineMidRoutingResultComponent } from './mid-routing-result/mid-routing-result.component';


const routes: Routes = [
  { path: 'mid-projects', component: AlgorithmEngineMidProjectsComponent },
  { path: 'mid-categories-datasets', component: AlgorithmEngineMidDWCategoriesComponent },
  { path: 'mid-datasets-entities', component: AlgorithmEngineMidDWDatasetEntitiesComponent },
  { path: 'mid-item-result', component: AlgorithmEngineMidItemResultComponent },
  { path: 'mid-routing-result', component: AlgorithmEngineMidRoutingResultComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlgorithmEngineRoutingModule { }

