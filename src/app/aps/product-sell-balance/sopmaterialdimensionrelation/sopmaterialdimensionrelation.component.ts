/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-18 09:51:22
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-06 15:29:23
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { SopMaterialDimensionRelationService } from '../../../modules/generated_module/services/sopmaterialdimensionrelation-service';
import { QueryService } from './queryService';
import { ProductSellBalanceSopmaterialdimensionrelationEditComponent } from './edit/edit.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MaterialDimensionImportComponent } from './import/import.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { PsItemRoutingsService } from 'app/modules/generated_module/services/ps-item-routings-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialdimensionrelation',
  templateUrl: './sopmaterialdimensionrelation.component.html',
  providers: [QueryService, PsItemRoutingsService]
})
export class ProductSellBalanceSopmaterialdimensionrelationComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopMaterialDimensionRelationService,
    private apptranslate: AppTranslationService,
    private nzModelService: NzModalService,
    private appGridStateService: AppGridStateService,
    private itemRoutingSrv: PsItemRoutingsService,
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  regionOptions: any[] = [];
  mySelection: any[] = [];
  YesOrNo: any[] = [];
  context = this;
  demandOptions: any[] = [];
  groupOptions: any[] = [];
  valueOptions: any[] = [];

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
    this.setGridWidth('sopmaterialdimensionrelation');
  }

  schedule: string;
  plantoptions: any[] = [];

  LoadData() {
    this.querydata.GetRegion('', this.appconfig.getUserId()).subscribe(res => {
      if (!res.data) return;
      this.schedule = res.data[0];
      this.regionChange(this.schedule);
      res.data.forEach(element => {
        this.regionOptions.push({
          label: element,
          value: element
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  httpAction = {
    url: this.querydata.url,
    method: 'POST',
  };

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];

  public queryParams = {
    defines: [
      { field: 'regionCode', title: '事业部', ui: { type: UiType.select, options: this.regionOptions, eventNo: 1 } },
      { field: 'demandDivision', title: '需求分析维度', ui: { type: UiType.select, options: this.demandOptions, eventNo: 3 } },
      { field: 'dividionValue', title: '维度值', ui: { type: UiType.select, options: this.valueOptions } },
      {
        field: 'txtItemCode', title: '物料', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } }
    ],
    values: {
      regionCode: this.appconfig.getDefaultScheduleRegionCode(),
      demandDivision: '',
      dividionValue: '',
      txtItemCode: { text: '', value: '' },
      enableFlag: 'Y',
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
      regionCode: this.queryParams.values.regionCode,
      demandDivision: this.queryParams.values.demandDivision,
      divisionValue: this.queryParams.values.dividionValue,
      txtItemCode: this.queryParams.values.txtItemCode.text,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport,
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
    { field: 'businessUnitCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'divisionName', headerName: '需求分析维度', menuTabs: ['filterMenuTab'] },
    { field: 'divisionValue', headerName: '维度值', menuTabs: ['filterMenuTab'] },
    { field: 'ratio', headerName: '标准产能系数', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsCn', headerName: '物料描述', tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 200, locked: false },
    { field: 'divisionName', title: '需求分析维度', width: 200, locked: false },
    { field: 'divisionValue', title: '维度值', width: 200, locked: false },
    { field: 'ratio', title: '标准产能系数', width: 200, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'descriptionsCn', title: '物料描述', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false }];

  clear() {
    this.queryParams.values = {
      regionCode: this.schedule,
      demandDivision: null,
      dividionValue: null,
      txtItemCode: { text: '', value: '' },
      enableFlag: 'Y',
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  add(item?: any) {
    console.log('add(item?: any)', item);
    this.modal
      .static(
        ProductSellBalanceSopmaterialdimensionrelationEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null) }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.apptranslate.translate('请先选择要删除的记录！'));
      return;
    }
    console.log('RemoveBatch11111111111', this.selectionKeys);
    // 弹出确认框
    this.nzModelService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata
          .RemoveBath(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.apptranslate.translate('删除成功'));
              this.query();
            } else {
              this.msgSrv.error(this.apptranslate.translate(res.msg));
            }
          });
      },
    });
  }

  httpExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(true), this.excelexport, this);
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

  regionChange(value: any) {
    console.log('加载需求维度');
    console.log(value);
    this.queryParams.values.demandDivision = null;
    this.demandOptions.length = 0;
    this.querydata.GetDemand(value).subscribe(res => {
      if (!res.data) return;
      res.data.forEach(element => {
        this.demandOptions.push({
          label: element,
          value: element
        });
      });
    });

    this.queryParams.values.dividionValue = '';
    this.valueOptions.length = 0;
    this.querydata.getValue(value, this.queryParams.values.demandDivision || '').subscribe(res => {
      if (!res.data) return;
      res.data.forEach(element => {
        this.valueOptions.push({
          label: element,
          value: element
        });
      });
    });
  }

  import() {
    this.modal
      .static(MaterialDimensionImportComponent, {}, 'md')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public loadItems(regionCode: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.itemRoutingSrv.GetUserPlantItemPageList('', ITEM_CODE || '', '', PageIndex, PageSize, '', regionCode || '').subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.regionCode, e.SearchValue, PageIndex, e.PageSize);
  }

  divisionChange(value: any) {
    this.queryParams.values.dividionValue = null;
    while (this.valueOptions.length > 0) {
      this.valueOptions.pop();
    }

    this.querydata.getValue(this.queryParams.values.regionCode || '', value).subscribe(res => {
      if (!res.data) return;
      res.data.forEach(element => {
        this.valueOptions.push({
          label: element,
          value: element
        });
      });
    });
  }
}
