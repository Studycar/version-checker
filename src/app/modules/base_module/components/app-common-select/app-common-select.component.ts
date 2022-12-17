import { Component, forwardRef, Input, Output, OnInit, OnChanges, TemplateRef, EventEmitter, SimpleChanges } from '@angular/core';
import { NzOptionComponent } from 'ng-zorro-antd';
import { QueryService } from './data-service.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'app-common-select',
  templateUrl: './app-common-select.component.html',
  styleUrls: ['./app-common-select.component.less'],
  providers: [
    QueryService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppCommonSelectComponent),
      multi: true
    }
  ]
})
export class AppCommonSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  // 是否使用默认值
  private _whetherUseDefaultValue = false;
  @Input()
  get whetherUseDefaultValue(): boolean {
    return this._whetherUseDefaultValue;
  }
  set whetherUseDefaultValue(value) {
    this._whetherUseDefaultValue = '' + value !== 'false';
  }
  // 是否校验权限
  private _whetherCheckAuthority = true;
  @Input()
  get whetherCheckAuthority(): boolean {
    return this._whetherCheckAuthority;
  }
  set whetherCheckAuthority(value) {
    this._whetherCheckAuthority = '' + value !== 'false';
  }
  // 组件级联影响因子；事业部----->工厂----->计划组----->产线
  @Input() cascade: any;
  // 选择框用于选择事业部、工厂、计划组或是产线, 默认工厂
  @Input() type: 'region' | 'plant' | 'group' | 'line' = 'plant';
  // 事业部，仅在type为group时有用（考虑到业务场景不使用工厂，计划组根据事业部获取）
  @Input() scheduleRegionCode: any;

  // 支持清除 boolean
  @Input() nzAllowClear = false;
  // 下拉菜单是否打开，可双向绑定 boolean
  @Input() nzOpen = false;
  // 默认获取焦点 boolean
  @Input() nzAutoFocus = false;
  // 是否禁用 boolean
  @Input() nzDisabled = false;
  // 下拉菜单的 className 属性 string
  @Input() nzDropdownClassName: string;
  // 下拉菜单和选择器同宽 boolean
  @Input() nzDropdownMatchSelectWidth = true;
  // 下拉菜单的 style 属性 object
  @Input() nzDropdownStyle: object;
  // 自定义选择框的Template内容 TemplateRef<{ $implicit: NzOptionComponent }>
  @Input() nzCustomTemplate: TemplateRef<{ $implicit: NzOptionComponent }>;
  // 是否使用服务端搜索，当为 true 时，将不再在前端对 nz-option 进行过滤 boolean
  @Input() nzServerSearch = false;
  // 最多选中多少个标签 number
  @Input() nzMaxMultipleCount = Infinity;
  // 设置 nz-select 的模式
  @Input() nzMode: 'multiple' | 'tags' | 'default' = 'default';
  // 当下拉列表为空时显示的内容
  @Input() nzNotFoundContent: string | TemplateRef<void>;
  // 选择框默认文字
  @Input() nzPlaceHolder: string;
  // 是否显示下拉小箭头
  @Input() nzShowArrow = true;
  // 使单选模式可搜索
  @Input() nzShowSearch = false;
  // 选择框大小
  @Input() nzSize: 'large' | 'small' | 'default' = 'default';
  // 自定义的选择框后缀图标
  @Input() nzSuffixIcon: TemplateRef<void>;
  // 自定义的多选框清除图标
  @Input() nzRemoveIcon: TemplateRef<void>;
  // 自定义的多选框清空图标
  @Input() nzClearIcon: TemplateRef<void>;
  // 自定义当前选中的条目图标
  @Input() nzMenuItemSelectedIcon: TemplateRef<void>;
  // 在 tags 和 multiple 模式下自动分词的分隔符
  @Input() nzTokenSeparators: string[] = [];
  // 加载中状态
  @Input() nzLoading = false;
  // 最多显示多少个 tag
  @Input() nzMaxTagCount: number;
  // 隐藏 tag 时显示的内容
  @Input() nzMaxTagPlaceholder: TemplateRef<{ $implicit: any[] }>;

  // 下拉菜单打开状态变化回调
  @Output() nzOpenChange: EventEmitter<boolean> = new EventEmitter<boolean> ();
  // 下拉列表滚动到底部的回调
  @Output() nzScrollToBottom: EventEmitter<void> = new EventEmitter<void> ();
  // 文本框值变化时回调
  @Output() nzOnSearch: EventEmitter<string> = new EventEmitter<string> ();
  // focus时回调
  @Output() nzFocus: EventEmitter<void> = new EventEmitter<void> ();
  // blur时回调
  @Output() nzBlur: EventEmitter<void> = new EventEmitter<void> ();

  // 下拉选项配置
  options: Array<{ label: string, value: any }> = [];
  // 组件ngModel绑定传入值
  ngModelData: any;

  constructor(
    private queryService: QueryService,
    private appConfig: AppConfigService,
    private msg: NzMessageService,
    private translateService: AppTranslationService
  ) {}

  ngOnChanges(obj: SimpleChanges) {
    if (obj.cascade && !obj.cascade.firstChange && obj.cascade.currentValue && obj.cascade.previousValue !== obj.cascade.currentValue) {
      switch (this.type) {
        case 'region':
          this.getRegionData(this.appConfig.getUserName(), this.whetherCheckAuthority);
          break;
        case 'plant':
          this.getPlantData(this.appConfig.getUserName(), this.whetherCheckAuthority, obj.cascade.currentValue);
          break;
        case 'group':
          this.getGroupData(this.appConfig.getUserName(), this.whetherCheckAuthority, '', obj.cascade.currentValue);
          break;
        case 'line':
          this.getLineData(this.appConfig.getUserName(), this.whetherCheckAuthority, obj.cascade.currentValue);
          break;
      }
    }
    if (obj.cascade && !obj.cascade.firstChange && obj.cascade.previousValue !== obj.cascade.currentValue) {
      this.ngModelData = null;
      this.onChange(null);
    }
    if (obj.scheduleRegionCode && !obj.scheduleRegionCode.firstChange && obj.scheduleRegionCode.currentValue && obj.scheduleRegionCode.previousValue !== obj.scheduleRegionCode.currentValue) {
      this.getGroupData(this.appConfig.getUserName(), this.whetherCheckAuthority, obj.scheduleRegionCode.currentValue, '');
    }
    if (obj.scheduleRegionCode && !obj.scheduleRegionCode.firstChange && obj.scheduleRegionCode.currentValue !== obj.scheduleRegionCode.previousValue) {
      this.ngModelData = null;
      this.onChange(null);
    }
  }

  ngOnInit() {
    if (this.whetherUseDefaultValue && this.type === 'region') {
      this.ngModelData = this.appConfig.getActiveScheduleRegionCode();
      this.onChange(this.appConfig.getActiveScheduleRegionCode());
    } else if (this.whetherUseDefaultValue && this.type === 'plant') {
      this.ngModelData = this.appConfig.getPlantCode();
      this.onChange(this.appConfig.getPlantCode());
    }
    this.initData();
  }

  /**
   * 组件初始化数据
   */
  initData() {
    switch (this.type) {
      case 'region':
        this.getRegionData(this.appConfig.getUserName(), this.whetherCheckAuthority);
        break;
      case 'plant':
        this.getPlantData(this.appConfig.getUserName(), this.whetherCheckAuthority, this.cascade || this.appConfig.getActiveScheduleRegionCode());
        break;
      case 'group':
        this.getGroupData(this.appConfig.getUserName(), this.whetherCheckAuthority, this.scheduleRegionCode || '', this.cascade || this.appConfig.getPlantCode());
        break;
      case 'line':
        this.getLineData(this.appConfig.getUserName(), this.whetherCheckAuthority, this.cascade || '');
        break;
    }
  }

  /**
   * 获取事业部选项数据
   * @param userName 用户名
   * @param whetherCheckAuthority 是否校验权限
   */
  getRegionData(userName: string, whetherCheckAuthority: boolean): void {
    this.nzLoading = true;
    this.queryService.getRegion(userName, whetherCheckAuthority).subscribe(res => {
      this.options.length = 0;
      if (res.Extra.Success) {
        res.Extra.Extra.forEach(item => {
          this.options.push({
            label: item.SCHEDULE_REGION_CODE,
            value: item.SCHEDULE_REGION_CODE
          });
        });
      } else {
        this.msg.error(this.translateService.translate(res.Extra.Message || '接口出错，请检查'));
      }
      this.nzLoading = false;
    });
  }

  /**
   * 获取工厂选项数据
   * @param userName 用户名
   * @param whetherCheckAuthority 是否校验权限
   * @param scheduleRegionCode 事业部编码
   */
  getPlantData(userName: string, whetherCheckAuthority: boolean, scheduleRegionCode: string): void {
    this.nzLoading = true;
    this.queryService.getPlant(userName, whetherCheckAuthority, scheduleRegionCode).subscribe(res => {
      this.options.length = 0;
      if (res.Extra.Success) {
        res.Extra.Extra.forEach(item => {
          this.options.push({
            label: item.PLANT_CODE,
            value: item.PLANT_CODE
          });
        });
      } else {
        this.msg.error(this.translateService.translate(res.Extra.Message || '接口出错，请检查'));
      }
      this.nzLoading = false;
    });
  }

  /**
   * 获取计划组选项数据
   * @param userName 用户名
   * @param whetherCheckAuthority 是否校验权限
   * @param scheduleRegionCode 事业部编码
   * @param plantCode 工厂编码
   */
  getGroupData(userName: string, whetherCheckAuthority: boolean, scheduleRegionCode: string, plantCode: string): void {
    this.nzLoading = true;
    this.queryService.getGroup(userName, whetherCheckAuthority, scheduleRegionCode, plantCode).subscribe(res => {
      this.options.length = 0;
      if (res.Extra.Success) {
        res.Extra.Extra.forEach(item => {
          this.options.push({
            label: item.SCHEDULE_GROUP_CODE,
            value: item.SCHEDULE_GROUP_CODE
          });
        });
      } else {
        this.msg.error(this.translateService.translate(res.Extra.Message || '接口出错，请检查'));
      }
      this.nzLoading = false;
    });
  }

  /**
   * 获取产线权限数据
   * @param userName 用户名
   * @param whetherCheckAuthority 是否校验权限
   * @param scheduleGroupCode 计划组编码
   */
  getLineData(userName: string, whetherCheckAuthority: boolean, scheduleGroupCode: string): void {
    this.nzLoading = true;
    this.queryService.getLines(userName, whetherCheckAuthority, scheduleGroupCode).subscribe(res => {
      this.options.length = 0;
      if (res.Extra.Success) {
        res.Extra.Extra.forEach(item => {
          this.options.push({
            label: item.RESOURCE_CODE,
            value: item.RESOURCE_CODE
          });
        });
      } else {
        this.msg.error(this.translateService.translate(res.Extra.Message || '接口出错，请检查'));
      }
      this.nzLoading = false;
    });
  }

  /**
   * select框选中值改变触发事件
   * @param value 当前选中值
   */
  onModelChange(value: any): void {
    this.ngModelData = value;
    this.onChange(value);
  }

  /**
   * 下拉菜单打开状态变化回调
   * @param value 是否打开
   */
  selectOpenChange(value: boolean): void {
    this.nzOpenChange.emit(value);
  }

  /**
   * 下拉列表滚动到底部的回调
   */
  scrollToBottom(): void {
    this.nzScrollToBottom.emit();
  }

  /**
   * 文本框值变化时回调
   * @param value 文本框的值
   */
  onSearch(value: string): void {
    this.nzOnSearch.emit(value);
  }

  /**
   * 下拉框获得焦点时的回调
   */
  onFocus(): void {
    this.nzFocus.emit();
  }

  /**
   * 下拉框失去焦点时的回调
   */
  onBlur(): void {
    this.nzBlur.emit();
  }

  // 用于接收registerOnChange()方法里传递回来的方法，然后通过这个方法通知到外部组件数据更新(自定义组件ngModel双向绑定使用)。
  onChange = (value: any) => {};
  // 用于接收registerOnTouched()方法里传递回来的方法，touched事件调用函数
  onTouched = () => {};

  /**
   * 初始化的时候调用 writeValue() 方法，将会使用表单模型中对应的初始值作为参数（也就是ngModel里的值）
   * @param value 组件ngModel里的值
   */
  writeValue(value: any): void {
    if (value !== this.ngModelData) {
      this.ngModelData = value;
      this.onChange(value);
    }
  }

  /**
   * 用来通知外部，组件已经发生变化
   * @param fn 数据更新方法
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * 设置当控件接收到 touched 事件后，调用的函数
   * @param fn touched事件调用函数
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
