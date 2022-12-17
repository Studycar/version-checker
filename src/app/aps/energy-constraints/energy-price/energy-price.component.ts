import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EnergyConstraintsEnergyPriceEditComponent } from './edit/edit.component';
import { EnergyPriceImportComponent } from './import/import.component';
import { EnergyPriceService } from './query.service';

@Component({
  selector: 'energy-price',
  templateUrl: './energy-price.component.html',
  providers: [EnergyPriceService]
})
export class EnergyConstraintsEnergyPriceComponent
  extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  plantCodeList: any[] = [];
  /**能源类型 */
  energyTypeOptions = [];
  /**价格类型 */
  planTypeOptions = [];
  /**峰平谷类型 */
  rateNumberOptions = [
    {
      label: '峰',
      value: '1'
    },
    {
      label: '平',
      value: '2'
    },
    {
      label: '谷',
      value: '3'
    },
    {
      label: '尖',
      value: '4'
    }
  ];
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantCodeList } },
      { field: 'energyType', title: '能源类型', ui: { type: UiType.select, options: this.energyTypeOptions } },
      { field: 'planType', title: '价格类型', ui: { type: UiType.select, options: this.planTypeOptions } },
      { field: 'rateNubmer', title: '峰平谷类型', ui: { type: UiType.select, options: this.rateNumberOptions } },
    ],
    values: {
      plantCode: null,
      energyType: '',
      planType: '',
      rateNubmer: '',
      unitSymbol: '',
    }
  };

  columns = [
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
      field: 'plantCode',
      width: 120,
      headerName: '工厂'
    },
    {
      field: 'energyType',
      width: 80,
      headerName: '能源类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'planType',
      width: 120,
      headerName: '价格类型',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'unitSymbol',
      width: 80,
      headerName: '能源单位',
      valueGetter: params => this.energyTypeValueGetter(params)
    },
    {
      field: 'priceResult',
      width: 80,
      headerName: '单价'
    },
    {
      field: 'rateNumber',
      width: 120,
      headerName: '峰平谷类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'startTime',
      width: 80,
      headerName: '时间从'
    },
    {
      field: 'endTime',
      width: 80,
      headerName: '时间至'
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.energyTypeOptions;
        break;
      case 2:
        options = this.planTypeOptions;
        break;
      case 3:
        options = this.rateNumberOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  public energyTypeValueGetter(params) {
    return this.optionsFind(params.data.energyType, 1).attribute1;
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private exportImportService: ExportImportService,
    private queryService: EnergyPriceService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadData();
    this.query();
  }

  public clear() {
    this.queryParams.values = {
      plantCode: null,
      energyType: null,
      planType: null,
      rateNubmer: null,
      unitSymbol: '',
    };
  }

  loadData() {
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appConfigService.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetEnergyTypeByTypeRef('PS_ENERGY_TYPE', this.energyTypeOptions);
    this.queryService.GetLookupByTypeRef('PS_ENERGY_PRICE_TYPE', this.planTypeOptions);
  }

  query() {
    super.query();
    // 从scada系统同步数据
    // this.plantCodeList.forEach(plantCode => {
    //   this.queryService.SyncEnergyPrice(plantCode);
    // })
    this.queryCommon();
  }

  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    );
  }

  getQueryParamsValue() {
    return {
      plantCode: this.queryParams.values.plantCode || this.appConfigService.getActivePlantCode(),
      energyType: this.queryParams.values.energyType,
      planType: this.queryParams.values.planType,
      rateNubmer: this.queryParams.values.rateNubmer,
      unitSymbol: this.queryParams.values.unitSymbol,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  add(dataItem?) {
    this.modal
      .static(EnergyConstraintsEnergyPriceEditComponent, { i: (dataItem !== undefined ? dataItem : { id: null }) })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    let exportParamsValues = {
      plantCode: this.queryParams.values.plantCode,
      energyType: this.queryParams.values.energyType,
      planType: this.queryParams.values.planType,
      rateNubmer: this.queryParams.values.rateNubmer,
      unitSymbol: this.queryParams.values.unitSymbol,
    };
    this.queryService.exportAction({ url: this.queryService.exportUrl, method: 'POST' }, exportParamsValues, this.excelexport, this.context, this.exportDataPreFilter);
  }

  exportDataPreFilter = (res) => {
    res.data.content = res.data.content.map(item => {
      item.energyType = this.typeFilter(1, item.energyType);
      item.planType = this.typeFilter(2, item.planType);
      item.rateNumber = this.typeFilter(3, item.rateNumber);
      return item;
    });
    return res.data.content;
  }

  typeFilter(typeIndex: number, type: string) {
    let result;
    switch (typeIndex) {
      case 1:
        result = this.energyTypeOptions.find(t => t.value == type);
        break;
      case 2:
        result = this.planTypeOptions.find(t => t.value == type);
        break;
      case 3:
        result = this.rateNumberOptions.find(t => t.value == type);
      default:
        break;
    }
    if (!this.isNull(result)) {
      return result.label;
    }
    return '';
  }

  import() {
    this.modal
      .static(EnergyPriceImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  remove(dataItem) {
    
  }
}