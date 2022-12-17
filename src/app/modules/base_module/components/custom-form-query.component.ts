import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CustomBaseContext } from './custom-base-context.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NgForm } from '@angular/forms';

/*
author:liujian11
date:2018-07-31
function:查询区动态生成组件
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-formquery',
  templateUrl: '../views/custom-form-query.html',
  styles: [
    `
      .div-container {
        padding: 5px 0;
        background: #ffffff;
      }
      .form-css {
        margin-top: 0px;
        border-top: solid 5px rgb(217, 217, 217);
        background-color: rgb(248, 248, 2);
      }

      .content-title {
        border-style: none;
        background-color: rgb(248, 248, 248);
      }

      :host ::ng-deep .ant-calendar-picker {
        width: 100% !important;
      }
      .div-container >>> .ant-form-item-label {
        line-height: 40px;
      }
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
      ::ng-deep .multi-select > .ant-select-selection--multiple {
        max-height: 36px;
        overflow-x: hidden;
        overflow-y: scroll
      }
      ::ng-deep .multi-select > .ant-select-selection--multiple > .ant-select-arrow {
        right: 25px;
      }
    `,
  ],
  // styleUrls: ['../../../../assets/css/common.css']
})
export class CustomFormQueryComponent
  implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('f', { static: true }) f: NgForm;

  @Input() public queryParams: QueryParamObject = { defines: [], values: {} }; // [{field:'',titile:'',ui:{type:'select',options:''}}]
  @Input() public context: CustomBaseContext;
  /* 外部调用组件对象的上下文*/
  @Input() public showConditionCount = 2;
  /* 此属性无效 */
  @Input() public showSearchIcon = true;
  /* 显示搜索按钮 */
  @Input() public showSearchButton = true;
  /* 显示查询按钮 */
  @Input() public showResetButton = true;
  /* 显示重置按钮 */
  @Input() public showExpandButton = true;
  /* 显示搜索展开按钮 */
  @Input() public showExpandIcon = true;
  /* 此属性无效 */
  @Input() public labelWidth = 120;
  @Input() public itemStyle = { width: '265px' };
  /* 此属性无效 */
  @Input() public columnCount = 3;
  /** 是否启用工作台设置 */
  @Input() enableWBSetting = true;
  @Input() queryStyle = null;
  @Input() queryLeftStyle = null;
  @Input() afterSearchStyle = null;

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

  /** 控制工作台呈现 */
  visible;

  /**
   * 关闭工作台
   */
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
  expand = false; // 展开状态
  @Input() set expandForm(value: boolean) {
    this.expand = value;
    this.resetGridHeight();
  }

  get expandForm(): boolean {
    return this.expand;
  }

  // ngFrom表单的检验有效值
  get NgFormInvalid(): boolean | null {
    return (this.f && this.f.invalid) || null;
  }

  form_marginTop = 20;

  /* form和按钮工具栏的margin-top */

  constructor(public element: ElementRef, public render: Renderer) {
  }

  ngOnInit() {
    this.queryParams.defines.forEach(x => {
      this.formInvalid.push(false);
    });

    this.showExpandButton = this.showExpandIcon; // 搜索按钮隐藏隐藏
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    // this.attachMouseEvent();
  }

  // 点击搜索展开/收起
  searchExpand() {
    if (this.expand) {
      this.toCollapse();
    } else {
      this.toExpand();
    }
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
    if (
      eventSource !== undefined &&
      eventSource.ngModelChange !== undefined &&
      typeof eventSource.ngModelChange === 'function'
    ) {
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

  // 展开
  private toExpand() {
    // 非已展开状态
    if (!this.expand && !this.isFix) {
      this.expand = true;
      this.resetGridHeight();
      this.context.gridHeightS1 = 217;
      this.context.gridStyle = {
        x: this.context.gridWidth + 'px',
        y: this.context.gridHeightS1 + 'px',
      };
    }
  }

  // 收起
  private toCollapse() {
    // 已展开状态
    if (this.expand && !this.isFix) {
      this.expand = false;
      this.resetGridHeight();
      this.context.gridHeightS1 = 302;
      this.context.gridStyle = {
        x: this.context.gridWidth + 'px',
        y: this.context.gridHeightS1 + 'px',
      };
    }
  }

  // 去文本输入参数的前后空格
  private trimParams(params: any, historyObj = []) {
    params = params || '';
    if (params === '') return;
    for (const key in params) {
      if (params[key] || '' !== '') {
        switch (typeof params[key]) {
          case 'string':
            params[key] = params[key].replace(/(^\s*)|(\s*$)/g, '');
            break;
          case 'object':
            // 查询曾经遍历过的对象，看看是否会出现环
            const cycleArray = historyObj.find(it => {
              if (params === it) {
                console.log('trimParams方法出现死循环:');
                console.log(params);
                return true;
              }
              return false;
            });
            console.log('cycleArray');
            console.log(cycleArray);
            if (cycleArray) {
              return; // 出现环的时候，停止代码执行
            }
            historyObj.push(params);
            this.trimParams(params[key], historyObj);
            break;
        }
      }
    }
  }

  /* #queryForm height */
  private formHeight = 20;

  /* 重设grid height
   *   标题行 51px, 按钮占比 66px, 空白 20px， 页脚40px, span中除了表格之外的空白占24px,
   *   如果查询弹出项的最后一行的第一个元素是  查询按钮， 那么本行的高度为40px， 初次外其他的为52px,
   */
  private resetGridHeight() {
    if (this.context.gridHeightArg.topMargin) {
      /* 方法一：查询区一行行高粗算按39，不会闪烁 */
      const rows = Math.ceil(
        (this.queryParams.defines.length +
          (this.showSearchButton || this.showResetButton ? 1 : 0)) /
        this.columnCount,
      );
      if (
        (this.queryParams.defines.length +
          (this.showSearchButton || this.showResetButton ? 1 : 0)) %
        3 ===
        1
      ) {
        this.formHeight = rows * 52 + this.form_marginTop - 12;
      } else {
        this.formHeight = rows * 52 + this.form_marginTop;
      }
      if (this.expand) {
        this.context.setGridHeight({
          topMargin: this.context.gridHeightArg.topMargin + this.formHeight,
          bottomMargin: this.context.gridHeightArg.bottomMargin,
        });
      } else {
        this.context.setGridHeight({
          topMargin: this.context.gridHeightArg.topMargin - this.formHeight,
          bottomMargin: this.context.gridHeightArg.bottomMargin,
        });
      }
      /* 方法二：查询区高度精算，但会闪烁 */
      /*     const that = this;
          setTimeout(function () {
            const form = document.querySelector('#queryForm');
            that.formHeight = form !== null ? form.clientHeight : that.formHeight;
            if (that.expand) {
              that.context.setGridHeight({ topMargin: that.context.gridHeightArg.topMargin + that.formHeight + that.form_marginTop, bottomMargin: that.context.gridHeightArg.bottomMargin });
            } else {
              that.context.setGridHeight({ topMargin: that.context.gridHeightArg.topMargin - that.formHeight - that.form_marginTop, bottomMargin: that.context.gridHeightArg.bottomMargin });
            }
          }, 0); */
    }
  }

  rootContainer: any; // 最外层容器
  divContainer: any; // form外层容器
  // 添加鼠标移入和移出事件
  private attachMouseEvent() {
    this.divContainer = this.element.nativeElement.querySelector(
      '#divContainer',
    );
    /*   this.rootContainer = this.element.nativeElement.querySelector('#rootContainer');
      if (this.rootContainer !== undefined && this.rootContainer !== null) {
        this.render.listen(this.rootContainer, 'mouseout', (event) => { this.mouseOut(event); });
      } */

    const expandButton = this.element.nativeElement.querySelector(
      '#expandButton',
    );
    if (expandButton !== undefined && expandButton !== null) {
      this.render.listen(expandButton, 'mouseover', event => {
        this.mouseOver(event);
      });
    }
  }

  // 鼠标移入
  private mouseOver(event: any) {
    this.toExpand();
  }

  // 鼠标移出
  private mouseOut(event: any) {
    // 鼠标移出form时收起
    if (!this.divContainer.contains(event.srcElement)) {
      this.toCollapse();
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
    设置: this.anthorPath + '基础icon-工作台设置.svg',
    工单例外: this.baseImgPath + '工单例外.png',
  };

  onPopupSelectTextChanged(event: any) {
    this.popupSelectTextChangedEvent.emit(event);
  }

  formatterPrecision = (value) => value;
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
  public popOptions?: any; // 弹出选择、树形选择使用、对象
  public selection?: any[]; // 树形选择使用
  public keyField?: string; // 树形选择使用
  public valueField?: string; // 弹出选择、树形选择使用
  public textField?: string; // 弹出选择、树形选择使用
  public selectValueField?: string; // 远程搜索、value
  public selectLabelField?: string; // 远程搜索、label
  public isSelectedShowValue?: boolean=false; // 远程搜索、选择器显示内容，false默认为label
  public searchFunction?: Function; // 远程搜索、搜索函数，返回Observable
  public valueLevel?: number; // 树形选择使用
  public eventNo?: number; // 值变更事件序号
  public extraEvent?: ExtraEvent; // 其他的事件序号（多事件的控件，如弹出选择）
  public extObject?: any;
  public hidden?: boolean; // 可以根据自定义条件决定是否显示
  public precision?: number; // 数字框：自定义小数位
  public formatter?: Function; // 数字框：格式化显示
  public showValue?: boolean; // 下拉框是否显示value
}

export class ExtraEvent {
  RowSelectEventNo?: number; // 弹出选择的行选中事件序号
  TextChangedEventNo?: number; // 弹出选择的文本变化事件序号
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
  yearPicker: '13', // yyyy
  checkboxMultiple: '14',
  blank: '15', //占位符
  selectServer: '16', //远程搜索框
  number: '17', //数字框
};
