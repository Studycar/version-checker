import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAddOnModule, NzNoAnimationModule, NzPipesModule } from 'ng-zorro-antd/core';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzModalControlServiceModule } from 'ng-zorro-antd/modal';

import { ModalService } from './modal.service';
import { ModalPlusService } from './modal-plus.service';

import { FlexibleModalComponent } from './flexible-modal/flexible-modal.component';
import { FlexibleSizeDirective } from './flexible-size.directive';
import { ModalPlusHeaderDirective } from './modal-plus-header.directive';
import { ModalPlusFooterDirective } from './modal-plus-footer.directive';

const components = [
  FlexibleModalComponent,
];

const directives = [
  FlexibleSizeDirective,
  ModalPlusHeaderDirective,
  ModalPlusFooterDirective,
];

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    DragDropModule,
    NzAddOnModule,
    NzI18nModule,
    NzButtonModule,
    NzIconModule,
    NzPipesModule,
    NzNoAnimationModule,
    NzModalControlServiceModule,
  ],
  declarations: [
    ...components,
    ...directives,
  ],
  entryComponents: [
    ...components,
  ],
  providers: [
    ModalService,
    ModalPlusService,
  ],
  exports: [
    ...directives,
  ]
})
export class ModalPlusModule { }
