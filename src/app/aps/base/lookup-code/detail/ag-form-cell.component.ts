import { Component } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'ag-form-cell',
  template: `
    <div *ngIf="formGroup" [formGroup]="formGroup">
      <ag-span [formControlName]="formControlName" *ngIf="formControl.valid;else tipsBlock"></ag-span>
      <ng-template #tipsBlock><span class="invalidClass">{{tips}}</span></ng-template>
    </div>`,
  styles: [`
    .invalidClass {
      color: red;
    }
  `],
})
export class AgFormCellComponent implements ICellRendererAngularComp {
  formGroup: FormArray;
  formControlName: string;
  formControl: AbstractControl;
  tips: string;

  agInit(params: any) {
    this.formControlName = params.column.colId;
    this.formGroup = params.context.agFormGroup.controls[params.data.uuid];
    this.tips = params.context.validatedRule[params.column.colId] && params.context.validatedRule[params.column.colId].tips;
    if (this.formGroup) {
      this.formControl = this.formGroup.get(this.formControlName);
      this.formControl.patchValue(params.value);
    }
  }

  refresh(params: any): boolean {
    this.formGroup = params.context.agFormGroup.controls[params.data.uuid];
    this.tips = params.context.validatedRule[params.column.colId] && params.context.validatedRule[params.column.colId].tips;

    this.formControl = this.formGroup.get(this.formControlName);
    this.formControl.patchValue(params.value);

    return true;
  }
}
