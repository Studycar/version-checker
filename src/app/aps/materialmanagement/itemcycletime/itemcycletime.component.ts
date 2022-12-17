import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { FunctionmanagerService } from '../../../modules/generated_module/services/functionmanager-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { ProLineGroupMaintainService } from '../../../modules/generated_module/services/prolinegroupmaintain-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { ItemCycleTimeEditService } from './edit.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { MaterialmanagementItemcycletimeEditComponent } from 'app/aps/materialmanagement/itemcycletime/edit/edit.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MaterialmanagementItemcycletimeViewComponent } from 'app/aps/materialmanagement/itemcycletime/view/view.component';
@Component({
  selector: 'materialmanagement-itemcycletime',
  templateUrl: './itemcycletime.component.html',
  providers: [ItemCycleTimeEditService],
})
export class MaterialmanagementItemcycletimeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public optionListPlant: any[] = [];
  public optionListCyclytime = [];
  public selectBy = 'Id';
  isLoading = false;
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
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.optionListPlant } },
      {
        field: 'ITEM_CODE_S', title: '物料起始值', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      {
        field: 'ITEM_CODE_E', title: '物料结束值', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      ITEM_CODE_S: { value: '', text: '' },
      ITEM_CODE_E: { value: '', text: '' }
    }
  };

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.optionListCyclytime;
        console.log(options);
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  httpAction = { url: this.editService.seachUrl, method: 'POST' };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 90, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'attribute1', headerName: '物料描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    {
      field: 'cycleTimeType', headerName: '周期类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      width: 120, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'cycleTime', headerName: '天数', width: 160, locked: false, menuTabs: ['filterMenuTab']
    },
    { field: 'enableDate', headerName: '生效日期', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
    { field: 'disableDate', headerName: '失效日期', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public functionmanagerService: FunctionmanagerService,
    public messageManageService: MessageManageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public prolinegroupmaintainService: ProLineGroupMaintainService,
    private plantmaintainService: PlantMaintainService,
    public editService: ItemCycleTimeEditService,
    private commonqueryService: CommonQueryService,
    private appconfig: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'cycleTimeType', options: this.optionListCyclytime }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonqueryService.export({ url: this.editService.seachUrl, method: 'POST' }, this.getQueryParamsValue('export'), this.excelexport, this.context);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadplant();
    this.loadItemCycleTime();
    this.queryCommon();
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
      if (this.allColumnIds.length <= 10) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('itemcycletime');
  }

  private getQueryParamsValue(queryorexport: string): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      attribute1: this.queryParams.values.ITEM_CODE_S.text,
      attribute2: this.queryParams.values.ITEM_CODE_E.text,
      attribute3: queryorexport === 'query' ? this.lastPageNo.toString() : '',
      attribute4: queryorexport === 'query' ? this.lastPageSize.toString() : ''
    };
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonqueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue('query'), this.context);
  }

  public add(item: any) {
    this.modal
      .static(
        MaterialmanagementItemcycletimeEditComponent,
        {
          i: {
            id: (item !== undefined ? item.id : null),
            plantCode: (item !== undefined ? item.plantCode : null)
          }
        },
        'lg',
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }


  public remove(item: any) {
    this.editService.Remove(item).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {

      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    // console.log(this.selectionKeys);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  // 导入
  public import() {
    this.modal
      .static(MaterialmanagementItemcycletimeViewComponent, {}, 'md')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public clear() {
    this.queryParams.values = {
      plantCode: '',
      ITEM_CODE_S: { value: '', text: '' },
      ITEM_CODE_E: { value: '', text: '' }
    };
    this.loadplant();
  }
  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonqueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      this.queryParams.values.plantCode = this.appconfig.getPlantCode();

      // 绑定物料
      this.queryParams.values.ITEM_CODE_E.text = '';
      this.queryParams.values.ITEM_CODE_S.text = '';
      this.loadItems(this.queryParams.values.plantCode, '', 1, 10);

      // this.query();
    });
  }

  loadItemCycleTime(): void {
    /** 初始化 周期类型  下拉框*/
    this.commonqueryService.GetLookupByType('PS_ITEM_CYCLE_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListCyclytime.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

  }
  // 绑定页面的下拉框周期类型组
  public loadCyclytime(): void {
    this.commonqueryService.GetLookupByType('PS_ITEM_CYCLE_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListCyclytime.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }
  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonqueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;


}
