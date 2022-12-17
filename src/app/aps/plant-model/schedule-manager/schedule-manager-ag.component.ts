import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScheduleManagerEditService } from './edit.service';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from '../../base/message/query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { ScheduleManagerService } from '../../../modules/generated_module/services/schedule-manager-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { PlantModelScheduleManagerEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
/**
 * 事业部
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-schedule-manager-ag',
  templateUrl: './schedule-manager-ag.component.html',
  providers: [ScheduleManagerEditService, QueryService],
})
export class PlantModelScheduleManagerAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  // public planAreaOptions: any[] = [];
  public enableOptions: any[] = [];
  public selectBy = 'id';

  public queryParams = {
    defines: [
      // { field: 'scheduleRegionCode', title: '事业部', ui: { type: UiType.string, options: this.planAreaOptions } },
      { field: 'scheduleRegionCode', title: '事业部', ui: { type: UiType.string } },
      { field: 'descriptions', title: '事业部描述', ui: { type: UiType.string } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.enableOptions } }
    ],
    values: {
      scheduleRegionCode: '',
      descriptions: '',
      enableFlag: ''
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
    { field: 'scheduleRegionCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '描述', tooltipField: 'DESCRIPTIONS', menuTabs: ['filterMenuTab'] },
    { field: 'planStartTime', headerName: '排产滚动开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'periodicTime', headerName: '排产滚动周期', menuTabs: ['filterMenuTab'] },
    { field: 'calendarCode', headerName: '工作日历编码', menuTabs: ['filterMenuTab'] },
    {
      field: 'enableFlag', headerName: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      ui: { options: this.enableOptions }, menuTabs: ['filterMenuTab']
    },
  ];

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private scheduleManagerService: ScheduleManagerService,
    private messageManageService: MessageManageService,
    public editService: ScheduleManagerEditService, /* grid行内单元格编辑 */
    public commonQueryService: QueryService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
  }

  ngOnInit() {
    // this.gridApi.sizeColumnsToFit();
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.commonQueryService
    .GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.enableOptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });
    /*this.scheduleManagerService.GetScheduleRegion().subscribe(result => {
      result.Extra.forEach(d => {
        this.planAreaOptions.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });*/
    this.clear();
    this.query();
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
    this.setGridWidth('pcbuyer');
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.enableOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
    { field: 'enableFlag', options: this.enableOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction(this.httpAction, this.queryParams.values, this.excelexport, this.context);
  }
  httpAction = { url: this.scheduleManagerService.queryUrl, method: 'POST' };
  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }
  public add(item?: any) {
    this.modal
      .static(PlantModelScheduleManagerEditComponent, { i: (item !== undefined ? this.clone(item) : { id: null }), columns: this.columns })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public clear() {
    this.queryParams.values = {
      scheduleRegionCode: '',
      descriptions: '',
      enableFlag: null
    };
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
