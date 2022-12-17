import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpandedOutputRateComponent } from './expanded-output-rate/expanded-output-rate.component';
import { SchedulePriorityComponent } from './schedule-priority/schedule-priority.component';
import { SchedulingCapacityTrendComponent } from './scheduling-capacity-trend/scheduling-capacity-trend.component';
import { SubstituteStrategyAGComponent } from './substitute-strategy/substitute-strategy-ag.component';

const routes: Routes = [
  { path: 'expanded-output-rate', component: ExpandedOutputRateComponent },
  { path: 'schedule-priority', component: SchedulePriorityComponent },
  { path: 'scheduling-capacity-trend', component: SchedulingCapacityTrendComponent },
  { path: 'substitute-strategy', component: SubstituteStrategyAGComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocRoutingModule { }
