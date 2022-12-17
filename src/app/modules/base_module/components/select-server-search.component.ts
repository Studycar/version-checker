import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Optional, Output, SkipSelf, ViewChild } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs/Subject";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nz-select-server',
  templateUrl: '../views/select-server-search.component.html',
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
export class NzSelectServerComponent implements OnInit, AfterContentChecked {
  constructor(@SkipSelf() @Optional() private ngForm: NgForm, private commonQuery: PlanscheduleHWCommonService) {}

  @Input() value;
  @Input() nzDisabled: Boolean = false;
  @Input() required: Boolean = false;
  @Input() isShowValue: Boolean = true;
  @Input() name: string = '';
  isLoading: Boolean = false;
  searchValue: string = '';
  isSearchOver: Boolean = false;
  @Input() searchFunction: Function; // 查询数据的方法，返回Observable对象
  @Input() options: any[] = []; // 保存结果的数组

  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 10;

  @Input() labelField: string = '';
  @Input() valueField: string = '';
  @Input() isSelectedShowValue: Boolean = false; // 定义选择器内容是否显示value，默认显示label
  @ViewChild('selectedValue', {static:true}) model: NgModel; // 绑定输入框的NgModel
  @Output() ngModelChangeEvent = new EventEmitter<any>();
  getDataTerms = new Subject<string>();

  ngOnInit(): void {
    this.getDataTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.getDataList(term);
    })
    this.loadMore();
  }
  
  ngAfterViewInit() {
    if(this.ngForm) {
      this.ngForm.addControl(this.model);
    }
  }

  ngAfterContentChecked(): void {
    if(this.value !== this.searchValue) {
      this.searchValue = this.value;
      this.pageIndex = 1;
      this.loadMore();
    }
  }

  loadMore() {
    if(this.isSearchOver) { return; }
    this.isLoading = true;
    if(this.pageIndex === 1) {
      this.options.length = 0;
    }
    this.searchFunction(this.searchValue, this.pageIndex++, this.pageSize).subscribe(res => {
      this.isLoading = false;
      if(res.code === 200) {
        if(res.data.content && res.data.content.length > 0) {
          res.data.content.forEach(d => {
            this.options.push({
              label: d[this.labelField],
              value: d[this.valueField],
              ...d,
            })
          })
        } else {
          this.isSearchOver = true;
        }
      } else {
        this.pageIndex--;
      }
    })
  }

  getData(value: string) {
    this.getDataTerms.next(value);
  }

  getDataList(value: string): void {
    this.pageIndex = 1;
    this.searchValue = value;
    this.isSearchOver = false;
    this.loadMore();
  }

  ngModelChange(e) {
    const option = this.options.find(o => o.value === e);
    this.searchValue = e;
    let param: any = {
      label: option ? option.label : e,
      value: e,
    }
    if (option) {
      param = Object.assign({}, param, option)
    }
    this.ngModelChangeEvent.emit(param);

  }
}