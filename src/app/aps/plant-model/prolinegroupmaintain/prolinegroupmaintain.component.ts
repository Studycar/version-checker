import { SFSchema } from '@delon/form';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { PlantModelProlinegroupmaintainEditComponent } from './edit/edit.component';
import { filter } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { ProLineGroupMaintainService } from '../../../modules/generated_module/services/prolinegroupmaintain-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { QueryService } from './query.service';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-prolinegroupmaintain',
  templateUrl: './prolinegroupmaintain.component.html',
  providers: [QueryService]
})
/**
 * 计划组
 */
export class PlantModelProlinegroupmaintainComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  httpAction = { url: this.prolinegroupmaintainService.seachUrl, method: 'POST' };
  context = this;
  selectItems: any[] = [];
  expandForm = false;
  scheduleregions: any[] = [];
  plants: any[] = [];
  /**计划组集合 */
  schedulegroups: any[] = [];
  linkagelevels: any[] = [];
  enableflags: any[] = [];
  schedulealgorithms: any[] = [];
  params: any = {};
  allColumnIds: any[] = [];

  /**表格显示列 */
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 50, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'scheduleRegionCode', headerName: '事业部编码', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'scheduleRegionDesc', headerName: '事业部描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂编码', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'plantDesc', headerName: '工厂描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组编码', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '计划组描述', width: 200, locked: false, ui: { tooltip: 1 }, menuTabs: ['filterMenuTab'] },
    { field: 'scheduleStartTime', headerName: '排产滚动开始时间', width: 150, locked: false, menuTabs: ['filterMenuTab'] },
    { field: 'schedulePeriod', headerName: '排产滚动周期', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
    // {
    //   field: 'scheduleAlgorithm', width: 100, headerName: '排程算法',
    //   valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab']
    // },
    { field: 'fixTimeFence', headerName: '固定时间栏(天)', width: 130, locked: false, menuTabs: ['filterMenuTab'] },
    // { field: 'moCompleteTimeOffset', headerName: '工单完工偏移量(小时)', width: 180, locked: false, menuTabs: ['filterMenuTab'] },
    // { field: 'orderByCode', headerName: '排序码', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
    // {
    //   field: 'linkageLevel', width: 100, headerName: '联动层级',
    //   valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    // },
    // {
    //   field: 'linkageReleaseFlag', width: 100, headerName: '联动发放',
    //   valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    // },
    // {
    //   field: 'enableMould', width: 100, headerName: '启用模具',
    //   valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    // },
    // {
    //   field: 'processScheduleFlag', width: 150, headerName: '启用工序排产标识',
    //   valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    // },
    {
      field: 'enableFlag', width: 100, headerName: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.linkagelevels;
        break;
      case 2:
        options = this.enableflags;
        break;
      case 3:
        options = this.schedulealgorithms;
        break;
      case 4:
        options = this.scheduleregions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  /**页面查询条件 */
  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', ui: { type: UiType.select, options: this.scheduleregions, ngModelChange: this.scheduleRegionChange }, required: true},
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plants, ngModelChange: this.plantChange }},
      { field: 'scheduleGroupCode', title: '计划组编码', ui: { type: UiType.select, options: this.schedulegroups } },
      { field: 'descriptions', title: '计划组描述', ui: { type: UiType.text } }
    ],
    values: {
      scheduleRegionCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      descriptions: ''
    }
  };
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'scheduleAlgorithm', options: this.schedulealgorithms },
    { field: 'linkageLevel', options: this.linkagelevels },
    { field: 'linkageReleaseFlag', options: this.enableflags },
    { field: 'enableMould', options: this.enableflags },
    { field: 'enableFlag', options: this.enableflags },
    { field: 'processScheduleFlag', options: this.enableflags }
  ];

  /**构造函数 */
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    public prolinegroupmaintainService: ProLineGroupMaintainService,
    private plantmaintainService: PlantMaintainService,
    public commonQueryService: QueryService,
    private commonqueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    public pro: BrandService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  /**页面初始化 */
  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.headerNameTranslate(this.columns);
    this.clear();
    this.loadOptions();
    this.query();
  }

  private loadOptions() {
    /** 初始化 事业部  下拉框*/
    this.scheduleregions.length = 0;
    this.commonqueryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.scheduleregions.push({
          label: d.descriptions,
          value: d.scheduleRegionCode,
        });
      });
    });
    /**绑定事业部下工厂 */
    // this.LoadPlants(this.appConfigService.getActiveScheduleRegionCode());

    this.commonqueryService
    .GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.enableflags.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    /** 初始化 联动层级  下拉框*/
    this.commonqueryService
    .GetLookupByTypeLang('PS_LINKAGE_LEVEL', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.linkagelevels.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    this.commonqueryService.GetLookupByType('PS_PLANNING_BASIC_ALGORITHM').subscribe(result => {
      result.Extra.forEach(d => {
        this.schedulealgorithms.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.loadOptions();
    super.export();
    this.commonQueryService.exportAction({ url: this.prolinegroupmaintainService.exportUrl, method: 'POST' }, this.queryParams.values, this.excelexport, this.context);
  }
  /**重置 */
  public clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      descriptions: ''
    };
    /**绑定事业部下工厂 */
    this.LoadPlants(this.queryParams.values.scheduleRegionCode);
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.read(this.httpAction);
  }
  /**查询 */
  public query() {
    super.query();
    this.queryCommon();
  }

  // 事业部切换
  public scheduleRegionChange(event: string) {
    this.LoadPlants(event);
  }

  // 工厂切换
  plantChange(event: string) {
    this.LoadScheduleGroups(event);
  }

  /**加载工厂 */
  public LoadPlants(scheduleRegionCode: string = '') {
    this.plants.length = 0; // 工厂下拉，
    this.queryParams.values.plantCode = this.appConfigService.getPlantCode();
    this.commonqueryService.GetUserPlant(scheduleRegionCode).subscribe(result => {
      result.Extra.forEach(d => {
        this.plants.push({
          label: d.descriptions,
          value: d.plantCode
        });
      });
      this.LoadScheduleGroups(result.Extra[0].plantCode);
    });
  }
  /**加载计划组 */
  public LoadScheduleGroups(plantCode: string = '') {
    this.schedulegroups.slice(0, this.schedulegroups.length);
    this.schedulegroups.length = 0;
    // this.queryParams.values.scheduleGroupCode = null;
    
    this.prolinegroupmaintainService.GetScheduleGroups(plantCode, this.queryParams.values.scheduleRegionCode).subscribe(result => {
      result.data.forEach(d => {
        this.schedulegroups.push({
          label: d.descriptions,
          value: d.scheduleGroupCode,
        });
      });
      if(result.data.length)this.queryParams.values.scheduleGroupCode = result.data[0].scheduleGroupCode;
    });
  }
  /**查询 */
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }
  /**增加 */
  add() {
    this.modal
      .static(
      PlantModelProlinegroupmaintainEditComponent,
      { i: { NEWFLAG: 'Y', scheduleregions: this.scheduleregions } },
      'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /**修改 */
  public modifyda(item: any) {
    this.modal
      .static(
      PlantModelProlinegroupmaintainEditComponent,
      { i: { ID: (item !== undefined ? item.id : null), NEWFLAG: 'N', scheduleregions: this.scheduleregions } },
      'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
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
