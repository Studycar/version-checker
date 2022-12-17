import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ProdManufSpecQueryService } from './query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-prod-manuf-spec',
  templateUrl: './ps-prod-manuf-spec.component.html',
  providers: [ProdManufSpecQueryService]
})
export class PsProdManufSpecComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: ProdManufSpecQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  optionListPlant: any[] = [];
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
    {
      field: 'stockDesc',
      title: '产品描述',
      width: '100',
    },
  ];

  columns = [
    {
      field: 'prodSpecId',
      width: 120,
      headerName: '产品规范标识',
    },
    {
      field: 'prodSpecCode',
      width: 120,
      headerName: '产品规范编码',
    },
    {
      field: 'catCode',
      width: 120,
      headerName: '存货大类',
    },
    {
      field: 'skuCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'steelGrade',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂编码',
    },
    {
      field: 'needSideCut',
      width: 120,
      headerName: '切边标记',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'needNextProcess',
      width: 120,
      headerName: '是否需要下工序',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'nextSkuCode',
      width: 120,
      headerName: '下工序SKU编码',
    },
    {
      field: 'nextSurface',
      width: 120,
      headerName: '下工序表面',
    },
    {
      field: 'manufSpecId',
      width: 120,
      headerName: '制造规范标识',
    },
    {
      field: 'manufSpecCode',
      width: 120,
      headerName: '制造规范编码',
    },
    {
      field: 'manufLineId',
      width: 120,
      headerName: '产线标识',
    },
    {
      field: 'manufLineName',
      width: 120,
      headerName: '产线名称',
    },
    {
      field: 'manufLineCode',
      width: 120,
      headerName: '产线编码',
    },
    {
      field: 'machineId',
      width: 120,
      headerName: '机台标识',
    },
    {
      field: 'workcenterId',
      width: 120,
      headerName: '工作中心标识',
    },
    {
      field: 'machineCode',
      width: 120,
      headerName: '机台编码',
    },
    {
      field: 'machineName',
      width: 120,
      headerName: '机台名称',
    },
    {
      field: 'operationId',
      width: 120,
      headerName: '工序标识',
    },
    {
      field: 'operationCode',
      width: 120,
      headerName: '工序编码',
    },
    {
      field: 'operationName',
      width: 120,
      headerName: '工序名称',
    },
    {
      field: 'prodSpecName',
      width: 120,
      headerName: '产品规范名称',
    },
    {
      field: 'skuName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'listOrder',
      width: 120,
      headerName: '排序',
    },
    {
      field: 'isCalcCapacity',
      width: 120,
      headerName: '是否计算产能',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'isRolling',
      width: 120,
      headerName: '是否轧制工艺',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'manufLineListOrder',
      width: 120,
      headerName: '产线优先级',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  YesNoOptions: any[] = [];
  needSiteCutOptions: any[] = [
    {
      label: '切',
      value: 1,
    },
    {
      label: '不切',
      value: 0,
    },
  ];
  contractSteelTypeOptions: any[] = [];
  contractSurfaceOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.YesNoOptions;
        break;
      case 2:
        options = this.needSiteCutOptions;
        break;
      case 3:
        options = this.contractSteelTypeOptions;
        break;
      case 4:
        options = this.contractSurfaceOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: {
          type: UiType.select,
          options: this.optionListPlant,
          ngModelChange: this.onChangePlant,
        },
      },
      {
        field: 'skuCode',
        title: '存货编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'stockCode',
          textField: 'stockCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
          extraEvent: {
            TextChangedEventNo: 3,
          }
        },
      },
      { field: 'prodSpecCode', title: '产品规范编码', ui: { type: UiType.text, } },
      { field: 'nextSkuCode', title: '下工序SKU编码', ui: { type: UiType.text, } },
      { field: 'steelGrade', title: '钢种', ui: { type: UiType.text, } },
      { field: 'surface', title: '表面', ui: { type: UiType.text, } },
      { field: 'needSideCut', title: '切边标识', ui: { type: UiType.select, options: this.needSiteCutOptions } },
      { field: 'needNextProcess', title: '是否需要下工序', ui: { type: UiType.select, options: this.YesNoOptions } },
      { field: 'isCalcCapacity', title: '是否计算产能', ui: { type: UiType.select, options: this.YesNoOptions } },
    ],
    values: {
      plantCode: null,
      skuCode: { value: '', text: '' },
      prodSpecCode: '',
      nextSkuCode: '',
      surface: '',
      steelGrade: '',
      needSideCut: null,
      needNextProcess: null,
      isCalcCapacity: null,
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: null,
      skuCode: { value: '', text: '' },
      prodSpecCode: '',
      nextSkuCode: '',
      surface: '',
      steelGrade: '',
      needSideCut: null,
      needNextProcess: null,
      isCalcCapacity: null,
    };
  }

  ngOnInit() {
    this.loadplant();
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    );
  }

  getQueryParamsValue(isExport = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      skuCode: this.queryParams.values.skuCode.value ? this.queryParams.values.skuCode.value : this.queryParams.values.skuCode.text,
      prodSpecCode: this.queryParams.values.prodSpecCode,
      nextSkuCode: this.queryParams.values.nextSkuCode,
      needSideCut: this.queryParams.values.needSideCut,
      steelGrade: this.queryParams.values.steelGrade,
      surface: this.queryParams.values.surface,
      isCalcCapacity: this.queryParams.values.isCalcCapacity,
      needNextProcess: this.queryParams.values.needNextProcess,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.optionListPlant.length = 0;
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      this.queryParams.values.plantCode = this.appconfig.getPlantCode();

      // 绑定物料
      // this.queryParams.values.ITEM_CODE_E.text = '';
      this.queryParams.values.skuCode.text = '';
      this.loadStock(this.queryParams.values.plantCode, '', 1, 10);

      // this.query();
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_YES_NOT': this.YesNoOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.queryParams.values.skuCode.text = '';
    this.loadStock(this.queryParams.values.plantCode, '', 1, 10);
  }

  public loadStock(plantCode: string, stockCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryService.getProductions({
      plantCode: plantCode || this.appconfig.getActivePlantCode(),
      stockCodeOrName: stockCode,
      pageIndex: 1,
      pageSize: 1
    }).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  onItemsTextChanged(e) {
    const stockCode = e.Text.trim();
    if(stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.queryParams.values.plantCode || this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.queryParams.values.skuCode = { value: res.data.content[0].stockCode, text: res.data.content[0].stockCode };
        } else {
          this.queryParams.values.skuCode = { value: '', text: '' };
          this.msgSrv.warning(this.appTranslationService.translate('此产品编码无效'));
        }
      }); 
    }
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


  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
