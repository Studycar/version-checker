import { Component, Input, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'numeric-cell2',
    template: `<nz-input-number #input [(ngModel)]="value" (keydown)="onKeyDown($event)" style="width:100%"></nz-input-number>`
})
// tslint:disable-next-line:component-class-suffix
export class AgAntNumberEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    @Input() options: any[];

    public params: ICellEditorParams;
    public value: number;
    private cancelBeforeStart = false;
    private keyPressEnter = false;

    @ViewChild('input', {  static: true, read: ViewContainerRef }) public input: ViewContainerRef;
    inputEle; // 保存输入框最底部input元素

    agInit(params: ICellEditorParams): void {
        this.params = params;
        this.value = params.value;
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    onKeyDown(e) {
      const event = e || window.event;
      if(event.keyCode === 13) {
        this.keyPressEnter = true;
      }
    }

    isCancelAfterEnd(): boolean {
      if(!this.keyPressEnter) {
        this.value = this.inputEle.value;
      }
        return false;
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        window.setTimeout(() => {
          this.inputEle = this.input.element.nativeElement.children[1].children[0];
          this.inputEle.focus();
        });
    }
}
