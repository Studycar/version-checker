import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PreparationPlatformWorkingMaterialComponent } from './working-material/working-material.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryKitStatusService } from '../../../modules/generated_module/services/query-kit-status-service';
import { State, process } from '../../../../../node_modules/@progress/kendo-data-query';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from '../query-kit-status/query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppGridStateService } from '../../../modules/base_module/services/app-gridstate-service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'querykitstatus',
  templateUrl: './query-kit-status.component.html',
  providers: [QueryService]
})
export class PreparationPlatformQueryKitStatusComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.gridData = [];
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.UserPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PC_KIT_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.KitStatusOption.push({
          label: d.meaning,
          value: d.meaning,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.MoStatusOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.queryKitStatusService.getBuyers().subscribe(result => {
      if (result.data !== undefined && result.data !== null) {
        result.data.forEach(x => {
          this.BuyersOptions.push({
            label: x.fullName,
            value: x.buyerId,
          });
        });
      }
    });

    this.plantChange(null);
  }
  public mySelection: any[] = [];
  public selectBy = 'ID';
  public context = this;
  public applicationOptions: any[] = [];
  public languageOptions: any[] = [];
  public menuTypeOptions: any[] = [];
  public windowTypeOptions: any[] = [];
  public parentMenuOptions: any[] = [];

  public UserPlantOptions: any[] = [];
  public KitStatusOption: any[] = [];
  public MoStatusOptions: any[] = [];
  public linegroupoptions: any[] = [];
  public PlantGroupLineoptions: any[] = [];
  public BuyersOptions: any[] = [];
  // 装配件编码从
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.UserPlantOptions, eventNo: 1 } },
      { field: 'moDate', title: '工单开始日期', ui: { type: UiType.dateRange } },
      { field: 'moStatus', title: '工单状态', ui: { type: UiType.select, options: this.MoStatusOptions } },
      { field: 'makeOrderNum', title: '工单号', ui: { type: UiType.string } },
      { field: 'kitStatus', title: '标准齐套状态', ui: { type: UiType.select, options: this.KitStatusOption } },
      { field: 'expendKitStatus', title: '扩展齐套状态', ui: { type: UiType.select, options: this.KitStatusOption } },
      { field: 'scheduleGroup', title: '计划组', ui: { type: UiType.select, options: this.linegroupoptions, eventNo: 2 } },
      { field: 'prodLine', title: '资源', ui: { type: UiType.select, options: this.PlantGroupLineoptions } },
      {
        field: 'itemCode', title: '装配件编码', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode'
          , gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 3
        }
      }
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      moDate: [],
      makeOrderNum: '',
      kitStatus: '',
      expendKitStatus: '',
      scheduleGroup: '',
      prodLine: '',
      moStatus: '',
      itemCode: { value: '', text: '' },
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 80 },
    { field: 'scheduleGroupCode', headerName: '计划组', width: 80 },
    { field: 'resourceCode', headerName: '资源', width: 80 },
    { field: 'startDate', headerName: '工单开始时间', width: 150 },
    { field: 'makeOrderNum', headerName: '工单号', width: 100 },
    { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,1).label', width: 100 },
    { field: 'moQty', headerName: '工单数量', width: 100 },
    { field: 'itemCode', headerName: '装配件编码', width: 120 },
    { field: 'itemDesc', headerName: '装配件描述', tooltipField: 'itemDesc', width: 120 },
    { field: 'attribute1', headerName: '关键料标准齐套状态', width: 150 },
    { field: 'standardKitStatus', headerName: '标准齐套状态', width: 120 },
    { field: 'standardKitCount', headerName: '标准齐套缺料个数', width: 150 },
    { field: 'attribute2', headerName: '关键料扩展齐套状态', width: 150 },
    { field: 'extendKitStatus', headerName: '扩展齐套状态', width: 120 },
    { field: 'extendKitCount', headerName: '扩展齐套缺料个数', width: 150 }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 100, locked: false, ui: { tooltip: 1 } },
    { field: 'scheduleGroupCode', title: '计划组', width: 120, locked: false, },
    { field: 'resourceCode', title: '资源', width: 120, locked: false },
    { field: 'startDate', title: '工单开始时间', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'makeOrderNum', title: '工单号', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'makeOrderStatus', title: '工单状态', width: 100, locked: false, ui: { type: 'select', index: 1, options: this.MoStatusOptions } },
    { field: 'moQty', title: '工单数量', width: 150, locked: false },
    { field: 'itemCode', title: '装配件编码', width: 150, locked: false },
    { field: 'itemDesc', title: '装配件描述', width: 200, locked: false, ui: { tooltip: 1 } },
    { field: 'standardKitStatus', title: '标准齐套状态', width: 150, locked: false },
    { field: 'standardKitCount', title: '标准齐套缺料个数', width: 150, locked: false },
    { field: 'extendKitStatus', title: '扩展齐套状态', width: 150, locked: false },
    { field: 'extendKitCount', title: '扩展齐套缺料个数', width: 150, locked: false }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.MoStatusOptions;
        break;
      case 2:
        options = this.KitStatusOption;
        break;
      case 3:
        options = this.menuTypeOptions;
        break;
      case 4:
        options = this.windowTypeOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  httpAction = { url: this.queryKitStatusService.queryUrl, method: 'POST', data: false };
  public query() {
    // this.loadOptions();
    this.queryCommon();
  }
  public queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.gridState.take = event.take;
    this.commonQueryService.read(this.httpAction);
    // 重新加载数据但不请求服务端了
  }

  public groupChange(value: any) {
    this.loadLine();
  }

  public plantChange(value: any) {
    // this.loadBuyers();
    this.loadGroup();
    this.loadLine();
  }

  loadGroup() {
    this.linegroupoptions.length = 0;
    this.queryParams.values.scheduleGroup = null;
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode).subscribe(result => {
      result.Extra.forEach(d => {
        this.linegroupoptions.push({
          label: d.scheduleGroupCode,
          value: d.scheduleGroupCode,
        });
      });
    });
  }

  public loadLine() {
    this.PlantGroupLineoptions.length = 0;
    this.queryParams.values.prodLine = null;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode, this.queryParams.values.scheduleGroup)
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          result.Extra.forEach(x => {
            this.PlantGroupLineoptions.push({
              label: x.resourceCode,
              value: x.resourceCode,
            });
          });
        }
      });
  }

  private getQueryParamsValue(isExport: boolean): any {
    return {
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      plantCode: this.queryParams.values.plantCode,
      moStartDate: this.queryParams.values.moDate[0] ? this.commonQueryService.formatDateTime(this.queryParams.values.moDate[0]) : null,
      moEndDate: this.queryParams.values.moDate[1] ? this.commonQueryService.formatDateTime(this.queryParams.values.moDate[1]) : null,
      makeOrderNum: this.queryParams.values.makeOrderNum,
      itemCode: this.queryParams.values.itemCode.text,
      kitStatus: this.queryParams.values.kitStatus,
      expendKitStatus: this.queryParams.values.expendKitStatus,
      scheduleGroup: this.queryParams.values.scheduleGroup,
      prodLine: this.queryParams.values.prodLine,
      moStatus: this.queryParams.values.moStatus,
      export: isExport
    };
  }

  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode || this.appConfigService.getPlantCode(), e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  public openWorkingMaterial(item: any) {
    this.modal
      .static(PreparationPlatformWorkingMaterialComponent, {
        plantCode: item.plantCode,
        makeOrderNum: item.makeOrderNum,
        // MoStatusOptions: this.MoStatusOptions
      })
      .subscribe((value) => {
        if (value) {
          // this.queryCommon();
        }
      });
  }

  expData: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.MoStatusOptions }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParamsValue(true), this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      moDate: [],
      makeOrderNum: '',
      kitStatus: '',
      expendKitStatus: '',
      scheduleGroup: null,
      prodLine: null,
      moStatus: '',
      itemCode: { value: '', text: '' },
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.query();
    } else {
      this.setLoading(false);
    }
  }
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryKitStatusService: QueryKitStatusService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('quer_mo_kit_status');
  }
}
