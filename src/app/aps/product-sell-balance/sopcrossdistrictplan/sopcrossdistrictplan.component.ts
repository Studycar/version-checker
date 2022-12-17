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
import { SopCrossDistrictPlanService } from '../../../modules/generated_module/services/sopcrossdistrictplan-service';
import { QueryService } from './queryService';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopcrossdistrictplan',
  templateUrl: './sopcrossdistrictplan.component.html',
  providers: [QueryService, SopCrossDistrictPlanService]
})
export class ProductSellBalanceSopcrossdistrictplanComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopCrossDistrictPlanService,
    private apptranslate: AppTranslationService,
    private appConfigService: AppConfigService,
    private nzModelService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }
  mySelection: any[] = [];
  /**事业部集合 */
  businessUnitOption: any[] = [];
  divisionNameOption: any[] = [];
  context = this;
  ngOnInit() {
    /**加载所有事业部 */
    this.commonquery.GetAllScheduleRegionNew().subscribe(result => {
      result.data.forEach(d => {
        this.businessUnitOption.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    this.scheduleRegionChange();
    this.query();
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

  httpAction = {
    url: this.querydata.url,
    method: 'POST',
  };

  /**页面查询参数 */
  public queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: {
          type: UiType.select,
          options: this.businessUnitOption,
        },
        required: true,
        eventNo: 1
      },
      {
        field: 'salesRegion',
        title: '需求区域',
        ui: { type: UiType.text },
      },
      {
        field: 'supplyRegion',
        title: '供应区域',
        ui: { type: UiType.text },
      },
       {
        field: 'divisionName',
        title: '汇总维度',
        ui: {
          type: UiType.select,
          options: this.divisionNameOption,
        },
      },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      salesRegion: '',
      supplyRegion: '',
      divisionName: null
    },
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(), this.context);
    //this.scheduleRegionChange();
  }

  GetQueryParams() {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      salesRegion: this.queryParams.values.salesRegion,
      supplyRegion: this.queryParams.values.supplyRegion,
      divisionName: this.queryParams.values.divisionName,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  public columns = [

    { field: 'businessUnitCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'salesRegion', headerName: '需求区域', menuTabs: ['filterMenuTab'] },
    { field: 'divisionValue', headerName: '品类', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '产品编码', menuTabs: ['filterMenuTab'] },
    { field: 'forecastQty', headerName: '需求数量', menuTabs: ['filterMenuTab'] },
    { field: 'weights', headerName: '重量', menuTabs: ['filterMenuTab'] },
    { field: 'custDivisionValue', headerName: '供货区域', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '供货工厂', menuTabs: ['filterMenuTab'] },
    { field: 'demandPeriod', headerName: '需求周期', menuTabs: ['filterMenuTab'] },
    { field: 'demandDate', headerName: '需求月份', menuTabs: ['filterMenuTab'] },
    { field: 'grossUnitWeight', headerName: '单位重量', menuTabs: ['filterMenuTab'] },
    { field: 'distance', headerName: '物流距离', menuTabs: ['filterMenuTab'] },
    { field: 'pricePer', headerName: '物流单价', menuTabs: ['filterMenuTab'] },
    { field: 'logisticsFee', headerName: '调拨物流费用', menuTabs: ['filterMenuTab'] },
  ];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'salesRegion', title: '需求区域', menuTabs: ['filterMenuTab'] },
    { field: 'divisionValue', title: '品类', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', title: '产品编码', menuTabs: ['filterMenuTab'] },
    { field: 'forecastQty', title: '需求数量', menuTabs: ['filterMenuTab'] },
    { field: 'weights', title: '重量', menuTabs: ['filterMenuTab'] },
    { field: 'custDivisionValue', title: '供货区域', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', title: '供货工厂', menuTabs: ['filterMenuTab'] },
    { field: 'demandPeriod', headerName: '需求周期', menuTabs: ['filterMenuTab'] },
    { field: 'demandDate', headerName: '需求月份', menuTabs: ['filterMenuTab'] },
    { field: 'grossUnitWeight', headerName: '单位重量', menuTabs: ['filterMenuTab'] },
    { field: 'distance', headerName: '物流距离', menuTabs: ['filterMenuTab'] },
    { field: 'pricePer', headerName: '物流单价', menuTabs: ['filterMenuTab'] },
    { field: 'logisticsFee', headerName: '调拨物流费用', menuTabs: ['filterMenuTab'] },
  ];


  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      salesRegion: '',
      supplyRegion: '',
      divisionName: null
    };
  }

  httpExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };
  expData: any[] = [];


  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
     super.export();
         setTimeout(() => {
           this.excelexport.export(this.gridData);
         });
    //this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(), this.excelexport, this);
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

  /*private loadOptions() {
    this.commonQueryService.GetApplication().subscribe(result => {
      this.applicationOptions.length = 0;
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });
  }*/

  scheduleRegionChange() {
    this.querydata.getDivisionName(this.queryParams.values.businessUnitCode).subscribe(result => {  
    this.divisionNameOption.length = 0;
      result.data.forEach(d => {
        this.divisionNameOption.push({
          label: d,
          value: d,
        });
      });
    });
  }

  /*scheduleRegionChange(event: string) {
    this.divisionNameOption.length = 0;
    this.querydata.getDivisionName(this.queryParams.values.businessUnitCode).subscribe(result => {
      result.data.forEach(d => {
        this.divisionNameOption.push({
          label: d.divisionName,
          value: d.divisionName,
        });
      });
    });
  }*/
}
