import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges, ViewChild,
} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from '../custom-base-context.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'custom-form-queries',
  templateUrl: './custom-form-queries.component.html',
  styleUrls: ['./custom-form-queries.component.less'],
})
export class CustomFormQueriesComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('f', { static: true }) f: NgForm;

  @Input() public queryParams: QueryParamObject; // [{field:'',titile:'',ui:{type:'select',options:''}}]
  /* 外部调用组件对象的上下文*/
  @Input() public context: CustomBaseContext;
  /* 此属性无效 */
  @Input() public showConditionCount = 2;
  /* 显示查询按钮 */
  @Input() public showSearchButton = true;
  /* 显示重置按钮 */
  @Input() public showResetButton = true;
  /* 显示搜索展开按钮 */
  @Input() public showExpandButton = true;
  /* 此属性无效 */
  @Input() public showExpandIcon = true;
  /* 此属性无效 */
  @Input() public itemStyle = { width: '265px' };
  /* 一行列数 */
  @Input() public columnCount = 2;
  baseColumnbWidth = 160;
  verticalWidth = 320;

  /** 是否启用工作台设置 */
  @Input() enableWBSetting = true;

  @Output() public event1 = new EventEmitter<any>();
  @Output() public event2 = new EventEmitter<any>();
  @Output() public event3 = new EventEmitter<any>();
  @Output() public event4 = new EventEmitter<any>();
  @Output() public event5 = new EventEmitter<any>();
  @Output() public event6 = new EventEmitter<any>();
  @Output() public event7 = new EventEmitter<any>();
  @Output() public event8 = new EventEmitter<any>();
  @Output() public event9 = new EventEmitter<any>();
  @Output() public event10 = new EventEmitter<any>();
  @Output() public event11 = new EventEmitter<any>();
  @Output() public event12 = new EventEmitter<any>();
  @Output() public event13 = new EventEmitter<any>();
  @Output() public event14 = new EventEmitter<any>();
  @Output() public event15 = new EventEmitter<any>();
  @Output() public popupSelectTextChangedEvent = new EventEmitter<any>();

  visible;

  closePopUp() {
    this.visible = false;
    setTimeout(() => {
      this.visible = undefined;
    });
  }

  formInvalid = []; // 表单无效，控制查询按钮是否可用
  getFormInvalid(): boolean {
    let invalid = false;
    this.formInvalid.forEach(x => {
      invalid = invalid || x;
    });
    return invalid;
  }

  isFix = false; // 固定状态

  // ngFrom表单的检验有效值
  get NgFormInvalid(): boolean | null {
    return this.f && this.f.invalid || null;
  }


  constructor(
    public element: ElementRef,
    public render: Renderer2) {
  }

  ngOnInit() {
    this.queryParams.defines.forEach(x => {
      this.formInvalid.push(false);
    });
    this.columnCount = Math.ceil(this.queryParams.defines.length / 3);
    this.verticalWidth = this.baseColumnbWidth * this.columnCount;
    this.showExpandButton = this.showExpandIcon;  // 搜索按钮隐藏隐藏
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    // this.attachMouseEvent();
  }


  // 查询
  query() {
    this.trimParams(this.queryParams.values);
    this.context.query();
    // 收起查询区
    // this.toCollapse();
  }

  // 重置
  clear() {
    this.context.clear();
  }

  // 值变更事件
  change(value: any, eventNo: number, eventSource?: any) {
    // add by jianl，增加事件直接回调的方法
    if (eventSource !== undefined &&
      eventSource.ngModelChange !== undefined &&
      typeof (eventSource.ngModelChange) === 'function') {
      eventSource.ngModelChange.call(this.context, value);
    }
    if (eventNo !== undefined && eventNo !== null) {
      switch (eventNo) {
        case 1:
          this.event1.emit(value);
          break;
        case 2:
          this.event2.emit(value);
          break;
        case 3:
          this.event3.emit(value);
          break;
        case 4:
          this.event4.emit(value);
          break;
        case 5:
          this.event5.emit(value);
          break;
        case 6:
          this.event6.emit(value);
          break;
        case 7:
          this.event7.emit(value);
          break;
        case 8:
          this.event8.emit(value);
          break;
        case 9:
          this.event9.emit(value);
          break;
        case 10:
          this.event10.emit(value);
          break;
        case 11:
          this.event11.emit(value);
          break;
        case 12:
          this.event12.emit(value);
          break;
        case 13:
          this.event13.emit(value);
          break;
        case 14:
          this.event14.emit(value);
          break;
        case 15:
          this.event15.emit(value);
          break;
      }
    }
  }

  // 去文本输入参数的前后空格
  private trimParams(params: any) {
    params = params || '';
    if (params === '') return;
    for (const key in params) {
      if (params[key] || '' !== '') {
        switch (typeof (params[key])) {
          case 'string':
            params[key] = params[key].replace(/(^\s*)|(\s*$)/g, '');
            break;
          case 'object':
            this.trimParams(params[key]);
            break;
        }
      }
    }
  }

  public baseImgPath = '/assets/imgs/planSchedule/'; // ../../../../assets/imgs/planSchedule/
  public anthorPath = '/assets/imgs/base-icon/';
  // 功能图片
  public Img = {
    产能平衡: this.baseImgPath + '1.svg',
    工单联动: this.baseImgPath + '2.svg',
    上层联动: this.baseImgPath + '上层联动.png',
    工作日历: this.baseImgPath + '3.svg',
    固定时间: this.baseImgPath + '4.svg',
    集约选线: this.baseImgPath + '5.svg',
    排产刷新: this.baseImgPath + '6.svg',
    批量资源调整: this.baseImgPath + '7.svg',
    搜索: this.baseImgPath + '8.svg',
    备注保存: this.baseImgPath + '9.svg',
    备注保存_不可用: this.baseImgPath + '9_un.svg',
    置尾单: this.baseImgPath + '10.svg',
    调整保存: this.baseImgPath + '11.svg',
    调整保存_不可用: this.baseImgPath + '11_un.svg',
    工单族: this.baseImgPath + '工单族.svg',
    工单组件: this.baseImgPath + '工单组件.svg',
    排产表: this.baseImgPath + '排产表.svg',
    计划发布: this.baseImgPath + '计划发布.svg',
    导出: this.baseImgPath + '基础icon-导出@1x.svg',
    新增: this.baseImgPath + '基础icon-新增.svg',
    删除: this.baseImgPath + '基础icon-删除.svg',
    查询: this.anthorPath + '基础icon-查询.svg',
  };

  onPopupSelectTextChanged(event: any) {
    this.popupSelectTextChangedEvent.emit(event);
  }
}

export class QueryParamObject {
  public defines: QueryParamDefineObject[];
  public values: any;
  public extObject?: any;
}

export class QueryParamDefineObject {
  public field: string;
  public title: string;
  public readonly?: boolean;
  public required?: boolean;
  public ui?: QueryParamDefineUiObject;
  public extObject?: any;
}

export class QueryParamDefineUiObject {
  public type: string;
  public options?: any[]; // 下拉选择使用
  // // tslint:disable-next-line:no-inferrable-types
  // public optionsLabel?: string = 'label'; // option的label
  // // tslint:disable-next-line:no-inferrable-types
  // public optionsValue?: string = 'value'; // option的label
  public gridView?: GridDataResult; // 弹出选择使用
  public columns?: any[]; //  弹出选择、树形选择使用
  public selection?: any[]; // 树形选择使用
  public keyField?: string; // 树形选择使用
  public valueField?: string; // 弹出选择、树形选择使用
  public textField?: string; // 弹出选择、树形选择使用
  public valueLevel?: number; // 树形选择使用
  public eventNo?: number;    // 值变更事件序号
  public extraEvent?: ExtraEvent; // 其他的事件序号（多事件的控件，如弹出选择）
  public extObject?: any;
}

export class ExtraEvent {
  RowSelectEventNo?: number; // 弹出选择的行选中事件序号
  ScrollEventNo?: number; // 下拉选择的滚动事件序号
  SearchEventNo?: number; // 下拉选择的模糊查询事件序号
}

export const UiType = {
  string: '0',
  text: '0',
  select: '1',
  date: '2',
  checkbox: '3',
  datetime: '4',
  treeSelect: '5',
  popupSelect: '6',
  dateRange: '7',
  dateTimeRange: '8',
  selectMultiple: '9',
  scrollSelect: '10',
  monthPicker: '11', // yyyy-MM
  textarea: '12',
};

export const UIType = {
  STRING: '0',
  TEXT: '0',
  SELECT: '1',
  DATE: '2',
  CHECKOUT: '3',
  DATE_TIME: '4',
  TREE_SELECT: '5',
  POPUP_SELECT: '6',
  DATE_RANGE: '7',
  DATETIME_RANGE: '8',
  SELECT_MULTIPLE: '9',
  SCROLL_SELECT: '10',
  MONTH_PICKER: '11', // yyyy-MM
  TEXT_AREA: '12',
};

