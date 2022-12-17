/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 08:48:34
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { PreparationPlatformDemandputEditComponent } from './edit/edit.component';
import { DemandPutService } from '../../../modules/generated_module/services/demand-put-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { DemandputImportComponent } from './import/import.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-demandput',
  templateUrl: './demandput.component.html',
  providers: [QueryService]
})
export class PreparationPlatformDemandputComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryservice: QueryService,
    private demandputservice: DemandPutService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
  }

  mySelection: any[] = [];
  plantoptions: any[] = [];
  itemoptions: any[] = [];
  regionOptions: any[] = [];

  public dis: Boolean = false;
  context = this;
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } },
      {
        field: 'itemCode', title: '物料编码', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'deliveryRegionCode', title: '送货区域', ui: { type: UiType.select, options: this.regionOptions } },
      { field: 'demandDateFrom', title: '需求开始时间', ui: { type: UiType.datetime } },
      { field: 'demandDateTo', title: '需求结束时间', ui: { type: UiType.datetime } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      itemCode: { value: '', text: '' },
      deliveryRegionCode: '',
      demandDateFrom: '',
      demandDateTo: '',
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
    { field: 'itemCode', headerName: '物料编码' },
    { field: 'itemDesc', headerName: '物料描述', tooltipField: 'itemDesc', menuTabs: ['filterMenuTab'] },
    { field: 'demandQty', headerName: '需求数量', menuTabs: ['filterMenuTab'] },
    { field: 'demandDate', headerName: '需求日期', menuTabs: ['filterMenuTab'] },
    { field: 'deliveryRegionCode', headerName: '送货区域', menuTabs: ['filterMenuTab'] }
  ];

  expColumns1 = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'itemCode', title: '物料编码', width: 200, locked: true },
    { field: 'itemDesc', title: '物料名称', width: 200, locked: true },
    { field: 'demandQty', title: '需求数量', width: 200, locked: true },
    { field: 'demandDate', title: '需求时间', width: 200, locked: true },
    { field: 'deliveryRegionCode', title: '送货区域', width: 200, locked: true }
  ];

  httpAction = {
    url: this.demandputservice.url,
    method: 'POST'
  };

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.dis = true;
    this.queryCommon();
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
    this.setGridWidth('demandput');
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
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
        PreparationPlatformDemandputEditComponent,
        { i: { id: (item !== undefined ? item.id : null), plantCode: (item !== undefined ? item.plantCode : null) } },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  plantchange(value) {
    this.dis = false;
    this.queryParams.values.itemCode.text = null;
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;

    this.regionOptions.length = 0;

    this.demandputservice.GetRegion1(this.queryParams.values.plantCode).subscribe(res => {
      res.data.forEach(element => {
        this.regionOptions.push({
          label: element.deliveryRegionCode,
          value: element.deliveryRegionCode
        });
      });
    });
    // this.demandputservice.GetItem(value).subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.itemoptions.push({
    //       label: element.itemCode,
    //       value: element.itemCode
    //     });
    //   });
    // });

  }

  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      deliveryRegionCode: this.queryParams.values.deliveryRegionCode,
      demandDateFrom: this.queryParams.values.demandDateFrom,
      demandDateTo: this.queryParams.values.demandDateTo,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  clear() {
    this.queryParams.values = {
      plantCode: null,
      itemCode: { value: '', text: '' },
      deliveryRegionCode: null,
      demandDateFrom: '',
      demandDateTo: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    };
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.demandputservice.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  remove(value: any) {
    this.demandputservice.remove(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  httpExportAction = {
    url: this.demandputservice.url,
    method: 'POST'
  };

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryservice.exportAction(this.httpExportAction, this.getQueryParamsValue(), this.excelexport, this.context);
  }

  public import() {
    this.modal
      .static(DemandputImportComponent, {}, 'md')
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
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
