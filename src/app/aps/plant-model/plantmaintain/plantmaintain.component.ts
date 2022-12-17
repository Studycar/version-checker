import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { PlantModelPlantmaintainEditComponent } from './edit/edit.component';
import { SFSchema } from '@delon/form';
import { filter } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
import { ProLineGroupMaintainService } from '../../../modules/generated_module/services/prolinegroupmaintain-service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CommonInputDto } from '../../../modules/generated_module/dtos/common-input-dto';
import {
  GridDataResult,
  RowArgs,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-plantmaintain',
  templateUrl: './plantmaintain.component.html',
  providers: [QueryService],
})
/**工厂维护 */
export class PlantModelPlantmaintainComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 50,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      },
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      // width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptions',
      headerName: '工厂描述',
      // width: 250,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute1',
      headerName: '工厂代码',
      // width: 250,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'scheduleRegionCode',
      // width: 120,
      headerName: '事业部编码',
      menuTabs: ['filterMenuTab'],
      // valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'areaName',
      // width: 120,
      headerName: '事业部描述',
      menuTabs: ['filterMenuTab'],
      // valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'operatingUnitCode',
      // width: 200,
      headerName: '业务实体',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab'],
    },
    // { field: 'WARNINGDAY', headerName: '发运集警告天数', width: 150 },
    {
      field: 'purchasingPlantCode',
      // width: 200,
      headerName: '统一社会信用代码',
      // valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      // width: 100,
      headerName: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
  ];

  operatingunits: any[] = [];
  enableflags: any[] = [];
  masterorganizationids: any[] = [];
  /**事业部集合 */
  scheduleregions: any[] = [];
  /**工厂集合 */
  organizationids: any[] = [];
  /**采购组织 */
  purchasingPlantCodes: any[] = [];
  httpAction = { url: this.plantmaintainService.seachUrl, method: 'POST' };

  public selectBy = 'id';
  /**页面查询参数 */
  public queryParams = {
    defines: [
      {
        field: 'scheduleRegionCode',
        title: '事业部',
        ui: {
          type: UiType.select,
          options: this.scheduleregions,
          ngModelChange: this.onScheduleRegionCodeChange,
        },
        required: true,
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.organizationids, eventNo: 2 },
      },
      { field: 'descriptions', title: '工厂描述', ui: { type: UiType.text } },
      {
        field: 'enableFlag',
        title: '是否有效',
        ui: { type: UiType.select, options: this.enableflags },
      },
    ],
    values: {
      scheduleRegionCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: '',
      descriptions: '',
      enableFlag: 'Y',
    },
  };
  /**导出参数 */
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'scheduleRegionCode', options: this.scheduleregions },
    { field: 'operatingUnitCode', options: this.operatingunits },
    { field: 'enableFlag', options: this.enableflags },
  ];
  allColumnIds: any[] = [];

  /**构造函数 */
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private plantmaintainService: PlantMaintainService,
    public prolinegroupmaintainService: ProLineGroupMaintainService,
    private commonqueryService: CommonQueryService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public pro: BrandService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    private appGridStateService: AppGridStateService, // tslint:disable-next-line:one-line
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  /**页面初始化 */
  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
  }
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.scheduleregions;
        break;
      case 2:
        options = this.enableflags;
        break;
      case 3:
        options = this.operatingunits;
        break;
      case 4:
        options = this.purchasingPlantCodes;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  /**查询 */
  public query() {
    super.query();
    this.queryCommon();
  }

  /**搜索关键字事业部值改变触发的回调 */
  onScheduleRegionCodeChange(value) {
    this.queryParams.values.plantCode = null;
    this.commonqueryService.GetAllPlant(value).subscribe(res => {
      this.organizationids.length = 0;
      res.data.forEach(item => {
        this.organizationids.push({
          label: item.descriptions,
          value: item.plantCode,
        });
      });
    });
  }

  /** 初始化 事业部  下拉框*/
  private loadOptions() {
    this.scheduleregions.length = 0;
    /**加载所有事业部 */
    this.commonqueryService.GetAllScheduleRegion().subscribe(result => {
      result.data.forEach(d => {
        this.scheduleregions.push({
          label: d.descriptions,
          value: d.scheduleRegionCode,
        });
      });
    });
    this.queryCommon();
    /**绑定事业部下工厂 */
    this.onScheduleRegionCodeChange(
      this.queryParams.values.scheduleRegionCode,
    );

    /** 初始化 是否有效  下拉框*/
    this.commonQueryService
      .GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.enableflags.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

    /** 初始化 业务实体  下拉框*/
    this.commonQueryService
      .GetLookupByTypeLang('PS_PLANT_OPERATING_UNIT', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.operatingunits.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

    /** 初始化 业务实体  下拉框*/
    this.commonQueryService
      .GetLookupByTypeLang('SAP_PURCHASING_ORGANIZATION', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.purchasingPlantCodes.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });
  }
  /**查询 */
  private queryCommon() {
    console.log(this.queryParams.values);
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.queryParams.values,
      this.context,
    );
  }

  /**编辑 */
  public modifyda(item: any) {
    console.log(this.scheduleregions);
    this.modal
      .static(
        PlantModelPlantmaintainEditComponent,
        {
          i: {
            PLANTID: item !== undefined ? item.id : null,
            scheduleregions: this.scheduleregions,
            NEWFLAG: 'N',
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /**新增 */
  add() {
    this.modal
      .static(
        PlantModelPlantmaintainEditComponent,
        {
          i: {
            NEWFLAG: 'Y',
            organizationids: this.organizationids,
            scheduleregions: this.scheduleregions,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /**导出 */
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    // this.loadOptions();
    super.export();
    this.commonQueryService.exportAction(
      { url: this.plantmaintainService.exportUrl, method: 'POST' },
      this.queryParams.values,
      this.excelexport,
      this.context,
    );
  }
  /**重置 */
  public clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: null,
      descriptions: '',
      enableFlag: null,
    };
    /**绑定事业部下工厂 */
    this.onScheduleRegionCodeChange(this.appConfigService.getActiveScheduleRegionCode());
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
