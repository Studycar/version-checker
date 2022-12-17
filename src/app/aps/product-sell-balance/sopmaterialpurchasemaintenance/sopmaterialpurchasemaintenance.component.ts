/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-08 09:00:54
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-05 19:52:17
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent } from './edit/edit.component';
import { SopMaterialPurchaseMaintenanceService } from '../../../modules/generated_module/services/sopmaterialpurchasemaintenance-service';
import { ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent } from './batch-modify/batch-modify.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialpurchasemaintenance',
  templateUrl: './sopmaterialpurchasemaintenance.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopmaterialpurchasemaintenanceComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryservice: QueryService,
    private querydata: SopMaterialPurchaseMaintenanceService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) { super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig }); }

  mySelection: any[] = [];
  plantoptions: any[] = [];
  yesOrNo: any[] = [];
  categoryoptions: any[] = [];
  public dis: Boolean = false;
  context = this;
  yesNum: number;
  noNum: number;
  noOptions: any[] = [];
  yesOptions: any[] = [];
  isCheck: Boolean = true;
  public gridView1: GridDataResult = {
    data: [],
    total: 0
  };

  public columns1: any[] = [
    {
      field: 'categoryCode',
      title: '采购分类',
      width: '100'
    },
    {
      field: 'descriptions',
      title: '类别描述',
      width: '100'
    }
  ];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } },
      { field: 'reviewFlag', title: '是否参与检讨', ui: { type: UiType.select, options: this.yesOrNo, eventNo: 1 } },
      {
        field: 'categoryCode', title: '采购分类', ui: {
          type: UiType.popupSelect, valueField: 'categoryCode', textField: 'categoryCode', gridView: this.gridView1, columns: this.columns1, eventNo: 2
        }
      },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      reviewFlag: '',
      categoryCode: { value: '', text: '' },
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

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
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'categoryCode', headerName: '采购分类', menuTabs: ['filterMenuTab'] },
    { field: 'categoryName', headerName: '类别描述', menuTabs: ['filterMenuTab'] },
    { field: 'reviewFlag', headerName: '是否参与检讨', menuTabs: ['filterMenuTab'] },
    { field: 'enterFlag', headerName: '是否录入产能', menuTabs: ['filterMenuTab'] },
    { field: 'lastUpdatedBy', headerName: '最近更新人', menuTabs: ['filterMenuTab'] },
    { field: 'lastUpdateDate', headerName: '最近更新时间', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'categoryCode', title: '采购分类', width: 200, locked: false },
    { field: 'reviewFlag', title: '是否参与检讨', width: 200, locked: false },
    { field: 'enterFlag', title: '是否录入产能', width: 200, locked: false },
    { field: 'lastUpdatedBy', title: '最近更新人', width: 200, locked: false },
    { field: 'lastUpdateDate', title: '最近更新时间', width: 200, locked: false }
  ];

  httpAction = {
    url: this.querydata.baseUrl + '/query',
    method: 'GET'
  };

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.headerNameTranslate(this.columns);
    this.dis = true;
    this.queryCommon();
    this.loadData();
    this.yesNum = 0;
    this.noNum = 0;
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
    this.setGridWidth('');
  }

  loadData() {
    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent,
        { i: { id: (item !== undefined ? item.id : null), plantCode: (item !== undefined ? item.plantCode : null) } },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  plantchange(value) {
    this.dis = false;
  }

  private getQueryParamsValue(isExport: any): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      reviewFlag: this.queryParams.values.reviewFlag,
      categoryCode: this.queryParams.values.categoryCode.text,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      reviewFlag: null,
      categoryCode: { value: '', text: '' },
      pageIndex: 1,
      pageSize: this.gridState.take,
    };
  }

  /*RemoveBatch() {
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
  }*/

  remove(value: any) {
    console.log('=====id', value.id);
    this.querydata.remove(value.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryservice.export(this.httpAction, this.getQueryParamsValue(true), this.excelexport, this);
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
    // const gridSelectRows = this.gridApi.getSelectedRows();
    // this.CheckedChange(gridSelectRows);
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

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.load(e.SearchValue, PageIndex, e.PageSize);
  }

  public load(CATEGORY_CODE: string, PageIndex: number, PageSize: number) {
    this.querydata.getCategoryPage('采购分类', CATEGORY_CODE || '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  batchModify() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要修改的行');
    } else {
      const gridSelectRows = this.gridApi.getSelectedRows();
      this.checkedChange(gridSelectRows);
      this.modal.static(
        ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent,
        { i: { yesOp: (this.yesOptions.length > 0 ? this.yesOptions : null), noOp: (this.noOptions.length > 0 ? this.noOptions : null) } },
        'sm'
      ).subscribe(() => {
        this.queryCommon();
        this.yesOptions = [];
        this.noOptions = [];
        this.mySelection = [];
      });
    }
  }

  checkedChange(value: any) {
    value.forEach(element => {
      if (element.reviewFlag === '是') {
        this.yesOptions.push(element.id);
      } else {
        this.noOptions.push(element.id);
      }
    });
  }
}
