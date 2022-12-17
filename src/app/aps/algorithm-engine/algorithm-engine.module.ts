import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GeneratedModule } from '../../modules/generated_module/generated.module';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { BaseModule } from '../../modules/base_module/base.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineRoutingModule } from './algorithm-engine-routing.module';
import { AlgorithmEngineMidProjectsComponent } from './mid-projects/mid-projects.component';
import { AlgorithmEngineProjectOrganizationComponent } from './mid-projects/project-organization/project-organization.component';
import { AlgorithmEngineMidProjectsEditComponent } from './mid-projects/edit/edit.component';
import { AlgorithmEngineProjectOrganizationEditComponent } from './mid-projects/project-organization/edit/edit.component';
import { AlgorithmEngineMidDWCategoriesComponent } from './mid-dw-categories/mid-dw-categories.component';
import { AlgorithmEngineMidDWCategoriesEditComponent } from './mid-dw-categories/edit/edit.component';
import { AlgorithmEngineCategoriesDatasetsComponent } from './mid-dw-categories/categories-datasets/categories-datasets.component';
import { AlgorithmEngineCategoriesDatasetsEditComponent } from './mid-dw-categories/categories-datasets/edit/edit.component';
import { AlgorithmEngineMidDWDatasetEntitiesComponent } from './mid-dw-dataset-entities/mid-dw-dataset-entities.component';
import { AlgorithmEngineEntitieOrganizationComponent } from './mid-dw-dataset-entities/entities-organization/entities-organization.component';
import { AlgorithmEngineDatasetEntitiesComponent } from './mid-dw-dataset-entities/dataset-entities/dataset-entities.component';
import { AlgorithmEngineDatasetEntitiesEditComponent } from './mid-dw-dataset-entities/dataset-entities/edit/edit.component';
import { AlgorithmEngineMidItemResultComponent } from './mid-item-result/mid-item-result.component';
import { AlgorithmEngineMidRoutingResultComponent } from './mid-routing-result/mid-routing-result.component';


const COMPONENTS = [
  AlgorithmEngineMidProjectsComponent,
  AlgorithmEngineMidDWCategoriesComponent,
  AlgorithmEngineMidDWDatasetEntitiesComponent,
  AlgorithmEngineMidItemResultComponent,
  AlgorithmEngineMidRoutingResultComponent,
];
const COMPONENTS_NOROUNT = [
  AlgorithmEngineMidProjectsEditComponent,
  AlgorithmEngineProjectOrganizationComponent,
  AlgorithmEngineProjectOrganizationEditComponent,
  AlgorithmEngineMidDWCategoriesEditComponent,
  AlgorithmEngineCategoriesDatasetsComponent,
  AlgorithmEngineCategoriesDatasetsEditComponent,
  AlgorithmEngineEntitieOrganizationComponent,
  AlgorithmEngineDatasetEntitiesComponent,
  AlgorithmEngineDatasetEntitiesEditComponent,

];

@NgModule({
  imports: [SharedModule, AlgorithmEngineRoutingModule, ExcelExportModule, BaseModule, GeneratedModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class AlgorithmEngineModule {
}

