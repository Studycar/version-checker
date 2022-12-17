import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkupRuleRoutingModule } from './markup-rule-routing.module';
import { MarkupElementComponent } from './markup-element/markup-element.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BaseModule } from 'app/modules/base_module/base.module';
import { MarkupElementEditComponent } from './markup-element/edit/edit.component';
import { MarkupElementImportComponent } from './markup-element/import/import.component';
import { ProcessFeeYesNoEditComponent } from './process-fee-yes-no/edit/edit.component';
import { ProcessFeeYesNoImportComponent } from './process-fee-yes-no/import/import.component';
import { ProcessFeeYesNoComponent } from './process-fee-yes-no/process-fee-yes-no.component';
import { BasePriceComponent } from './base-price/base-price.component';
import { BasePriceEditComponent } from './base-price/edit/edit.component';
import { BasePriceImportComponent } from './base-price/import/import.component';
import { MarkupElement1Component } from './markup-element1/markup-element1.component';
import { MarkupElement1EditComponent } from './markup-element1/edit/edit.component';
import { MarkupElement1ImportComponent } from './markup-element1/import/import.component';
import { MarkupGradeEditComponent } from './markup-grade/edit/edit.component';
import { MarkupGradeImportComponent } from './markup-grade/import/import.component';
import { MarkupGradeComponent } from './markup-grade/markup-grade.component';
import { MarkupSubsecEditComponent } from './markup-subsec/edit/edit.component';
import { MarkupSubsecImportComponent } from './markup-subsec/import/import.component';
import { MarkupSubsecComponent } from './markup-subsec/markup-subsec.component';
import { MarkupElement6EditComponent } from './markup-bzfs/edit/edit.component';
import { MarkupElement6ImportComponent } from './markup-bzfs/import/import.component';
import { MarkupElement6Component } from './markup-bzfs/markup-bzfs.component';
import { PsMarkupChargesComponent } from './markup-charges/list.component';
import { PsMarkupChargesEditComponent } from './markup-charges/edit/edit.component';
import { MarkupElementTransportComponent } from './markup-element-transport/markup-element-transport.component';
import { MarkupElementTransportEditComponent } from './markup-element-transport/edit/edit.component';
import { MarkupElementTransportImportComponent } from './markup-element-transport/import/import.component';
import { MarkupElementRebateComponent } from './markup-element-rebate/markup-element-rebate.component';
import { MarkupElementRebateEditComponent } from './markup-element-rebate/edit/edit.component';
import { MarkupElementRebateImportComponent } from './markup-element-rebate/import/import.component';
import { MarkupElementCccdComponent } from './markup-element-cccd/markup-element-cccd.component';
import { MarkupElementCccdEditComponent } from './markup-element-cccd/edit/edit.component';
import { MarkupElementCccdImportComponent } from './markup-element-cccd/import/import.component';
import { MarkupInnerDiaEditComponent } from './markup-inner-dia/edit/edit.component';
import { MarkupInnerDiaImportComponent } from './markup-inner-dia/import/import.component';
import { MarkupInnerDiaComponent } from './markup-inner-dia/markup-inner-dia.component';
import { MarkupSittingEditComponent } from './markup-sitting/edit/edit.component';
import { MarkupSittingImportComponent } from './markup-sitting/import/import.component';
import { MarkupSittingComponent } from './markup-sitting/markup-sitting.component';
import { MarkupHbpLrEditComponent } from './markup-hbp-lr/edit/edit.component';
import { MarkupHbpLrComponent } from './markup-hbp-lr/markup-hbp-lr.component';
import { MarkupHbpLrImportComponent } from './markup-hbp-lr/import/import.component';
import { MarkupHBEditComponent } from './markup-hb/edit/edit.component';
import { MarkupHBImportComponent } from './markup-hb/import/import.component';
import { MarkupHBComponent } from './markup-hb/markup-hb.component';
import { MarkupJSFSImportComponent } from './markup-jsfs/import/import.component';
import { MarkupJSFSEditComponent } from './markup-jsfs/edit/edit.component';
import { MarkupJSFSComponent } from './markup-jsfs/markup-jsfs.component';
import { LowerDifferenceComponent } from './lower-difference/lower-difference.component';
import { LowerDifferenceEditComponent } from './lower-difference/edit/edit.component';
import { LowerDifferenceImportComponent } from './lower-difference/import/import.component';
import { MarkupProcessEditComponent } from './markup-process/edit/edit.component';
import { MarkupProcessImportComponent } from './markup-process/import/import.component';
import { MarkupProcessComponent } from './markup-process/markup-process.component';
import { MarkupCoatingEditComponent } from './markup-coating/edit/edit.component';
import { MarkupCoatingImportComponent } from './markup-coating/import/import.component';
import { MarkupCoatingComponent } from './markup-coating/markup-coating.component';
import { MarkupSurfaceEditComponent } from './markup-surface/edit/edit.component';
import { MarkupSurfaceImportComponent } from './markup-surface/import/import.component';
import { MarkupSurfaceComponent } from './markup-surface/markup-surface.component';
import { MarkupPbEditComponent } from './markup-pb/edit/edit.component';
import { MarkupPbImportComponent } from './markup-pb/import/import.component';
import { MarkupPbComponent } from './markup-pb/markup-pb.component';
import { MarkupTtEditComponent } from './markup-tt/edit/edit.component';
import { MarkupTtImportComponent } from './markup-tt/import/import.component';
import { MarkupTtComponent } from './markup-tt/markup-tt.component';
import { MarkupPaperEditComponent } from './markup-paper/edit/edit.component';
import { MarkupPaperImportComponent } from './markup-paper/import/import.component';
import { MarkupPaperComponent } from './markup-paper/markup-paper.component';
import { MarkupGgEditComponent } from './markup-gg/edit/edit.component';
import { MarkupGgImportComponent } from './markup-gg/import/import.component';
import { MarkupGgComponent } from './markup-gg/markup-gg.component';

const COMPONENTS = [
  MarkupElementComponent,
  ProcessFeeYesNoComponent,
  BasePriceComponent,
  MarkupElement1Component,
  MarkupGradeComponent,
  MarkupSubsecComponent,
  MarkupProcessComponent,
  MarkupElement6Component,
  MarkupCoatingComponent,
  PsMarkupChargesComponent,
  MarkupElementTransportComponent,
  MarkupElementRebateComponent,
  MarkupElementCccdComponent,
  MarkupInnerDiaComponent,
  MarkupSittingComponent,
  MarkupHbpLrComponent,
  MarkupHBComponent,
  MarkupJSFSComponent,
  LowerDifferenceComponent,
  MarkupSurfaceComponent,
  MarkupPbComponent,
  MarkupTtComponent,
  MarkupPaperComponent,
  MarkupGgComponent,
];

const COMPONENTS_NOROUNT = [
  MarkupElementEditComponent,
  MarkupElementImportComponent,
  ProcessFeeYesNoEditComponent,
  ProcessFeeYesNoImportComponent,
  BasePriceEditComponent,
  BasePriceImportComponent,
  MarkupElement1EditComponent,
  MarkupElement1ImportComponent,
  MarkupGradeEditComponent,
  MarkupGradeImportComponent,
  MarkupSubsecEditComponent,
  MarkupSubsecImportComponent,
  MarkupProcessEditComponent,
  MarkupProcessImportComponent,
  MarkupElement6EditComponent,
  MarkupElement6ImportComponent,
  MarkupCoatingEditComponent,
  MarkupCoatingImportComponent,
  PsMarkupChargesEditComponent,
  MarkupElementTransportEditComponent,
  MarkupElementTransportImportComponent,
  MarkupElementRebateEditComponent,
  MarkupElementRebateImportComponent,
  MarkupElementCccdEditComponent,
  MarkupElementCccdImportComponent,
  MarkupInnerDiaEditComponent,
  MarkupInnerDiaImportComponent,
  MarkupSittingEditComponent,
  MarkupSittingImportComponent,
  MarkupHbpLrEditComponent,
  MarkupHbpLrImportComponent,
  MarkupHBEditComponent,
  MarkupHBImportComponent,
  MarkupJSFSEditComponent,
  MarkupJSFSImportComponent,
  LowerDifferenceEditComponent,
  LowerDifferenceImportComponent,
  MarkupSurfaceEditComponent,
  MarkupSurfaceImportComponent,
  MarkupPbEditComponent,
  MarkupPbImportComponent,
  MarkupTtEditComponent,
  MarkupTtImportComponent,
  MarkupPaperEditComponent,
  MarkupPaperImportComponent,
  MarkupGgEditComponent,
  MarkupGgImportComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    FormsModule,
    MarkupRuleRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  exports: [...COMPONENTS],
  entryComponents: COMPONENTS_NOROUNT,
})
export class MarkupRuleModule { }
