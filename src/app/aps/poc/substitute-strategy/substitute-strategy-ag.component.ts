import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { SubstituteStrategyDetailComponent } from './detail/substitute-strategy-detail.component';
import { SubstituteStrategyEditComponent } from './edit/edit.component';
//import { LookupCodeManageService } from '../../../modules/generated_module/services/lookup-code-manage-service';
//import { SubstituteStrategyManageService } from '../../../modules/generated_module/services/substitute-strategy-manage-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { DragModalService } from '../../../modules/base_module/services/drag-modal.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'substitute-strategy-ag',
  templateUrl: './substitute-strategy-ag.component.html',
  providers: [QueryService],
})
export class SubstituteStrategyAGComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'LOOKUP_TYPE_CODE';
  //public languageOptions: any[] = [];
  public substituteStrategyOptions: any[] = [];//替代策略值集
  public useStrategyOptions: any[] = [];//消耗策略值集
  public buyStrategyOptions: any[] = [];//采购策略值集
  public mixUseOptions: any[] = [];
  public applicationOptions: any[] = [];
  public LngOptions: any[] = [];
  plants: any[] = [];
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100',
    },
  ];

  public queryParams = {
    defines: [
      {
        field: 'PLANT_CODE', title: '工厂',
        //ui: { type: UiType.select, options: this.plants, ngModelChange: this.plantChange },
        ui: { type: UiType.select, options: this.plants, eventNo: 2 },
        required: true,
      },
      { field: 'SUBSTITUTE_NAME', title: '替代名称', ui: { type: UiType.string } },
      { field: 'SUBSTITUTE_STRATEGY', title: '替代策略', ui: { type: UiType.select, options: this.substituteStrategyOptions } },
      {
        field: 'ITEM_CODE', title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'ITEM_CODE',
          textField: 'ITEM_CODE' /*valueField和textField与gridView的列对应  */,
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
        },
      },
      { field: 'ITEM_DESC', title: '物料描述', ui: { type: UiType.string } },
    ],
    values: {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      SUBSTITUTE_NAME: '',
      SUBSTITUTE_STRATEGY: '',
      ITEM_CODE: { value: '', text: '' },
      ITEM_DESC: '',
    },
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      // cellRendererParams: {
      //   customTemplate: this.customTemplate,
      // },
    },
    { field: 'PLANT_CODE', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'SUBSTITUTE_CODE', headerName: '替代名录编码', tooltipField: 'MEANING', menuTabs: ['filterMenuTab'] },
    { field: 'SUBSTITUTE_NAME', headerName: '替代名称', menuTabs: ['filterMenuTab'] },
    {
      field: 'MIX_USED', headerName: '混用',
      valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'SUBSTITUTE_STRATEGY', headerName: '替代策略',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'USE_STRATEGY', headerName: '消耗策略',
      valueFormatter: 'ctx.optionsFind(value,4).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'BUY_STRATEGY', headerName: '采购策略',
      valueFormatter: 'ctx.optionsFind(value,5).label', menuTabs: ['filterMenuTab']
    },
    { field: 'EFFECTIVITY_DATE', headerName: '生效日期', menuTabs: ['filterMenuTab'] },
    { field: 'DISABLE_DATE', headerName: '失效日期', menuTabs: ['filterMenuTab'] },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationOptions;
        break;
      case 2:
        options = this.substituteStrategyOptions;
        break;
      case 3:
        options = this.mixUseOptions;
        break;
      case 4:
        options = this.useStrategyOptions;
        break;
      case 5:
        options = this.buyStrategyOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private dragModal: DragModalService,
    private msgSrv: NzMessageService,
    //private lookupcodeManageService: LookupCodeManageService,
    // private SubstituteStrategyManageService: SubstituteStrategyManageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
  }

  ngOnInit() {
    this.loadOptions();
    this.clear();
    this.queryCommon();

    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
  }

  /**加载工厂 */
  public LoadPlants(SCHEDULE_REGION_CODE: string = '') {
    this.plants.length = 0; // 工厂下拉，
    this.queryParams.values.PLANT_CODE = null;
    this.commonQueryService.GetUserPlant(SCHEDULE_REGION_CODE).subscribe(result => {
      result.Extra.forEach(d => {
        this.plants.push({
          label: d.PLANT_CODE,
          value: d.PLANT_CODE
        });
      });
    });
  }

  // 工厂切换
  plantChange(event: string) {

  }

  public loadItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
    ViewNo: number = 1,
  ) {
    // 加载物料
    this.commonQueryService
      .GetUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        if (ViewNo === 1) {
          this.gridViewItems.data = res.Result;
          this.gridViewItems.total = res.TotalCount;
        }
        // else {
        //   this.gridViewItems2.data = res.Result;
        //   this.gridViewItems2.total = res.TotalCount;
        // }
      });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.PLANT_CODE,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }


  // 物料弹出查询
  public searchItems2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.PLANT_CODE,
      e.SearchValue,
      PageIndex,
      e.PageSize,
      2,
    );
  }

  onPopupRowSelectChanged(event: any) {
    this.queryParams.values.ITEM_DESC = event.Value;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('lookupcode');
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
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  private loadOptions() {

    this.LoadPlants();

    /**初始化 加载替代策略 */
    this.commonQueryService.GetLookupByType('MRP_SUBSTITUTE_STRATEGY').subscribe(result => {
      result.Extra.forEach(d => {
        this.substituteStrategyOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    /**初始化 加载消耗策略 */
    this.commonQueryService.GetLookupByType('MRP_SUBSTITUTE_USE_STRATEGY').subscribe(result => {
      result.Extra.forEach(d => {
        this.useStrategyOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    /**初始化 加载采购策略 */
    this.commonQueryService.GetLookupByType('MRP_SUBSTITUTE_BUY_STRATEGY').subscribe(result => {
      result.Extra.forEach(d => {
        this.buyStrategyOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    /**初始化 是否混用 */
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.mixUseOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }

  httpAction: any;// { url: this.SubstituteStrategyManageService.queryUrl, method: 'POST' };

  public query() {
    super.query();
    //this.loadOptions();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(this.httpAction,
      //this.queryParams.values,
      this.getQueryParamsValue(),
      this.context);
  }

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      PLANT_CODE: this.queryParams.values.PLANT_CODE,
      ITEM_CODE: this.queryParams.values.ITEM_CODE.text,
      // ITEM_CODE_MAX: this.queryParams.values.ITEM_CODE_MAX.text,
      SUBSTITUTE_NAME: this.queryParams.values.SUBSTITUTE_NAME,
      SUBSTITUTE_STRATEGY: this.queryParams.values.SUBSTITUTE_STRATEGY,
      ITEM_DESC: this.queryParams.values.ITEM_DESC,
      // PAGE_INDEX: this._pageNo,
      // PAGE_SIZE: this._pageSize,
    };
  }

  public add(item?: any) {
    this.modal.static(SubstituteStrategyEditComponent, {
      i: {
        ID: (item !== undefined ? (item.ID ? item.ID : (item.Id ? item.Id : null)) : null),
        PLANT_CODE: (item !== undefined ? item.PLANT_CODE : null),
        SUBSTITUTE_CODE: (item !== undefined ? item.SUBSTITUTE_CODE : null),
        SUBSTITUTE_NAME: (item !== undefined ? item.SUBSTITUTE_NAME : null),
        MIX_USED: (item !== undefined ? item.MIX_USED : null),
        SUBSTITUTE_STRATEGY: (item !== undefined ? item.SUBSTITUTE_STRATEGY : null),
        USE_STRATEGY: (item !== undefined ? item.USE_STRATEGY : null),
        BUY_STRATEGY: (item !== undefined ? item.BUY_STRATEGY : null),
        EFFECTIVITY_DATE: (item !== undefined ? item.EFFECTIVITY_DATE : null),
        DISABLE_DATE: (item !== undefined ? item.DISABLE_DATE : null),
      },
      plantOptions: this.plants,
      mixUseOptions: this.mixUseOptions,
      substituteStrategyOptions: this.substituteStrategyOptions,
      useStrategyOptions: this.useStrategyOptions,
      buyStrategyOptions: this.buyStrategyOptions,
    })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public detail(item?: any) {
    // this.dragModal.create(BaseLookupCodeDetailComponent, {
    this.modal.static(SubstituteStrategyDetailComponent, {
      plantCode: item.PLANT_CODE,
      substituteCode: item.SUBSTITUTE_CODE,
      substituteStrategy: item.SUBSTITUTE_STRATEGY,
      useStrategy: item.USE_STRATEGY,
      buyStrategy: item.BUY_STRATEGY,
    }).subscribe(() => {
    });
  }

  public remove(item: any) {
    // this.SubstituteStrategyManageService.Remove(item.ID).subscribe(res => {
    //   if (res.Success) {
    //     this.msgSrv.success(this.appTranslationService.translate('删除成功'));
    //     this.queryCommon();
    //   } else {
    //     this.msgSrv.error(this.appTranslationService.translate(res.Message));
    //   }
    // });
  }

  /*
  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.lookupcodeManageService
          .removeBatch(this.selectionKeys)
          .subscribe(res => {
            if (res.Success) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.Message));
            }
          });
      },
    });
  }
  */

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'PLANT_CODE', options: this.plants },
    { field: 'MIX_USED', options: this.mixUseOptions },
    { field: 'SUBSTITUTE_STRATEGY', options: this.substituteStrategyOptions },
    { field: 'USE_STRATEGY', options: this.useStrategyOptions },
    { field: 'BUY_STRATEGY', options: this.buyStrategyOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    // this.commonQueryService.exportAction({
    //   url: this.commonQueryService.exportUrl,
    //   method: 'POST',
    // }, 
    // //this.queryParams.values, 
    // this.getQueryParamsValue(),
    // this.excelexport, this.context);
    this.commonQueryService.export({
      url: this.commonQueryService.exportUrl,
      method: 'POST',
    }, this.getQueryParamsValue(), this.excelexport, this.context);
  }

  public clear() {
    this.queryParams.values = {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      SUBSTITUTE_NAME: '',
      SUBSTITUTE_STRATEGY: '',
      ITEM_CODE: { value: '', text: '' },
      ITEM_DESC: '',
    };

    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
    this.plantChange(this.queryParams.values.PLANT_CODE);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
