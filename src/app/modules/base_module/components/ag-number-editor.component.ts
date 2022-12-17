import { Component, Input, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { AppTranslationService } from '../../base_module/services/app-translation-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%">`
})
// tslint:disable-next-line:component-class-suffix
export class AgNumberEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    @Input() options: any[];

    // private params: any;
    private inputParams: AgNumberEditorInputParams;
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
        console.log('isCancelAfterEnd():');
        console.log(this.value);
        return !this.inputParams.charRegExpression.test(this.value.toString());
    }

    onKeyDown(event): void {
        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault) event.preventDefault();
        }
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which === 'undefined') ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
        return !!/\d/.test(charStr);
    }

    private isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        console.log('isKeyPressedNumeric:' + charCode);
        console.log(charCode);
        console.log(charCode === 8);
        if (charCode === 8) return true; // 删除键
        console.log('String.fromCharCode(charCode):' + String.fromCharCode(charCode));
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        return this.isCharNumeric(charStr);
    }
}


/**
 * 输入参数
 */
export class AgNumberEditorInputParams {
    public numberType: 'int' | 'float' = 'int'; // 默认为支持整型
    public maxValue: number = Number.MAX_VALUE; // 限制最大值
    public minValue: number = Number.MIN_VALUE; // 限制最小值
    public charPress = '1234567890.-'; // 只能输入的字符
    public charRegExpression = /^0|([1-9][0-9]*(.[0-9]+)?)$/; // 校验的正则表达式
}
