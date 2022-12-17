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
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-mo-summary',
  templateUrl: './mo-summary.component.html',
  providers: [EditService],
})
export class PlanscheduleDigitalizationWorkbenchMoSummaryComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private appTranslate: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfig: AppConfigService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private queryService: EditService,
  ) {
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    this.headerNameTranslate(this.columns);
    this.groupDefaultExpanded = -1;
  }

  showExpand = false;
  ImgSrc = '全部收缩'; // 全部展开样式
  isExpand = false; // 展开

  public plantCode = '';
  public makeOrderNum = '';
  public projectNumber = '';

  listMakeOrderStatus: any[] = [];

  context = this;
  queryParams = {
    defines: [],
    values: {
    }
  };

  columns = [
    { field: 'levelNum', headerName: 'MO层级', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料号', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    // { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'demandDate', headerName: '需求时间', menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime', headerName: '计划开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime', headerName: '计划完成时间', menuTabs: ['filterMenuTab'] },
    { field: 'projectNumber', headerName: '项目号', menuTabs: ['filterMenuTab'] },
    { field: 'moQty', headerName: 'MO数量', menuTabs: ['filterMenuTab'] },
    { field: 'completedQty', headerName: '完工数量', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderStatus', headerName: 'MO状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
  ];

  expColumns = [];
  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.listMakeOrderStatus },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.listMakeOrderStatus;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  ngOnInit() {
    this.loadInitData();

    this.getDataPath = function (data) {
      return data.makeOrderNumAg;
    };

    this.autoGroupColumnDef = {
      headerName: 'MO号',
      width: 250,
      cellRendererParams: {
        checkbox: false,
        suppressCount: true,
      },
      valueGetter: function (params) {
        // console.log(params);
        return params.data.makeOrderNum;
      },
    };

    this.initExportCols();

    this.query();
  }

  initExportCols() {
    this.expColumns = [];
    this.expColumns.push({ field: 'makeOrderNum', title: 'MO号', width: 200 });
    this.columns.forEach(p => {
      this.expColumns.push({ field: p.field, title: p.headerName, width: 200 });
    });
  }

  loadInitData() {
    // 工单状态
    this.queryService.GetLookupByTypeNew('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.data.forEach(d => {
        this.listMakeOrderStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  clear() {

  }

  queryCommon() {
    this.queryService.loadGridViewNew(this.queryService.queryMoSummary, this.getQueryParams(), this.context);
  }

  getQueryParams() {
    // console.log(this.iParam.ID);
    return {
      plantCode: this.plantCode,
      makeOrderNum: this.makeOrderNum,
      projectNumber: this.projectNumber,
    };
  }

  exportFile() {
    // super.export();
    // this.queryService.exportAction(this.queryService.planPeggingQuery, this.getQueryParams(), this.excelexport, this.context);
    this.excelexport.export(this.gridData);
  }

  // 全部展开
  showMinus() {
    if (this.isExpand) {
      this.gridApi.expandAll(); // 当前展开
      this.isExpand = false;
      this.ImgSrc = '全部收缩'; // 全部展开样式
    } else {
      this.gridApi.collapseAll(); // 当前收缩
      this.isExpand = true;
      this.ImgSrc = '全部展开'; // 全部收缩
    }
  }

  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}
