/*
 * @Author: lyp
 * @contact: 
 * @Date: 2020-08-13 09:51:22
 * @LastEditors: lyp
 * @LastEditTime: 2020-08-13 15:29:23
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
import { SopPlantCapacityReviewService } from '../../../modules/generated_module/services/sopplantcapacityreview-service';
import { QueryService } from './queryService';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ProductSellBalanceSopPlantCapacityReviewChildAgComponent } from '../sopplantcapacityreviewchild/sopplantcapacityreviewchild.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopplantcapacityreview',
  templateUrl: './sopplantcapacityreview.component.html',
  providers: [QueryService, SopPlantCapacityReviewService]
})
export class ProductSellBalanceSopplantcapacityreviewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  mySelection: any[] = [];
  /**事业部集合 */
  businessUnitOption: any[] = [];
  /**工厂集合 */
  plantOption: any[] = [];
  /**产能分类集合 */
  capacityOption: any[] = [];
  context = this;
  /**页面查询参数 */
  public queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: {
          type: UiType.select,
          options: this.businessUnitOption,
          ngModelChange: this.onScheduleRegionCodeChange,
        },
        required: true,
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption },
      },

      {
        field: 'capacityClass',
        title: '产能分类',
        ui: { type: UiType.select, options: this.capacityOption },
      },
      { field: 'demandDate', title: '月份', ui: { type: UiType.monthPicker, format: 'yyyy-MM' } },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: '',
      capacityClass: '',
      demandDate: '',
    },
  };
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopPlantCapacityReviewService,
    private apptranslate: AppTranslationService,
    private appConfigService: AppConfigService,
    private nzModelService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.query();
  }

  private loadOptions() {
    /**加载所有事业部 */
    this.commonquery.GetAllScheduleRegionNew().subscribe(result => {
      result.data.forEach(item => {
        this.businessUnitOption.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode,
        });
      });
    });
    /**绑定事业部下工厂 */
    this.onScheduleRegionCodeChange(
      this.queryParams.values.businessUnitCode,
    );

    this.querydata.GetCapacityClass(this.queryParams.values.businessUnitCode).subscribe(res => {
      this.capacityOption.length = 0;
      res.data.forEach(item => {
        this.capacityOption.push({
          label: item.divisionValue,
          value: item.divisionValue,
        });
      });
    });;
  }

  httpAction = {
    url: this.querydata.url,
    method: 'POST',
  };

  GetQueryParams() {
    let demandd = '';
    if (this.queryParams.values.demandDate !== '') {
      demandd = this.commonquery.getYearNum(this.queryParams.values.demandDate) + '-' + this.commonquery.getMonthNum(this.queryParams.values.demandDate);
    }
    return {
      buCode: this.queryParams.values.businessUnitCode,
      plantCode: this.queryParams.values.plantCode,
      demandDate: demandd,
      capacityClass: this.queryParams.values.capacityClass,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(), this.context);
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
    { field: 'salesType', headerName: '内外销', menuTabs: ['filterMenuTab'] },
    { field: 'capacityclass', headerName: '产能分类', menuTabs: ['filterMenuTab'] },
    { field: 'monthMM', headerName: '月份', menuTabs: ['filterMenuTab'] },
    { field: 'monthPlanningQuantity', headerName: '月度产能', menuTabs: ['filterMenuTab'] },
    { field: 'monthPlan', headerName: '月度计划', menuTabs: ['filterMenuTab'] },
    { field: 'satisfyQuantity', headerName: '分配数量', menuTabs: ['filterMenuTab'] },
    { field: 'unmetQuantity', headerName: '未满足数量', menuTabs: ['filterMenuTab'] },
    { field: 'leaveQuantity', headerName: '剩余产能', menuTabs: ['filterMenuTab'] },
    { field: 'capacityRate', headerName: '产能利用率(%)', menuTabs: ['filterMenuTab'] },

  ];

  // 弹出明细
  public detailHandler(item: any) {
    this.modal
      .static(ProductSellBalanceSopPlantCapacityReviewChildAgComponent, {
        p: {
          buCode: item.buCode,
          plantCode: item.plantCode,
          salesType: item.salesType,
          monthMM: item.monthMM,
          capacityclass: item.capacityclass,
        }
      }, 'lg')
      .subscribe(() => {

      });
  }

  /**搜索事业部值改变触发的回调 */
  onScheduleRegionCodeChange(value) {
    this.queryParams.values.plantCode = null;
    this.commonquery.GetAllPlant(value).subscribe(res => {
      this.plantOption.length = 0;
      res.data.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode,
        });
      });
    });
    this.querydata.GetCapacityClass(this.queryParams.values.businessUnitCode).subscribe(res => {
      this.capacityOption.length = 0;
      res.data.forEach(item => {
        this.capacityOption.push({
          label: item.divisionValue,
          value: item.divisionValue,
        });
      });
    });;

  }

  expColumns = [
    { field: 'buCode', title: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', title: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'salesType', title: '内外销', menuTabs: ['filterMenuTab'] },
    { field: 'capacityclass', title: '产能分类', menuTabs: ['filterMenuTab'] },
    { field: 'monthMM', title: '月份', menuTabs: ['filterMenuTab'] },
    { field: 'monthPlanningQuantity', title: '月度产能', menuTabs: ['filterMenuTab'] },
    { field: 'monthPlan', title: '月度计划', menuTabs: ['filterMenuTab'] },
    { field: 'satisfyQuantity', headerName: '分配数量', menuTabs: ['filterMenuTab'] },
    { field: 'unmetQuantity', headerName: '未满足数量', menuTabs: ['filterMenuTab'] },
    { field: 'leaveQuantity', headerName: '剩余产能', menuTabs: ['filterMenuTab'] },
    { field: 'capacityRate', headerName: '产能利用率(%)', menuTabs: ['filterMenuTab'] },

  ];
  httpExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };
  expData: any[] = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
    /*this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(), this.excelexport, this);*/
  }

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
    this.setGridWidth('sopcrossdistrictplan');
  }

}
