import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasePriceComponent } from './base-price/base-price.component';
import { MarkupElementComponent } from './markup-element/markup-element.component';
import { MarkupElement1Component } from './markup-element1/markup-element1.component';
import { MarkupGradeComponent } from './markup-grade/markup-grade.component';
import { MarkupSubsecComponent } from './markup-subsec/markup-subsec.component';
import { MarkupElement6Component } from './markup-bzfs/markup-bzfs.component';
import { ProcessFeeYesNoComponent } from './process-fee-yes-no/process-fee-yes-no.component';
import { PsMarkupChargesComponent } from './markup-charges/list.component';
import { MarkupElementTransportComponent } from './markup-element-transport/markup-element-transport.component';
import { MarkupElementRebateComponent } from './markup-element-rebate/markup-element-rebate.component';
import { MarkupElementCccdComponent } from './markup-element-cccd/markup-element-cccd.component';
import { MarkupInnerDiaComponent } from './markup-inner-dia/markup-inner-dia.component';
import { MarkupSittingComponent } from './markup-sitting/markup-sitting.component';
import { MarkupHbpLrComponent } from './markup-hbp-lr/markup-hbp-lr.component';
import { MarkupJSFSComponent } from './markup-jsfs/markup-jsfs.component';
import { MarkupHBComponent } from './markup-hb/markup-hb.component';
import { LowerDifferenceComponent } from './lower-difference/lower-difference.component';
import { MarkupProcessComponent } from './markup-process/markup-process.component';
import { MarkupCoatingComponent } from './markup-coating/markup-coating.component';
import { MarkupSurfaceComponent } from './markup-surface/markup-surface.component';
import { MarkupPbComponent } from './markup-pb/markup-pb.component';
import { MarkupTtComponent } from './markup-tt/markup-tt.component';
import { MarkupPaperComponent } from './markup-paper/markup-paper.component';
import { MarkupGgComponent } from './markup-gg/markup-gg.component';

const routes: Routes = [
  { path: 'markup-element', component: MarkupElementComponent },
  { path: 'markup-element1', component: MarkupElement1Component },
  { path: 'markup-grade', component: MarkupGradeComponent },
  { path: 'markup-subsec', component: MarkupSubsecComponent },
  { path: 'markup-process', component: MarkupProcessComponent },
  { path: 'markup-bzfs', component: MarkupElement6Component },
  { path: 'markup-hbp-lr', component: MarkupHbpLrComponent },
  { path: 'process-fee-yes-no', component: ProcessFeeYesNoComponent },
  { path: 'base-price', component: BasePriceComponent },
  { path: 'markup-coating', component: MarkupCoatingComponent },
  { path: 'markup-charges', component: PsMarkupChargesComponent },
  { path: 'markup-ysfs', component: MarkupElementTransportComponent },
  { path: 'markup-rebate', component: MarkupElementRebateComponent },
  { path: 'markup-cccd', component: MarkupElementCccdComponent },
  { path: 'markup-inner-dia', component: MarkupInnerDiaComponent },
  { path: 'markup-sitting', component: MarkupSittingComponent },
  { path: 'markup-hb', component: MarkupHBComponent },
  { path: 'markup-jsfs', component: MarkupJSFSComponent },
  { path: 'markup-surface', component: MarkupSurfaceComponent },
  { path: 'markup-pb', component: MarkupPbComponent },
  { path: 'markup-tt', component: MarkupTtComponent },
  { path: 'markup-paper', component: MarkupPaperComponent },
  { path: 'markup-gg', component: MarkupGgComponent },
  { path: 'lower-difference', component: LowerDifferenceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkupRuleRoutingModule { }
