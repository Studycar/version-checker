import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ProdRouteItemQueryService } from './query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-prod-route-item',
  templateUrl: './ps-prod-route-item.component.html',
  providers: [ProdRouteItemQueryService]
})
export class PsProdRouteItemComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: ProdRouteItemQueryService,
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
  ];

  columns = [
    {
      field: 'itemId',
      width: 120,
      headerName: '路径明细标识',
    },
    {
      field: 'routeId',
      width: 120,
      headerName: '路径标识',
    },
    {
      field: 'catCode',
      width: 120,
      headerName: '存货大类',
    },
    {
      field: 'stockSkuCode',
      width: 120,
      headerName: '产品编码',
    },
    {
      field: 'stockSkuName',
      width: 120,
      headerName: '产品名称',
    },
    {
      field: 'stockSteelGrade',
      width: 120,
      headerName: '产品钢种',
    },
    {
      field: 'stockSurface',
      width: 120,
      headerName: '产品表面',
    },
    {
      field: 'skuCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'skuName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'steelGrade',
      width: 120,
      headerName: '存货钢种',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '存货表面',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂编码',
    },
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
      field: 'workcenterCode',
      width: 120,
      headerName: '工作中心编码',
    },
    {
      field: 'listOrder',
      width: 120,
      headerName: '排序',
    },
    {
      field: 'prodSpecName',
      width: 120,
      headerName: '产品规范名称',
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
        },
      },
      { field: 'prodSpecCode', title: '产品规范编码', ui: { type: UiType.text, } },
      { field: 'stockSkuCode', title: '产品编码', ui: { type: UiType.text, } },
      { field: 'surface', title: '存货表面', ui: { type: UiType.text, } },
      { field: 'steelGrade', title: '存货钢种', ui: { type: UiType.text, } },
      { field: 'routeId', title: '路径标识', ui: { type: UiType.text, } }
    ],
    values: {
      plantCode: null,
      skuCode: { value: '', text: '' },
      prodSpecCode: '',
      stockSkuCode: '',
      routeId: '',
      steelGrade: '',
      surface: ''
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: null,
      skuCode: { value: '', text: '' },
      prodSpecCode: '',
      stockSkuCode: '',
      routeId: '',
      steelGrade: '',
      surface: '',
    };
  }

  ngOnInit() {
    this.loadplant();
    this.query();
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
      stockSkuCode: this.queryParams.values.stockSkuCode,
      routeId: this.queryParams.values.routeId,
      surface: this.queryParams.values.surface,
      steelGrade: this.queryParams.values.steelGrade,
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

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.queryParams.values.skuCode.text = '';
    this.loadStock(this.queryParams.values.plantCode, '', 1, 10);
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

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
