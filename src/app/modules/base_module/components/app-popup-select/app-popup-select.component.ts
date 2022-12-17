import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { ConnectedPosition, Overlay, ScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-popup-select',
  templateUrl: './app-popup-select.component.html',
  styleUrls: ['./app-popup-select.component.less']
})
export class AppPopupSelectComponent implements OnInit {
  cancelBubble = false;
  show = false;
  SearchValue: string;
  Id: string;
  lastColumnName: string;
  sort: SortDescriptor[] = [];
  kendoStyle: any = { width: '650px' };

  positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  ];
  scrollStrategy: ScrollStrategy = this.overlay.scrollStrategies.reposition();

  @Input() readOnly = false;
  @Input() Disabled = false;
  @Input() nzStyle = { width: '100%' };
  @Input() TextField: string;
  @Input() ValueField: string;
  @Input() gridView: GridDataResult;
  @Input() columns: any[] = [];
  @Input() nzLoading: Boolean = false; // create by jianl
  @Input() nzSearchNull: Boolean = false; // create by liuwei232
  @Input() required: Boolean = false;

  @Output() SearchEvent = new EventEmitter<any>();
  @Output() TextChanged = new EventEmitter<any>();
  @Output() RowSelect = new EventEmitter<any>();

  // add by jianl 2018-10-29，增加双向绑定属性，方便使用（原来存在这两个属性，但是不支持双向绑定）
  @Input() SelectText: string;
  @Output() SelectTextChange = new EventEmitter();
  @Input() SelectValue: string;
  @Output() SelectValueChange = new EventEmitter();
  @Output() PopupEvent = new EventEmitter<any>(); // add by jianl 2018-10-29，弹出事件，窗口show出来的时候回调的事件
  // end add by jianl

  // 定义控件宽度
  kendoHeight = 250;
  kendoMaxHeight = 320;
  otherHeight = 72;

  public mySelection: string[] = [];
  public pageSize = 10;
  public skip = 0;
  // MousedownListener: () => void;

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    // this.setMousedownListener();
    if (this.columns === undefined || this.columns === null || this.columns.length === 0) return;
    this.lastColumnName = this.columns[this.columns.length - 1].field;

    let kendoWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      kendoWidth = kendoWidth + Number(this.columns[i].width);
    }
    kendoWidth = kendoWidth > 650 ? 650 : kendoWidth;
    kendoWidth = kendoWidth < 500 ? 500 : kendoWidth;
    this.kendoStyle.width = kendoWidth + 'px';
  }

  @ViewChild('anchor', {static: false}) public anchor: ElementRef;
  @ViewChild('popup', { static: false, read: ElementRef }) public popup: ElementRef;

  public keydown(event: KeyboardEvent): void {
    // 按esc健 退出
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  // 给document注册click事件
  @HostListener('document:click', ['$event'])
  protected documentClick(event: any): void {
    // 如果是点击的放大镜显示下拉选择窗体时不执行下面代码
    if (!this.cancelBubble && !this.contains(event.target)) {
      this.toggle(false);
    }
    this.cancelBubble = false;
  }

  protected toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  protected contains(target: any): boolean {
    return this.popup ? this.popup.nativeElement.contains(target) : false;
  }

  @Input()
  public set Value(value: string) {
    this.SelectValue = value || '';
  }

  public get Value(): string {
    return this.SelectValue === undefined ? '' : this.SelectValue;
  }

  @Input()
  public set Text(text: string) {
    this.SelectText = text || '';
  }

  public get Text(): string {
    return this.SelectText === undefined ? '' : this.SelectText;
  }

  @Input()
  public set ID(id: string) {
    this.Id = id || '';
  }

  public get ID(): string {
    return this.Id || '';
  }

  protected calcGridViewHeight(e: any) {
    const clientY = e.clientY;
    const offsetY = e.offsetY;

    // 计算触发元素上边缘到顶部距离
    const topY = clientY - offsetY;
    // 计算触发元素下边缘到底部距离
    const bottomY = document.body.clientHeight - clientY - (24 - offsetY);

    // 触发元素下边缘到底部的距离是满足控件最大高度 this.kendoMaxHeight + this.otherHeight
    // 或者下边缘到底部距离大于上边缘到顶部距离则控件向下展示 否则向上展示
    if (bottomY >= this.kendoMaxHeight + this.otherHeight || bottomY > topY) {
      this.kendoHeight = bottomY - this.otherHeight;
    } else {
      this.kendoHeight = topY - this.otherHeight;
    }
    // 计算网格高度大于预计高度,则取预计高度，否则取实际高度
    this.kendoHeight = this.kendoHeight > this.kendoMaxHeight ? this.kendoMaxHeight : this.kendoHeight;
  }

  public SelectPopup(e: any) {
    if (!this.anchor.nativeElement.contains(e.target)) {
      if (!this.Disabled) {
        this.toggle();
        if (this.show) {
          // 计算网格高度
          this.calcGridViewHeight(e);
          // 赋值到查询框
          this.SearchValue = this.SelectText;
          // 初始化选中状态
          this.mySelection = [];
          // 如果查询框有值则进行查询操作。避免选中了一行记录后 点击下一页没有记录的情况
          if ((this.SearchValue !== '' && this.SearchValue !== null && this.SearchValue !== undefined) || this.nzSearchNull) {
            this.Search();
          }
          // add by jianl 2018-10-29
          // mid by liuwei232 2021-06-04 添加SelectText为空时是否自动搜索的判断
          this.PopupEvent.emit({
            sender: this,
            SearchValue: this.SearchValue || '',
            PageSize: this.pageSize,
            Skip: this.skip
          });
        }
      }
      this.cancelBubble = true;
    }
  }

  // 清除
  public Clear() {
    this.SearchValue = '';
  }

  // 查询
  public Search() {
    this.skip = 0;
    const Params = {
      sender: this,
      SearchValue: this.SearchValue || '',
      PageSize: this.pageSize,
      Skip: this.skip
    };
    this.SearchEvent.emit(Params);
  }

  // 文本值改变
  public onChange(e: any) {
    if (this.SelectText === '' || this.SelectText !== null || this.SelectText !== undefined) {
      this.SelectValue = '';
    }
    // add by jianl 2018-10-31（可以根据需求扩展old值的传出），这段代码一定要放在事件抛出之前回到，这样在事件的方法内部就可以获取到双向绑定的值了
    this.SelectValueChange.emit(this.SelectValue);
    this.SelectTextChange.emit(this.SelectText);
    // end add by jianl

    this.TextChanged.emit({ sender: this, event: e, Text: this.SelectText || '' });
    this.setValueObject();
  }

  // 选中行事件
  public onSelectedKeysChange(e) {
    this.SelectValue = e.toString();
    const SelectRow = this.gridView.data.find(x => x[this.ValueField].toString() === e.toString());
    if (SelectRow !== undefined && SelectRow !== null) {
      this.SelectText = SelectRow[this.TextField || this.ValueField];
    }
    // add by jianl 2018-10-31（可以根据需求扩展old值的传出）
    this.SelectValueChange.emit(this.SelectValue);
    this.SelectTextChange.emit(this.SelectText);
    // end add by jianl

    this.setValueObject();
    this.show = !this.show;
    this.RowSelect.emit({ sender: this, Row: SelectRow, Value: this.SelectValue, Text: this.SelectText });
  }

  // 分页事件
  public pageChange({ skip, take }): void {
    this.skip = skip;
    this.pageSize = take;
    const Params = {
      sender: this,
      SearchValue: this.SearchValue || '',
      PageSize: this.pageSize,
      Skip: this.skip
    };
    this.SearchEvent.emit(Params);
  }

  // 排序事件
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridView = {
      data: orderBy(this.gridView.data, sort),
      total: this.gridView.total
    };
  }

  @Input() ValueObject: any; /* 取值的对象引用,用于值返回  add by ljian11 2018-08-24*/
  // 返回值
  private setValueObject() {
    if (this.ValueObject !== undefined && this.ValueField !== undefined) {
      if (this.ValueObject[this.ValueField].value !== undefined) {
        this.ValueObject[this.ValueField].value = this.SelectValue;
        this.ValueObject[this.ValueField].text = this.SelectText;
      } else {
        this.ValueObject[this.ValueField] = this.SelectValue;
      }
    }
  }
}
