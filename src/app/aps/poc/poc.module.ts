import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { BaseModule } from 'app/modules/base_module/base.module';
import { FormsModule } from '@angular/forms';

import { PocRoutingModule } from './poc-routing.module';
import { CustomOperateCellRenderComponent } from '../../modules/base_module/components/custom-operatecell-render.component';
import { ExpandedOutputRateComponent } from './expanded-output-rate/expanded-output-rate.component';
import { ExpandedOutputRateEditComponent } from './expanded-output-rate/edit/edit.component';
import { SchedulePriorityComponent } from './schedule-priority/schedule-priority.component';
import { SchedulePriorityEditComponent } from './schedule-priority/edit/edit.component';
import { SchedulingCapacityTrendComponent } from './scheduling-capacity-trend/scheduling-capacity-trend.component';
import { SubstituteStrategyAGComponent } from './substitute-strategy/substitute-strategy-ag.component';
import { SubstituteStrategyDetailComponent } from './substitute-strategy/detail/substitute-strategy-detail.component';
import { SubstituteStrategyEditComponent } from './substitute-strategy/edit/edit.component';
import { AgDatePickerComponent } from './substitute-strategy/detail/ag-date-picker.component';
import { AgFormCellComponent } from './substitute-strategy/detail/ag-form-cell.component';
import { AgInnerTextComponent } from './substitute-strategy/detail/ag-inner-text.component';
import { AddSubstituteStrategyComponent } from './substitute-strategy/detail/add-substitute-strategy/add-substitute-strategy.component';
import { SubstituteStrategyDetailService } from './substitute-strategy/detail/substitute-strategy-detail.service';
import { AddDetailSubstituteStrategyComponent } from './substitute-strategy/detail/add-substitute-strategy/add-detail-substitute-strategy.component';
import { SubstituteStrategyInfoComponent } from './substitute-strategy/detail/substitute-strategy-info/substitute-strategy-info.component';
import { AddSubstituteStrategyInfoComponent } from './substitute-strategy/detail/substitute-strategy-info/add-substitute-strategy-info.component';
import { AgGridModule } from 'ag-grid-angular';
// import { SubstituteStrategyInfoComponent } from './substitute-strategy/detail/substitute-strategy-info/substitute-strategy-info.component';

const components = [
  ExpandedOutputRateComponent,
  SchedulePriorityComponent,
  SchedulingCapacityTrendComponent,
  SubstituteStrategyAGComponent,
];
const componentsNoRoute = [
  ExpandedOutputRateEditComponent,
  SchedulePriorityEditComponent,
  SubstituteStrategyDetailComponent,
  SubstituteStrategyEditComponent,
  AgDatePickerComponent,
  AgFormCellComponent,
  AgInnerTextComponent,
  AddSubstituteStrategyComponent,
  AddDetailSubstituteStrategyComponent,
  SubstituteStrategyInfoComponent,
  AddSubstituteStrategyInfoComponent,
];

@NgModule({
  declarations: [
    ...components,
    ...componentsNoRoute,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    FormsModule,
    PocRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  entryComponents: componentsNoRoute,
  providers: [SubstituteStrategyDetailService],
})
export class PocModule { }
