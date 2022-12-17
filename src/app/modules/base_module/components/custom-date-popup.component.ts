import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { formatDate } from '@telerik/kendo-intl';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'custom-date-popup',
    template: `<nz-date-picker #Date
            nzFormat="yyyy-MM-dd HH:mm:ss"
            [(ngModel)]="currentDate"
            name="currentDate"></nz-date-picker>`,
    styles: [``]
})
export class CustomDatePopupComponent implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public currentDate: Date;

    @ViewChild('Date', { static: true, read: ViewContainerRef }) public Date;

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.Date.element.nativeElement.focus();
        });
    }

    agInit(params: any): void {
        this.params = params;
        this.currentDate = new Date(this.params.value);
    }

    isPopup(): boolean {
        return true;
    }

    getValue() {
        const str1 = formatDate(this.currentDate, 'yyyy-MM-dd HH:mm:ss');
        return str1;
    }

}
