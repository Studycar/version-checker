/*
 * @Author:
 * @contact:
 * @Date: 2021-09-17 15:30:10
 * @LastEditors: hdh
 * @Note: {
 *  column menu -hdh
 * }
 * @LastEditTime: 2021-09-17 15:30:10
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FormBuilder } from '@angular/forms';
import { DemandclearupnoticeService } from '../../../modules/generated_module/services/demandclearupnotice-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { DemandOrderManagementDemandclearupnoticeEditComponent } from 'app/aps/demand-order-management/demandclearupnotice/edit/edit.component';
import { DemandOrderManagementDemandclearupnoticeViewComponent } from 'app/aps/demand-order-management/demandclearupnotice/view/view.component';
import { DemandOrderManagementDemandclearupnoticenonstdreqComponent } from 'app/aps/demand-order-management/demandclearupnoticenonstdreq/demandclearupnoticenonstdreq.component';
import { ViewEncapsulation } from '@angular/core';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PsItemRoutingsService } from '../../../modules/generated_module/services/ps-item-routings-service';
import { DemandOrderHisViewComponent } from '../demand-order-his-view/demand-order-his-view.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './query.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { AppAgGridExtendService } from 'app/modules/base_module/services/app-aggrid-extend.service';
import { VisualView } from './visual-view/visual-view.component';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice',
  templateUrl: './demand-order-visualization-view.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .k-grid .no-padding {
      padding: 0px;
    }

    .whole-cell {
      display: block;
      padding: 8px 12px;
    }
    .modal-header{
      margin-bottom: 10px !important;
    }
    .ant-divider-horizontal {
      margin: 10px !important;
    }
    .ant-descriptions-title {
      margin-bottom: 5px !important;
    }
    .ant-descriptions-row > th, .ant-descriptions-row > td {
      padding-bottom: 8px !important;
    }
  `],
  providers: [QueryService, PsItemRoutingsService],
})
export class DemandOrderVisualization extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  extra = {
    moCompletedQuantity: 0,
    demandQuantity: 0,
  };

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  salesTypeList: any[] = [];
  gradeList: any[] = [];
  mySelection: any[] = [];
  sources: any[] = [];
  dateRange: any[] = [];
  makebuycodes: any[] = [];
  organizationids: any[] = [];
  scheduleregions: any[] = [];
  applicationReqType: any[] = [];
  applicationYesNo: any[] = [];
  applicationStatus: any[] = [];
  moStatus: any[] = [];
  colors: any[] = [];
  projectNumList: any[] = [];
  selectIndex = 1;
  defaultScheduleRegionCode = '';
  gridView: GridDataResult;
  httpAction = { url: this.demandclearupnoticeService.seachUrl, method: 'GET' };
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', ui: { type: UiType.select, options: this.organizationids, eventNo: 4 }, required: true },
      { field: 'strSource', title: '订单来源', ui: { type: UiType.select, options: this.sources } },
      { field: 'strSourceType', title: '订单状态', ui: { type: UiType.select, options: this.applicationStatus } },
      { field: 'strReqNumber', title: '需求订单号', ui: { type: UiType.text } },
      {
        field: 'strProjectNumber',
        title: '项目号码',
        ui: { type: UiType.text },
      },
      { field: 'strStandardFlag', title: '标准类型', ui: { type: UiType.select, options: this.applicationYesNo } },
      {
        field: 'strItemCodeFrom', title: '物料编码', ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
      { field: 'dateRange', title: '需求日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      strPlantCode: null,
      strSource: null,
      strSourceType: null,
      strReqNumber: '',
      strProjectNumber: '',
      strStandardFlag: null,
      strItemCodeFrom: { value: '', text: '' },
      dateRange: [],
    },
  };

  expColumnsOptions = [
    { field: 'reqType', options: this.applicationReqType },
    { field: 'standardFlag', options: this.applicationYesNo },
    { field: 'status', options: this.applicationStatus },
    { field: 'source', options: this.sources },
    { field: 'manualEntryFlag', options: this.applicationYesNo },
    { field: 'combinationFlag', options: this.applicationYesNo },
    { field: 'splitFlag', options: this.applicationYesNo },
    { field: 'mrpImportedFlag', options: this.applicationYesNo },
    { field: 'mrpNetFlag', options: this.applicationYesNo },
    { field: 'productScheduleFlag', options: this.applicationYesNo },
    { field: 'moStatus', options: this.moStatus },
    { field: 'attribute8', options: this.gradeList },
    { field: 'domesticOversea', options: this.salesTypeList },
  ];

  query() {
    super.query();
    // this.loadOptions();
    this.queryCommon();
  }

  private queryCommon() {
    const queryValues = this.getQueryParamsValue();
    queryValues.pageIndex = this._pageNo;
    queryValues.pageSize = this._pageSize;
    queryValues.isExport = false;
    this.commonQueryService.loadGridViewNew(this.httpAction, queryValues, this.context);
  }


  public export() {
    // this.loadOptions();
    super.export(true);
    const queryValues = this.getQueryParamsValue();
    queryValues.isExport = true;
    this.commonQueryService.exportAction({
      url: this.demandclearupnoticeService.seachUrl,
      method: 'GET',
    }, queryValues, this.excelexport, this.context);
  }

  public getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.strPlantCode ? this.queryParams.values.strPlantCode : null,
      itemCode: this.queryParams.values.strItemCodeFrom.text,
      reqNumber: this.queryParams.values.strReqNumber ? this.queryParams.values.strReqNumber : null,
      source: this.queryParams.values.strSource ? this.queryParams.values.strSource : null,
      sourceType: this.queryParams.values.strSourceType ? this.queryParams.values.strSourceType : null,
      startBegin: this.queryParams.values.dateRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.dateRange[0]) : '',
      startEnd: this.queryParams.values.dateRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.dateRange[1]) : '',
      standardFlag: this.queryParams.values.strStandardFlag ? this.queryParams.values.strStandardFlag : null,
      ProjectNumber: this.queryParams.values.strProjectNumber ? this.queryParams.values.strProjectNumber : null,
    };
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    public commonQueryService: QueryService,
    private formBuilder: FormBuilder,
    private demandclearupnoticeService: DemandclearupnoticeService,
    private commonqueryService: CommonQueryService,
    private plantmaintainService: PlantMaintainService,
    public ProdlineeditService: PsItemRoutingsService,
    private appGridStateService: AppGridStateService,
    private appAgGridExtendService: AppAgGridExtendService,
  )
  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
    super.setTopMargin(209);
  }

  // filterChanged
  tabs = [
    {
      index: 1,
      active: true,
      name: '主要信息',
    },
    {
      index: 2,
      active: false,
      name: '工单信息',
    }
    ,
    {
      index: 3,
      active: false,
      name: '非标信息',
    }
    ,
    {
      index: 4,
      active: false,
      name: '销售信息',
    },

  ];

  tabFirstFlag = Array(this.tabs.length).fill(true);
  stateKey = 'demandclearupnotice';
  tabSubject = new Subject<{ index: number, curColDef: any[], columnApi: any, gridApi: any }>();
  curTabColumns: any[] = [];

  tabSelect(arg: any): void {
    if (arg.index == null) {
      this.selectIndex = 1;
    } else {
      this.selectIndex = arg.index;
    }

    const curDisabledColumns = this.hideObjs.find(h => h.tabIndex === this.selectIndex).columns;
    this.curTabColumns = this.columns.filter(c => !curDisabledColumns.find(cc => cc.field === c.field));
    this.tabSubject.next({
      index: this.selectIndex,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
    });
    this.gridApi.redrawRows();
    this.initGridWidth();
  }

  hideObjs = [
    {
      tabIndex: 1,
      columns: [
        {
          field: 'shipmentSetName',
        },
        {
          field: 'moNumber',
        },
        {
          field: 'moStatus',
        },
        {
          field: 'moQuantity',
        },
        {
          field: 'moCompletedQuantity',
        },
        {
          field: 'moRemainQuantity',
        },
        {
          field: 'moStartDate',
        },
        {
          field: 'moEndDate',
        },
        {
          field: 'scheduleGroupCode',
        },
        {
          field: 'resourceCode',
        },
        {
          field: 'uph',
        },
        {
          field: 'mprNetFlag',
        },
        {
          field: 'salesRegion',
        },
        {
          field: 'salesArea',
        },
        {
          field: 'customerNumber',
        },
        {
          field: 'customerName',
        },
        {
          field: 'customerModel',
        },
        {
          field: 'custPoNumber',
        },
        {
          field: 'custPoLineNum',
        },
        {
          field: 'attribute8',
        },
        {
          field: 'attribute9',
        },
        {
          field: 'attribute10',
        },
        {
          field: 'attribute11',
        },
        {
          field: 'attribute12',
        },
        {
          field: 'attribute13',
        },
        {
          field: 'attribute14',
        },
        {
          field: 'attribute15',
        },
        {
          field: 'domesticOversea',
        }
      ],
    },
    {
      tabIndex: 2,
      columns: [
        {
          field: 'shipmentSetName',
        },
        {
          field: 'ratio',
        },
        {
          field: 'division',
        },
        {
          field: 'singleMachine',
        },
        {
          field: 'semiProduct',
        },
        {
          field: 'testNote',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'scheduleRegionCode',
        },
        {
          field: 'plantCode',
        },
        {
          field: 'reqType',
        },
        {
          field: 'standardFlag',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'status',
        },
        {
          field: 'cancelComments',
        },
        {
          field: 'reqQty',
        },
        {
          field: 'source',
        },
        {
          field: 'reqDate',
        },
        {
          field: 'promiseDate',
        },
        {
          field: 'reqComment',
        },
        {
          field: 'projectNumber',
        },
        {
          field: 'manualEntryFlag',
        },
        {
          field: 'combinationFlag',
        },
        {
          field: 'combinationReqNum',
        },
        {
          field: 'splitFlag',
        },
        {
          field: 'productScheduleFlag',
        },
        {
          field: 'mrpImportedFlag',
        },
        {
          field: 'riskOrderFlag',
        },
        {
          field: 'splitBaseQuantity',
        },
        {
          field: 'scheduleGroupCode',
        },
        {
          field: 'resourceCode',
        },
        {
          field: 'uph',
        },
        {
          field: 'mrpNetFlag',
        },
        {
          field: 'salesRegion',
        },
        {
          field: 'salesArea',
        },
        {
          field: 'customerNumber',
        },
        {
          field: 'customerName',
        },
        {
          field: 'customerModel',
        },
        {
          field: 'custPoNumber',
        },
        {
          field: 'custPoLineNum',
        },
        {
          field: 'attribute8',
        },
        {
          field: 'attribute9',
        },
        {
          field: 'attribute10',
        },
        {
          field: 'attribute11',
        },
        {
          field: 'attribute12',
        },
        {
          field: 'attribute13',
        },
        {
          field: 'attribute14',
        },
        {
          field: 'attribute15',
        },
        {
          field: 'domesticOversea',
        }
      ],
    },
    {
      tabIndex: 3,
      columns: [
        {
          field: 'shipmentSetName',
        },
        {
          field: 'ratio',
        },
        {
          field: 'division',
        },
        {
          field: 'singleMachine',
        },
        {
          field: 'semiProduct',
        },
        {
          field: 'testNode',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'scheduleRegionCode',
        },
        {
          field: 'plantCode',
        },
        {
          field: 'reqType',
        },
        {
          field: 'standardFlag',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'status',
        },
        {
          field: 'cancelComments',
        },
        {
          field: 'reqQty',
        },
        {
          field: 'source',
        },
        {
          field: 'reqDate',
        },
        {
          field: 'promiseDate',
        },
        {
          field: 'reqComment',
        },
        {
          field: 'projectNumber',
        },
        {
          field: 'manualEntryFlag',
        },
        {
          field: 'combinationFlag',
        },
        {
          field: 'combinationReqNum',
        },
        {
          field: 'splitFlag',
        },
        {
          field: 'productScheduleFlag',
        },
        {
          field: 'mrpImportedFlag',
        },
        {
          field: 'riskOrderFlag',
        },
        {
          field: 'splitBaseQuantity',
        },
        {
          field: 'moNumber',
        },
        {
          field: 'moStatus',
        },
        {
          field: 'moQuantity',
        },
        {
          field: 'moCompletedQuantity',
        },
        {
          field: 'moRemainQuantity',
        },
        {
          field: 'moStartDate',
        },
        {
          field: 'moEndDate',
        },
        {
          field: 'salesRegion',
        },
        {
          field: 'salesArea',
        },
        {
          field: 'customerNumber',
        },
        {
          field: 'customerName',
        },
        {
          field: 'customerModel',
        },
        {
          field: 'custPoNumber',
        },
        {
          field: 'custPoLineNum',
        },
        {
          field: 'attribute8',
        },
        {
          field: 'attribute9',
        },
        {
          field: 'attribute10',
        },
        {
          field: 'attribute11',
        },
        {
          field: 'attribute12',
        },
        {
          field: 'attribute13',
        },
        {
          field: 'attribute14',
        },
        {
          field: 'attribute15',
        },
        {
          field: 'domesticOversea',
        }
      ],
    }
    ,
    {
      tabIndex: 4,
      columns: [
        {
          field: 'ratio',
        },
        {
          field: 'division',
        },
        {
          field: 'singleMachine',
        },
        {
          field: 'semiProduct',
        },
        {
          field: 'testNote',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'scheduleRegionCode',
        },
        {
          field: 'plantCode',
        },
        {
          field: 'reqType',
        },
        {
          field: 'standardFlag',
        },
        {
          field: 'unitOfMeasure',
        },
        {
          field: 'status',
        },
        {
          field: 'cancelComments',
        },
        {
          field: 'reqQty',
        },
        {
          field: 'source',
        },
        {
          field: 'reqDate',
        },
        {
          field: 'promiseDate',
        },
        {
          field: 'reqComment',
        },
        {
          field: 'projectNumber',
        },
        {
          field: 'manualEntryFlag',
        },
        {
          field: 'combinationFlag',
        },
        {
          field: 'combinationReqNum',
        },
        {
          field: 'splitFlag',
        },
        {
          field: 'productScheduleFlag',
        },
        {
          field: 'mrpImportedFlag',
        },
        {
          field: 'riskOrderFlag',
        },
        {
          field: 'splitBaseQuantity',
        },
        {
          field: 'moNumber',
        },
        {
          field: 'moStatus',
        },
        {
          field: 'moQuantity',
        },
        {
          field: 'moCompletedQuantity',
        },
        {
          field: 'moRemainQuantity',
        },
        {
          field: 'moStartDate',
        },
        {
          field: 'moEndDate',
        },
        {
          field: 'scheduleGroupCode',
        },
        {
          field: 'resourceCode',
        },
        {
          field: 'uph',
        },
        {
          field: 'mrpNetFlag',
        }
      ],
    },

  ];

  columns = [
    {
      colId: 0, field: '', headerName: '订单可视操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 80, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'scheduleRegionCode',
      headerName: '事业部',
      width: 140, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 90, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqNumber',
      headerName: '需求订单号', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqLineNum',
      headerName: '需求订单行号',
      width: 110, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      headerName: '物料编码',
      width: 120, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptionsCn',
      headerName: '物料描述',
      width: 120, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqType', width: 120, headerName: '需求类型',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'standardFlag',
      width: 90,
      headerName: '标准类型',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '订单单位', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'status',
      width: 120,
      headerName: '订单状态',
      valueFormatter: 'ctx.optionsFind(value,4).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'cancelComments',
      width: 120,
      headerName: '取消说明', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqQty',
      width: 120,
      headerName: '需求数量', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'source',
      width: 120,
      headerName: '订单来源',
      valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqDate',
      width: 120,
      headerName: '需求日期', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'promiseDate',
      width: 120,
      headerName: '承诺日期', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqComment',
      width: 120,
      headerName: '需求说明', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'projectNumber',
      width: 120,
      headerName: '项目号码', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'manualEntryFlag',
      width: 120,
      headerName: '手工订单',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'combinationFlag',
      width: 120,
      headerName: '合并标识',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'combinationOrderNum',
      width: 120,
      headerName: '合并订单号', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'splitFlag',
      width: 120,
      headerName: '拆分标识',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'productScheduleFlag',
      width: 120,
      headerName: '可排产标识',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'mrpImportedFlag',
      width: 120,
      headerName: '已参与MRP',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'riskOrderFlag',
      width: 120,
      headerName: '风险订单标识', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'splitBaseQuantity',
      width: 120,
      headerName: '拆分合并基数', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moNumber',
      width: 120,
      headerName: '工单号', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moStatus',
      width: 120,
      headerName: '工单状态',
      valueFormatter: 'ctx.optionsFind(value,5).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moQuantity',
      width: 120,
      headerName: '工单数量', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moCompletedQuantity',
      width: 120,
      headerName: '完工数量', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moRemainQuantity',
      width: 120,
      headerName: '剩余数量', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moStartDate',
      width: 120,
      headerName: '计划开始时间', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'moEndDate',
      width: 120,
      headerName: '计划完成时间', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'scheduleGroupCode',
      width: 120,
      headerName: '非标计划组', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceCode',
      width: 120,
      headerName: '非标生产线', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'uph',
      width: 120,
      headerName: '小时产出', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'mrpNetFlag',
      width: 120,
      headerName: 'MRP净值标识',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'salesRegion',
      width: 120,
      headerName: '销售大区', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'salesArea',
      width: 120,
      headerName: '销售区域', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'customerNumber',
      width: 120,
      headerName: '客户代码', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'customerName',
      width: 120,
      headerName: '客户名称', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'customerName',
      width: 120,
      headerName: '客户型号', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'custPoNumber',
      width: 120,
      headerName: '客户订单号', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'custPoLineNum',
      width: 120,
      headerName: '客户订单行号', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute8',
      width: 120,
      headerName: '客户等级', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'attribute9',
      width: 120,
      headerName: '收货人电话', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute10',
      width: 120,
      headerName: '送货地址', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute11',
      width: 120,
      headerName: '运费承担', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute12',
      width: 120,
      headerName: '币种', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute13',
      width: 120,
      headerName: '收款状态', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute14',
      width: 120,
      headerName: '提货方式', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute15',
      width: 120,
      headerName: '装载车型', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'ratio',
      width: 70,
      headerName: 'QPA',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'division',
      width: 70,
      headerName: '产品类型',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'singleMachine',
      width: 120,
      headerName: '单机编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'semiProduct',
      width: 120,
      headerName: '半成品编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'testNote',
      width: 120,
      headerName: '试条编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'shipmentSetName',
      width: 120,
      headerName: '发运集',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'domesticOverSea', width: 100, headerName: '内外销',
      valueFormatter: 'ctx.optionsFind(value,7).label', menuTabs: ['filterMenuTab'],
    },
  ];
  expColumns = this.columns;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationReqType;
        break;
      case 2:
        options = this.applicationYesNo;
        break;
      case 3:
        options = this.sources;
        break;
      case 4:
        options = this.applicationStatus;
        break;
      case 5:
        options = this.moStatus;
        break;
      case 6:
        options = this.gradeList;
        break;
      case 7:
        options = this.salesTypeList;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public loadCustomGrade() {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_CUSTOMER_DEGREE').subscribe(result => {
      this.gradeList.length = 0;
      result.data.forEach(d => {
        this.gradeList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }
  public loadReqType(): void {

  }

  public loadColor(): void {

    this.commonQueryService.getColor('需求').subscribe(result => {
      result.data.forEach(d => {
        this.colors.push({
          label: d.colorName,
          value: d.colorValue,
        });
      });
    });

  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.loadColor();
    this.loadCustomGrade();
    this.query();
  }

  private loadOptions() {
    // 内外销
    // this.commonQueryService.GetLookupByTypeRefAttribute('SOP_SALES_TYPE', this.salesTypeList); // 迁移需要修改
    /** 初始化 事业部  下拉框*/
    this.commonqueryService.GetScheduleRegions().subscribe(result => {
      this.scheduleregions.length = 0;
      result.data.forEach(d => {
        this.scheduleregions.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    this.applicationReqType.length = 0;
    this.commonqueryService.GetLookupByTypeNew('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.applicationReqType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonqueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      this.applicationYesNo.length = 0;
      result.data.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonqueryService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
      this.sources.length = 0;
      result.data.forEach(d => {
        this.sources.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonqueryService.GetLookupByTypeNew('PP_PLN_ORDER_STATUS').subscribe(result => {
      this.applicationStatus.length = 0;
      result.data.forEach(d => {
        this.applicationStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonqueryService.GetLookupByTypeNew('PS_MAKE_ORDER_STATUS').subscribe(result => {
      this.moStatus.length = 0;
      result.data.forEach(d => {
        this.moStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appConfigService.getPlantCode();
    /** 初始化 组织  下拉框*/
    this.commonqueryService.GetUserPlant().subscribe(result => {
      this.organizationids.length = 0;
      result.Extra.forEach(d => {
        this.organizationids.push({ value: d.plantCode, label: d.plantCode });
      });
    });
    this.defaultScheduleRegionCode = this.appConfigService.getActiveScheduleRegionCode();
  }

  // 物料弹出查询
  public searchItemsFrom(e: any) {
    if (!this.queryParams.values.strPlantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.strPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public searchItemsTo(e: any) {
    if (!this.queryParams.values.strPlantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.strPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonqueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  // 事业部切换动态加载工厂
  public LoadPlantCodes(event: string) {
    this.queryParams.values.strPlantCode = null;
    this.queryParams.values.strItemCodeFrom.text = '';
    this.queryParams.values.strItemCodeFrom.value = '';
    this.commonqueryService.GetUserPlant(event).subscribe(result => {
      this.organizationids.length = 0;
      result.Extra.forEach(d => {
        this.organizationids.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  // 工厂切换动态清除物料
  public ClearItemCodes(event: string) {
    this.queryParams.values.strItemCodeFrom.text = '';
    this.queryParams.values.strItemCodeFrom.value = '';
  }

  public clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfigService.getPlantCode(),
      strSourceType: null,
      strItemCodeFrom: { value: '', text: '' },
      strSource: null,
      strReqNumber: '',
      dateRange: [],
      strStandardFlag: null,
      strProjectNumber: '',
    };
  }

  add() {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticeEditComponent,
        { i: { NEWFLAG: 'Y' } },
        1000, 500,
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public selectBy = 'id';

  public modifyData(item: any) {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticeEditComponent,
        {
          /*i: {
            id: (item !== undefined ? item.id : null),
            status: (item !== undefined ? item.status : null),
            cancelComments: (item !== undefined ? item.cancelComments : null),
            standardFlag: (item !== undefined ? item.standardFlag : null),
            moStatus: (item !== undefined ? item.moStatus : null),
            plantCode: (item !== undefined ? item.plantCode : null),
            scheduleGroupCode: (item !== undefined ? item.scheduleGroupCode : null),
            itemId: (item !== undefined ? item.itemId : null),
            reqType: (item !== undefined ? item.reqType : null),
            REQ_QTY_MODIFY: (item !== undefined ? item.reqQty : null),
            REQ_DATE_MODIFY: (item !== undefined ? item.reqDate : null),
            NEWFLAG: 'N',
          },*/
          i: item
        })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  searchOrderHistory(item: any) {
    // 改用新版的展示方式，create by jianl
    if (item === undefined || item === null) return;
    this.modal
      .static(
        DemandOrderHisViewComponent,
        {
          i: {
            REQ_NUMBER: item.reqNumber,
            REQ_LINE_NUM: item.reqLineNum,
            REQ_QTY: item.reqQty,
            REQ_DATE: item.reqDate,
            NEWFLAG: 'H',
          },
        },
        800, 400,
      ).subscribe(() => {

      });
  }

  public cancelSplitorMergeOrder(item: any) {
    if (item.reqNumber.substring(0, 1) === 'H' || item.splitFlag === 'Y') {
      this.demandclearupnoticeService.cancelSplitorMergeOrder(item.id).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('取消拆分/合并成功'));
          this.query();
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.msgSrv.info(this.appTranslationService.translate('只能选择拆分标识或合并标识为是的记录去取消拆分/合并'));
    }
  }

  public cancelOrder(item: any) {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticeViewComponent,
        {
          i: {
            id: (item !== undefined ? item.id : null),
            plantCode: (item !== undefined ? item.plantCode : null),
            reqNumber: (item !== undefined ? item.reqNumber : null),
            reqLineNum: (item !== undefined ? item.reqLineNum : null),
            NEWFLAG: 'C',
          },
        },
        'md'
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });

  }

  handleOrder(item: any) {
    let result = this.moStatus.filter(d => { if(item.moStatus == d.value) return d});
    item.moStatusStr = result.length ? result[0].label : '';
    // 后端要求总工单号没有传 -999
    item.moNumber = item.moNumber ? item.moNumber : '-999'
    this.modal
      .static(
        VisualView,
        {
          i: item,
        },
        1000
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  nonStdReq(item: any) {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticenonstdreqComponent,
        {
          i: {
            reqNumber: (item !== undefined ? item.reqNumber : null),
            reqLineNum: (item !== undefined ? item.reqLineNum : null),
            reqQty: (item !== undefined ? item.reqQty : null),
            reqDate: (item !== undefined ? item.reqDate : null),
            plantCode: (item !== undefined ? item.plantCode : null),
            status: (item !== undefined ? item.status : null),
            NEWFLAG: 'R',
            id: null,
          },
        },
        1000, 500,
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public mergeOrder() {

    if (this.selectionKeys.length < 1) {
      this.msgSrv.info(this.appTranslationService.translate('请先选择订单'));
      return;
    }
    const selectItems = [];
    this.gridData.forEach(d => {
      if (this.selectionKeys.findIndex(x => x === d.id) > -1) {
        selectItems.push(d);
      }
    });
    const selectItemstmp = selectItems.find(x => x.attribute1 === 'N');
    if (selectItemstmp !== undefined) {
      this.msgSrv.info(this.appTranslationService.translate('父订单拆分出来的子订单或者合并过的订单不能和任何订单合并'));
      return;
    }
    const selectItemssplit = selectItems.find(x => x.splitFlag === 'Y');
    if (selectItemssplit !== undefined) {
      this.msgSrv.info(this.appTranslationService.translate('已拆分订单不能和任何订单合并'));
      return;
    }
    const selectItemsStandard = selectItems.find(x => x.standardFlag === 'N');
    if (selectItemsStandard !== undefined) {
      this.msgSrv.info(this.appTranslationService.translate('标准类型为否的订单不能和任何订单合并'));
      return;
    }

    const selectItemsMO = selectItems.find(x => x.moStatus !== 'A' && x.moStatus !== null && x.moStatus !== '');
    if (selectItemsMO !== undefined) {
      this.msgSrv.info(this.appTranslationService.translate('已经下达工单的订单不能和任何订单合并'));
      return;
    }

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要合并吗？'),
      nzOnOk: () => {
        this.demandclearupnoticeService
          .MergeOrder(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('合并成功'));
              this.queryCommon();
              // this.query();
            } else {
              this.msgSrv.warning(this.appTranslationService.translate(res.msg));
            }

          });
      },
    });
  }


  // 生成工单
  setMakeOrder() {
    if (!this.queryParams.values.strPlantCode) {
      this.msgSrv.error(this.appTranslationService.translate('请先查询需求订单'));
      return;
    }

    this.projectNumList = [];
    const gridSelectRows = this.gridApi.getSelectedRows();
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        this.projectNumList.push(d['projectNumber']);
      });
    }

    if (this.projectNumList.length === 0) {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('没有选择需求订单，继续提交将生成需求日期为一个月内定订单对应的工单，是否继续生成?'),
        nzOnOk: () => {
          this.demandclearupnoticeService.setMakeOrder(this.queryParams.values.strPlantCode, this.projectNumList).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('生成订单请求已提交，请等候处理'));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('系统将生成已选择的需求订单的工单，是否继续生成?'),
        nzOnOk: () => {
          this.demandclearupnoticeService.setMakeOrder(this.queryParams.values.strPlantCode, this.projectNumList).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('生成订单请求已提交，请等候处理'));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        },
      });
    }
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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

  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }
}
