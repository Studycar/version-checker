import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { QueryService } from './queryService';
import { GridDataResult } from '@progress/kendo-angular-grid';
/**
 * 模具信息维护
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-production-manager',
  templateUrl: './list.component.html',
  providers: [QueryService],
})
export class PsProductionComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  httpAction = {
    url: this.queryService.seachUrl,
    method: 'GET',
    data: false,
  };
  context = this;
  plantOptions: any[] = [];
  yesOrNoOptions: any[] = [];
  productCategoryOptions: any[] = [];
  unitOptions: any[] = [];


  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions },
        required: true,
      },

      {
        field: 'productCategory',
        title: '产品大类',
        ui: { type: UiType.select, options: this.productCategoryOptions },
      },
      {
        field: 'stockCode',
        title: '产品编码',
        ui: { type: UiType.text },
      },

      {
        field: 'stockName',
        title: '产品名称',
        ui: { type: UiType.text },
      },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      stockCode: '',
      stockName: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
    },
  };
  public columns = [
    /*
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    */
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'productionCategory',
      headerName: '产品大类',
      width: 100,
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'stockCode',
      headerName: '产品编码',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'stockName',
      headerName: '产品名称',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'stockDesc',
      headerName: '产品描述',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'labelDesc',
      headerName: '标签描述',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'unitWeight',
      headerName: '胶膜重量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'catId',
      headerName: '产品类目标识',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'catName',
      headerName: '产品类目名称',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },

    {
      field: 'steelTypeFlag',
      headerName: '是否启用钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'standardsFlag',
      headerName: '是否启用规格',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'surfaceFlag',
      headerName: '是否启用表面',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'gradeFlag',
      headerName: '是否启用等级',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'unitOfMeasure',
      headerName: '计量单位',
      valueFormatter: 'ctx.optionsFind(value,3).label', 
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'coatingFlag',
      headerName: '是否启用保护材料',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    }, {
      field: 'processingType',
      headerName: '加工类型',
      hide: true,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'hardness',
      headerName: '硬度',
      hide: true,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'thickness',
      headerName: '实厚',
      hide: true,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'weight',
      headerName: '实宽',
      hide: true,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'sort',
      headerName: '存货大类',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'manufactured',
      headerName: '是否自制',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'purchase',
      headerName: '是否采购',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'disableDate',
      headerName: '停用日期',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'enableLotControl',
      headerName: '启用批次管理',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'standards',
      headerName: '规格',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'createdBy',
      hide: true,
      headerName: '创建人',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'creationDate',
      hide: true,
      headerName: '创建时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'lastUpdatedBy',
      hide: true,
      headerName: '最近更新人',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'lastUpdateDate',
      hide: true,
      headerName: '最近更新时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
  ];


  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonQuery: CommonQueryService,
    private appconfig: AppConfigService,
    private translateservice: AppTranslationService,
    private modalService: NzModalService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  LoadData() {
    this.loadSystemData();
    this.commonQuery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });

      });
    });




  }

  async loadSystemData() {
    await this.queryService.GetLookupByTypeRefZip({
      'FND_YES_NO': this.yesOrNoOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_ITEM_UNIT': this.unitOptions,
    });


  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.GetQueryParams(false),
      this.context,
    );
  }


  GetQueryParams(isExport: boolean) {

    return {
      plantCode: this.queryParams.values.plantCode,
      stockCode: this.queryParams.values.stockCode,
      stockName: this.queryParams.values.stockName,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode() ? this.appconfig.getPlantCode() : this.plantOptions[0].value,
      stockCode: '',
      stockName: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
    };
  }




  expColumns = [...this.columns];
  expColumnsOptions: any[] = [
    { field: 'productionCategory', options: this.productCategoryOptions },
    { field: 'steelTypeFlag', options: this.yesOrNoOptions },
    { field: 'standardsFlag', options: this.yesOrNoOptions },
    { field: 'surfaceFlag', options: this.yesOrNoOptions },
    { field: 'gradeFlag', options: this.yesOrNoOptions },
    { field: 'coatingFlag', options: this.yesOrNoOptions },
    { field: 'manufactured', options: this.yesOrNoOptions },
    { field: 'purchase', options: this.yesOrNoOptions },
    { field: 'enableLotControl', options: this.yesOrNoOptions },
  ];



  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    const dto = this.GetQueryParams(true);
    super.export(); // 导出网格列，如果需要导出自定义列，那么注释此行
    this.queryService.export({ url: this.httpAction.url, method: 'GET' }, dto, this.excelexport, this.context);
  }




  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
      this.queryService.loadGridView(
        this.httpAction,
        this.GetQueryParams(false),
        this.context,
      );
    } else {
      this.setLoading(false);
    }
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNoOptions;
        break;
      case 2:
        options = this.productCategoryOptions;
        break;
      case 3:
        options = this.unitOptions;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }


}
