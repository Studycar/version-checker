import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer2,
  NgZone,
  ElementRef,
  HostListener,
  SkipSelf,
  Optional,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import {
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { NzMessageService } from 'ng-zorro-antd';
import { NgForm, NgModel } from '@angular/forms';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { AgGridAngular } from 'ag-grid-angular';
import { RowSelectedEvent } from 'ag-grid-community';
import { CustomBaseContext } from './custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from '../services/app-config-service';
import { AppTranslationService } from '../services/app-translation-service';
import { decimal } from '@shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'popup-select',
  templateUrl: '../views/popup-select.component.html',
})
export class PopupSelectComponent extends CustomBaseContext implements OnChanges, OnInit, AfterViewInit {
  cancelBubble = false;
  clickPageSize = false; // 点击事件是否属于改变分页
  show = false;
  SearchValue: string;
  Id: string;
  lastColumnName: string;
  anchorAlign: any = { horizontal: 'left', vertical: 'bottom' };
  popupAlign: any = { horizontal: 'left', vertical: 'top' };
  isClear: boolean = false;
  colWidths = 0; // 总列宽
  @Input() selectBy: string = '';
  @Input() rowSelection: 'single' | 'multiple' = 'single';
  @Input() canClickSearch: boolean = false; // 是否可以点击搜索，默认由Disabled决定
  @ViewChild('selectedValue', {static:true}) model: NgModel; // 绑定输入框的NgModel

  @Input() readOnly = false;
  @Input() Disabled = false;
  @Input() nzStyle = { width: '100%' };
  @Input() TextField: string;
  @Input() ValueField: string;
  @Input() gridView: GridDataResult;
  @Input() columns: any[] = [];
  @Input() nzLoading: Boolean = false; // create by jianl
  @Input() required: Boolean = false;
  @Input() placeHolder: string = '';
  @Input() name: string = ''; // 保存输入框对应变量的名称，保证唯一性

  @Output() SearchEvent = new EventEmitter<any>();
  @Output() TextChanged = new EventEmitter<any>();
  @Output() RowSelect = new EventEmitter<any>();

  // add by jianl 2018-10-29，增加双向绑定属性，方便使用（原来存在这两个属性，但是不支持双向绑定）
  @Input() SelectText: string;
  @Output() SelectTextChange = new EventEmitter();
  @Input() SelectValue: string;
  @Output() SelectValueChange = new EventEmitter();
  @Input() AutoPopopuOnFocus: Boolean = false; // 输入框获取到焦点后自动弹出
  @Output() PopupEvent = new EventEmitter<any>(); // add by jianl 2018-10-29，弹出事件，窗口show出来的时候回调的事件
  // end add by jianl

  @Input() options: { [key:number]: { [key:string]: any[] } } = {}; // add by zhouzl52，存储快码配置
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular; 
  @Input() width = 850;
  firstOpen: boolean = true;

  // 定义控件宽度
  kendoHeight = 300;
  kendoMaxHeight = 320;
  otherHeight = 72;

  public mySelection: string[] = [];
  @Input() pageSize = 10;
  @Input() pageNo = 1;
  public skip = 0;

  constructor(
    private zone: NgZone, public renderer: Renderer2, @SkipSelf() @Optional() private ngForm: NgForm, private commonQuery: PlanscheduleHWCommonService,
    public pro: BrandService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  )
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    if (
      this.columns === undefined ||
      this.columns === null ||
      this.columns.length === 0
    )
      return;
    this.width -= 20; // 除去边距
    this.setGridOptions();
  }

  ngAfterViewInit() {
    if(this.ngForm) {
      this.ngForm.addControl(this.model);
    }
    if(this.columns) {
      this.setColumns();
    }
  }

  setColumns() {
    this.columns = this.columns.map(d => {
      const col = Object.assign({}, d, { headerName: d.title });
      col.width = Number(col.width) || 100;
      delete col.title;
      this.colWidths = decimal.add(col.width, this.colWidths);
      return col;
    });
    this.lastColumnName = this.columns[this.columns.length - 1].field;
  }

  setGridOptions() {
    this.gridOptions.suppressRowClickSelection = false;
    this.gridOptions.rowSelection = this.rowSelection;
  }

  // add by zhouzl52，加载快码
  async loadOptions() {
    const lookupTypes = {};
    let plantCodeKey: any = -1;
    if(this.options) {
      Object.getOwnPropertyNames(this.options).forEach(key => {
        const o = this.options[key];
        if(Object.keys(o)[0] === 'PLANT_CODE') {
          plantCodeKey = key;
        } else {
          Object.assign(lookupTypes, o);
        }
      });
      if(Object.keys(lookupTypes).length > 0) {
        await this.commonQuery.GetLookupByTypeRefZip(lookupTypes);
        if(plantCodeKey !== -1) {
          const plantOptions = Object.values(this.options[plantCodeKey])[0];
          const plantRes = await this.commonQuery.GetAppliactioPlant().toPromise();
          plantRes.data.forEach(d => {
            plantOptions.push({
              label: d.descriptions,
              value: d.plantCode,
            })
          });
        }
      }
    }
  }

  // 配置快码
  public optionsFind(value, index) {
    if(this.options.hasOwnProperty(index)) {
      const options = Object.values(this.options[index])[0];
      const option = options.find(o => o.value === value);
      return option || {label: value};
    }
    return {label: value};
  }

  /**
   * create by jianl
   * @param event
   */
  onAnchorKeyup(event: any): void {
    if (this.AutoPopopuOnFocus) {
      this.SearchValue = this.SelectText;
    }
  }

  @ViewChild('anchor', { static: false }) public anchor: ElementRef;
  @ViewChild('popup', { static: false, read: ElementRef })
  public popup: ElementRef;

  @HostListener('keydown', ['$event'])
  protected keydown(event: any): void {
    // 按esc健 退出
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  // 给document注册click事件
  @HostListener('document:click', ['$event'])
  protected documentClick(event: any): void {
    // 如果是点击的放大镜显示下拉选择窗体或者点击表格分页下拉框时不执行下面代码
    if (!this.cancelBubble && !this.contains(event.target) && !this.clickPageSize) {
      this.toggle(false);
    }
    this.cancelBubble = false;
    this.clickPageSize = false;
  }

  protected toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
    if(this.show) {
      this.setGridViewWidth();
    }
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
      this.anchorAlign.vertical = 'bottom';
      this.popupAlign.vertical = 'top';
      this.kendoHeight = bottomY - this.otherHeight;
    } else {
      this.anchorAlign.vertical = 'top';
      this.popupAlign.vertical = 'bottom';
      this.kendoHeight = topY - this.otherHeight;
    }

    // 计算网格高度大于预计高度,则取预计高度，否则取实际高度
    this.kendoHeight =
      this.kendoHeight > this.kendoMaxHeight
        ? this.kendoMaxHeight
        : this.kendoHeight;
  }

  setGridViewWidth() {
    setTimeout(() => {
      if(this.agGrid && this.colWidths < this.width) {
        this.agGrid.api.sizeColumnsToFit();
      }
    }, 0);
  }

  /**
   * 回车监听
   * @param e 
   */
  keyDown(e) {
    var event = window.event || e;
    var code = event.keyCode || event.which || event.charCode;
    if (code == 13) {
      this.Search();
    }
  }

  // 第一次打开弹窗时触发
  onFirstOpen() {
    setTimeout(() => {
      if(this.agGrid) {
        this.agGrid.api.setColumnDefs(this.columns);
      }
    }, 0);
    this.loadOptions().then(() => {
      if(this.agGrid) {
        this.agGrid.api.setRowData(this.gridView.data);
      }
    });
  }

  public SelectPopup(e: any) {
    // 首次点击搜索按钮时需要加载快码
    if(this.firstOpen) {
      this.onFirstOpen();
      this.firstOpen = false;
    }
    // if(this.isClear && this.SelectText) {
    //   this.SelectText = '';
    //   return;
    // }
    if (
      this.AutoPopopuOnFocus ||
      !this.anchor.nativeElement.contains(e.target)
    ) {
      if (!this.Disabled || this.canClickSearch) {
        this.toggle();
        if (this.show) {
          // 计算网格高度
          this.calcGridViewHeight(e);
          // 赋值到查询框
          this.SearchValue = this.SelectText;
          // 初始化选中状态
          this.mySelection = [];
          // 如果查询框有值则进行查询操作。避免选中了一行记录后 点击下一页没有记录的情况
          // if (this.SearchValue !== '' && this.SearchValue !== null && this.SearchValue !== undefined) {
          //   this.Search();
          // }
          this.Search();

          // add by jianl 2018-10-29
          this.PopupEvent.emit({
            sender: this,
            SearchValue: this.SearchValue || '',
            PageSize: this._pageSize,
            Skip: this.skip,
          });
        }
      }
      this.cancelBubble = true;
    }
    // else {
    //   console.log('666666666666666');
    // }
  }

  // 清除
  public Clear() {
    this.SearchValue = '';
  }

  public popupContext = this;

  // 查询
  public Search() {
    // this.setLoading(true);
    // setTimeout(() => {
    //   this.setLoading(false);
    // }, 1000);
    this.skip = 0;
    const Params = {
      sender: this,
      SearchValue: this.SearchValue || '',
      PageSize: this._pageSize,
      Skip: this.skip,
      context: this.popupContext
    };
    this.SearchEvent.emit(Params);
  }

  setLoading(loading) {
    if(loading !== this.nzLoading) {
      this.nzLoading = loading;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // const gridView = changes.gridView;
    // if(gridView.currentValue !== gridView.previousValue) {
    //   this.nzLoading = false;
    // }
  }

  // 文本值改变
  public onChange(e: any) {
    if (
      this.SelectText === '' ||
      this.SelectText !== null ||
      this.SelectText !== undefined
    ) {
      this.SelectValue = '';
    }
    // add by jianl 2018-10-31（可以根据需求扩展old值的传出），这段代码一定要放在事件抛出之前回到，这样在事件的方法内部就可以获取到双向绑定的值了
    this.SelectValueChange.emit(this.SelectValue);
    this.SelectTextChange.emit(this.SelectText);
    // end add by jianl

    this.TextChanged.emit({
      sender: this,
      event: e,
      Text: this.SelectText || '',
    });
    this.setValueObject();
  }

  onRowSelected(event: RowSelectedEvent) {
    if(event.node.isSelected()) {
      const SelectRow = event.node.data;
      if (SelectRow !== undefined && SelectRow !== null) {
        const SelectText = SelectRow[this.TextField || this.ValueField];
        this.SelectValue = SelectRow[this.ValueField || this.TextField];
        this.SelectText = SelectText;
        this.model.control.markAsDirty(); // 值变化时设置脏状态
      }
      this.SelectValueChange.emit(this.SelectValue);
      this.SelectTextChange.emit(this.SelectText);
      this.setValueObject();
      this.show = !this.show;
      this.RowSelect.emit({
        sender: this,
        Row: SelectRow,
        Value: this.SelectValue,
        Text: this.SelectText,
      });
    }
  }

  public onPageChanged({ pageNo, pageSize }) {
    this.clickPageSize = true;
    this.agGrid.api.paginationSetPageSize(pageSize);
    this.agGrid.api.paginationGoToPage(pageNo - 1);
    this.skip = (pageNo - 1) * pageSize;
    const Params = {
      sender: this,
      SearchValue: this.SearchValue || '',
      PageSize: this._pageSize,
      Skip: this.skip,
    };
    this.SearchEvent.emit(Params);
  }

  // 清空值
  ClearValue() {
    this.SelectText = '';
    this.SelectValue = '';
    this.SelectValueChange.emit(this.SelectValue);
    this.SelectTextChange.emit(this.SelectText);
    this.TextChanged.emit({
      sender: this,
      event: null,
      Text: '',
    });
    this.ngForm.control.markAsDirty();
  }

  @Input()
  ValueObject: any; /* 取值的对象引用,用于值返回  add by ljian11 2018-08-24*/
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
