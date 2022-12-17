import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { LOOKUP_CODE } from 'app/modules/generated_module/dtos/LOOKUP_CODE';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { EditService } from '../edit.service';
import { T } from '@angular/cdk/keycodes';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-mo-summary2',
  templateUrl: './mo-summary2.component.html',
  providers: [EditService],
})
export class PlanscheduleDigitalizationWorkbenchMoSummary2Component extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';
  i: any;
  isLoading = false;

  public plantCode = '';
  public projectNumberList: string[] = [];

  lockFlagOptions: any[] = LOOKUP_CODE.LOCK_FLAG;
  surfaceOptions: any[] = [];
  steelTypeOptions: any[] = [];
  moStatusOptions: any[] = [];
  yesOrNoOptions: any[] = [];

  public columns = [
    // {
    //   colId: 0,
    //   field: '',
    //   headerName: '操作',
    //   width: 80,
    //   pinned: this.pinnedAlign,
    //   lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: null, // Complementing the Cell Renderer parameters
    //   },
    // },
    // {
    //   colId: 1,
    //   cellClass: '',
    //   field: '',
    //   headerName: '',
    //   width: 40,
    //   pinned: 'left',
    //   lockPinned: true,
    //   checkboxSelection: true,
    //   headerCheckboxSelection: true,
    //   headerCheckboxSelectionFilteredOnly: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    // },

    {
      field: 'projectNumber',
      width: 90,
      headerName: '项目号',
      tooltipField: 'projectNumber',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'makeOrderNum',
      width: 90,
      headerName: 'MO号',
      tooltipField: 'makeOrderNum',
      menuTabs: ['filterMenuTab'],
    },

    {
      field: 'levelNum',
      width: 90,
      headerName: 'MO层级',
      tooltipField: 'levelNum',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceCode',
      width: 90,
      headerName: '资源编码',
      tooltipField: 'resourceCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceDesc',
      width: 90,
      headerName: '资源名称',
      tooltipField: 'resourceDesc',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'manufLineCode',
      width: 90,
      headerName: '产线编码',
      tooltipField: 'manufLineCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'manufLineName',
      width: 90,
      headerName: '产线名称',
      tooltipField: 'manufLineName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'stockCode',
      width: 90,
      headerName: '产品编码',
      tooltipField: 'stockCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'stockName',
      width: 90,
      headerName: '产品名称',
      tooltipField: 'stockName',
      menuTabs: ['filterMenuTab'],
    },

    {
      field: 'steelType',
      width: 90,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'surface',
      width: 90,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'standardsType',
      width: 90,
      headerName: '规格尺寸',
      tooltipField: 'standardsType',
      valueFormatter: 'ctx.formatSpec(value)',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moQty',
      width: 90,
      headerName: '工单数量',
      tooltipField: 'moQty',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'makeOrderStatus',
      width: 90,
      headerName: '工单状态',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lockFlag',
      width: 90,
      headerName: '齐套状态',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'completedQty',
      width: 90,
      headerName: '完工数量',
      tooltipField: 'completedQty',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'demandDate',
      width: 90,
      headerName: '需求日期',
      tooltipField: 'demandDate',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'cusDeliveryDate',
      width: 90,
      headerName: '客户交期',
      tooltipField: 'cusDeliveryDate',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'promiseDate',
      width: 90,
      headerName: '承诺日期',
      tooltipField: 'promiseDate',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'urgent',
      width: 90,
      headerName: '加急标识',
      valueFormatter: 'ctx.optionsFind(value,5).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fpcTime',
      width: 90,
      headerName: '计划开始时间',
      tooltipField: 'fpcTime',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lpcTime',
      width: 90,
      headerName: '计划完成时间',
      tooltipField: 'lpcTime',
      menuTabs: ['filterMenuTab'],
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.surfaceOptions;
        break;
      case 3:
        options = this.moStatusOptions;
        break;
      case 4:
        options = this.lockFlagOptions;
        break;
      case 5:
        options = this.yesOrNoOptions;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  formatSpec(value) {
    const specs = value.split('*');
    if(specs.length > 1 && Number(specs[1]) === Math.floor(specs[1])) {
      specs[1] = Math.floor(specs[1]).toString();
    }
    if(specs.length > 2 && Number(specs[2]) === Math.floor(specs[2])) {
      specs[2] = Math.floor(specs[2]).toString();
    }
    return specs.join('*');
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: EditService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService,
    private appConfigService: AppConfigService,
    private exportImportService: ExportImportService,
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
  /**
   * MO总结
   */
  httpAction = {};


  ngOnInit() {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();

    this.query();
  }
  loadOptions() {
    this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_MAKE_ORDER_STATUS': this.moStatusOptions,
      'FND_YES_NO': this.yesOrNoOptions,
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const httpAction = { url: '/api/ps/digitalizationworkbenchrs/queryMoSummary?plantCode=' + this.plantCode, method: 'POST' };
    this.queryService.loadGridViewNew(
      httpAction,
      this.projectNumberList,
      this.context,
    );
  }


  expData: any[] = [];
  // expColumns = this.columns;
  expColumnsOptions = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'makeOrderStatus', options: this.moStatusOptions },
    { field: 'lockFlag', options: this.lockFlagOptions },
    { field: 'urgent', options: this.yesOrNoOptions },
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const httpAction = { url: '/api/ps/digitalizationworkbenchrs/queryMoSummary?plantCode=' + this.plantCode, method: 'POST' };
    this.queryService.exportAction(httpAction, this.projectNumberList, this.excelexport, this.context);

  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.plantCode,
      projectNumber: this.projectNumberList,
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
