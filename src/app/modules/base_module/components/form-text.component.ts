import { Component } from '@angular/core';
import { FormFieldBaseComponent } from './form-field-base.component';
import { AppTranslationService } from '../../base_module/services/app-translation-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'm-form-text',
    templateUrl: '../views/form-text.html'
})
export class FormTextComponent extends FormFieldBaseComponent {
    constructor(appTranslationService: AppTranslationService) {
        super(appTranslationService);
    }
}
