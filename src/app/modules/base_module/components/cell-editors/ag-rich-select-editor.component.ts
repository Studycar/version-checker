import { Component, Input, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-rich-select-cell',
  template: `
    <nz-select #select nzShowSearch [(ngModel)]="value" style="width: 100%">
      <ng-container *ngIf="isShowValue">
        <nz-option nzCustomContent *ngFor="let o of options" [nzValue]="o.value" [nzLabel]="o.label">
          <div class="option-container">
            <div class="option-main">{{o[titleKey]}}</div>
            <div class="option-sub">{{o[subTitleKey]}}</div>
          </div>
        </nz-option>
      </ng-container>
      <ng-container *ngIf="!isShowValue">
        <nz-option nzCustomContent *ngFor="let o of options" [nzValue]="o.value" [nzLabel]="o.label">
          {{o.label}}
        </nz-option>
      </ng-container>
    </nz-select>`,
  styles: [
    `
      .option-container {
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .option-main {

      }
      .option-sub {
        color: rgba(0,0,0,.45);
      }
    `
  ]
})
// tslint:disable-next-line:component-class-suffix
export class AgRichSelectEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    public options: any[];

    // private params: any;
    public value: number;
    private cancelBeforeStart = false;
    public isShowValue: Boolean = true;
    public isShowTitle: Boolean = false;
    public title: string = '标题';
    public titleKey: string = 'value';
    public subTitle: string = '副标题';
    public subTitleKey: string = 'label';

    @ViewChild('select', {  static: true, read: ViewContainerRef }) public select;

    agInit(params: any): void {
      // this.params = params;
      this.value = params.value;
      this.options = params.options;
      if(params.isShowValue !== undefined && typeof params.isShowValue === 'boolean') {
        this.isShowValue = params.isShowValue;
      }
      if(params.isShowTitle !== undefined && typeof params.isShowTitle === 'boolean') {
        this.isShowTitle = params.isShowTitle;
      }
      if(params.titleKey !== undefined) {
        this.titleKey = params.titleKey;
      }
      if(params.subTitleKey !== undefined) {
        this.subTitleKey = params.subTitleKey;
      }
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

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
      window.setTimeout(() => {
        this.select.element.nativeElement.focus();
      });
    }
}
