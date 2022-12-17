import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { PocSubstituteStrategyDetailEditService } from './edit.service';
import { SubstituteStrategyDetail } from './model';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { BrandService } from '../../../../layout/pro/pro.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { SubstituteStrategyDetailService } from './substitute-strategy-detail.service';
import { CustomOperateCellRenderComponent } from '../../../../modules/base_module/components/custom-operatecell-render.component';
import { AgDatePickerComponent } from './ag-date-picker.component';
import { AgFormCellComponent } from './ag-form-cell.component';
import { Column, GridReadyEvent, RowNode } from 'ag-grid-community';
import { AddSubstituteStrategyComponent } from './add-substitute-strategy/add-substitute-strategy.component';
import { AddDetailSubstituteStrategyComponent } from './add-substitute-strategy/add-detail-substitute-strategy.component';
import { SubstituteStrategyInfoComponent } from './substitute-strategy-info/substitute-strategy-info.component';
// import { SubstituteStrategyInfoComponent } from './substitute-strategy-info/substitute-strategy-info.component';
/**
 * 快速编码明细
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'substitute-strategy-detail',
  templateUrl: './substitute-strategy-detail.component.html',
  styles: [`
    .operatable-area {
      margin-bottom: 16px;
    }
    .k-grid .no-padding {
        padding: 0;
      }
      .whole-cell {
        display: block;
        padding: 0;
        margin: 0;
      }
      .redCellStyle {
        color: red;
      }
      .blueCellStyle {
        color: blue;
      }
      .editCellStyle {
        color: #F6A52C;
      }
      .gPlanCodeColumn {
        background-color: Yellow;
      }
      .sPlanCodeColumn {
        background-color: Green;
      }
      .bPlanCodeColumn {
        background-color: LightGreen;
      }
      .gyPlanCodeColumn {
        background-color: LightGray;
      }
      .focusCellStye {
        color: blue;
      }
      .backColor0 {
        background-color: #ffffff !important;
      }
      .backColor1 {
        background-color: #f5f7fa !important;
      }
      ::ng-deep .cell-span {
        background-color: #ffffff;
      }
      ::ng-deep .show-cell {
        background: white;
        border-left: 1px solid lightgrey !important;
        border-right: 1px solid lightgrey !important;
        border-bottom: 1px solid lightgrey !important;
      }
      .texStyle {
        line-height: 100px;
      }
      ::ng-deep .test{
        display: flex !important;
    align-items: center !important;
      }
  `],
  providers: [
    PocSubstituteStrategyDetailEditService,
  ],

})
export class SubstituteStrategyDetailComponent extends CustomBaseContext implements OnInit {
  // @Input() private code: string;
  // @Input() private lookupTypeId: string;
  // @Input() private lng: string;
  // @Input() private LngOptions: any[];

  @ViewChild('customTemplate5', { static: true }) customTemplate5: TemplateRef<
    any
  >;
  @Input() private plantCode: string;
  @Input() private substituteCode: string;
  @Input() private substituteStrategy: string;
  @Input() private useStrategy: string;//消耗策略
  @Input() private buyStrategy: string;//消耗策略

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  view2: Observable<GridDataResult>;
  gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };
  applications: any[] = [];
  changes: any = {};
  updateRowData: RowNode[] = [];
  // 表格height
  gridHeight: any = 300;
  // // 列定义
  // columnsDef = [
  //   {
  //     colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
  //     type: 'nonEditableColumn',
  //     headerComponentParams: {
  //       template: this.headerTemplate,
  //     },
  //     cellRendererFramework: CustomOperateCellRenderComponent,
  //     cellRendererParams: {
  //       customTemplate: this.customTemplate,
  //     },
  //     rowSpan: function (params) {
  //       if (params.data.spanFlag === true) {
  //         return params.data.SpanCount;
  //       } else {
  //         return 0;
  //       }
  //     }, 
  //     cellClassRules: {
  //       'show-cell': function (params) {
  //         return params.data.spanFlag;
  //       },
  //       backColor0: function (params) {
  //         return params.data.spanFlag && params.data.ITEM_INDEX % 2 === 0;
  //       },
  //       backColor1: function (params) {
  //         return params.data.spanFlag && params.data.ITEM_INDEX % 2 !== 0;
  //       },
  //     },
  //     cellStyle: { 'line-height': '120px' },
  //   },
  //   { field: 'SUBSTITUTE_GROUP', 
  //   headerName: '替代组',  
  //   pinned: 'left',
  //   lockPinned: true,
  //   width: 100,
  //   rowSpan: function (params) {
  //     if (params.data.spanFlag === true) {
  //       return params.data.SpanCount;
  //     } else {
  //       return 0;
  //     }
  //   }, 
  //   // cellStyle: { 'line-height': '120px' },
  //   // cellClassRules: {
  //   //   'show-cell': function (params) {
  //   //     return params.data.spanFlag;
  //   //   },
  //   // },
  //   cellClassRules: {
  //     'cell-span': 'value!==undefined',
  //     'show-cell': 'value!==undefined',
  //   },
  //   cellStyle: { 'line-height': '120px' },
  //   cellEditor: 'agLargeTextCellEditor',
  //   menuTabs: ['filterMenuTab'],
  //  },
  //   { field: 'USE_PRIORITY', headerName: '消耗优先级', width: 100 },
  //   { field: 'BUY_PERSENT', headerName: '采购比例', width: 150 },
  //   {
  //     headerName: '替代策略值',
  //     field: 'SUBSTITUTE_STRATEGY',
  //     width: 150, // 未维护混流工艺路线
  //     cellRendererFramework: CustomOperateCellRenderComponent,
  //     cellRendererParams: {
  //       customTemplate: this.customTemplate5
  //     },
  //     menuTabs: ['filterMenuTab'],
  //   },
  //   { field: 'ITEM_CODE', headerName: '物料编码', width: 150 },
  //   { field: 'DESCRIPTIONS_CN', headerName: '物料描述', width: 150 },
  //   { field: 'USAGE', headerName: '单位用量', width: 80 },
  //   { field: 'KEY_FLAG', headerName: '关键物料', width: 150 },
  //   { field: 'EFFECTIVITY_DATE', headerName: '生效日期', width: 120 },
  //   { field: 'DISABLE_DATE', headerName: '失效日期', width: 120 },
  // ];

  // 扩展默认列定义
  defaultColDef = {
    ...this.defaultColDef,
    resizable: true,
    // editable: true,
  };
  agFormGroup: FormGroup;

  // 扩展默认gridOptions
  gridOptions = {
    ...this.gridOptions,
    defaultColDef: this.defaultColDef,
    stopEditingWhenGridLosesFocus: false,
  };
  components;

  /** 检验规则 */
  validatedRule: { [key: string]: { rule: any, tips: any } } = {};

  constructor(
    public pro: BrandService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder,
    private modal: ModalHelper,
    private SubstituteStrategyDetailService: SubstituteStrategyDetailService,
    private fb: FormBuilder,
    public editService: PocSubstituteStrategyDetailEditService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.components = { showCellRenderer: this.createShowCellRenderer() };
    this.defaultColDef.sortable = false;;
    this.initColumns();
    this.headerNameTranslate(this.columnsDef);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.columnsDef[0].cellRendererParams.customTemplate = this.customTemplate;
    this.columnsDef[4].cellRendererParams.customTemplate = this.customTemplate5;

    this.agFormGroup = this.fb.group({});
    (<any>window).fb = this.agFormGroup;

    this.editService.plantCode = this.plantCode;
    this.editService.substituteCode = this.substituteCode;
    this.view2 = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.editService.read();
    this.SubstituteStrategyDetailService.init({
      plantCode: this.plantCode,
      substituteCode: this.substituteCode,
    });
    this.queryCode();
  }

  createShowCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      const cellBlank = !params.value;
      if (cellBlank) {
        return null;
      }
      this.ui = document.createElement('div');
      this.ui.innerHTML = '<div class="show-name">' + params.value;
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }
  // grid数据列集合
  public columnsDef: any[] = [];
  initColumns() {
    // 列定义
    this.columnsDef = [
      {
        colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
        type: 'nonEditableColumn',
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
      },
      {
        field: 'SUBSTITUTE_GROUP',
        headerName: '替代组',
        pinned: 'left',
        lockPinned: true,
        width: 100,
        // cellRenderer: 'showCellRenderer',
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return params.data.SpanCount;
          } else {
            return 0;
          }
        },
        cellClassRules: {
          'test': function (params) {
            return params.data.SpanCount > 0;
          },//让合并数据居中显示
          'cell-span': 'true',
          'show-cell': function (params) {
            return params.data.spanFlag;
          },
        },
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'USE_PRIORITY',
        headerName: '消耗优先级',
        pinned: 'left',
        lockPinned: true,
        width: 100,
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return params.data.SpanCount;
          } else {
            return 0;
          }
        },
        cellClassRules: {
          'test': function (params) {
            return params.data.SpanCount > 0;
          },//让合并数据居中显示
          'cell-span': 'true',
          'show-cell': function (params) {
            return params.data.spanFlag;
          },
        },
      },
      {
        field: 'BUY_PERSENT', headerName: '采购比例',
        pinned: 'left',
        lockPinned: true, width: 150,
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return params.data.SpanCount;
          } else {
            return 0;
          }
        },
        cellClassRules: {
          'test': function (params) {
            return params.data.SpanCount > 0;
          },//让合并数据居中显示
          'cell-span': 'true',
          'show-cell': function (params) {
            return params.data.spanFlag;
          },
        },
      },
      {
        headerName: '替代策略值',
        field: 'SUBSTITUTE_STRATEGY',
        pinned: 'left',
        lockPinned: true,
        width: 150, // 未维护混流工艺路线
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate5
        },
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return params.data.SpanCount;
          } else {
            return 0;
          }
        },
        cellClassRules: {
          'test': function (params) {
            return params.data.SpanCount > 0;
          },
          'cell-span': 'true',
          'show-cell': function (params) {
            return params.data.spanFlag;
          },
        },
        menuTabs: ['filterMenuTab'],
      },
      { field: 'ITEM_CODE', headerName: '物料编码', width: 150 },
      { field: 'DESCRIPTIONS_CN', headerName: '物料描述', width: 150 },
      { field: 'USAGE', headerName: '单位用量', width: 80 },
      { field: 'KEY_FLAG', headerName: '关键物料', width: 150 },
      { field: 'EFFECTIVITY_DATE', headerName: '生效日期', width: 120 },
      { field: 'DISABLE_DATE', headerName: '失效日期', width: 120 },
    ];
  }


  /**
   * 查询明细
   */
  queryCode() {
    this.SubstituteStrategyDetailService.getCode(this.plantCode, this.substituteCode).subscribe(res => {
      this.gridData = res.Result.slice();
      this.view = {
        data: [],
        total: res.TotalCount,
      };
    });
  }

  /**
   * 新增明细
   */
  addCode(item?: any) {
    this.modal.static(AddSubstituteStrategyComponent, {
      i: {
        ID: (item !== undefined ? (item.ID ? item.ID : (item.Id ? item.Id : null)) : null),
        PLANT_CODE: this.plantCode,//(item !== undefined ? item.PLANT_CODE : null),
        SUBSTITUTE_CODE: this.substituteCode,//(item !== undefined ? item.SUBSTITUTE_CODE : null),
        SUBSTITUTE_GROUP: (item !== undefined ? item.SUBSTITUTE_GROUP : null),
        USE_PRIORITY: (item !== undefined ? item.USE_PRIORITY : null),
        BUY_PERSENT: (item !== undefined ? item.BUY_PERSENT : null),
        ITEM_CODE: (item !== undefined ? item.ITEM_CODE : null),
        USAGE: (item !== undefined ? item.USAGE : null),
        KEY_FLAG: (item !== undefined ? item.KEY_FLAG : null),
        EFFECTIVITY_DATE: (item !== undefined ? item.EFFECTIVITY_DATE : null),
        DISABLE_DATE: (item !== undefined ? item.DISABLE_DATE : null),
      },
      isUsePriority: this.useStrategy === '优先级',//用来控制一些输入框是否只读 当头【消耗策略】为优先级时，必填，其他不可填写
      isPercentBalance: this.buyStrategy === '比例均衡',//用来控制一些输入框是否只读 当头【采购策略】为“比例均衡”时，必填，其他不可填写
    })
      .subscribe((value) => {
        if (value) {
          this.queryCode();
        }
      });
  }

  /** recode by jian.huang**/
  /**
   * 打开策略值维护功能
   */
  openstrategyinfo(item?: any) {
    this.modal.static(SubstituteStrategyInfoComponent, {
      plantCode: item.PLANT_CODE,
      substituteCode: item.SUBSTITUTE_CODE,
      strategyGroup: item.SUBSTITUTE_GROUP,
      substituteStrategy: this.substituteStrategy,
      usePriority: item.USE_PRIORITY,
      buyPercent:item.BUY_PERSENT,
      useAge: item.USAGE,
    })
      .subscribe((value) => {
        if (value) {
          this.queryCode();
        }
      });
  }

  /**
   * 删除
   * @param item
   */
  deleteCode(item) {
    this.SubstituteStrategyDetailService.deleteCode(item.ID).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.gridApi.updateRowData({ remove: [item] });
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  public addDetail(item?: any) {

    this.modal.static(AddDetailSubstituteStrategyComponent, {
      i: {
        ID: null,//(item !== undefined ? (item.ID ? item.ID : (item.Id ? item.Id : null)) : null),
        PLANT_CODE: this.plantCode,//(item !== undefined ? item.PLANT_CODE : null),
        SUBSTITUTE_CODE: this.substituteCode,//(item !== undefined ? item.SUBSTITUTE_CODE : null),
        SUBSTITUTE_GROUP: (item !== undefined ? item.SUBSTITUTE_GROUP : null),
        USE_PRIORITY: (item !== undefined ? item.USE_PRIORITY : null),
        BUY_PERSENT: (item !== undefined ? item.BUY_PERSENT : null),
        ITEM_CODE: null,//(item !== undefined ? item.ITEM_CODE : null),
        USAGE: null,//(item !== undefined ? item.USAGE : null),
        KEY_FLAG: null,//(item !== undefined ? item.KEY_FLAG : null),
        EFFECTIVITY_DATE: null,//(item !== undefined ? item.EFFECTIVITY_DATE : null),
        DISABLE_DATE: null,//(item !== undefined ? item.DISABLE_DATE : null),
      },
      isUsePriority: this.useStrategy === '优先级',
      isPercentBalance: this.buyStrategy === '比例均衡',
    })
      .subscribe((value) => {
        if (value) {
          this.queryCode();
        }
      });
  }


  /**
   * 页码切换
   * @param {any} pageNo
   * @param {any} pageSize
   */
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  /**
   * grid准备事件
   */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
