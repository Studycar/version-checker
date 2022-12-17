import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ProductSellBalanceSopforeastsetEditComponent } from './edit/edit.component';
import { SopForeastSetService } from 'app/modules/generated_module/services/sopforeastset-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforeastset',
  templateUrl: './sopforeastset.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopforeastsetComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopForeastSetService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  plantOptions: any[] = [];
  context = this;
  typeOptions: any[] = [];
  sourceOptions: any[] = [];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('sopforecastset');
  }

  LoadData() {

    this.commonquery.GetLookupByTypeLang('SOP_SALES_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.sourceOptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_FORECAST_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeOptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.PLANT_CODE,
          value: element.PLANT_CODE
        });
      });
    });

  }

  httpAction = {
    url: this.querydata.url,
    method: 'GET',
    data: false
  };

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'foreastSource', title: '需求来源', ui: { type: UiType.select, options: this.sourceOptions } },
      { field: 'foreastType', title: '预测类型', ui: { type: UiType.select, options: this.typeOptions } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      foreastSource: '',
      foreastType: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  query() {
    super.query();
    this.queryService.loadGridView(this.httpAction, this.queryParams.values, this.context);
  }

  GetQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      foreastSource: this.queryParams.values.foreastSource,
      foreastType: this.queryParams.values.foreastType,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
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
    { field: 'PLANT_CODE', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'SALES_TYPE', headerName: '需求来源', menuTabs: ['filterMenuTab'] },
    { field: 'FORECAST_TYPE', headerName: '预测类型', menuTabs: ['filterMenuTab'] },
    { field: 'MONTHS', headerName: '需求月份', menuTabs: ['filterMenuTab'] },
    { field: 'FORECAST_SETS', headerName: '预测集', menuTabs: ['filterMenuTab'] },
    { field: 'FORECAST_NAME', headerName: '预测名', menuTabs: ['filterMenuTab'] }
  ];

  // expColumns = [
  //   { field: 'PLANT_CODE', title: '工厂', width: 200, locked: false },
  //   { field: 'SALES_TYPE', title: '计划组', width: 200, locked: false },
  //   { field: 'DIVISION_NAME', title: '资源维度', width: 200, locked: false },
  //   { field: 'DIVISION_DESC', title: '维度描述', width: 200, locked: false },
  //   { field: 'DIVISION_TYPE', title: '维度类型', width: 200, locked: false },
  //   { field: 'ENABLE_FLAG', title: '是否有效', width: 200, locked: false }];

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      foreastSource: null,
      foreastType: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopforeastsetEditComponent,
        {
          i: { Id: (item !== undefined ? item.Id : null) }
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
    this.querydata.remove(value).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  // httpExportAction = {
  //   url: this.querydata.exportUrl,
  //   method: 'GET'
  // };
  // @ViewChild('excelexport') excelexport: CustomExcelExportComponent;
  // public export() {
  //   this.queryService.exportAction(this.httpExportAction, this.queryParams.values, this.excelexport, this);
  // }
  selectKeys = 'Id';
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

  plantChange(value: any) {
  }

}
