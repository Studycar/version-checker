import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { ModalHelper } from '@delon/theme';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mrp-planning-exception',
  templateUrl: './planning-exception.component.html',
  providers: [QueryService],
})
export class MrpPlanningExceptionComponent extends CustomBaseContext implements OnInit {

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

  public iParam: any; // 传入参数
  isFormLoad = true;
  listPlan: any[] = [];
  listPlant: any[] = [];
  listVersion: any[] = [];
  listOrderType: any[] = [];
  listExceptionType: any[] = [];

  context = this;
  queryParams = {
    defines: [
      { field: 'planName', title: '计划名称', ui: { type: UiType.select, options: this.listPlan, ngModelChange: this.onPlanChange }, required: true },
      { field: 'version', title: '版本', ui: { type: UiType.select, options: this.listVersion }, required: true },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.listPlant }, required: true },
      { field: 'itemCode', title: '物料号', ui: { type: UiType.text } },
      { field: 'orderNumber', title: '订单号', ui: { type: UiType.text } },
      { field: 'exceptionType', title: '例外类型', ui: { type: UiType.select, options: this.listExceptionType } },
      { field: 'demandSupplyDate', title: '新到日期', ui: { type: UiType.dateRange } },
      { field: 'oldDemandSupplyDate', title: '原到日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      planName: null,
      version: null,
      plantCode: null,
      itemCode: null,
      orderNumber: null,
      exceptionType: null,
      demandSupplyDate: [],
      oldDemandSupplyDate: [],
    }
  };

  columns = [
    { field: 'itemCode', headerName: '物料号', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'exceptionType', headerName: '例外类型', menuTabs: ['filterMenuTab'] },
    { field: 'exceptionDescription', headerName: '例外描述', menuTabs: ['filterMenuTab'] },
    // { field: 'supplyId', headerName: '供应id', menuTabs: ['filterMenuTab'] },
    // { field: 'demandId', headerName: '需求id', menuTabs: ['filterMenuTab'] },
    { field: 'orderNumber', headerName: '订单号', menuTabs: ['filterMenuTab'] },
    { field: 'quantity', headerName: '数量', menuTabs: ['filterMenuTab'] },
    { field: 'oldDate', headerName: '原到日期', menuTabs: ['filterMenuTab'] },
    { field: 'newDate', headerName: '新到日期', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleCompressDays', headerName: '压缩天数', menuTabs: ['filterMenuTab'] },

    // { field: 'orderLineType', headerName: '订单类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
  ];

  expColumns = [];
  expColumnsOptions: any[] = [
    { field: 'orderLineType', options: this.listOrderType },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1: // 订单类型
        options = this.listOrderType;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  ngOnInit() {
    this.loadInitData();
    this.loadInputParams();

    this.query();
  }

  loadInputParams() {
    this.queryParams.values.planName = this.iParam.planName;
    this.queryParams.values.version = this.iParam.version;
    this.queryParams.values.plantCode = this.iParam.plantCode;
    this.queryParams.values.itemCode = this.iParam.itemCode;

    this.onPlanChange(this.queryParams.values.planName);
  }

  loadInitData() {
    this.queryService.QueryPlans().subscribe(res => {
      res.data.forEach(item => {
        this.listPlan.push({
          label: item.planName,
          value: item.planName
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

    // 例外类型
    this.queryService.GetLookupByTypeNew('MRP_EXCEPTION_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.listExceptionType.push({
          label: d.lookupCode + '-' + d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  onPlanChange(value) {
    if (!this.isFormLoad) {
      this.queryParams.values.version = null;
      this.queryParams.values.plantCode = null;
    }
    this.queryService.QueryDataByPlan(value).subscribe(res => {
      this.listVersion.length = 0;
      this.listPlant.length = 0;

      // 版本
      res.data.Version.forEach(item => {
        this.listVersion.push({
          label: item,
          value: item
        });
      });
      // 计划工厂
      res.data.Plant.forEach(item => {
        this.listPlant.push({
          label: item,
          value: item
        });
      });

      if (!this.isFormLoad) {
        if (this.listVersion.length > 0)
          this.queryParams.values.version = this.listVersion[0].value;


        if (this.listPlant.length > 0)
          this.queryParams.values.plantCode = this.listPlant[0].value;
        this.isFormLoad = false;
      }
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
      itemCode: null,
      orderNumber: null,
      exceptionType: null,
      demandSupplyDate: [],
      oldDemandSupplyDate: [],
    };

    this.loadInputParams();
    this.onPlanChange(this.queryParams.values.planName);
  }

  commonQuery() {
    this.queryService.loadGridViewNew(this.queryService.planExceptionQuery, this.getQueryParams(), this.context);
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
      orderNumber: this.queryParams.values.orderNumber,
      exceptionType: this.queryParams.values.exceptionType,
      demandSupplyDate_S: this.formatDate(this.queryParams.values.demandSupplyDate[0]),
      demandSupplyDate_T: this.formatDate(this.queryParams.values.demandSupplyDate[1]),
      oldDemandSupplyDate_S: this.formatDate(this.queryParams.values.oldDemandSupplyDate[0]),
      oldDemandSupplyDate_T: this.formatDate(this.queryParams.values.oldDemandSupplyDate[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    };
  }

  exportFile() {
    super.export();
    this.queryService.exportAction(this.queryService.planExceptionQuery, this.getQueryParams(true), this.excelexport, this.context);
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
}
