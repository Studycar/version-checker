import { Component, Input } from '@angular/core';
import { FormFieldBaseComponent } from './form-field-base.component';
import { AppTranslationService } from '../../base_module/services/app-translation-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'm-form-dropdown',
    templateUrl: '../views/form-dropdown.html'
})
export class FormDropdownComponent extends FormFieldBaseComponent {
    @Input() options: any[];

    datas: any[] = [{ id: '1', value: 'base', text: '应用程序对象库'}, { id: '2', value: 'base', text: '应用程序对象库'}];

    constructor(appTranslationService: AppTranslationService) {
        super(appTranslationService);
    }
}
