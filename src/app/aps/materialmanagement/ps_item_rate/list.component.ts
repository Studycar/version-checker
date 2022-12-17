import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

import { PsItemRateEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsItemRateService } from './queryService';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PsItemRateImportComponent } from './import/import.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-item-rate-list',
  templateUrl: './list.component.html',
  providers: [PsItemRateService],
})
export class PsItemRateListComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';

  isLoading = false;
  public optionListPlant: any[] = [];
  public optionListPlantGroup: Set<any> = new Set();
  public optionListProductLine: Set<any> = new Set();
  public applicationRateType: any[] = [];
  public applicationitemtypes: any[] = [];
  public surfaceOptions: any[] = [];
  yesOrNo: any[] = [];
  steelTypeOption: any[] = [];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };

  public columnsItems: any[] = [
    {
      field: 'stockCode',
      title: '产品编码',
      width: '100',
    },
    {
      field: 'stockName',
      title: '产品名称',
      width: '100',
    },
  ];

  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        required: true,
        ui: {
          type: UiType.select,
          options: this.optionListPlant,
          ngModelChange: this.onChangePlant,
        },
      },
      {
        field: 'scheduleGroupCode',
        title: '计划组',
        ui: {
          type: UiType.select,
          options: this.optionListPlantGroup,
          ngModelChange: this.onChangeGroup,
        },
      },
      {
        field: 'resourceCode',
        title: '资源',
        ui: { type: UiType.select, options: this.optionListProductLine },
      },
      {
        field: 'stockCodeData',
        title: '产品编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'stockCode',
          textField: 'stockCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
      {
        field: 'steelType',
        title: '钢种',
        ui: { type: UiType.select, options: this.steelTypeOption },
      },
      {
        field: 'surface',
        title: '表面',
        ui: { type: UiType.select, options: this.surfaceOptions },
      },
      {
        field: 'standards',
        title: '产品规格',
        ui: { type: UiType.text },
      },
      {
        field: 'width',
        title: '产品宽',
        ui: { type: UiType.number },
      },
      {
        field: 'length',
        title: '产品长',
        ui: { type: UiType.number },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: '',
      resourceCode: '',
      stockCodeData: { value: '', text: '' },
      steelType: '',
      surface: '',
      standards: '',
      width: '',
      length: '',
    },
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
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
    {
      field: 'plantCode',
      width: 80,
      headerName: '工厂',
      tooltipField: 'plantCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'scheduleGroupCode',
      width: 120,
      headerName: '计划组',
      tooltipField: 'scheduleGroupCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceCode',
      width: 120,
      headerName: '资源',
      tooltipField: 'resourceCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceType',
      width: 100,
      headerName: '资源类型',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'processCode',
      width: 140,
      headerName: '工序',
      tooltipField: 'processCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'stockCode',
      width: 140,
      headerName: '产品编码',
      tooltipField: 'stockCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'stockName',
      width: 140,
      headerName: '产品名称',
      tooltipField: 'stockName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'steelType',
      width: 140,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'surface',
      width: 140,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,5).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'standards',
      width: 90,
      headerName: '产品规格',
      tooltipField: 'standards',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'width',
      width: 90,
      headerName: '产品宽',
      tooltipField: 'width',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'length',
      width: 90,
      headerName: '产品长',
      tooltipField: 'length',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'rawStockCode',
    //   width: 90,
    //   headerName: '原料编码',
    //   tooltipField: 'rawStockCode',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'rawStockName',
    //   width: 90,
    //   headerName: '原料名称',
    //   tooltipField: 'rawStockName',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'rawSurface',
    //   width: 110,
    //   headerName: '原料表面',
    //   tooltipField: 'rawSurface',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'rawStandards',
    //   width: 90,
    //   headerName: '原料规格',
    //   tooltipField: 'rawStandards',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'rawWidth',
    //   width: 90,
    //   headerName: '原料宽',
    //   tooltipField: 'rawWidth',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'rawLength',
    //   width: 90,
    //   headerName: '原料长',
    //   tooltipField: 'rawLength',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'rateType',
      width: 140,
      headerName: '速率类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rate',
      width: 90,
      headerName: '速率',
      tooltipField: 'rate',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'priority',
      width: 90,
      headerName: '优先级',
      tooltipField: 'priority',
      menuTabs: ['filterMenuTab'],
    },
    
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationRateType;
        break;
      case 2:
        options = this.applicationitemtypes;
        break;
      case 3:
        options = this.steelTypeOption;
        break;
      case 4:
        options = this.yesOrNo;
        break;
      case 5:
        options = this.surfaceOptions;
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
    private msgSrv: NzMessageService,
    public queryService: PsItemRateService,
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

  private getQueryParamsValue(): any {
    const values = this.queryParams.values
    return {
      plantCode: values.plantCode,
      stockCode: values.stockCodeData.text,

      // ITEM_CODE_E: ITEM_CODE_E.text,
      scheduleGroupCode: values.scheduleGroupCode,
      resourceCode: values.resourceCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      steelType: values.steelType,
      surface: values.surface,
      standards: values.standards,
      width: values.width,
      length: values.length,
    };
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadplant();
    this.loadOptions();
    this.query();
  }

  public loadOptions(): void {
    this.queryService.GetLookupByTypeRefAll({
      'FND_YES_NO': this.yesOrNo,
      'PS_RATE_TYPE': this.applicationRateType,
      'PS_RESOURCE_TYPE': this.applicationitemtypes,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOption,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
    })
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.optionListPlant.length = 0;
    this.queryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });
      });
      this.queryParams.values.plantCode = this.appConfigService.getPlantCode();

      // 根据工厂 加载组和产线
      this.loadplantGroup();
      this.loadproductLine();

      // 绑定物料
      // this.queryParams.values.ITEM_CODE_E.text = '';
      this.queryParams.values.stockCodeData.text = '';
      this.loadStock(this.queryParams.values.plantCode, '', 1, 10);

      // this.query();
    });
  }

  loadplantGroup(): void {
    this.isLoading = true;
    this.queryService.GetUserPlantGroup(this.queryParams.values.plantCode)
      .subscribe(result => {
        this.isLoading = false;
        result.Extra.forEach(d => {
          this.optionListPlantGroup.add({
            label: `${d.scheduleGroupCode}(${d.descriptions})`,
            value: d.scheduleGroupCode,
          });
        });
      });
  }

  loadproductLine(): void {
    this.isLoading = true;
    this.queryService.GetUserPlantGroupLine(
      this.queryParams.values.plantCode,
      this.queryParams.values.scheduleGroupCode,
    )
      .subscribe(result => {
        this.isLoading = false;
        result.Extra.forEach(d => {
          this.optionListProductLine.add({
            label: `${d.resourceCode}(${d.descriptions})`,
            value: d.resourceCode,
          });
        });
      });
  }


  public loadStock(plantCode: string, stockCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryService.getPsProductionPageList(plantCode || '', stockCode || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }



 
  // 物料弹出查询
  public searchStock(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStock(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.queryService.GetUserPlantGroup(value).subscribe(result => {
      if (result.Extra == null) {
        this.optionListPlantGroup.clear();
        return;
      } else {
        // 先清除，在重新绑定
        this.optionListPlantGroup.clear();
        result.Extra.forEach(d => {
          this.optionListPlantGroup.add({
            label: d.scheduleGroupCode,
            value: d.scheduleGroupCode,
          });
        });
        return;
      }
    });

    // this.queryParams.values.ITEM_CODE_E.text = '';
    this.queryParams.values.stockCodeData.text = '';
    this.loadStock(this.queryParams.values.plantCode, '', 1, 10);
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    console.log(value);
    this.queryParams.values.resourceCode = null;
    /** 重新绑定  组*/
    this.queryService.GetUserPlantGroupLine(this.queryParams.values.plantCode, value)
      .subscribe(result => {
        if (result.Extra == null) {
          this.optionListProductLine.clear();
          return;
        } else {
          // 先清除，在重新绑定
          this.optionListProductLine.clear();
          result.Extra.forEach(d => {
            this.optionListProductLine.add({
              label: d.resourceCode,
              value: d.resourceCode,
            });
          });
          return;
        }
      });
  }

  httpAction = { url: this.queryService.seachUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }

  public add(item: any) {
    this.modal
      .static(
        PsItemRateEditComponent,
        {
          i: {
            id: item !== undefined ? item.id : null,
            plantCode: item !== undefined ? item.plantCode : null,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }



  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.queryService.removeBatch(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.queryService.removeBatch([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 导入
  public import() {
    this.modal
      .static(PsItemRateImportComponent, {}, 'md')
      .subscribe(value => {
        this.query();
      });
    
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
    { field: 'resourceType', options: this.applicationitemtypes },
    { field: 'steelType', options: this.steelTypeOption },
    { field: 'rateType', options: this.applicationRateType },
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.export({ url: this.queryService.seachUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);

  }

  public clear() {
    this.queryParams.values = {
      plantCode: null,
      scheduleGroupCode: null,
      resourceCode: null,
      stockCodeData: { value: '', text: '' },
      // ITEM_CODE_E: { value: '', text: '' }
      steelType: null,
      surface: null,
      standards: null,
      width: null,
      length: null,
    };

    this.loadplant();
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
