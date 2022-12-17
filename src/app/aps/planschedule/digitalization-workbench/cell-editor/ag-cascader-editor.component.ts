import { Component, Input, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { NzCascaderComponent, NzCascaderOption } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-cascader-cell',
  template: `
    <nz-cascader #cascader 
      [(ngModel)]="values" 
      [nzChangeOn]="validate"
      [nzExpandTrigger]="'hover'" 
      [nzOptions]="options" 
      (ngModelChange)="onChanges($event)"
      (onKeyDown)="onChanges($event)"
      style="width:100%"> 
    </nz-cascader>`,
})
// tslint:disable-next-line:component-class-suffix
export class AgCascaderEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    public options: NzCascaderOption[];
    public values: string[];
    public params: ICellEditorParams;

    // private params: any;
    private cancelBeforeStart = false;
    private cancelAfterEnd = false;

    @ViewChild('cascader', {  static: true, read: ViewContainerRef }) public cascaderElement;
    @ViewChild('cascader', {  static: true }) public cascader: NzCascaderComponent;

    agInit(params: any): void {
      // this.params = params;
      this.values = [params.data.resourceCode, params.data.manufLineCode];
      this.options = params.options;
      this.params = params;
    }

    onChanges(values: any[]) {
      console.log('values', this.values);
      this.cancelAfterEnd = false;
      this.params.api.stopEditing();
    }

    // 只能选择叶子节点
    validate(option: NzCascaderOption, _index: number): boolean {
      return option.isLeaf;
    }

    getValue(): any {
      const resourceIndex = this.options.findIndex(o => o.value === this.values[0]);
      let manuCode = this.values[1];
      let manuName = '';
      for(let i = 0; i < this.options.length; i++) {
        if(manuName !== '') { break; }
        if(this.options[i].children && this.options[i].children.length > 0) {
          for(let j = 0; j < this.options[i].children.length; j++) {
            if(manuCode === this.options[i].children[j].value) {
              manuName = this.options[i].children[j].label;
              break;
            }
          }
        }
      }
      console.log('getSubmitValue', this.cascader);
      return [
        {
          value: this.values[0],
          label: this.options[resourceIndex].label,
        },
        {
          value: manuCode,
          label: manuName,
        },
      ];
    }

    isCancelBeforeStart(): boolean {
      return this.cancelBeforeStart;
    }

    isCancelAfterEnd(): boolean {
      return this.cancelAfterEnd;
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
      window.setTimeout(() => {
        this.cascaderElement.element.nativeElement.focus();
      });
    }
}
