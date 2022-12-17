import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

import { PsBurdeningStandardEditComponent } from './edit/edit.component';
import { PsBurdeningStandardExListComponent } from './detail/list.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsBurdeningStandardService } from './queryService';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PsBurdeningStandardImportComponent } from './import/import.component';
import { PsBurdeningStandardImportPlatesComponent } from './import/importPlates.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-burdening-standard-list',
  templateUrl: './list.component.html',
  providers: [PsBurdeningStandardService],
})
export class PsBurdeningStandardListComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';

  isLoading = false;
  public optionListPlant: any[] = [];
  public optionListPlantGroup: Set<any> = new Set();
  public optionListProductLine: Set<any> = new Set();
  public surfaceOptions: any[] = [];
  yesOrNoOptions: any[] = [];
  steelTypeOption: any[] = [];
  // public rawSurfaceOptions: any[] = [];
  public gradeLevelOptions: any[] = [];
  standardsSortOptions: any[] = [
    { label: '由薄至厚', value: 2 },
    { label: '由厚至薄', value: 1 }
  ];
  attributeOptions: any[] = [
    { label: '卷材', value: 'juanCai' },
    { label: '板材', value: 'banCai' }
  ];
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
        field: 'processCode',
        title: '工序编码',
        ui: {
          type: UiType.text
        },
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
        field: 'burdeningType',
        title: '卷材类型',
        ui: {
          type: UiType.select,
          options: this.attributeOptions,
        },
      },
      {
        field: 'steelType',
        title: '钢种',
        ui: {
          type: UiType.select,
          options: this.steelTypeOption,
        },
      },
      {
        field: 'standards',
        title: '产品规格',
        ui: {
          type: UiType.text,
        },
      },
      {
        field: 'surface',
        title: '产品表面',
        ui: {
          type: UiType.select,
          options: this.surfaceOptions,
        },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      processCode: '',
      burdeningType: null,
      steelType: null,
      standards: '',
      surface: null,
      stockCodeData: { value: '', text: '' },
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
      field: 'processCode',
      width: 120,
      headerName: '工序编码',
      tooltipField: 'processCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'processName',
      width: 120,
      headerName: '工序名称',
      tooltipField: 'processName',
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
    {
      field: 'surface',
      width: 90,
      headerName: '产品表面',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      width: 90,
      headerName: '启用状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'burdeningType',
      width: 90,
      headerName: '材料类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },


  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.surfaceOptions;
        break;
      case 2:
        options = this.yesOrNoOptions;
        break;
      case 3:
        options = this.steelTypeOption;
        break;
      case 4:
        options = this.attributeOptions;
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
    private msgSrv: NzMessageService,
    public queryService: PsBurdeningStandardService,
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
    return {
      plantCode: this.queryParams.values.plantCode,
      stockCode: this.queryParams.values.stockCodeData.text,
      processCode: this.queryParams.values.processCode,
      burdeningType: this.queryParams.values.burdeningType,
      steelType: this.queryParams.values.steelType,
      standards: this.queryParams.values.standards,
      surface: this.queryParams.values.surface,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadplant();
    this.loadSteelType();
    this.loadContractSurface();
    this.loadYesOrNo();
    // this.loadRawFace();
    this.loadGradeLevel();
    this.query();
  }



  /**
   * 加载快码 产品表面
   */
  public loadContractSurface(): void {
    this.queryService.GetLookupByType('PS_CONTRACT_SURFACE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.surfaceOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  /**
   * 加载快码 原料表面
   */
  // public loadRawFace(): void {
  //   this.queryService.GetLookupByType('PS_RAW_SURFACE')
  //     .subscribe(result => {
  //       result.Extra.forEach(d => {
  //         this.rawSurfaceOptions.push({
  //           label: d.meaning,
  //           value: d.lookupCode,
  //         });
  //       });
  //     });
  // }
  /**
  * 加载快码 表面等级
  */
  public loadGradeLevel(): void {
    this.queryService.GetLookupByType('PS_GRADE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.gradeLevelOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  /**
   * 加载快码 钢种
   */
  public loadSteelType(): void {
    this.queryService.GetLookupByType('PS_CONTRACT_STEEL_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.steelTypeOption.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.optionListPlant.length = 0;
    this.queryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      this.queryParams.values.plantCode = this.appConfigService.getPlantCode();



      // 绑定物料
      // this.queryParams.values.ITEM_CODE_E.text = '';
      this.queryParams.values.stockCodeData.text = '';
      this.loadStock(this.queryParams.values.plantCode, '', 1, 10);

      // this.query();
    });
  }



  /**
   * 加载快码 启用禁用
   */
  public loadYesOrNo(): void {
    this.queryService.GetLookupByType('FND_YES_NO')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.yesOrNoOptions.push({
            label: d.meaning,
            value: d.lookupCode,
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
    this.queryParams.values.stockCodeData.text = '';
    this.loadStock(this.queryParams.values.plantCode, '', 1, 10);
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {

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
        PsBurdeningStandardEditComponent,
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

  /**
   * 查看详情
   * @param item 
   */
  public detail(item: any) {
    this.modal
      .static(
        PsBurdeningStandardExListComponent,
        {
          i: {
            burdeningId: item !== undefined ? item.id : null,
            burdeningType: item !== undefined ? item.burdeningType : null,
            plantCode: item !== undefined ? item.plantCode : null,
          },
        },
        'xl',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }



  turnOnOffBatch(type: string) {
    const operTypeName = type === '0' ? '禁用' : '启用';
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要' + operTypeName + '的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要' + operTypeName + '吗？'),
      nzOnOk: () => {
        this.queryService.turnOnOff({ ids: this.selectionKeys, operType: type }).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(operTypeName + '成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  turnOnOff(value: any, operType: string) {
    this.queryService.turnOnOff({ ids: [value.id], operType: operType }).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 导入 卷材
  public import() {
    this.modal
      .static(PsBurdeningStandardImportComponent, {}, 'md')
      .subscribe(value => {
        this.query();
      });

  }

  /**
   * 导入 板材
   */
  public importPlates() {
    this.modal
      .static(PsBurdeningStandardImportPlatesComponent, {}, 'md')
      .subscribe(value => {
        this.query();
      });

  }

  expColumns: any[] = [
    {
      field: 'plantCode',
      width: 80,
      headerName: '工厂',
    },
    {
      field: 'processCode',
      width: 120,
      headerName: '工序编码',
    },
    {
      field: 'processName',
      width: 120,
      headerName: '工序名称',
    },

    {
      field: 'stockCode',
      width: 140,
      headerName: '产品编码',
    },
    {
      field: 'stockName',
      width: 140,
      headerName: '产品名称',
    },
    {
      field: 'steelType',
      width: 140,
      headerName: '钢种',
    },
    {
      field: 'standards',
      width: 90,
      headerName: '产品规格',
    },
    {
      field: 'standardsWidth',
      width: 90,
      headerName: '产品宽',
    },
    {
      field: 'standardsLength',
      width: 90,
      headerName: '产品长',
    },
    {
      field: 'surface',
      width: 90,
      headerName: '产品表面',
    },
    {
      field: 'enableFlag',
      width: 90,
      headerName: '启用状态',
    },
    {
      field: 'burdeningType',
      width: 90,
      headerName: '材料类型',
    },
    {
      field: 'rawStockCode',
      width: 90,
      headerName: '原料编码',
    },
    {
      field: 'rawStockName',
      width: 90,
      headerName: '原料名称',
    },
    {
      field: 'rawStandardsInterval',
      width: 90,
      headerName: '原料规格区间',
    },
    {
      field: 'width',
      width: 90,
      headerName: '原料宽',
    },
    {
      field: 'length',
      width: 90,
      headerName: '原料长',
    },
    {
      field: 'rawSurface',
      width: 90,
      headerName: '原料表面',
    },
    {
      field: 'rawPriority',
      width: 90,
      headerName: '原料优先级',
    },
    {
      field: 'standardsPriority',
      width: 90,
      headerName: '规格优先级',
    },
    {
      field: 'surfaceGrade',
      width: 90,
      headerName: '表面等级',
    },
    {
      field: 'productionPlace',
      width: 90,
      headerName: '产地',
    },
    {
      field: 'exEnableFlag',
      width: 90,
      headerName: '原料启用状态',
    },
  ];
  expData: any[] = [];
  expColumnsOptions = [
    { field: 'steelType', options: this.steelTypeOption },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'enableFlag', options: this.yesOrNoOptions },
    { field: 'exEnableFlag', options: this.yesOrNoOptions },
    { field: 'standardsSort', options: this.standardsSortOptions },
    { field: 'rawSurface', options: this.surfaceOptions },
    { field: 'surfaceGrade', options: this.gradeLevelOptions },
    { field: 'burdeningType', options: this.attributeOptions },
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    //    super.export();
    this.excelexport.setExportColumn(this.expColumns);
    this.queryService.export({ url: this.queryService.exportDataUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);

  }

  public clear() {
    this.queryParams.values = {
      plantCode: null,
      processCode: null,
      burdeningType: null,
      steelType: null,
      standards: '',
      surface: null,
      stockCodeData: { value: '', text: '' },
      // ITEM_CODE_E: { value: '', text: '' }
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


  deleteBatch(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if (dataItem === undefined) {
        this.modalService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.deleteByIds({ ids: ids }).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

}
