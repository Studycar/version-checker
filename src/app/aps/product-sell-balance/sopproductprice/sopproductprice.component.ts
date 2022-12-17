import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ProductSellBalanceSopProductPriceEditComponent } from './edit/edit.component';
import { PriceQueryService } from './queryService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopproductprice',
  templateUrl: './sopproductprice.component.html',
  providers: [PriceQueryService]
})
export class ProductSellBalanceSopProductPriceComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: PriceQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }
  regionOptions: any[] = [];
  plantOptions: any[] = [];
  context = this;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  LoadData() {
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.regionOptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode
        });
      });
    });
    this.LoadPlant(this.queryParams.values.buCode);
  }
  LoadPlant(value: any) {
    this.queryParams.values.plantCode = null;
    this.plantOptions.length = 0;
    this.queryService.GetUserPlant(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
    data: false
  };

  public queryParams = {
    defines: [
      { field: 'buCode', title: '事业部', ui: { type: UiType.select, options: this.regionOptions, ngModelChange: (value) => { this.LoadPlant(value); } } },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'itemCode', title: '物料编码', ui: { type: UiType.textarea } }
    ],
    values: {
      buCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: this.appconfig.getPlantCode(),
      itemCode: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(), this.context);
  }

  GetQueryParams(isExport = false) {
    return {
      buCode: this.queryParams.values.buCode,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
  }

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'buCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'price', headerName: '销售价格', menuTabs: ['filterMenuTab'] },
    { field: 'grossMargin', headerName: '毛利率(%)', menuTabs: ['filterMenuTab'] },
    { field: 'onhandCost', headerName: '库存成本(元)', menuTabs: ['filterMenuTab'] },
    { field: 'productionCost', headerName: '生产成本(元)', menuTabs: ['filterMenuTab'] }
  ];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.exportAction({ url: this.queryService.queryUrl, method: 'POST' }, this.GetQueryParams(true), this.excelexport, this.context);
  }
  clear() {
    this.queryParams.values = {
      buCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: this.appconfig.getPlantCode(),
      itemCode: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopProductPriceEditComponent,
        {
          i: item !== undefined ? item : { id: null }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  remove(value: any) {
    this.queryService.RemoveBatch([value[this.selectKeys]]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.queryService.RemoveBatch(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
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
      this.query();
    } else {
      this.setLoading(false);
    }
  }

}
