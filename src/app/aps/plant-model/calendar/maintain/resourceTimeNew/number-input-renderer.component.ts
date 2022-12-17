import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'number-input-renderer',
  template: `<nz-input-number [nzPrecision]="0" [nzMin]="0" [nzMax]="100" [(ngModel)]="value" style="width: 100%; height: 30px;"></nz-input-number>`,
})
export class NumberInputRendererComponent implements ICellRendererAngularComp {

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
    if (!this.value && this.value !== 0) return true;
    return false;
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
    return !!/\d+/.test(charStr);
  }

  private isKeyPressedNumeric(event): boolean {
    const charCode = this.getCharCodeFromEvent(event);
    if (charCode === 8) return true; // 删除键
    if (charCode === 16) return true; // shift键，中英文切换
    if (charCode === 190) return true; // 小数点
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }
  value: number;

  refresh(params: any): boolean {
    return true;
  }

}
