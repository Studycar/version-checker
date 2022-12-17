import { Component, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'number-cell',
  template: `<input #input type="number" (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%; height: 30px;">`
})
export class NumberInputEditorComponent implements ICellEditorAngularComp, AfterViewInit {

  private charRegExpression = /^0|([1-9][0-9]*(.[0-9]+)?)$/;
  public value: number;
  private cancelBeforeStart = false;

  @ViewChild('input', {  static: true, read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.value = params.value;
  }

  getValue(): any {
    return this.value;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  isCancelAfterEnd(): boolean {
    if (!this.value) return true;
    return !this.charRegExpression.test(this.value.toString());
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
    if (charCode === 8) return true; // 删除键
    if (charCode === 16) return true; // shift键，中英文切换
    if (charCode === 190) return true; // 小数点
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }
}
