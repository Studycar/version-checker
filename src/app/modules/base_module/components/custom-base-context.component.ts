import {
  SelectableSettings,
  GridDataResult,
  GridComponent,
  ColumnComponent,
} from '@progress/kendo-angular-grid';
import { Observable, of } from 'rxjs';
import { State } from '@progress/kendo-data-query';
import { ViewChild, OnDestroy, AfterViewInit, ElementRef, Renderer2, Injector, HostListener, ViewContainerRef } from '@angular/core';
import { AppTranslationService } from '../services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from '../services/app-config-service';
import { deepCopy } from '@delon/util';
import { GridApi, ColumnApi, ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppGridStateService } from '../services/app-gridstate-service';
import { AgNumberEditorComponent } from './ag-number-editor.component';
import { AppAgGridStateService } from '../services/app-ag-gridstate-service';
import { AgNumberEditorComponent2 } from './ag-number-editor.component2';
import { AppInjector, BaseService } from '../services/app-injector.service';
import { GridCustomLoadingComponent } from './grid-custom-loading/grid-custom-loading.component';
import { AngularFilterComponent } from './angular-filter/angular-filter.component';
import { AgRichSelectEditorComponent } from './cell-editors/ag-rich-select-editor.component';
import Decimal from 'decimal.js-light';
import { StandardsTypeFilterComponent } from './angular-filter/standrads-type-filter/standrads-type-filter.component';
import { AgAntNumberEditorComponent } from './cell-editors/ag-ant-number-editor.component';
import { ClipboardService } from 'ngx-clipboard';
import { MyAgGridStateDirective } from './custom-aggrid-state.directive';

/*
author:liujian11
date:2018-07-31
function:组件基类，抽象通用属性和方法，子类可覆盖
*/
export abstract class CustomBaseContext implements AfterViewInit, OnDestroy {
  private el: ElementRef;
  protected baseService: BaseService;
  protected renderer: Renderer2;
  protected _clipboardService: ClipboardService;
  @ViewChild(MyAgGridStateDirective, { static: true }) agGridStateDirective;

  protected constructor(services: ServiceOptions) {
    /**
     * start by huangjian
     * 注入器调用
     * 注入基类服务
     * @type {Injector}
     */

    const injector = AppInjector.getInjector();
    this.baseService = injector.get(BaseService);
    this._clipboardService = injector.get(ClipboardService);
    this.renderer = this.baseService.renderer;

    /** end by huangjian*/

    // 翻译等服务类
    this.services = services;
    // ag-grid localeText配置翻译
    this.localeTextTranslate();
    // ag-grid 无数据提示翻译
    this.noRowsTextTranslate();
    // 添加到组件通知列表
    this.addNotify();
    // 初始化grid高度
    this.initGridHeight();
    // 初始化模态窗宽度
    this.initModalWidth();
  }

  /* ----------------------------------以下为高度自适应增加内容------------------------------------ */
  ngAfterViewInit(): void {
    this.setOverlayNoRows();
  }

  ngOnDestroy(): void {
    this.removeNotify();
  }

  private addNotify() {
    if (!this.isNull(this.services.pro)) {
      this.layoutHeader = this.services.pro.layoutHeader;
      this.layoutContent = this.services.pro.layoutContent;
      this.services.pro.addPageToNotify({
        page: this,
        notifyCallback: x => this.notifyCallback(x),
      });
    }
  }

  private removeNotify() {
    if (!this.isNull(this.services.pro)) {
      this.services.pro.removePageFromNotify(this);
    }
  }

  private layoutHeader: Element;
  private layoutContent: Element;

  public notifyCallback({ layoutHeader, layoutContent }) {
    this.layoutHeader = layoutHeader;
    this.layoutContent = layoutContent;
    this.setGridHeight(this.gridHeightArg);
  }

  /* ----------------------------------以下为公共属性------------------------------------ */
  public modalWidth = 1000; // 模态窗宽度
  // 初始化模态窗宽度
  private initModalWidth() {
    if (!this.isNull(document.body.clientWidth)) {
      this.modalWidth = document.body.clientWidth > 1000 ? document.body.clientWidth - 300 : 1000;
    }
  }

  extra: any; // 累计需求变数量

  private services: ServiceOptions;
  // Component上下文
  public context = this;
  // grid loading
  public loading = null; // jianl修改，改为null，这样第一次调用set方法的时候可以进去
  public optionsLoading = false;
  savedFilterModel = null;

  // 设置 grid loading
  public setLoading(isLoading: boolean) {
    if (this.loading !== isLoading) {
      this.loading = isLoading;
      if (!this.isNull(this.gridApi)) {
        if (this.loading) {
          this.gridApi.showLoadingOverlay();
          this.savedFilterModel = this.gridApi.getFilterModel();
        } else {
          this.gridApi.setFilterModel(this.savedFilterModel);
          this.gridApi.hideOverlay();
        }
      }
    }
  }

  // 查询区参数定义
  public queryParams: any;
  // 查询区参数值拷贝
  public queryValuesClone: any;
  // 当前页码
  public _pageNo = 1;
  // 页面大小量
  public _pageSize = 100;
  // grid data
  public gridData: any[];
  // grid view(kendo-ui)
  public view: GridDataResult = { data: [], total: 0 };
  // checkbox选择key字段设置，在子类覆盖
  public selectBy = 'ID';
  // checkbox选择key集合
  public selectionKeys: any[] = [];
  // 特别指定的height
  gridWidth: number = 0;
  gridHeightS1 = 302;
  public gridStyle = {
    x: this.gridWidth + 'px',
    y: this.gridHeightS1 + 'px',
  };
  // grid高度，可在子类覆盖
  public gridHeight = document.body.clientHeight - 185;
  // grid 高度参数
  public gridHeightArg: HeightArg;
  public defaultTopMargin = -1;
  private defaultBottomMargin;
  @ViewChild('customTbSelectSum', {static:true, read:ViewContainerRef}) customTbSelectSum: ViewContainerRef;
  public sumHeight = 0;

  // grid设置height
  public setGridHeight(heightArg: HeightArg) {
    this.gridHeightArg = heightArg;
    if (!this.isNull(this.layoutHeader)) {
      // this.gridHeight = heightArg.height || (this.layoutContent.clientHeight - this.isNullDefault(heightArg.topMargin, this.defaultTopMargin) - this.isNullDefault(heightArg.bottomMargin, this.defaultBottomMargin));
      this.gridHeight =
        heightArg.height ||
        document.body.clientHeight -
        this.layoutHeader.clientHeight -
        this.isNullDefault(heightArg.topMargin, this.defaultTopMargin) -
        this.isNullDefault(heightArg.bottomMargin, this.defaultBottomMargin) -
        7;
    } else {
      this.gridHeight =
        heightArg.height ||
        document.body.clientHeight -
        this.isNullDefault(heightArg.topMargin, this.defaultTopMargin) -
        this.isNullDefault(heightArg.bottomMargin, this.defaultBottomMargin) -
        7;
    }
  }

  setOverlayNoRows() {
    let gridHeight = this.gridHeight;
    if(this.agGridElement) {
      setTimeout(() => {
        gridHeight = parseFloat(window.getComputedStyle(this.agGridElement.nativeElement).height) || 200;
      }, );
    } else {
      gridHeight = 200;
    }
    this.overlayNoRowsTemplate = `<img src="/assets/empty-list-grid.png" style="height:${gridHeight * 0.5}px"/>`;
    this.gridOptions.overlayNoRowsTemplate = this.overlayNoRowsTemplate;
  }

  // 初始化grid高度
  public initGridHeight() {
    if (!this.isNull(this.services.pro)) {
      if (this.defaultTopMargin !== -1) {
        this.defaultBottomMargin = this.pagerHeight + this.sumHeight; // nz-card 内空白15
      } else {
        this.defaultTopMargin = 145;
        this.defaultBottomMargin = this.pagerHeight + this.sumHeight; // nz-card 内空白15
      }
    }
    this.gridHeightArg = {
      topMargin: this.defaultTopMargin,
      bottomMargin: this.defaultBottomMargin,
    };
    this.setGridHeight(this.gridHeightArg);
  }

  public setTopMargin(k: number) {
    this.defaultTopMargin = k;
    this.gridHeightArg.topMargin = k;
    this.initGridHeight();
  }

  // grid数据列集合
  public columns: any[] = [];
  // 导出数据列集合
  public expColumns: any[] = [];
  // 导出数据列快码值集合
  public expColumnsOptions: any[] = [];
  // 提示语选项
  public msgOption = {
    nzDuration: 3000,
    nzAnimate: true,
    nzPauseOnHover: true,
  };
  // 计时器
  public stopwatch: Stopwatch = new Stopwatch();
  // 功能图片目录相对路径
  public planScheduleImgPath = '/assets/imgs/planSchedule/'; // ../../../../assets/imgs/planSchedule/
  // 基础icon
  public baseImgPath = '/assets/imgs/base-icon/';
  // 补充icon
  public addictionPath = '/assets/imgs/addiction-icon/';
  // 功能图片
  public Img = {
    产能平衡: this.planScheduleImgPath + '1.svg',
    工单联动: this.planScheduleImgPath + '2.svg',
    上层联动: this.planScheduleImgPath + '上层联动.png',
    工作日历: this.planScheduleImgPath + '3.svg',
    固定时间: this.planScheduleImgPath + '4.svg',
    集约选线: this.planScheduleImgPath + '5.svg',
    排产刷新: this.planScheduleImgPath + '6.svg',
    批量资源调整: this.planScheduleImgPath + '7.svg',
    搜索: this.planScheduleImgPath + '8.svg',
    备注保存: this.planScheduleImgPath + '9.svg',
    备注保存_不可用: this.planScheduleImgPath + '9_un.svg',
    置尾单: this.planScheduleImgPath + '10.svg',
    调整保存: this.planScheduleImgPath + '11.svg',
    调整保存_不可用: this.planScheduleImgPath + '11_un.svg',
    工单族: this.planScheduleImgPath + '工单族.svg',
    智能排产: this.planScheduleImgPath + '智能排产.svg',
    工单组件: this.planScheduleImgPath + '工单组件.svg',
    排产表: this.planScheduleImgPath + '排产表.svg',
    计划发布: this.planScheduleImgPath + '计划发布.svg',
    排产评分: this.planScheduleImgPath + '排产评分.svg',
    一键匹模: this.planScheduleImgPath + '一键匹模.svg',
    一模多出: this.planScheduleImgPath + '一模多出.svg',
    导出: this.baseImgPath + '基础icon-导出@1x.svg',
    新增: this.baseImgPath + '基础icon-新增.svg',
    删除: this.baseImgPath + '基础icon-删除.svg',
    导入: this.baseImgPath + '基础icon-导入.svg',
    参与排产: this.addictionPath + '参与排产.svg',
    不参与排产: this.addictionPath + '不参与排产.svg',
    修改: this.baseImgPath + '基础icon-修改.svg',
    刷新: this.baseImgPath + '基础icon-刷新.svg',
    例外信息: this.addictionPath + '例外信息.svg',
    清除: this.baseImgPath + '基础icon-清除@1.5x.svg',
    查找请求: this.addictionPath + '查找请求.svg',
    提交新请求: this.addictionPath + '提交新请求.svg',
    合并订单: this.addictionPath + '合并订单.svg',
    批量修改: this.addictionPath + '批量修改.svg',
    日历编码: this.addictionPath + '日历编码.svg',
    资源日历班次: this.addictionPath + '资源日历班次.svg',
    工作时段模板: this.addictionPath + '工作时段模板.svg',
    工作日历初始化: this.addictionPath + '工作日历初始化.svg',
    日期复制: this.addictionPath + '日期复制.svg',
    工作日历复制: this.addictionPath + '工作日历复制.svg',
    发放: this.addictionPath + '发放.svg',
    批量下达: this.addictionPath + '批量下达.svg',
    单元格下达: this.addictionPath + '单元格下达.svg',
    清除计划: this.addictionPath + '清除计划.svg',
    PO缺料: this.addictionPath + 'PO缺料.svg',
    全部收缩: this.addictionPath + '全部收缩.svg',
    全部展开: this.addictionPath + '全部展开.svg',
    订单引入: this.addictionPath + '引入需求工作台.svg',
    拆分合并: this.addictionPath + '自动拆分合并.svg',
    可收起: this.addictionPath + '可收起.svg',
    可展开: this.addictionPath + '可展开.svg',
    单据编码记录: this.addictionPath + '单据编码记录.svg',
    生成流水号: this.addictionPath + '生成流水号.svg',
    来源明细: this.addictionPath + '来源明细.svg',
    查询: this.baseImgPath + '基础icon-查询.svg',
    脚本配置: this.addictionPath + '脚本配置.svg',
    收集数据: this.addictionPath + '收集数据.svg',
    生成数据: this.addictionPath + '生成数据.svg',
    取消: this.addictionPath + '取消.svg',
    释放: this.addictionPath + '释放.svg',
    自动计算: this.addictionPath + '自动计算.svg',
    发送邮件: this.addictionPath + '发送邮件.svg',
    建立模型: this.addictionPath + '建立模型.svg',
    工单例外: this.planScheduleImgPath + '工单例外.png',
  };

  /* start create by jianl */
  public lookupItemCache = new Map<string, Set<LookupItem>>(); // 值列表的缓存区
  /* end create by jianl */

  /* ----------------------------------以下为kendo-ui grid属性------------------------------------ */
  @ViewChild('grid', { static: true }) grid: GridComponent;
  // kendo-ui grid异步view
  public viewAsync: Observable<GridDataResult>;
  // grid状态设置
  public gridState: State = {
    sort: [],
    skip: 0,
    take: this._pageSize,
    filter: null,
  };
  // grid分页设置
  public pageable = {
    buttonCount: 10,
    info: true,
    type: 'numeric',
    pageSizes: [10, 20, 50, 100],
    previousNext: true,
  };
  // grid checkbox选择设置
  public selectableSettings: SelectableSettings = {
    enabled: true,
    checkboxOnly: false,
    mode: 'multiple' /*  'multiple'  'single'   */,
  };
  // grid命令列功能按钮鼠标手势
  public pointer = {
    cursor: 'Pointer',
  };
  /* ----------------------------------以下为ag-grid属性------------------------------------ */
  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;
  @ViewChild('agGrid', { static: true, read: ElementRef })
  agGridElement: ElementRef;
  /** add by huangjian*/
  // ag-grid Api
  public gridApi: GridApi;
  // ag-grid ColumnApi
  public gridColumnApi: ColumnApi;
  // 操作区水平停靠方向
  public pinnedAlign = 'right';
  // custom pager height
  public pagerHeight = 40;
  private overlayNoRowsText = 'noRowsToShow';
  // ag-grid NoRowsTemplate
  // public overlayNoRowsTemplate =
  //   '<span class="agGridCellFont">' + this.overlayNoRowsText + '</span>';
  public overlayNoRowsTemplate =
    `<img src="/assets/empty-list-grid.png" style="height:${this.gridHeight * 0.5}px"/>`;
  public headerTemplate = `<div class="ag-cell-label-container" role="presentation">
        <div ref="eLabel" class="ag-header-cell-label" role="presentation">
          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
          <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button" style="display:none;"></span>
        </div>
      </div>`;
  /** 是否自动填充列宽 */
  public isSizeColumnsToFit = true;

  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridLoadCallback();
  }

  /**
   * create by jianl
   */
  public gridLoadCallback() {
    // 派生类可以做一些自己的逻辑
  }

  // 获取选中行key集合
  public getGridSelectionKeys(Key: string = 'id'): any[] {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.selectionKeys = [];
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        this.selectionKeys.push(d[Key]);
      });
    }
    return this.selectionKeys;
  }

  // 筛选选中行
  public getGridSelectionKeysByFilter(Key: string = 'id', filter: Function) {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.selectionKeys = [];
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        if(filter(d)) {
          this.selectionKeys.push(d[Key]);
        }
      });
    }
    return this.selectionKeys;
  }

  public selectAll(): void {
    return this.gridApi.selectAll();
  }

  // 语言国际化配置
  public localeText = {
    // for filter panel
    page: 'daPage',
    more: 'daMore',
    to: 'daTo',
    of: 'daOf',
    next: 'daNexten',
    last: 'daLasten',
    first: 'daFirsten',
    previous: 'daPreviousen',
    loadingOoo: 'daLoading...',

    // for set filter
    selectAll: 'daSelect Allen',
    searchOoo: 'daSearch...',
    blanks: 'daBlanc',

    // for number filter and text filter
    filterOoo: 'daFilter...',
    applyFilter: 'daApplyFilter...',
    equals: 'daEquals',
    notEqual: 'daNotEqual', // notEquals

    // for number filter
    lessThan: 'daLessThan',
    greaterThan: 'daGreaterThan',
    lessThanOrEqual: 'daLessThanOrEqual',
    greaterThanOrEqual: 'daGreaterThanOrEqual',
    inRange: 'daInRange',

    // for text filter
    contains: 'daContains',
    notContains: 'daNotContains',
    startsWith: 'daStarts dawith',
    endsWith: 'daEnds dawith',

    // the header of the default group column
    group: 'laGroup',

    // tool panel
    columns: 'laColumns',
    filters: 'laFilters',
    rowGroupColumns: 'laPivot Cols',
    rowGroupColumnsEmptyMessage: 'la drag cols to group',
    valueColumns: 'laValue Cols',
    pivotMode: 'laPivot-Mode',
    groups: 'laGroups',
    values: 'laValues',
    pivots: 'laPivots',
    valueColumnsEmptyMessage: 'la drag cols to aggregate',
    pivotColumnsEmptyMessage: 'la drag here to pivot',
    toolPanelButton: 'la tool panel',

    // other
    noRowsToShow: 'la no rows',

    // enterprise menu
    pinColumn: 'laPin Column',
    valueAggregation: 'laValue Agg',
    autosizeThiscolumn: 'laAutosize Diz',
    autosizeAllColumns: 'laAutsoie em All',
    groupBy: 'laGroup by',
    ungroupBy: 'laUnGroup by',
    resetColumns: 'laReset Those Cols',
    expandAll: 'laOpen-em-up',
    collapseAll: 'laClose-em-up',
    toolPanel: 'laTool Panelo',
    export: 'laExporto',
    csvExport: 'la CSV Exportp',
    excelExport: 'la Excel Exporto',

    // enterprise menu pinning
    pinLeft: 'laPin <<',
    pinRight: 'laPin >>',
    noPin: 'laDontPin <>',

    // enterprise menu aggregation and status bar
    sum: 'laSum',
    min: 'laMin',
    max: 'laMax',
    none: 'laNone',
    count: 'laCount',
    average: 'laAverage',

    // standard menu
    copy: 'laCopy',
    copyWithHeaders: 'laCopy Wit hHeaders',
    ctrlC: 'ctrl n C',
    paste: 'laPaste',
    ctrlV: 'ctrl n V',
  };
  // column menu
  public getMainMenuItems = {};
  // ag-grid 主题样式
  public themeClass = 'ag-theme-balham';
  public defaultHeaderHeight = 30;
  public defaultRowHeight = 30;
  public defaultColDef: any = {
    headerClass: 'agGridHeaderFont',
    // cellClass: ['agCellSelection', 'agGridCellFont'],
    // 区域选择功能修改
    cellClass: ['agGridCellFont'],
    hide: false,
    tooltipValueGetter: param => param.value,
    filter: 'defaultFilter',
    resizable: true, /* 列宽可调整 */
    sortable: true, /* 排序 */
  };
  // ag-grid 默认选项设置
  public filterSettings: any = {};
  public getDataPath;
  public getRowNodeId;
  public autoGroupColumnDef;
  public groupDefaultExpanded = -1;
  public gridOptions: { [key: string]: any } = {
    // domLayout: 'autoHeight',
    headerHeight: this.defaultHeaderHeight,
    rowHeight: this.defaultRowHeight,
    defaultColDef: this.defaultColDef,
    context: this.context,
    pagination: true,
    paginationPageSize: this._pageSize,
    paginationAutoPageSize: false,
    suppressPaginationPanel: true,
    suppressAutoSize: true /* 自动列宽 add by jianl */,
    rowSelection: 'multiple' /* 行多选/单选 */,
    isRowSelectable: rowNode => true, /* 控制行是否可选 */
    loadingOverlayComponent: 'customLoadingOverlay' /* loading组件 */,
    overlayNoRowsTemplate: this.overlayNoRowsTemplate /* 没数据显示模板 */,
    localeText: this.localeText /* 多语言设置 */,
    suppressRowClickSelection: true /* 禁用行单击选择 */,
    stopEditingWhenGridLosesFocus: true /* 失去焦点停止编辑 */,
    frameworkComponents: {
      customLoadingOverlay: GridCustomLoadingComponent,
      // add by jianl，aggrid里面实现数字输入框（组件里面还有bug，没改）
      AgAntNumberEditor: AgAntNumberEditorComponent,
      AgNumberEditor: AgNumberEditorComponent,
      standardsTypeFilter: StandardsTypeFilterComponent,
      AgRichSelectCellEditor: AgRichSelectEditorComponent,
      AgNumberEditor2: AgNumberEditorComponent2,
      // 自定义过滤组件
      defaultFilter: AngularFilterComponent,
    },
    suppressContextMenu: true /* 禁用右键 */,
    onGridReady: event => {
      // event.api.hideOverlay();
      this.onGridReady(event);
    } /* grid加载 */,
    /**
     *  start by huangjian
     * 修复tabs切换表格与内容错位（原因:滚动条重置，表头没重置）
     */
    onGridSizeChanged: event => {
      const gridApi = event.api;
      const left = gridApi.getHorizontalPixelRange().left;
      if (left === 0 && this.agGridElement) {
        this.renderer.setStyle(
          this.agGridElement.nativeElement.querySelector(
            '.ag-header-container',
          ),
          'transform',
          `translateX(${left}px)`,
        );
      }
    },
    /**
     * 修复表格内formatter后的文本复制黏贴扔为原值
     * (原因: 复制时只是复制原始值，并未直接复制formatter后的值)
     * */
    processCellForClipboard: params => {
      if (params.column.userProvidedColDef.valueFormatter) {
        const evalFn = new Function(
          'params',
          'value',
          `return ${params.column.userProvidedColDef.valueFormatter.replace(
            'ctx',
            'params.context',
          )}`,
        );
        return evalFn(params, params.value);
      }
      return params.value;
    },
    /** end by huangjian*/
    // 开启区域选择
    // enableRangeSelection: true,
    // 开启内容选择
    enableCellTextSelection: true,
  };

  // 语言国际化配置翻译
  private localeTextTranslate() {
    if (!this.isNull(this.services.appTranslationSrv)) {
      const localeTextTranslation: any = {};
      for (const p in this.localeText) {
        localeTextTranslation[p] = this.services.appTranslationSrv.translate(p);
      }
      this.localeText = localeTextTranslation;
      this.gridOptions.localeText = localeTextTranslation;
    }
  }

  // 无数据提示文本翻译
  private noRowsTextTranslate() {
    if (!this.isNull(this.services.appTranslationSrv)) {
      // this.overlayNoRowsTemplate =
      //   '<span class="agGridCellFont">' +
      //   this.services.appTranslationSrv.translate(this.overlayNoRowsText) +
      //   '</span>';
      this.gridOptions.overlayNoRowsTemplate = this.overlayNoRowsTemplate;
    }
  }

  // columns headerName翻译(个性化设置后，该方法在gridReady中无效,在功能构造函数中调用)
  public headerNameTranslate(columns: any[]) {
    if (columns === undefined || columns === null) return;
    if (!this.isNull(this.services.appTranslationSrv) && columns.length > 0) {
      columns.forEach(x => {
        if (!this.isNull(x.headerName)) {
          x.headerName = this.services.appTranslationSrv.translate(
            x.headerName,
          );
        } else if (!this.isNull(x.title)) {
          x.title = this.services.appTranslationSrv.translate(
            x.headerName,
          );
        }
      });
    }
  }

  // 列可复制(个性化设置后，该方法在gridReady中无效，在默认列定义属性设置)
  public cellSelectable(columns: any[]) {
    // columns.forEach(x => {  x['editable'] = true; x['singleClickEdit'] = true;  }); // 可编辑
    columns.forEach(x => {
      if (!this.isNull(x.headerName)) {
        // x['cellClass'] = ['agCellSelection', 'agGridCellFont'];
        // 区域选择功能修改
        x['cellClass'] = ['agGridCellFont'];
      }
    }); // 全局样式
  }

  /* ----------------------------------以下为待删除属性------------------------------------ */
  // grid命令列功能按钮有边框样式
  public spanStyle = {
    cursor: 'Pointer',
    'padding-left': '4px',
    'padding-right': '4px',
    'border-right': '1px solid #d9d9d9',
  };
  // grid命令列功能按钮无边框样式
  public spanStyleNoBorder = {
    cursor: 'Pointer',
    'padding-left': '4px',
    'padding-right': '4px',
  };
  // grid数据行样式
  public gridLineStyle = { 'border-bottom': '1px solid #d9d9d9' };

  /* ----------------------------------以下为公用方法定义------------------------------------ */

  // 重置导出列(含顺序)
  public resetExpColumns(isExpAll: boolean = false) {
    // kendo-grid
    if (!!this.grid) {
      const columns = [];
      this.grid.columns.toArray().map(item => {
        const col = <ColumnComponent>item;
        if (col && col.field && col.displayTitle) {
          columns.push({
            field: col.field,
            title: col.displayTitle,
            locked: col.locked,
            width: col.width,
            orderIndex: col.orderIndex,
            hidden: isExpAll ? false : !col.isVisible,
          });
        }
      });
      this.expColumns = columns.sort((a, b) => a.orderIndex - b.orderIndex);
    } else if (!!this.gridColumnApi) {
      // ag-grid
      const columns = [];
      const oldColumns = this.gridColumnApi.getAllGridColumns();
      const columnState = this.gridColumnApi.getColumnState();
      oldColumns.forEach(item => {
        const col = item.getColDef();
        if (col && !this.isNull(col.field) && !this.isNull(col.headerName)) {
          const state = columnState.find(s => s.colId === item.getColId());
          const width = item.getActualWidth();
          columns.push({
            field: col.field,
            title: col.headerName,
            locked:
              !this.isNull(state) && !this.isNull(state.pinned)
                ? state.pinned
                : false,
            width: !this.isNull(width) ? width : col.width,
            hidden: isExpAll
              ? false
              : !this.isNull(state) && !this.isNull(state.hide)
                ? state.hide
                : false,
          });
        }
      });
      this.expColumns = columns;
    }

  }
    
  public toNumber(number) {
    let result = Number(number);
    return result.toString() === 'NaN' ? 0 : result;
  }

  // 导出
  public export(isExpAll: boolean = false) {
    // 重置导出列（用户操作隐藏列不导出/ag-grid适配kendo-ui导出）
    this.resetExpColumns(isExpAll);
  }

  // excel数据处理虚方法,data为逗号分隔的行数据数组（由导入组件解析）
  public excelDataProcess(data: any[]) {
  }

  // 查询虚方法，具体逻辑在子类实现
  public query(queryParams?: any) {
    /* kendo-ui grid状态信息部分初始化 */
    this.gridState = {
      sort: this.gridState.sort,
      skip: 0,
      take: this.gridState.take,
      filter: null,
    };
    this.selectionKeys = [];
    this._pageNo = 1;
    /* ag-grid状态清理 */
    if (!this.isNull(this.gridApi)) {
      this.gridApi.deselectAll(); // 清除选择项
      // this.gridApi.redrawRows(); // 重绘，清除前一次查询的样式
      this.gridApi.paginationGoToFirstPage(); // 跳转到第一页
      this.gridApi.setFilterModel(null); // 重置筛选器
    }
  }

  initGridWidth() {
    setTimeout(() => {
      const grids = document.querySelectorAll('ag-grid-angular');
      let grid;
      if (grids && grids.length > 0) {
        grid = grids[grids.length-1];
      }
      const cols = this.gridColumnApi.getColumnState()
      if (grid && cols) {
        const columnsWidth = cols.map(c => c.width || 100).reduce((t, w) => t+w);
        const gridWidth = grid.offsetWidth;
        if(columnsWidth < gridWidth) {
          this.context.gridApi.sizeColumnsToFit();
        }
      }
    }, 500);
  }

  // 监听表格复制
  @HostListener('copy', ['$event.target'])
  copy(ele: HTMLElement) {
    if (window.getSelection().toString()) {
      return
    }
    const copyContent = ele.innerText || ele.textContent.trim()
    if (copyContent) {
      this._clipboardService.copy(copyContent);
    }
  }
  // 新增虚方法
  public add(value?: any) {
  }

  // 编辑虚方法
  public edit(value?: any) {
  }

  // 删除虚方法
  public remove(value?: any) {
  }

  // 批量删除虚方法
  public removeBatch(value?: any) {
  }

  // 明细虚方法
  public detail(value?: any) {
  }

  // Clone查询参数
  public cloneQueryParams() {
    if (!this.isNull(this.queryParams.values)) {
      this.queryValuesClone = this.clone(this.queryParams.values);
    }
  }

  // 重置虚方法
  public clear() {
    if (!this.isNull(this.queryValuesClone) && !this.isNull(this.queryParams)) {
      this.queryParams.values = this.clone(this.queryValuesClone);
    }
  }

  // 下拉选项查找虚方法
  public optionsFind(value: string, optionsIndex: number): any {
    return { value: '', label: '' };
  }

  /**
   * add by jianl
   * 加载完数据之后回调的方法（派生类可以直接重写）
   */
  public loadGridDataCallback(result) {
  }

  /** create by jianl
   * 获取值列表值（支持缓存的功能）
   * @param key 值列表的key值
   */
  public getLookupItems(key: string): Observable<Set<LookupItem>> {
    if (!key || key === undefined) return of();
    if (this.lookupItemCache.has(key)) return of(this.lookupItemCache.get(key));
    this.lookupItemCache.set(key, new Set<LookupItem>());
    /** 初始化 工单状态  下拉框*/
    return this.services.commonQuerySrv.GetLookupByTypeMul(key).map(it => {
      Array.from(it.data).forEach(item => {
        const temp = <any>item;
        const obj = new LookupItem(temp.LOOKUP_CODE, temp.MEANING);
        this.lookupItemCache.get(key).add(obj);
      });
      return this.lookupItemCache.get(key);
    });
  }

  /**
   * create by jianl
   * 重置grid的状态
   * 考虑到动态列的情况，所以此方法先获取现有的个性化信息，然后把历史的个性化信息更新现有的
   */
  public agGridStateReset(gridStateKey: any) {
    console.log('this.services.appAgGridStateService');
    console.log(this.services.appAgGridStateService);
    if (
      this.services.appAgGridStateService === undefined ||
      this.services.appAgGridStateService === null
    )
      return;
    console.log(this.agGrid.columnApi);
    this.services.appAgGridStateService.resetGridSettingsByCache(
      this.agGrid.columnApi,
      this.services.appGridStateService,
      gridStateKey,
    );
  }

  /**
   * create by jianl
   * 特别注意：（此方法不能直接调用，应该调用getLookupItems的回调方法里面调用）
   * 根据值列表项的CODE获取值列表项的text值
   * @param key 值列表的key值，例如：PS_MAKE_ORDER_STATUS
   * @param code 值列表项的CODE值
   */
  public getLookupText(key: string, code: string): String {
    const setItem = this.lookupItemCache.get(key);
    if (!setItem || setItem === undefined) return code;
    for (const item of Array.from(setItem)) {
      if (item.Code === code) return item.Text;
    }
    return code;
  }

  /**
   * create by jianl
   * 设置loading图标
   * @param fields
   * @param loadingValue
   */
  public setQueryFormUILoading(fields: any[], loadingValue: Boolean) {
    if (fields === undefined || fields === null || fields.length === 0) return;
    this.queryParams.defines.forEach(it => {
      fields.forEach(item => {
        if (it.field === item) {
          (<any>it.ui.nzLoading) = loadingValue;
        }
      });
    });
  }

  // grid状态更改事件虚方法
  public dataStateChange(state: any) {
  }

  // grid切换页码事件虚方法
  public pageChange(state: any) {
  }

  // 空值返回默认值
  public isNullDefault(data: any, defaultValue: any): any {
    return data || defaultValue || '';
  }

  // 判断为空
  public isNull(data: any): boolean {
    return (data || '') === '';
  }

  // object克隆
  public clone(obj: any): any {
    // return Object.assign({}, obj); //浅拷贝
    // const jsonString = JSON.stringify(obj);
    // return JSON.parse(jsonString); // 会忽略值为function以及undefied的字段，而且对date类型的支持也不太友好
    return deepCopy(obj);
  }

  // 去除前后空格
  public trim(param: string): string {
    return param.replace(/(^\s*)|(\s*$)/g, '');
  }

  // 事件触发控制（修复bug双击多个弹窗）
  hasEventTriggered = false;

  public checkEventTriggered(): boolean {
    if (this.hasEventTriggered) {
      return true;
    } else {
      this.hasEventTriggered = true;
      return false;
    }
  }

  /**
   * 显示总计功能
   * @param data 表格数据
   * @param totalField 要显示“总计”的列，没有可以传空字符串，例如：'name'
   * @param fields 需要计算的列数组，例如：['attribute1', 'attribute2']
   */
  public setTotalBottomRow(data: any[], totalField: string, fields: string[]): void {
    if (data.length) {
      // 初始化统计行
      const bottomRowData = {
        isBottomRowData: true // 表示这行是总计数据
      };
      bottomRowData[totalField] = '总计';
      fields.forEach(key => {
        bottomRowData[key] = '';
      });
      // 累计数据
      data.forEach((item, index) => {
        fields.forEach(key => {
          const value = (item[key] || item[key] === 0) ? parseFloat(item[key]) : 0;
          if (index === 0) {
            bottomRowData[key] = value;
          } else {
            bottomRowData[key] = new Decimal(this.toNumber(bottomRowData[key])).add(new Decimal(this.toNumber(value))).toNumber();
          }
        });
      });
      this.gridApi.setPinnedBottomRowData([bottomRowData]);
    } else {
      this.gridApi.setPinnedBottomRowData([]);
    }
  }

  /**
   * loadOptions 的包裹函数，用于在 loadOptions 函数执行前后统一加入某些操作
   * @param fn 
   * @returns fn
   */
  protected wrapLoadOptionsFn(fn: () => Promise<void>) {
    return () => {
      this.optionsLoading = true // options 加载中
      const promise = fn()
      promise.then(() => {
        this.optionsLoading = false
        if (this.gridApi) {
          const formattedCols: ColDef[] = this.gridApi.getColumnDefs().filter((i) => 'valueFormatter' in i)
          if (formattedCols.length) {
            this.gridApi.refreshCells({
              force: true,
              suppressFlash: true,
              columns: formattedCols.map(i => i.field)
            })
          }
        }
      }).catch((err) => {
        this.optionsLoading = false
        console.error(err)
      })
    }
  }
}

/* grid height参数 */
export class HeightArg {
  public height?: number;
  public topMargin?: number;
  public bottomMargin?: number;
}

/* Stopwatch 计时器 */
export class Stopwatch {
  _start: Date = new Date();

  public start() {
    this._start = new Date();
  }

  public getTime() {
    const stop = new Date();
    const milSeconds = stop.getTime() - this._start.getTime();
    return milSeconds;
  }
}

/* 服务选项 */
export class ServiceOptions {
  // 翻译服务
  public appTranslationSrv: AppTranslationService;
  // 提示消息服务
  public msgSrv?: NzMessageService;
  // 默认信息服务，比如用户组织、语言等
  public appConfigSrv?: AppConfigService;
  // grid高度自适应使用,贯穿整个布局
  public pro?: BrandService;
  // 查询服务 create by jianl
  public commonQuerySrv?: CommonQueryService;
  // gridstate服务
  public appGridStateService?: AppGridStateService = null;
  // ag-gridstate服务
  public appAgGridStateService?: AppAgGridStateService = null;

  // 组件注入器
  injector?: Injector = null;

  [key: string]: any;
}

/**
 * create by jianl
 * 值列表类型实体类
 */
export class LookupItem {
  /**code值 */
  Code: string;
  /** text值 */
  Text: string;

  constructor(code?: string, text?: string) {
    this.Code = code;
    this.Text = text;
  }
}
