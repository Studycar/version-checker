import { Validators, ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * create by jianl
 * popu-select控件的验证器
 */
export function PopuSelectRequireValidator(propName: string): ValidatorFn {
  const v = Validators.required;
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log('popuSelectRequireValidator');
    const val = control[propName];
    console.log('popuSelectRequireValidator', val);
    return val ? null : { required: true };
  };
}
