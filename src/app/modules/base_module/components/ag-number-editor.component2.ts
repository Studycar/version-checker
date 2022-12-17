import { Component, Input, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { AppTranslationService } from '../../base_module/services/app-translation-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'numeric-cell2',
    template: `<nz-input-number [(ngModel)]="value" [nzMin]="inputParams.minValue" [nzMax]="inputParams.maxValue" [nzStep]="1" style="width:100%"></nz-input-number>`
})
// tslint:disable-next-line:component-class-suffix
export class AgNumberEditorComponent2 implements ICellEditorAngularComp, AfterViewInit {
    @Input() options: any[];
    public inputParams: AgNumberEditorInputParams;

    // private params: any;
    public value: number;
    private cancelBeforeStart = false;

    @ViewChild('input', {  static: true, read: ViewContainerRef }) public input;

    agInit(params: any): void {
        // this.params = params;
        this.value = params.value;
        this.inputParams = Object.assign({}, new AgNumberEditorInputParams(), params.inputParams);
        console.log('AgNumberEditorComponent:');
        console.log(this.inputParams);
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    isCancelAfterEnd(): boolean {
        return false;
    }

    onKeyDown(event): void {

    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }
}


/**
 * 输入参数
 */
export class AgNumberEditorInputParams {
    public maxValue: number = Number.MAX_VALUE; // 限制最大值
    public minValue: number = Number.MIN_VALUE; // 限制最小值
}
