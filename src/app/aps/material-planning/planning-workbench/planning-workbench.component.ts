import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
import { MrpPlanningExceptionComponent } from './view/planning-exception.component';
import { MrpPlanningOnhandComponent } from './view/planning-onhand.component';
import { MrpPlanningPeggingComponent } from './view/planning-pegging.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mrp-planning-workbench',
  templateUrl: './planning-workbench.component.html',
  providers: [QueryService],
  encapsulation: ViewEncapsulation.None,
  styles: [`.boldStyle {font-weight:bold ;}`]
})
export class MrpPlanningWorkbenchComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private appTranslate: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfig: AppConfigService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private queryService: QueryService,
  ) {
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    this.headerNameTranslate(this.columns);
  }

  inputParam: any;
  isPopShow = false; // 是否其他页面弹出
  isFormLoad = true;
  listPlan: any[] = [];
  listPlant: any[] = [];
  listVersion: any[] = [];
  listDataType: any[] = [{ label: '需求', value: '1' }, { label: '供应', value: '2' }];
  listPlanType: any[] = [];
  listMakeBuy: any[] = [];
  listOrderType: any[] = [];
  listSourcePlant: any[] = [];
  listScheduleGroup: any[] = [];

  context = this;
  queryParams = {
    defines: [
      { field: 'planName', title: '计划名称', ui: { type: UiType.select, options: this.listPlan, ngModelChange: this.onPlanChange }, required: true },
      { field: 'version', title: '版本', ui: { type: UiType.select, options: this.listVersion }, required: true },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.listPlant, ngModelChange: this.onPlantChange }, required: true },
      { field: 'sourcePlantCode', title: '来源工厂', ui: { type: UiType.select, options: this.listSourcePlant } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.listScheduleGroup } },
      { field: 'planType', title: '计划类型', ui: { type: UiType.select, options: this.listPlanType } },
      { field: 'itemCode', title: '物料号', ui: { type: UiType.text } },
      { field: 'planner', title: '计划员', ui: { type: UiType.text } },
      { field: 'buyer', title: '采购员', ui: { type: UiType.text } },
      { field: 'replaceGroup', title: '替代组', ui: { type: UiType.text } },
      { field: 'makeBuyCode', title: '制造或采购', ui: { type: UiType.select, options: this.listMakeBuy } },
      { field: 'customerNumber', title: '客户', ui: { type: UiType.text } },
      { field: 'vendorNumber', title: '供应商', ui: { type: UiType.text } },
      { field: 'orderNumber', title: '订单号', ui: { type: UiType.text } },
      { field: 'projectNumber', title: '项目号', ui: { type: UiType.text } },
      { field: 'demandSupplyDate', title: '新到日期', ui: { type: UiType.dateRange } },
      { field: 'oldDemandSupplyDate', title: '原到日期', ui: { type: UiType.dateRange } },
      { field: 'newStartDate', title: '新开始日期', ui: { type: UiType.dateRange } },
      { field: 'oldStartDate', title: '新开始日期', ui: { type: UiType.dateRange } },
      { field: 'dataType', title: '数据类型', ui: { type: UiType.select, options: this.listDataType } },
    ],
    values: {
      planName: null,
      version: null,
      plantCode: null,
      sourcePlantCode: null,
      scheduleGroupCode: null,
      planType: null,
      itemCode: null,
      planner: null,
      buyer: null,
      replaceGroup: null,
      makeBuyCode: null,
      customerNumber: null,
      vendorNumber: null,
      orderNumber: null,
      projectNumber: null,
      demandSupplyDate: [],
      oldDemandSupplyDate: [],
      newStartDate: [],
      oldStartDate: [],
      dataType: null,

      noPlanType: null, // 用于二维工作台弹出查询条件
      itemId: null,  // 用于二维工作台弹出查询条件
      vendorSiteCode: null, // 用于二维工作台弹出查询条件
    }
  };

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplateDate', { static: true }) customTemplateDate: TemplateRef<any>;
  @ViewChild('customTemplateQty', { static: true }) customTemplateQty: TemplateRef<any>;

  columns = [
    {
      colId: 'action', field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    {
      colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: function (params) { return params.context.dataRowEdit(params.data); },
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    // { field: 'ID', headerName: '主键ID', menuTabs: ['filterMenuTab'] },
    // { field: 'CREATED_BY', headerName: '创建人', menuTabs: ['filterMenuTab'] },
    // { field: 'CREATION_DATE', headerName: '创建日期', menuTabs: ['filterMenuTab'] },
    // { field: 'LAST_UPDATED_BY', headerName: '修改人', menuTabs: ['filterMenuTab'] },
    // { field: 'LAST_UPDATE_DATE', headerName: '修改日期', menuTabs: ['filterMenuTab'] },
    // { field: 'VERSION', headerName: '版本号', menuTabs: ['filterMenuTab'] },
    // { field: 'PLAN_NAME', headerName: '计划名称', menuTabs: ['filterMenuTab'] },
    // { field: 'PLANT_CODE', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    // { field: 'ITEM_ID', headerName: '物料ID', menuTabs: ['filterMenuTab'] },
    {
      field: 'itemCode', headerName: '物料号', menuTabs: ['filterMenuTab'],
      cellClassRules: {
        'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
      },
    },
    {
      field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'],
      cellClassRules: {
        'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
      },
    },
    { field: 'planCategory', headerName: '计划分类', menuTabs: ['filterMenuTab'] },
    {
      field: 'demandSupplyDate', headerName: '新到日期', menuTabs: ['filterMenuTab'],
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null
      }
    },
    { field: 'planTypeShow', headerName: '计划类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
    { field: 'orderNumber', headerName: '订单号', menuTabs: ['filterMenuTab'] },
    {
      field: 'demandSupplyQty', headerName: '需求供应数量', menuTabs: ['filterMenuTab'],
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null
      }
    },
    { field: 'status', headerName: '发布状态', menuTabs: ['filterMenuTab', 'columnsMenuTab'], valueFormatter: 'ctx.publishStatusFind(value)' },
    { field: 'replaceGroup', headerName: '替代组', menuTabs: ['filterMenuTab'] },
    { field: 'projectNumber', headerName: '项目号', menuTabs: ['filterMenuTab'] },
    { field: 'oldDemandSupplyDate', headerName: '原到日期', menuTabs: ['filterMenuTab'] },
    { field: 'sourcePlant', headerName: '来源工厂', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'planner', headerName: '计划员', menuTabs: ['filterMenuTab'] },
    { field: 'buyer', headerName: '采购员', menuTabs: ['filterMenuTab'] },
    { field: 'customerNumber', headerName: '客户', menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber', headerName: '供应商', menuTabs: ['filterMenuTab'] },
    { field: 'vendorSiteCode', headerName: '供应商地址', menuTabs: ['filterMenuTab'] },
    // { field: 'oriProjectNumber', headerName: '原项目号', menuTabs: ['filterMenuTab'] },
    { field: 'orderLineNum', headerName: '订单行号', menuTabs: ['filterMenuTab'] },
    // { field: 'usingAssemblyItemId', headerName: '父物料id', menuTabs: ['filterMenuTab'] },
    { field: 'parentItemCode', headerName: '父物料号', menuTabs: ['filterMenuTab'] },
    // { field: 'topItemId', headerName: '顶层物料id', menuTabs: ['filterMenuTab'] },
    { field: 'topItemCode', headerName: '顶层物料号', menuTabs: ['filterMenuTab'] },
    { field: 'orderLineType', headerName: '订单类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2)' },
    // { field: 'prQuantityAdjusted', headerName: '自制pr下单工单数量', menuTabs: ['filterMenuTab'] },
    { field: 'poprQuantityOrdered', headerName: 'po/pr原数量', menuTabs: ['filterMenuTab'] },
    { field: 'poprQuantityCancelled', headerName: 'po/pr取消数量', menuTabs: ['filterMenuTab'] },
    { field: 'poQuantityReceived', headerName: 'po接收数量', menuTabs: ['filterMenuTab'] },
    { field: 'poQuantityDelivered', headerName: 'po入库数量', menuTabs: ['filterMenuTab'] },
    { field: 'newStartDate', headerName: '新开始日期', menuTabs: ['filterMenuTab'] },
    { field: 'newOrderReleaseDate', headerName: '新下单日期', menuTabs: ['filterMenuTab'] },
    { field: 'newDockDate', headerName: '新到岸日期', menuTabs: ['filterMenuTab'] },
    { field: 'oldStartDate', headerName: '原开始日期', menuTabs: ['filterMenuTab'] },
    { field: 'oldOrderReleaseDate', headerName: '原下单日期', menuTabs: ['filterMenuTab'] },
    { field: 'oldDockDate', headerName: '原到岸日期', menuTabs: ['filterMenuTab'] },
    // { field: 'rescheduleFlag', headerName: '重排标识', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleCompressDays', headerName: '压缩天数', menuTabs: ['filterMenuTab'] },
    { field: 'rescheduleAction', headerName: '重排处理建议', menuTabs: ['filterMenuTab'] },
    { field: 'dataType', headerName: '数据类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3)' },
    { field: 'makeBuyCode', headerName: '制造或采购', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,4)' },

    // { field: 'SCHEDULE_DESIGNATOR', headerName: 'MDS/预测集名称', menuTabs: ['filterMenuTab'] },
    // { field: 'ORIGINATION_TYPE', headerName: '需求订单类型', menuTabs: ['filterMenuTab'] },
    // { field: 'SOURCE_CODE', headerName: '来源类型', menuTabs: ['filterMenuTab'] },
    // { field: 'MAKE_ORDER_NUM', headerName: '工单号', menuTabs: ['filterMenuTab'] },
    // { field: 'ORDER_SEQ', headerName: '排序号', menuTabs: ['filterMenuTab'] },
    // { field: 'FIRM_PLANNED_TYPE', headerName: '固定标识', menuTabs: ['filterMenuTab'] },
    // { field: 'OLD_SCHEDULE_QTY', headerName: '原供应订单数量', menuTabs: ['filterMenuTab'] },
  ];

  expColumns = [];
  expColumnsOptions: any[] = [
    { field: 'planTypeShow', options: this.listPlanType },
    { field: 'orderLineType', options: this.listOrderType },
    { field: 'dataType', options: this.listDataType },
    { field: 'makeBuyCode', options: this.listMakeBuy },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1: // 计划类型
        options = this.listPlanType;
        break;
      case 2: // 订单类型
        options = this.listOrderType;
        break;
      case 3: // 数据类型
        options = this.listDataType;
        break;
      case 4: // 制造采购
        options = this.listMakeBuy;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  public publishStatusFind(value: string): any {
    return (value && value === "S") ? this.appTranslate.translate('已发布') :this.appTranslate.translate('未发布');
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.columns[5].cellRendererParams.customTemplate = this.customTemplateDate;
    this.columns[8].cellRendererParams.customTemplate = this.customTemplateQty;
    this.loadPopParam();
    this.loadInitData();
  }

  // 加载弹出框数据
  loadPopParam() {
    if (this.isPopShow && this.inputParam !== undefined && this.inputParam !== null) {
      // 其他页面弹出
      this.isPopShow = true;
      this.queryParams.values.planName = this.inputParam.planName;
      this.queryParams.values.version = this.inputParam.version;
      this.queryParams.values.plantCode = this.inputParam.plantCode;
      this.queryParams.values.itemCode = this.inputParam.itemCode;
      this.queryParams.values.itemId = this.inputParam.itemId;
      this.queryParams.values.planType = this.inputParam.planType;
      this.queryParams.values.noPlanType = this.inputParam.noPlanType;
      this.queryParams.values.vendorNumber = this.inputParam.vendorNumber;
      this.queryParams.values.vendorSiteCode = this.inputParam.vendorSiteCode;
      this.queryParams.values.dataType = this.inputParam.dataType;
      this.queryParams.values.demandSupplyDate = this.inputParam.demandSupplyDate;
    }
  }

  loadInitData() {
    this.queryService.QueryPlans().subscribe(res => {
      res.data.forEach(item => {
        this.listPlan.push({
          label: item.planName,
          value: item.planName
        });
      });

      if (this.listPlan.length > 0 && !this.isPopShow)
        this.queryParams.values.planName = this.listPlan[0].value;

      this.onPlanChange(this.queryParams.values.planName);
    });

    // 计划类型
    // this.listPlanType.push({ label: '计划订单', value: 'PLANNED ORDER', });
    // 需求类型
    this.queryService.GetLookupByTypeNew('MRP_DEMAND_ORIGINATION_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.listPlanType.push({
          label: d.meaning,
          value: 'DEMAND_' + d.lookupCode,
        });
      });
    });
    // 供应类型
    this.queryService.GetLookupByTypeNew('MRP_SUPPLY_ORDER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.listPlanType.push({
          label: d.meaning,
          value: 'SUPPLY_' + d.lookupCode,
        });
      });
    });
    // 订单行类型
    this.queryService.GetLookupByTypeNew('PP_PLN_ORDER_LINE_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.listOrderType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // 制造或采购
    this.queryService.GetLookupByTypeNew('PS_MAKE_BUY_CODE').subscribe(result => {
      result.data.forEach(d => {
        this.listMakeBuy.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // 加载工厂
    this.queryService.GetUserPlantNew().subscribe(result => {
      // this.plantOptions.length = 0;
      result.data.forEach(d => {
        this.listSourcePlant.push({ value: d.plantCode, label: d.plantCode });
      });
    });
    // this.query();
  }

  onPlanChange(value) {
    this.queryParams.values.version = null;
    this.queryParams.values.plantCode = null;
    this.queryService.QueryDataByPlan(value).subscribe(res => {
      this.listVersion.length = 0;
      this.listPlant.length = 0;

      // 版本
      res.data.listVersion.forEach(item => {
        this.listVersion.push({
          label: item,
          value: item
        });
      });
      if (this.listVersion.length > 0)
        this.queryParams.values.version = this.listVersion[0].value;

      // 计划工厂
      res.data.listPlant.forEach(item => {
        this.listPlant.push({
          label: item,
          value: item
        });
      });
      if (this.listPlant.length > 0)
        this.queryParams.values.plantCode = this.listPlant[0].value;

      if (this.isFormLoad) this.loadPopParam(); // 加载弹出框数据

      this.onPlantChange(this.queryParams.values.plantCode);

      if (this.isFormLoad) {
        this.isFormLoad = false;
        this.query();
      }
    });
  }

  onPlantChange(value) {
    this.queryParams.values.scheduleGroupCode = null;
    this.listScheduleGroup.length = 0;
    this.queryService.GetUserPlantGroupNew(value).subscribe(res => {
      res.data.forEach(element => {
        this.listScheduleGroup.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode,
        });
      });
    });
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      planName: null,
      version: null,
      plantCode: null,
      sourcePlantCode: null,
      scheduleGroupCode: null,
      planType: null,
      itemCode: null,
      planner: null,
      buyer: null,
      replaceGroup: null,
      makeBuyCode: null,
      customerNumber: null,
      vendorNumber: null,
      orderNumber: null,
      projectNumber: null,
      demandSupplyDate: [],
      oldDemandSupplyDate: [],
      newStartDate: [],
      oldStartDate: [],
      dataType: null,

      noPlanType: null, // 用于二维工作台弹出查询条件
      itemId: null,  // 用于二维工作台弹出查询条件
      vendorSiteCode: null, // 用于二维工作台弹出查询条件
    };
    if (this.listPlan.length > 0) {
      this.queryParams.values.planName = this.listPlan[0].value;
      this.onPlanChange(this.queryParams.values.planName);
    }
  }

  commonQuery() {
    // console.log(this.queryParams.values.IS_QUERY_DEMAND);
    // console.log(this.queryParams.values.IS_QUERY_SUPPLY);
    this.queryService.loadGridViewNew(this.queryService.planWorkbenchQuery, this.getQueryParams(false), this.context);
  }

  formatDate(date?: Date): string {
    // if (!date) return '';
    // return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return this.queryService.formatDate(date);
  }

  getQueryParams(isExport?: boolean) {
    return {
      planName: this.queryParams.values.planName,
      version: this.queryParams.values.version,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      sourcePlantCode: this.queryParams.values.sourcePlantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      planType: this.queryParams.values.planType,
      planner: this.queryParams.values.planner,
      buyer: this.queryParams.values.buyer,
      replaceGroup: this.queryParams.values.replaceGroup,
      makeBuyCode: this.queryParams.values.makeBuyCode,
      customerNumber: this.queryParams.values.customerNumber,
      vendorNumber: this.queryParams.values.vendorNumber,
      orderNumber: this.queryParams.values.orderNumber,
      projectNumber: this.queryParams.values.projectNumber,
      dataType: this.queryParams.values.dataType,
      demandSupplyDateS: this.formatDate(this.queryParams.values.demandSupplyDate[0]),
      demandSupplyDateT: this.formatDate(this.queryParams.values.demandSupplyDate[1]),
      oldDemandSupplyDateS: this.formatDate(this.queryParams.values.oldDemandSupplyDate[0]),
      oldDemandSupplyDateT: this.formatDate(this.queryParams.values.oldDemandSupplyDate[1]),
      newStartDateS: this.formatDate(this.queryParams.values.newStartDate[0]),
      newStartDateT: this.formatDate(this.queryParams.values.newStartDate[1]),
      oldStartDateS: this.formatDate(this.queryParams.values.oldStartDate[0]),
      oldStartDateT: this.formatDate(this.queryParams.values.oldStartDate[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport,

      noPlanType: this.queryParams.values.noPlanType, // 用于二维工作台弹出查询条件
      itemId: this.queryParams.values.itemId,  // 用于二维工作台弹出查询条件
      vendorSiteCode: this.queryParams.values.vendorSiteCode, // 用于二维工作台弹出查询条件
    };
  }

  exportFile() {
    super.export();
    this.queryService.exportAction(this.queryService.planWorkbenchQuery, this.getQueryParams(true), this.excelexport, this.context);
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  onhand(dataItem: any) {
    // this.msgSrv.success('onhand');
    this.modal.static(MrpPlanningOnhandComponent, { iParam: dataItem }, 'xl').subscribe(res => {

    });
  }

  pegging(dataItem: any) {
    // this.msgSrv.success('pegging');
    this.modal.static(MrpPlanningPeggingComponent, { iParam: dataItem }, 'xl').subscribe(res => {

    });
  }

  exception(dataItem: any) {
    // this.msgSrv.success('exception');
    this.modal.static(MrpPlanningExceptionComponent, { iParam: dataItem }, 'xl').subscribe(res => {

    });
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['需求供应数量', '新到日期'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#MrpPlanWorkbenchGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C;');
          
        }
      });
    }
  }

  public loadGridDataCallback(result) {
    this.onVirtualColumnsChanged(result);
  }

  public dataRowEdit(dataItem: any) {
    return this.queryParams.values.version === this.listVersion[0].value && dataItem.dataType === '2' && dataItem.planType === 'PLANNED_ORDER' && dataItem.status !== 'S';
  }

  public dataRowChange(dataItem: any) {
    return dataItem.dataType === '2' && dataItem.planType === 'PLANNED_ORDER'
      && (dataItem.demandSupplyQty !== dataItem.manualOldScheduleQty || dataItem.demandSupplyDate !== dataItem.manualOldScheduleDate);
  }

  save() {
    if (this.gridData == null || this.gridData.length === 0) {
      return;
    }

    const dtSave = this.gridApi.getSelectedRows();

    if (dtSave.length === 0) {
      const msg = this.appTranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.UpdatePlannedOrder(dtSave)
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslate.translate('保存成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
      });
  }

  publish() {
    if (this.gridData == null || this.gridData.length === 0) {
      return;
    }
    const dtPublish = this.gridApi.getSelectedRows();
    if (dtPublish.length === 0) {
      const msg = this.appTranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.PublishPlannedOrder(dtPublish)
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslate.translate('发布成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
        this.query();
      });
  }
}
