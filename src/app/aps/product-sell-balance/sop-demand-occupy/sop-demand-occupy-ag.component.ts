import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceSopdemandOccupyChildAgComponent } from '../sop-demand-occupy-child/sop-demand-occupy-child-ag.component';
import { SopDemandOccupyService } from 'app/modules/generated_module/services/sopdemandoccupy-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ProductSellBalanceSopdemandOccupydtlAgComponent } from '../sop-demand-occupy-dtl/sop-demand-occupy-dtl-ag.component';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sop-demand-occupy-ag',
  templateUrl: './sop-demand-occupy-ag.component.html',
  providers: [SopDemandOccupyService],
})
export class ProductSellBalanceSopdemandOccupyAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'Id';
  isLoading = false;
  public optionListPlant: any[] = [];
  public mothOptions: any[] = []; // 月份

  public gridViewBatch: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsBatch: any[] = [
    {
      field: 'BATCH_NUMBER',
      title: '版本号',
      width: '150'
    }
  ];

  public queryParams = {
    defines: [

      { field: 'plantID', title: '工厂', ui: { type: UiType.select, options: this.optionListPlant, ngModelChange: this.onChangePlant }, required: true },
      {
        field: 'batchNamber', title: '版本', ui: {
          type: UiType.popupSelect, valueField: 'BATCH_NUMBER', textField: 'BATCH_NUMBER', gridView: this.gridViewBatch, columns: this.columnsBatch, eventNo: 2
        }, required: true
      },
      { field: 'demandDate', title: '月份', ui: { type: UiType.monthPicker, format: 'yyyy-MM' } },
      { field: 'category', title: '类别', ui: { type: UiType.string } }
    ],
    values: {
      plantID: '',
      batchNamber: { value: '', text: '' },
      demandDate: '',
      category: ''
    }
  };
  // grid 设置行样式
  public getRowStyle = function (params) {
    // console.log(params);
    // if (params.node.data.CAPACITY_VARIANCE < 0) {
    //   return { color: 'red' };
    // } else {
    //   // return { 'background-color': '#fcfdfe', color: 'black' };
    //   return null;
    // }
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'PLANT_CODE', headerName: '工厂', tooltipField: 'PLANT_CODE', menuTabs: ['filterMenuTab'] },
    {
      field: 'BATCH_NUMBER', headerName: '版本', tooltipField: 'BATCH_NUMBER', menuTabs: ['filterMenuTab']
    },

    {
      field: 'DEMAND_DATE', headerName: '月份', valueFormatter: 'ctx.demandDateFormatter(value)', menuTabs: ['filterMenuTab']
    },
    {
      field: 'TONNAGE', headerName: '类别', tooltipField: 'TONNAGE', menuTabs: ['filterMenuTab']
    },
    {
      field: 'DEMAND_QUANTITY', headerName: '需求数量', tooltipField: 'DEMAND_QUANTITY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'AVAILABLE_QUANTITY', headerName: '满足数量', tooltipField: 'AVAILABLE_QUANTITY', menuTabs: ['filterMenuTab']
    },
    {
      field: 'CAPACITY_VARIANCE', headerName: '产能缺口', tooltipField: 'CAPACITY_VARIANCE', menuTabs: ['filterMenuTab'],
      cellStyle: function (params) {
        if (params.value < 0) {
          return { color: 'red' };
        } else {
          return null;
        }
      }
    },
    {
      field: 'COMMENTS', headerName: '备注', tooltipField: 'COMMENTS',
      editable: true, cellEditor: 'agTextCellEditor', menuTabs: ['filterMenuTab']
    }
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: SopDemandOccupyService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);

  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.gridData = [];
    this.selectableSettings.mode = 'single';
    this.selectableSettings.checkboxOnly = true;
    this.gridOptions.rowSelection = 'single';
    this.loadplant();
    // this.queryCommon();
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
      if (this.allColumnIds.length <= 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('sopdemandoccupy');
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.PLANT_CODE,
          value: d.PLANT_CODE,
        });
      });
      this.queryParams.values.plantID = this.appConfigService.getPlantCode();
      // console.log(this.appConfigService.getPlantCode());

      // 绑定批次
      this.queryParams.values.batchNamber.text = '';
      this.loadBatch(this.queryParams.values.plantID, '', 1, 10);

    });
  }

  // 加载版本
  searchBatch(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadBatch(this.queryParams.values.plantID, e.SearchValue, PageIndex, e.PageSize);
  }
  public loadBatch(PLANT_CODE: string, BATCH_NUMBER: string, PageIndex: number, PageSize: number) {
    // 加载版本
    this.editService.GetBatchPageList(PLANT_CODE || '', '2', BATCH_NUMBER || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewBatch.data = res.Result;
      this.gridViewBatch.total = res.TotalCount;
    });
  }


  // 工厂 值更新事件 重新绑定批次
  onChangePlant(value: string): void {

    this.queryParams.values.batchNamber.text = '';
    this.loadBatch(this.queryParams.values.plantID, '', 1, 10);
  }

  httpAction = { url: this.editService.seachUrlSum, method: 'POST' };

  public query() {
    if (this.queryParams.values.batchNamber.text === '') {
      this.msgSrv.error('请选择版本！');
      return;
    }

    super.query();
    this.queryCommon();
  }

  // 获取查询参数
  private getQueryParamsValue(): any {
    let demandd = '';
    if (this.queryParams.values.demandDate !== '') {
      demandd = this.commonQueryService.getYearNum(this.queryParams.values.demandDate) + '-' + this.commonQueryService.getMonthNum(this.queryParams.values.demandDate);
    }
    return {
      plantID: this.queryParams.values.plantID,
      batchNamber: this.queryParams.values.batchNamber.text,
      demandDate: demandd,
      category: this.queryParams.values.category,
      page: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  // 单元格内容改变   修改备注
  onCellValueChanged(event) {
    // 加载版本
    this.editService.Edit(event.node.data)
      .subscribe(res => {
        if (res.Success === true) {

        } else {
          this.msgSrv.error(res.Message);
        }
      });
  }

  // grid当前选中行
  public gridSelectRows: any[];


  // 行选中改变
  onSelectionChanged(event) {
    // console.log(event);
    this.gridSelectRows = this.gridApi.getSelectedRows();
  }

  // 弹出来源明细
  public occupylist() {
    if (!this.isNull(this.gridSelectRows) && this.gridSelectRows.length > 0) {
      const row = this.gridSelectRows[0];
      // console.log('yuyyuy' + row.PLANT_CODE);
      this.modal
        .static(ProductSellBalanceSopdemandOccupydtlAgComponent, {
          p: {
            PLANT_CODE: row.PLANT_CODE,
            TONNAGE: row.TONNAGE,
            BATCH_NUMBER: row.BATCH_NUMBER,
            DEMAND_DATE: row.DEMAND_DATE,
            RESOURCE_TYPE: row.RESOURCE_TYPE
          }
        }, 'lg')
        .subscribe(() => {
        });
    } else {
      this.msgSrv.success('请选择一行数据。');
      return;
    }
  }

  // 弹出明细
  public detailHandler(item: any) {
    this.modal
      .static(ProductSellBalanceSopdemandOccupyChildAgComponent, {
        p: {
          PLANT_CODE: item.PLANT_CODE,
          TONNAGE: item.TONNAGE,
          BATCH_NUMBER: item.BATCH_NUMBER,
          DEMAND_DATE: item.DEMAND_DATE,
          RESOURCE_TYPE: item.RESOURCE_TYPE
        }
      }, 'lg')
      .subscribe(() => {
      });
  }


  expData: any[] = [];
  expColumns = this.columns;

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {

    super.export();
    this.commonQueryService.export({ url: this.editService.seachUrlSumExp, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }



  public clear() {
    this.queryParams.values = {
      plantID: '',
      batchNamber: { value: '', text: '' },
      demandDate: '',
      category: ''
    };

    this.loadplant();
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

  /**
   * 格式化需求日期
   * @param value
   */
  public demandDateFormatter(value) {
    if (value !== undefined) {
      const date = new Date(value);
      return date.getFullYear() + '-' + (date.getMonth() + 1);
    }
    return value;
  }


  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['备注'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#opDigitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }
}
