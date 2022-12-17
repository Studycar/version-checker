import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonQueryService } from '../../generated_module/services/common-query.service';
/* 
author:liujian11
date:2018-08-20 
function:快码下拉框组件
使用方法：
<custom-select-lookup [valueObject]="valueObject" [valueField]="valueField"  [value]="value"  [width]="200" [lookupType]="'SYS_ENABLE_FLAG'" (getSelectOption)="getSelectOption($event)"></custom-select-lookup>
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-select-lookup',
  templateUrl: '../views/custom-select-lookup.html',
  providers: [CommonQueryService]
})
export class CustomSelectLookupComponent implements OnInit {

  @Input() public lookupType = 'FND_LANGUAGE'; // SYS_LANGUAGE
  @Input() public width: number;
  @Output() public getSelectOption = new EventEmitter<any>();

  public options: any[] = [];
  public selectValue: any;
  @Input() public valueObject: any;
  @Input() public valueField: string;
  @Input() set value(value: any) {
    if (this.selectValue !== value) {
      this.selectValue = value;
    }
  }
  get value(): any {
    return this.selectValue;
  }

  constructor(private commonQueryService: CommonQueryService) { }

  ngOnInit() {
    this.commonQueryService.GetLookupByType(this.lookupType).subscribe(result => {
      result.Extra.forEach(d => {
        this.options.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }

  change() {
    if (this.valueObject !== undefined && this.valueField !== undefined) {
      this.valueObject[this.valueField] = this.selectValue;
    }
    const option = this.options.find(op => op.value === this.selectValue);
    this.getSelectOption.emit(option);
  }
}

export class SelectOption {
  public value: string;
  public label: string;
}
