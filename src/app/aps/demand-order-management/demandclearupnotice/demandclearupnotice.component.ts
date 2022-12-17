/*
 * @Author:
 * @contact:
 * @Date: 2018-12-25 13:59:10
 * @LastEditors: Zwh
 * @Note: {
 *  column menu -zwh
 * }
 * @LastEditTime: 2019-09-05 19:14:06
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
import { DemandOrderManagementDemandclearupnoticesplitAgComponent } from './demandclearupnoticesplitAg.component';
import { PpReqOrderImportComponent } from './import/import.component';
import { Subject } from 'rxjs';
import { decimal } from '@shared';
import { DemandOrderManagementDemandclearupnoticeCopyComponent } from './copy/copy.component';
import { DemandOrderManagementDemandclearupnoticeRawListComponent } from './raw-list/raw-list.component';
import { LOOKUP_CODE } from 'app/modules/generated_module/dtos/LOOKUP_CODE';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { BatchChooseRouteComponent } from './batch-choose-route/batch-choose-route.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice',
  templateUrl: './demandclearupnotice.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .k-grid .no-padding {
      padding: 0px;
    }

    .whole-cell {
      display: block;
      padding: 8px 12px;
    }
  `],
  providers: [QueryService, PsItemRoutingsService],
})
export class DemandOrderManagementDemandclearupnoticeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  extra = {
    moCompletedQuantity: 0,
    demandQuantity: 0,
    meterNumQuantity: 0,
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
  lockOption: any[] = [];
  moStatus: any[] = [];
  colors: any[] = [];
  projectNumList: any[] = [];
  needSiteCutOptions: any[] = LOOKUP_CODE.NEED_SITE_CUT;
  surfaceOptions: any[] = [];
  steelTypeOption: any[] = [];
  pricingTypeOption: any[] = [];
  surfaceProtectOptions: any[] = [];
  lockFlagOption: any[] = LOOKUP_CODE.LOCK_FLAG;
  moFlagOption: any[] = LOOKUP_CODE.MO_FLAG;
  reqStatusOptions: any[] = LOOKUP_CODE.REQ_STATUS;
  subsectionStateOptions: any = []; // PS_SUBSECTION_STATE
  transportTypeOptions: any = []; // PS_TRANSPORT_TYPE
  packTypeOptions: any = []; // PS_PACK_TYPE
  gongchaOptions: any = []; // PS_PACK_TYPE
  YesNoOptions: any[] = [];
  unitOptions: any[] = [];
  prodTypeOptions: any[] = [];
  productCategoryOptions: any = []; // PS_PRODUCT_CATEGORY
  orderStatusOptions: any = []; // PS_ORDER_STATUS
  selectIndex = 1;
  defaultScheduleRegionCode = '';
  gridView: GridDataResult;
  httpAction = { url: this.demandclearupnoticeService.seachUrl, method: 'POST' };
  customerOrderColumns = [
    {
      field: 'productCategory', width: 100, headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'cusAbbreviation', width: 100, headerName: '客户简称',
    },
    {
      field: 'prodType', width: 100, headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,16).label',
    },
    {
      field: 'length', width: 100, headerName: '长度',
    },
    {
      field: 'width', width: 100, headerName: '宽度',
    },
    {
      field: 'boxQuantity', width: 100, headerName: '箱数',
    },
    {
      field: 'packingQuantuty', width: 100, headerName: '装箱张数',
    },
    {
      field: 'processingReq', width: 100, headerName: '加工要求',
    },
    {
      field: 'entrustedProcessing', width: 100, headerName: '是否受托', valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'tolerance', width: 100, headerName: '公差',
      valueFormatter: 'ctx.optionsFind(value,19).label',
    },
    {
      field: 'cusOrder', width: 100, headerName: '是否客订',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'hardness', width: 100, headerName: '硬度',
    },
    {
      field: 'cusDeliveryDate', width: 100, headerName: '客户交期',
    },
    {
      field: 'plannedDeliveryDate', width: 100, headerName: '计划交期',
    },
    {
      field: 'meterNum', width: 100, headerName: '米数',
    },
    {
      field: 'plantcode', width: 100, headerName: '产地',
    },
    {
      field: 'urgent', width: 100, headerName: '急要',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'standardsType', width: 100, headerName: '规格尺寸',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'elongation', width: 100, headerName: '延伸率',
    },
    {
      field: 'gloss', width: 100, headerName: '光泽度',
    },
    {
      field: 'ironLoss', width: 100, headerName: '铁损',
    },
    {
      field: 'magnetoreception', width: 100, headerName: '磁感',
    },
    {
      field: 'subsectionState', width: 100, headerName: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,13).label',
    },
    {
      field: 'coilInnerDia', width: 100, headerName: '钢卷内径',
    },
    {
      field: 'transportType', width: 100, headerName: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,14).label',
    },
    {
      field: 'packType', width: 100, headerName: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,15).label',
    },
    {
      field: 'slittingQuantity', width: 100, headerName: '分条数量',
    },
    {
      field: 'coatingUpCode',
      width: 120,
      headerName: '面膜存货编码'
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜存货描述'
    },
    {
      field: 'coatingDownCode',
      width: 120,
      headerName: '底膜存货编码'
    },
    {
      field: 'coatingDownName',
      width: 120,
      headerName: '底膜存货描述'
    },
    {
      field: 'paper',
      width: 120,
      headerName: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,23).label',
    },
  ];
  rawColumns = [
    {
      field: 'rawBatchCode',
      width: 120,
      headerName: '原料批号',
    },
    {
      field: 'rawSkuName',
      width: 120,
      headerName: '原料名称',
    },
    {
      field: 'rawSpec',
      width: 120,
      headerName: '原料规格尺寸',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'rawSurface',
      width: 120,
      headerName: '原料表面',
    },
    {
      field: 'rawWhPosCode',
      width: 120,
      headerName: '库位编码',
    },
    {
      field: 'rawActHeight',
      width: 120,
      headerName: '原料实厚',
    },
    {
      field: 'rawGrade',
      width: 120,
      headerName: '原料等级',
    },
    {
      field: 'rawWhName',
      width: 120,
      headerName: '存货仓库',
    },
    {
      field: 'lockFlag',
      width: 120,
      headerName: '齐套类型',
      valueFormatter: 'ctx.optionsFind(value,18).label',
    },
    {
      field: 'exceptionCompleteFlag',
      width: 120,
      headerName: '是否异常完工',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
  ];


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
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.organizationids, eventNo: 4 }, required: true },
      { field: 'stockName', title: '产品名称', ui: { type: UiType.text } },
      { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOption } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      { field: 'standardsType', title: '规格尺寸', ui: { type: UiType.text } },
      {
        field: 'projectNumber',
        title: '项目号码',
        ui: { type: UiType.text },
      },
      { field: 'dateRange', title: '需求日期', ui: { type: UiType.dateRange } },
      { field: 'moStatusList', title: '工单状态', ui: { type: UiType.selectMultiple, options: this.moStatus } },
      { field: 'lockFlag', title: '齐套类型', ui: { type: UiType.select, options: this.lockFlagOption } },
      { field: 'moFlag', title: '生成工单', ui: { type: UiType.select, options: this.moFlagOption } },
      { field: 'orderStatusList', title: '订单状态', ui: { type: UiType.selectMultiple, options: this.orderStatusOptions } },
      { field: 'isBindind', title: '合并标识', ui: { type: UiType.checkbox } },
      { field: 'exceptionCompleteFlag', title: '工单异常完工', ui: { type: UiType.checkbox } },
      { field: 'autoLockBatch', title: '锁料批次号', ui: { type: UiType.select, options: this.lockOption } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      productCategory: null,
      steelType: null,
      surface: null,
      // strSource: null,
      // strSourceType: null,
      stockName: '',
      standardsType: '',
      // strReqNumber: '',
      projectNumber: '',
      // strStandardFlag: null,
      moStatusList: [],
      lockFlag: null,
      moFlag: null,
      isBindind: null,
      exceptionCompleteFlag: null,
      // strItemCodeFrom: { value: '', text: '' },
      dateRange: [],
      // status: null,
      orderStatusList: [],
      autoLockBatch: null
      // createDateRange: [],
    },
  };

  expColumnsOptions = [
    { field: 'reqType', options: this.applicationReqType },
    { field: 'standardFlag', options: this.applicationYesNo },
    { field: 'exceptionCompleteFlag', options: this.applicationYesNo },
    { field: 'lockFlag', options: this.lockFlagOption },
    { field: 'status', options: this.applicationStatus },
    { field: 'orderStatus', options: this.orderStatusOptions },
    { field: 'source', options: this.sources },
    // { field: 'manualEntryFlag', options: this.applicationYesNo },
    // { field: 'combinationFlag', options: this.applicationYesNo },
    // { field: 'splitFlag', options: this.applicationYesNo },
    // { field: 'mrpImportedFlag', options: this.applicationYesNo },
    // { field: 'mrpNetFlag', options: this.applicationYesNo },
    // { field: 'productScheduleFlag', options: this.applicationYesNo },
    { field: 'moStatus', options: this.moStatus },
    { field: 'attribute8', options: this.gradeList },
    { field: 'domesticOversea', options: this.salesTypeList },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'cusOrder', options: this.YesNoOptions },
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'subsectionState', options: this.subsectionStateOptions },
    { field: 'transportType', options: this.transportTypeOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'tolerance', options: this.gongchaOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'exceptionCompleteFlag', options: this.applicationYesNo },
    { field: 'entrustedProcessing', options: this.YesNoOptions },
    { field: 'autoLockBatch', options: this.lockOption },
    { field: 'pricingType', options: this.pricingTypeOption },
    { field: 'paper', options: this.surfaceProtectOptions },
  ];

  query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const queryValues = this.getQueryParamsValue();
    queryValues.pageIndex = this._pageNo;
    queryValues.pageSize = this._pageSize;
    queryValues.isExport = false;
    const httpAction = { url: this.httpAction.url + `?pageIndex=${queryValues.pageIndex}&pageSize=${queryValues.pageSize}`, 
      method: this.httpAction.method};
    this.commonQueryService.loadGridViewNew(httpAction, queryValues, this.context);
  }

  getRowStyle = function (params) {
    if (params.context.colors.length === 0) return;
    let bgcolor = '';
    if (params.node.data.status === 'CANCELLED') {
      // bgcolor = params.context.colors.find(x => x.label === 'CANCELLED').value;
      const selectItemstmp = params.context.colors.find(x => x.label === 'CANCELLED');
      if (selectItemstmp !== undefined) {
        bgcolor = params.context.colors.find(x => x.label === 'CANCELLED').value;
      }
      return { 'background-color': bgcolor, color: 'red' };
    } else if (params.node.data.attribute1 === 'N' && params.node.data.reqNumber.substring(0, 1) === 'H') {
      // bgcolor = params.context.colors.find(x => x.label === 'MERGED').value;
      const selectItemstmp = params.context.colors.find(x => x.label === 'MERGED');
      if (selectItemstmp !== undefined) {
        bgcolor = params.context.colors.find(x => x.label === 'MERGED').value;
      }
      return { 'background-color': bgcolor, color: 'red' };
    } else if (params.node.data.attribute1 === 'N' && params.node.data.reqNumber.substring(0, 1) !== 'H') {
      // bgcolor = params.context.colors.find(x => x.label === 'SPLITED').value;
      const selectItemstmp = params.context.colors.find(x => x.label === 'SPLITED');
      if (selectItemstmp !== undefined) {
        bgcolor = params.context.colors.find(x => x.label === 'SPLITED').value;
      }
      return { 'background-color': bgcolor, color: 'red' };
    } else {
      return null;
    }
  };

  public export() {
    // this.loadOptions();
    super.export(true);
    const queryValues = this.getQueryParamsValue();
    queryValues.isExport = true;
    this.commonQueryService.exportAction({
      url: this.demandclearupnoticeService.seachUrl,
      method: 'POST',
    }, queryValues, this.excelexport, this.context);
  }

  public getQueryParamsValue(): any {
    const params: any = { ...this.queryParams.values };
    params.startBegin = this.queryParams.values.dateRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.dateRange[0]) : '';
    params.startEnd = this.queryParams.values.dateRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.dateRange[1]) : '';
    params.exceptionCompleteFlag = this.queryParams.values.exceptionCompleteFlag ? 'Y' : '';
    delete params.dateRange;
    return params;
  }

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    public commonQueryService: QueryService,
    private formBuilder: FormBuilder,
    private demandclearupnoticeService: DemandclearupnoticeService,
    private commonqueryService: PlanscheduleHWCommonService,
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
      name: '汇总信息',
    },
    {
      index: 2,
      active: false,
      name: '锁料信息',
    }
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
          field: 'autoLockBatch'
        },
        {
          field: 'rawQuantity'
        },
        {
          field: 'rawCr'
        },
        {
          field: 'rawQuality'
        }
        // ...this.rawColumns.slice(0, 8).map(c => ({ field: c.field }))
      ],
    },
    {
      tabIndex: 2,
      columns: [
        {
          field: 'plantCode'
        },
        {
          field: 'reqType'
        },
        {
          field: 'standardFlag'
        },
        {
          field: 'unitOfMeasure'
        },
        {
          field: 'orderStatus'
        },
        {
          field: 'cancelComments'
        },
        {
          field: 'orderWeight'
        },
        {
          field: 'orderWeightUnit'
        },
        {
          field: 'source'
        },
        {
          field: 'reqDate'
        },
        {
          field: 'reqComment'
        },
        {
          field: 'needSideCut'
        },
        {
          field: 'stockCode'
        },
        {
          field: 'standards'

        },
        {
          field: 'routeId'

        },
        {
          field: 'manufRoute'
        },
        {
          field: 'checkFlag'
        },
        {
          field: 'checkMsg'
        },
        {
          field: 'moNumber'
        },
        {
          field: 'moStatus'
        },
        {
          field: 'moQuantity'
        },
        {
          field: 'moCompletedQuantityTotal'
        },
        {
          field: 'moCompletedQuantity'
        },
        {
          field: 'moExcompletedQuantity'
        },
        {
          field: 'orderOweQty'
        },
        {
          field: 'moRemainQuantity'
        },
        {
          field: 'moStartDate'
        },
        {
          field: 'moEndDate'
        },
        {
          field: 'bindindNum'
        },
        {
          field: 'domesticOverSea'
        },
        {
          field: 'createdBy'
        },
        {
          field: 'creationDate'
        },
        {
          field: 'lastUpdatedBy'
        },
        {
          field: 'lastUpdateDate'
        },
        {
          field: 'productCategory'
        },
        {
          field: 'cusAbbreviation'
        },
        {
          field: 'prodType'
        },
        {
          field: 'length'
        },
        {
          field: 'width'
        },
        {
          field: 'boxQuantity'

        },
        {
          field: 'packingQuantuty'

        },
        {
          field: 'processingReq'
        },
        {
          field: 'entrustedProcessing'
        },
        {
          field: 'tolerance'
        },
        {
          field: 'cusOrder'
        },
        {
          field: 'hardness'

        },
        {
          field: 'cusDeliveryDate'
        },
        {
          field: 'plannedDeliveryDate'

        },
        {
          field: 'meterNum'

        },
        {
          field: 'plantcode'

        },
        {
          field: 'urgent'
        },
        {
          field: 'elongation'
        },
        {
          field: 'gloss'
        },
        {
          field: 'ironLoss'
        },
        {
          field: 'magnetoreception'
        },
        {
          field: 'subsectionState'
        },
        {
          field: 'coilInnerDia'
        },
        {
          field: 'transportType'
        },
        {
          field: 'packType'
        },
        {
          field: 'slittingQuantity'
        },
        {
          field: 'coatingUpCode'
        },
        {
          field: 'coatingUpName'
        },
        {
          field: 'coatingDownCode'
        },
        {
          field: 'coatingDownName'
        },
        {
          field: 'paper'
        },
        {
          field: 'lockFlag'
        },
        {
          field: 'exceptionCompleteFlag'
        },
        {
          field: 'sampleNum'
        },
        {
          field: 'coilBatchNum'
        },
      ],
    }
  ];

  columns: any[] = [
    {
      colId: 0, field: '', headerName: '操作', width: 130, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'autoLockBatch',
      width: 120,
      headerName: '锁料批次号',
      valueFormatter: 'ctx.optionsFind(value,21).label'
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 90,
    },
    {
      field: 'reqNumber',
      headerName: '需求订单号',
    },

    {
      field: 'reqLineNum',
      headerName: '需求订单行号',
      width: 110,
    },
    {
      field: 'reqType', width: 120, headerName: '需求类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'standardFlag',
      width: 90,
      headerName: '标准类型',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,17).label',
    },
    {
      field: 'orderStatus',
      width: 120,
      headerName: '订单状态',
      valueFormatter: 'ctx.optionsFind(value,20).label',
    },
    {
      field: 'cancelComments',
      width: 120,
      headerName: '取消说明',
    },
    {
      field: 'reqQty',
      width: 120,
      headerName: '需求数量',
    },
    {
      field: 'orderWeight',
      width: 120,
      headerName: '重量',
    },
    {
      field: 'orderWeightUnit',
      width: 120,
      headerName: '重量单位',
      valueFormatter: 'ctx.optionsFind(value,17).label',
    },
    {
      field: 'source',
      width: 120,
      headerName: '订单来源',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'reqDate',
      width: 120,
      headerName: '需求日期',
    },
    {
      field: 'reqComment',
      width: 120,
      headerName: '需求说明',
    },
    {
      field: 'projectNumber',
      width: 120,
      headerName: '项目号码',
    },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'stockCode', width: 100, headerName: '产品编码',
    },
    {
      field: 'stockName', width: 100, headerName: '产品名称',
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'standards', width: 100, headerName: '规格',
    },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'routeId', width: 100, headerName: '路径标识',

    },
    {
      field: 'manufRoute', width: 100, headerName: '制造路径',
    },
    {
      field: 'checkFlag', width: 100, headerName: '校验标识',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'checkMsg', width: 100, headerName: '校验消息',
    },
    ...this.customerOrderColumns.slice(0, 5),
    {
      field: 'moNumber',
      width: 120,
      headerName: '工单号',
    },
    {
      field: 'moStatus',
      width: 120,
      headerName: '工单状态',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'moQuantity',
      width: 120,
      headerName: '工单数量',
    },
    {
      field: 'moCompletedQuantityTotal',
      width: 120,
      headerName: '完工数量',
    },
    {
      field: 'moCompletedQuantity',
      width: 120,
      headerName: '正常完工数量',
    },
    {
      field: 'moExcompletedQuantity',
      width: 120,
      headerName: '异常完工数量',
    },
    {
      field: 'orderOweQty',
      width: 120,
      headerName: '订单欠数',
    },
    {
      field: 'moRemainQuantity',
      width: 120,
      headerName: '剩余数量',
    },
    {
      field: 'moStartDate',
      width: 120,
      headerName: '计划开始时间',
    },
    {
      field: 'moEndDate',
      width: 120,
      headerName: '计划完成时间',
    },
    {
      field: 'bindindNum',
      width: 120,
      headerName: '合并单号',
    },
    ...this.rawColumns,
    {
      field: 'domesticOverSea', width: 100, headerName: '内外销',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'rawQuantity',
      headerName: '现存量',
      width: 120,
    },
    {
      field: 'rawCr',
      headerName: '化学成分Cr',
      width: 100
    },
    {
      field: 'pricingType', width: 100, headerName: '计价方式',
      valueFormatter: 'ctx.optionsFind(value,22).label',
    },
    {
      field: 'labelSpecs', width: 100, headerName: '标签规格',
    },
    ...this.customerOrderColumns.slice(5),
    {
      field: 'createdBy',
      headerName: '创建人',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'creationDate',
      headerName: '创建时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'lastUpdatedBy',
      headerName: '最近更新人',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'lastUpdateDate',
      headerName: '最近更新时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'rawQuality',
      headerName: '品质信息',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'sampleNum',
      headerName: '样品编号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'coilBatchNum',
      headerName: '受托卷号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    }
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
      case 8:
        options = this.needSiteCutOptions;
        break;
      case 9:
        options = this.surfaceOptions;
        break;
      case 10:
        options = this.steelTypeOption;
        break;
      case 11:
        options = this.productCategoryOptions;
        break;
      case 12:
        options = this.YesNoOptions;
        break;
      case 13:
        options = this.subsectionStateOptions;
        break;
      case 14:
        options = this.transportTypeOptions;
        break;
      case 15:
        options = this.packTypeOptions;
        break;
      case 16:
        options = this.prodTypeOptions;
        break;
      case 17:
        options = this.unitOptions;
        break;
      case 18:
        options = this.lockFlagOption;
        break;
      case 19:
        options = this.gongchaOptions;
        break;
      case 20:
        options = this.orderStatusOptions;
        break;
      case 21:
        options = this.lockOption;
        break;
      case 22:
        options = this.pricingTypeOption;
        break;
      case 23:
        options = this.surfaceProtectOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public loadReqType(): void {

  }

  public loadColor(): void {

    this.commonQueryService.getColor('需求', '', '', 'zh-CN').subscribe(result => {
      result.data.forEach(d => {
        this.colors.push({
          label: d.colorName,
          value: d.colorValue,
          meaning: d.meaning,
        });
      });
    });

  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.gridOptions.isRowSelectable = rowNode => rowNode.data.status !== 'CANCELLED';
    this.loadColor();
    this.query();
    this.loadOptions();
  }
  getLockBatch() {
    this.commonqueryService.getAutoLockBatch({
      plantCode: this.queryParams.values.plantCode
    }).subscribe(res => {
      if (res.code === 200) {
        res.data.forEach(item => {
          this.lockOption.push({
            label: item,
            value: item
          })
        })
      }
    })
  }
  loadOptions = super.wrapLoadOptionsFn(async () => {
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
    this.getLockBatch()
    await this.commonQueryService.GetLookupByTypeRefZip({
      'PP_PLN_ORDER_TYPE': this.applicationReqType,
      'FND_YES_NO': this.applicationYesNo,
      'PP_DM_SOURCE_SYSTEM': this.sources,
      'PP_PLN_ORDER_STATUS': this.applicationStatus,
      'PS_MAKE_ORDER_STATUS': this.moStatus,
      'PP_PLN_CUSTOMER_DEGREE': this.gradeList,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_ORDER_STATUS': this.orderStatusOptions,
      'PS_PRICING_TYPE': this.pricingTypeOption,
      'PS_SURFACE_PROTECT': this.surfaceProtectOptions,
    });
    const steelTypeRes = await this.commonQueryService.GetLookupByType('PS_CONTRACT_STEEL_TYPE').toPromise();
    if (steelTypeRes.Extra) {
      steelTypeRes.Extra.forEach(d => {
        this.steelTypeOption.push({
          label: d.meaning,
          value: d.lookupCode,
          attribute2: d.attribute2,
        });
      });
      this.commonQueryService.getArrBySort(this.steelTypeOption, 'attribute2', 'asc');
    }
    const surfaceRes = await this.commonQueryService.GetLookupByType('PS_CONTRACT_SURFACE').toPromise();
    if (surfaceRes.Extra) {
      surfaceRes.Extra.forEach(d => {
        this.surfaceOptions.push({
          label: d.meaning,
          value: d.lookupCode,
          attribute2: d.attribute2,
        });
      });
      this.commonQueryService.getArrBySort(this.surfaceOptions, 'attribute2', 'asc');
    }

    /** 初始化 组织  下拉框*/
    this.commonqueryService.GetUserPlant().subscribe(result => {
      this.organizationids.length = 0;
      result.Extra.forEach(d => {
        this.organizationids.push({ value: d.plantCode, label: `${d.plantCode}(${d.descriptions})` });
      });
    });
    this.defaultScheduleRegionCode = this.appConfigService.getActiveScheduleRegionCode();
  })

  bind() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选需求订单'));
      return;
    }
    const projectNumberList = [];
    let reqQtySum = 0;
    let routeId = selectedRows[0].routeId;
    let isDiff: Boolean = false;
    for (let i = 0; i < selectedRows.length; i++) {
      if (!selectedRows[i].routeId) {
        this.msgSrv.warning(this.appTranslationService.translate('绑定的订单存在制造路径为空的情况，请处理'));
        return;
      } else if (selectedRows[i].routeId !== routeId) {
        isDiff = true;
      }
      if (selectedRows[i].combinationFlag === 'Y') {
        this.msgSrv.info(this.appTranslationService.translate('已有捆绑订单，请先解除绑定'));
        return;
      }
      projectNumberList.push(selectedRows[i].projectNumber);
      reqQtySum = decimal.add(reqQtySum, selectedRows[i].reqQty);
    }
    let msg = `本次合并的散单总计 ${reqQtySum}，是否确认做绑定？`;
    if (isDiff) {
      msg = `绑定的订单存在制造路径不同的情况，是否继续做绑定？本次合并的散单总计 ${reqQtySum}`;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(msg),
      nzOnOk: () => {
        this.demandclearupnoticeService.BindReqOrder(this.queryParams.values.plantCode, projectNumberList, 'Y').subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('绑定成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg))
          }
        });
      },
    });
  }

  unbind() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选需求订单'));
      return;
    }
    const projectNumberList = this.getGridSelectionKeysByFilter('projectNumber', (item) => !this.isNull(item.bindindNum));
    if (projectNumberList.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('没有合并序号'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确认解除绑定？`),
      nzOnOk: () => {
        this.demandclearupnoticeService.BindReqOrder(this.queryParams.values.plantCode, projectNumberList, 'N').subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('解绑成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg))
          }
        });
      },
    });
  }

  batchChooseRoute() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选可编辑的数据进行修改！'));
      return;
    }
    if (selectedRows.some(item => !this.checkEditValid(item))) {
      this.msgSrv.warning(this.appTranslationService.translate('只能勾选可编辑的数据进行修改！'));
      return;
    }
    this.modal.static(
      BatchChooseRouteComponent,
      {
        gridData: selectedRows
      }
    ).subscribe(value => {
      if (value) {
        this.queryCommon();
      }
    })
  }

  isVisible: boolean = false;
  cId: string = ''; // 保存关闭的id
  copyItem: any = {};
  modalTitle: string = '关闭';
  cancelComments: string = '';

  copyData(item) {
    this.copyItem = item;
    this.modalTitle = '复制订单';
    this.isVisible = true;
    this.cancelComments = '';
  }

  // 关闭订单
  close() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选需求订单'));
      return;
    }
    const idList = this.getGridSelectionKeysByFilter('id', (item) => !this.isNull(item.orderStatus)
      && (item.orderStatus === 'W' || item.orderStatus === 'X' || item.orderStatus === 'J'));
    if (idList.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请选择·订单状态为【未完成】、【新增】、【进行中】的需求'));
      return;
    }
    if (idList.length > 1) {
      this.msgSrv.info(this.appTranslationService.translate('订单关闭只能单条关闭'));
      return;
    }
    this.isVisible = true;
    this.modalTitle = '关闭订单';
    this.cancelComments = '';
    this.cId = idList[0];
  }

  handleOk() {
    switch (this.modalTitle) {
      case '关闭订单':
        this.demandclearupnoticeService.closeReqOrder(this.cId,this.cancelComments).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.isVisible = false;
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
        break;
      case '复制订单':
        this.copyItem.isCopying = true;
        this.demandclearupnoticeService.Copy(this.copyItem.id, this.cancelComments).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.data));
            this.isVisible = false;
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
          this.copyItem.isCopying = false;
        });
        break;
    
      default:
        break;
    }

  }
  
  handleCancel() {
    this.isVisible = false;
  }

  // 物料弹出查询
  public searchItemsFrom(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public searchItemsTo(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
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
    this.queryParams.values.plantCode = null;
    // this.queryParams.values.strItemCodeFrom.text = '';
    // this.queryParams.values.strItemCodeFrom.value = '';
    this.commonqueryService.GetUserPlant(event).subscribe(result => {
      this.organizationids.length = 0;
      result.Extra.forEach(d => {
        this.organizationids.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  // 工厂切换动态清除物料
  public ClearItemCodes(event: string) {
    // this.queryParams.values.strItemCodeFrom.text = '';
    // this.queryParams.values.strItemCodeFrom.value = '';
    this.getLockBatch()
    this.queryParams.values.autoLockBatch = null
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getActivePlantCode(),
      productCategory: null,
      steelType: null,
      surface: null,
      // strSource: null,
      // strSourceType: null,
      standardsType: '',
      stockName: '',
      // strReqNumber: '',
      projectNumber: '',
      // strStandardFlag: null,
      moStatusList: [],
      lockFlag: null,
      moFlag: null,
      isBindind: null,
      exceptionCompleteFlag: null,
      // status: null,
      orderStatusList: [],
      // strItemCodeFrom: { value: '', text: '' },
      dateRange: [],
      autoLockBatch: null
      // createDateRange: [],
    };
  }

  checkEditValid(dataItem) {
    return dataItem.moFlag !== 'Y' && dataItem.status !== 'CANCELLED' && !['G','Q'].includes(dataItem.orderStatus);
  }

  add() {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticeEditComponent,
        { i: { NEWFLAG: 'Y' } },
        1100
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  showRaw(dataItem) {
    const isEditValid = this.checkEditValid(dataItem);
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticeRawListComponent,
        {
          demandOrder: dataItem,
          isEditValid: isEditValid,
          isCanDelete: !isEditValid && dataItem.status === 'CANCELLED' // 未生成工单且取消订单状态：可删除原料
        },
        1100
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
          i: Object.assign({}, item, {
            REQ_QTY_MODIFY: (item !== undefined ? item.reqQty : null),
            REQ_DATE_MODIFY: (item !== undefined ? item.reqDate : null),
            NEWFLAG: 'N',
          })
        },
        980, 500,
      )
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

  splitOrder(item: any) {
    this.modal
      .static(
        DemandOrderManagementDemandclearupnoticesplitAgComponent,
        {
          i: {
            REQ_NUMBER: (item !== undefined ? item.reqNumber : null),
            REQ_LINE_NUM: (item !== undefined ? item.reqLineNum : null),
            REQ_QTY: (item !== undefined ? item.reqQty : null),
            REQ_DATE: (item !== undefined ? item.reqDate : null),
            NEWFLAG: 'S',
          },
        },
        'lg',
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });

    // .subscribe((value) => {
    //     this.queryCommon();
    // });
  }

  submitRequest(type) {
    if ('lockMaterSendMes' === type) {
      const dtos = this.gridApi.getSelectedRows().filter(item => item.moFlag === 'Y' && item.lockFlag === 'Y').map(item => {
        delete item.reqDate;
        return item;
      });
      if (dtos.length > 0) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要提交锁料推送请求吗？'),
          nzOnOk: () => {
            this.demandclearupnoticeService.LockMaterSendMes(dtos).subscribe(res => {
              if (res.code === 200) {
                this.msgSrv.success(this.appTranslationService.translate(res.data));
              } else {
                this.msgSrv.error(this.appTranslationService.translate(res.msg));
              }
            })
          },
        });
      } else {
        this.msgSrv.warning('已生成工单并且已选料的需求订单才能重新下发锁料信息！');
      }
    } else if ('route' === type) {
      const dtos = this.gridApi.getSelectedRows().filter(item => item.routeId === null || item.routeId === '').map(item => {
        delete item.reqDate;
        return item;
      });
      if (dtos.length > 0) {
        this.demandclearupnoticeService.completeRouteInfo(dtos).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.data));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      } else {
        this.msgSrv.warning('已有制造路径的需求不需要再次生成！');
      }
    }
  }

  batchLockMaterForMes() {
    const dtos = this.gridApi.getSelectedRows().map(item => {
      delete item.reqDate;
      return item;
    });
    if (dtos.length > 0) {
      this.demandclearupnoticeService.batchLockMaterForMes(dtos).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.data));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    } else {
      this.msgSrv.warning('请选择需要批量锁料的订单信息！');
    }
  }

  /**
   * 批量解锁
   */
  batchUnLockMaterForMes() {
    const dtos = this.gridApi.getSelectedRows().map(item => {
      delete item.reqDate;
      return item;
    });
    if (dtos.length > 0) {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('确定要提交解锁推送请求吗？'),
        nzOnOk: () => {
          this.demandclearupnoticeService.batchUnLockMaterForMes(dtos).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate(res.data));
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          })
        },
      });

    } else {
      this.msgSrv.warning('请选择需要批量解锁的订单信息！');
    }
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
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.error(this.appTranslationService.translate('请先查询需求订单'));
      return;
    }

    this.projectNumList = this.getGridSelectionKeys('projectNumber');

    if (this.projectNumList.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择数据'));
      return;
    }
    this.demandclearupnoticeService.ValidGenerateDispatchNum(this.queryParams.values.plantCode, this.projectNumList).subscribe(res => {
      let msg = '是否继续生成？';
      if (res.code === 200) {
        msg = '系统将生成已选择的需求订单的工单，' + msg;
      } else if (res.data.type === 'warn') {
        msg = res.msg + msg;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        return;
      }
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(msg),
        nzOnOk: () => {
          this.demandclearupnoticeService.setMakeOrder(this.queryParams.values.plantCode, this.projectNumList).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate(res.msg));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        },
      });
    });
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

  importData() {
    this.modal.static(
      PpReqOrderImportComponent,
      null,
      'md'
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    });
  }

  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }
  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }
  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'plantCode';
    // 需要统计的列数组
    const fields = ['reqQty', 'moQuantity', 'moCompletedQuantity', 'moExcompletedQuantity', 'orderOweQty', 'moRemainQuantity', 'meterNum', 'orderWeight'];
    super.setTotalBottomRow(data, totalField, fields);
  }
}


