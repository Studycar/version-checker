import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppTranslationService } from '../../base_module/services/app-translation-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'm-form-submit-button',
    templateUrl: '../views/form-submit-button.html'
})
export class FormSubmitButtonComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() displayName: string;
    @Input() leftGridWidth = 0;
    @Input() selfGridWidth = 12;
    @Input() isSubmitting: any;
    translatedDisplayName: string;

    constructor(private appTranslationService: AppTranslationService) {

    }

    ngOnInit() {
        this.translatedDisplayName = this.appTranslationService.translate(this.displayName || 'Submit');
    }
}
