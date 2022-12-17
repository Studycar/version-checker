import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { map, reduce } from 'rxjs/operators';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { DataExceptionService } from './dataexception.service';
import { BaseDataexceptionViewComponent } from './view/view.component';
import { BaseDataexceptionEditComponent } from './edit/edit.component';
import { BaseDataexceptionConfigComponent } from './config/config.component';
import { BaseDataexceptionCalculateComponent } from './calculate/calculate.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-dataexception',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dataexception.component.html',
  providers: [DataExceptionService],
  styles: [`.no-padding{padding:0;}
            .whole-cell{display:block;padding:0;margin:0;}`
  ]
})
export class BaseDataexceptionComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'ID';                    // 选择行的主键ID
  public context = this;                     // 上下文
  public applicationCodeOptions: any[] = []; // 模块下拉
  public isEnabledOptions: any[] = [];       // 是否有效下拉
  private rowClassRules;

  /**查询参数定义 */
  public queryParams = {
    defines: [
      { field: 'applicationCode', title: '模块', ui: { type: UiType.select, options: this.applicationCodeOptions, eventNo: 1 } },
      { field: 'exceptionType', title: '检查类型', ui: { type: UiType.text } },
      { field: 'showException', title: '仅显示例外', ui: { type: UiType.select, options: this.isEnabledOptions } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.isEnabledOptions } }
    ],
    values: {
      plantCode:this.appConfig.getPlantCode(),
      applicationCode: '',
      exceptionType: '',
      showException: 'N',
      enableFlag: ''
    }
  };

  /**主网格栏位和导出excel文件中的栏位定义*/
  public columns = [
    { field: 'applicationCode', title: '模块', width: 150, locked: false, ui: { type: 'select', index: 1, options: this.applicationCodeOptions } },
    { field: 'exceptionType', title: '检查类型', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'description', title: '描述', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'orderByCode', title: '显示优先级', width: 120, locked: false },
    { field: 'exceptionQty', title: '例外数量', width: 110, locked: false, ui: { error: 1 } },
    { field: 'enableFlag', title: '是否有效', width: 110, locked: false, ui: { type: 'select', index: 2, options: this.isEnabledOptions } },
    { field: 'lastCheckDate', title: '检查时间', width: 150, locked: false }
  ];

  public gridColumns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 60, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'applicationCode', headerName: '模块', valueFormatter: 'ctx.optionsFind(value,1).label',menuTabs: ['filterMenuTab'] },
    { field: 'exceptionType', headerName: '检查类型', tooltipField: 'PARAMETER_NAME', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '描述', tooltipField: 'DESCRIPTION', menuTabs: ['filterMenuTab'] },
    { field: 'orderByCode', headerName: '显示优先级', menuTabs: ['filterMenuTab'] },
    { field: 'exceptionQty', headerName: '例外数量', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效',valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'lastCheckDate', headerName: '检查时间', menuTabs: ['filterMenuTab'] }
  ];

  /**构造函数 */
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public dataExceptionService: DataExceptionService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appConfig: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.gridColumns);
  }

  /**页面初始化 */
  ngOnInit(): void {
    this.gridColumns[0].cellRendererParams.customTemplate = this.customTemplate;

    try {
      this.clear();
      this.loadOptions();
      this.viewAsync = this.dataExceptionService.pipe(map(data => process(data, this.gridState)));
      this.query();
    } catch (error) {
      this.msgSrv.error('页面初始化异常！' + error);
    }
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      this.gridApi.sizeColumnsToFit();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  /**主网格数据状态变更事件 */
  public dataStateChange(state: State) {

    this.gridState = state;
    this.dataExceptionService.read(this.dataExceptionService.readAction);
  }
  // #ffff80

  /**设置单元格颜色样式*/
  public setCellClass(dataItem: any, column: any) {
    const _exceptionQty = dataItem.EXCEPTION_QTY;

    if (_exceptionQty !== '0' && _exceptionQty !== null && column.field === 'exceptionQty') {

      return { 'background-color': 'yellow' };
    } else {

      return {};
    }
  }

  /**键值对翻译 */
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationCodeOptions;
        break;
      case 2:
        options = this.isEnabledOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  /**查询 */
  public query() {
    super.query(); // grid初始化
    this.dataExceptionService.loadGridViewNew(this.dataExceptionService.readAction, this.queryParams.values, this.context);
  }

  /**重置 */
  public clear() {
    this.queryParams.values = {
      plantCode:this.appConfig.getPlantCode(),
      applicationCode: null,
      exceptionType: '',
      showException: 'N',
      enableFlag: null
    };
  }

  /**保存 */
  public save(item?: any) {
    this.modal
      .static(BaseDataexceptionEditComponent, { record: (item !== undefined ? item : { id: '' }) })
      .subscribe((result) => {
        if (result) {
          this.query();
        }
      });
  }

  /**删除 */
  public delete() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.dataExceptionService
          .delete({ ids: this.selectionKeys })
          .subscribe(result => {
            if (result.code == 200) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.query();
            } else {
              this.msgSrv.warning(this.appTranslationService.translate(result.msg));
            }
          });
      },
    });
  }

  /**脚本配置 */
  public config() {
    if (this.selectionKeys.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择一条记录！'));
      return;
    }
    this.modal
      .static(BaseDataexceptionConfigComponent, { record: { id: this.selectionKeys[0] } })
      .subscribe((result) => {
        if (result) {
          this.query();
        }
      });
  }

  /**例外计算 */
  public calculate() {
    this.modal
      .static(BaseDataexceptionCalculateComponent, { record: { ids: this.selectionKeys, Mode: '' } }, 450, 450)
      .subscribe((result) => {
        if (result) {
          this.query();
        }
      });
  }

  /**例外查看 */
  public queryDetail() {
    if (this.selectionKeys.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择一条记录！'));
      return;
    }
    this.modal
      .static(BaseDataexceptionViewComponent, { record: { id: this.selectionKeys[0], applicationCode: '', exceptionType: '' } })
      .subscribe((result) => {
        if (result) {
          this.query();
        }
      });
  }

  /**导出网格数据控制 */
  expData: any[] = [];
  expColumns = this.columns;
  hiddenColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'applicationCode', options: this.applicationCodeOptions },
    { field: 'enableFlag', options: this.isEnabledOptions }
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.dataExceptionService.export(this.dataExceptionService.readAction, this.queryParams.values, this.excelexport);
  }

  /**加载下拉数据源 */
  private loadOptions(): void {
    this.loadApplicationCodeData();
    this.loadIsEnabledData();
  }

  /**加载模块数据 */
  private loadApplicationCodeData() {
    this.dataExceptionService.GetApplication().subscribe(result => {
      this.applicationCodeOptions.length = 0;
      result.data.forEach(d => {
        this.applicationCodeOptions.push({
          label: d.applicationName,
          value: d.applicationCode
        });
      });
    });
  }

  /**加载是否可用数据 */
  private loadIsEnabledData() {
    this.dataExceptionService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.isEnabledOptions.length = 0;
      result.Extra.forEach(d => {
        this.isEnabledOptions.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
    });
  }

  selectKeys = 'id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
