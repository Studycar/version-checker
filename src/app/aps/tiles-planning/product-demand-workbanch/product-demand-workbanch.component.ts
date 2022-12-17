/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:03
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-15 15:09:03
 * @Note: ...
 */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { GridDataResult } from '../../../../../node_modules/@progress/kendo-angular-grid';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ActivatedRoute } from '@angular/router';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { TilesShowDetailComponent } from './show-detail/show-detail.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-demand-workbanch',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './product-demand-workbanch.component.html',
  providers: [QueryService],
})
export class TilesProductDemandWorkbenchComponent extends CustomBaseContext
  implements OnInit {
  organizationids: any[] = [];
  gridData: any[] = [];
  selectionKeys: any[] = [];
  ItemTypeList: any[] = [];
  defaultplantcode: any = null;

  expColumnsOptions: any[] = [];
  public gridViewItemModel: GridDataResult = {
    data: [],
    total: 0,
  };

  public gridViewItemCategory: GridDataResult = {
    data: [],
    total: 0,
  };
  public gridViewItemSeries: GridDataResult = {
    data: [],
    total: 0,
  };
  public CustomColumnsItemSeries: any[] = [
    {
      field: 'itemSeries',
      title: '系列',
      width: '150',
    },
  ];
  columns = [
    {
      field: 'plantCode',
      title: '销售公司',
      headerName: '销售公司',
      width: 100,
    },
    {
      field: 'description',
      title: '名称',
      headerName: '名称',
      width: 120,
    },
    {
      field: 'itemSpecs',
      title: '规格',
      headerName: '规格',
      width: 100,
    },
    {
      field: 'itemModel',
      title: '生产型号',
      headerName: '生产型号',
      width: 130,
    },
    {
      field: 'itemSeries',
      title: '系列',
      headerName: '系列',
      width: '150',
    },
    {
      field: 'itemCategory',
      title: '品种代码',
      headerName: '品种代码',
      width: 100,
    },
    {
      field: 'itemType',
      title: '产品类型',
      headerName: '产品类型',
      width: 130,
    },
    {
      field: 'unpalletQty',
      title: '未开单量',
      headerName: '未开单量',
      valueFormatter: params => this.showDigital(params),
      width: 120,
    },
    {
      field: 'maxStockQty',
      title: '安全库存最大水位',
      headerName: '安全库存最大水位',
      width: 150,
    },
    {
      field: 'minStockQty',
      title: '安全库存最小水位',
      headerName: '安全库存最小水位',
      width: 150,
    },
    {
      field: 'auditingQty',
      title: '在审批订单量',
      headerName: '在审批订单量',
      valueFormatter: params => this.showDigital(params),
      width: 150,
    },
    {
      field: 'reChangeQty',
      title: '待变更订单量',
      headerName: '待变更订单量',
      valueFormatter: params => this.showDigital(params),
      width: 120,
    },
    {
      field: 'inventoryDestroyQty',
      title: '库存销存量',
      headerName: '库存销存量',
      width: 120,
    },
    {
      field: 'scheduleQty',
      title: '在排产量',
      headerName: '在排产量',
      valueFormatter: params => this.showDigital(params),
      width: 120,
    },
    {
      field: 'fixUnenableQty',
      title: '锁定不可用量',
      headerName: '锁定不可用量',
      valueFormatter: params => this.showDigital(params),
      width: 120,
    },
    {
      field: 'stockoutSum',
      title: '订单缺货数',
      headerName: '订单缺货数',
      valueFormatter: params => this.showDigital(params),
      width: 120,
    },
    {
      field: 'unorderSum',
      title: '未下单量',
      headerName: '未下单量',
      valueFormatter: params => this.showDigital(params),
      width: 120,
    },

    {
      field: 'safestockSuggest',
      title: '安全库存补货建议',
      headerName: '安全库存补货建议',
      width: 120,
    },
    {
      field: 'orderdueNum',
      title: '已超期订单',
      headerName: '已超期订单',
      width: 120,
    },
    {
      field: 'delivery30Qty',
      title: '30天内提货',
      headerName: '30天内提货',
      width: 150,
    },
    {
      field: 'delivery30_60Qty',
      title: '30-60天内提货',
      headerName: '30-60天内提货',
      width: 150,
    },
    {
      field: 'delivery60_90Qty',
      title: '60-90天内提货',
      headerName: '60-90天内提货',
      width: 150,
    },
    {
      field: 'delivery90_180Qty',
      title: '90-180天内提货',
      headerName: '90-180天内提货',
      width: 150,
    },
    {
      field: 'delivery180Qty',
      title: '180天以上提货',
      headerName: '180天以上提货',
      width: 150,
    },
  ];

  showDigital(params: any) {
    if (params.value = null || params.value == undefined || params.value == '0')
      return '';
  }
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '销售公司',
        required: true,
        ui: { type: UiType.select, options: this.organizationids },
      },
      {
        field: 'itemCategory',
        title: '品种代码',
        ui: { type: UiType.text },
      },
      {
        field: 'itemSeries',
        title: '系列',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemSeries',
          textField: 'itemSeries',
          gridView: this.gridViewItemSeries,
          columns: this.CustomColumnsItemSeries,
          eventNo: 4,
        },
      },
      {
        field: 'itemSpecs',
        title: '规格',
        ui: { type: UiType.text },
      },
      {
        field: 'itemModel',
        title: '生产型号',
        ui: { type: UiType.text },
      },
      {
        field: 'itemType',
        title: '产品类型',
        ui: {
          type: UiType.select,
          options: this.ItemTypeList,
        },
      },
    ],
    values: {
      plantCode: this.defaultplantcode,
      itemCategory: null,
      itemModel: null,
      itemSpecs: null,
      itemType: null,
      itemSeries: { value: '', text: '' },
    },
  };

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private formBuilder: FormBuilder,
    private confirmationService: NzModalService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private route: ActivatedRoute,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    // this.components = { showCellRenderer: this.createShowCellRenderer() };
  }

  searchItemModel(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.commonQueryService
      .GetItemModel(
        this.queryParams.values.plantCode,
        e.SearchValue,
        PageIndex,
        e.PageSize,
      )
      .subscribe(res => {
        this.gridViewItemModel.data = res.Result;
        this.gridViewItemModel.total = res.TotalCount;
      });
  }

  // searchItemSpecs(e: any) {
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   this.commonQueryService
  //     .GetItemSpecs(
  //       this.queryParams.values.plantCode,
  //       e.SearchValue,
  //       PageIndex,
  //       e.PageSize,
  //     )
  //     .subscribe(res => {
  //       this.gridViewItemSpecs.data = res.Result;
  //       this.gridViewItemSpecs.total = res.TotalCount;
  //     });
  // }

  searchItemSeries(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.commonQueryService
      .GetItemSeries(
        this.queryParams.values.plantCode,
        e.SearchValue,
        PageIndex,
        e.PageSize,
      )
      .subscribe(res => {
        this.gridViewItemSeries.data = res.data.content;
        this.gridViewItemSeries.total = res.data.totalElements;
      });
  }
  searchItemcategory(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.commonQueryService
      .GetItemCategorys(
        this.queryParams.values.plantCode,
        e.SearchValue,
        PageIndex,
        e.PageSize,
      )
      .subscribe(res => {
        this.gridViewItemCategory.data = res.Result;
        this.gridViewItemCategory.total = res.TotalCount;
      });
  }
  createShowCellRenderer() {
    function ShowCellRenderer() {}
    ShowCellRenderer.prototype.init = function(params) {
      const cellBlank = !params.value;
      if (cellBlank) {
        return null;
      }
      this.ui = document.createElement('div');
      this.ui.innerHTML = '<div class="show-name">' + params.value;
    };
    ShowCellRenderer.prototype.getGui = function() {
      return this.ui;
    };
    return ShowCellRenderer;
  }

  ngOnInit(): void {
    this.columns.forEach(x => {
      this.expColumns.push({ title: x.title, field: x.field });
    });
    this.commonQueryService.GetLookupByType('MNLS_ITEM_TYPE').subscribe(res => {
      if (res.Success) {
        res.Extra.forEach(element => {
          this.ItemTypeList.push({
            label: element.MEANING,
            value: element.LOOKUP_CODE,
          });
        });
      }
    });
    var plantcode = this.appconfig.getPlantCode();
    // this.initColumns();
    /** 初始化 主组织  下拉框*/
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(element => {
        if (plantcode === element.plantCode) {
          this.defaultplantcode = plantcode;
          this.queryParams.values.plantCode = this.defaultplantcode;
        }
        this.organizationids.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });
  }

  onCellClicked(obj: any) {
    //未开单量
    //销存量
    if (obj.value = null || obj.value == undefined || obj.value == '0')
    return ;
    if (
      obj.colDef.field == 'scheduleQty' ||
      obj.colDef.field == 'unpalletQty' ||
      obj.colDef.field == 'inventoryDestroyQty'
    ) {
      this.modal
        .static(TilesShowDetailComponent, {
          detailType: obj.colDef.field,
          id: obj.data.id,
          size: 'xl',
        })
        .subscribe(() => {});
    }
  }
  query() {
    super.query();
    this.queryCommon();
  }
  searchAction = {
    url: '/api/tp/productdemand/queryAll',
    method: 'POST',
  };
  queryCommon() {
    const searchParams = this.getSearchParams();
    this.commonQueryService.loadGridViewNew(
      this.searchAction,
      searchParams,
      this.context,
    );
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  /**操作code的缓存 */
  _importOpCodeCache = new Map();

  clear() {
    // 默认开始时间为当前时间，结束时间为当前时间+15天
    this.queryParams.values = {
      plantCode: this.defaultplantcode,
      itemCategory: '',
      itemModel: '',
      itemSpecs: null,
      itemType: null,
      itemSeries: { value: '', text: '' },
    };
  }

  getSearchParams(): any {
    const pageNo = this.lastPageNo;
    const pageSize = this.lastPageSize;
    const searchParans: any = Object.assign({}, this.queryParams.values);
    searchParans.plantCode = this.queryParams.values.plantCode;
    searchParans.itemModel = this.queryParams.values.itemModel;
    searchParans.itemSpecs = this.queryParams.values.itemSpecs;
    searchParans.itemCategory = this.queryParams.values.itemCategory;
    searchParans.itemType = this.queryParams.values.itemType;
    searchParans.itemSeries = this.queryParams.values.itemSeries.text;
    searchParans.QueryParams = {
      PageIndex: this._pageNo,
      PageSize: this._pageSize,
    };
    return searchParans;
  }

  selectKeys = 'ITEM_ID';
  // 行选中改变
  onSelectionChanged(obj) {
    this.getGridSelectionKeys(this.selectKeys);
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;

  public onPageChanged({ pageNo, pageSize }) {
    // this.gridState = state;
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        // this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      if (this.queryParams !== undefined) {
        this.queryCommon();
      }
    } else {
      this.setLoading(false);
    }
  }
  ExportAction = {
    url: '/afs/ServerPPProuctDemand/ProductDemandService/ExportQuery',
    method: 'POST',
  };
  // 导出 /**导出 */
  // @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.exportImportService.exportCompatibilityWithProgress(
      this.ExportAction,
      this.getSearchParams(),
      this.expColumns,
      'ProductDemandExport',
      this,
      '产品需求跟踪导出.xlsx',
    );
    // this.commonQueryService.exportAction( this.ExportAction, this.getSearchParams(), this.excelexport, this.context);
  }
}
