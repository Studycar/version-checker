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
  selector: 'mrp-planning-pegging',
  templateUrl: './planning-pegging.component.html',
  providers: [QueryService],
})
export class MrpPlanningPeggingComponent extends CustomBaseContext implements OnInit {

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
    this.groupDefaultExpanded = -1;
  }

  showExpand = false;
  ImgSrc = '全部收缩'; // 全部展开样式
  isExpand = false; // 展开

  title = '追溯';
  queryType = ''; // 查询类型，1-查询需求追溯，2-查询供应追溯
  public iParam: any; // 传入参数
  listDemandType: any[] = [];
  listSupplyType: any[] = [];

  context = this;
  queryParams = {
    defines: [],
    values: {
    }
  };

  columns = [
    // { field: 'itemCode', headerName: '物料号', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'demandSupplyQty', headerName: '原始数量', menuTabs: ['filterMenuTab'] },
    { field: 'peggingQty', headerName: '分配数量', menuTabs: ['filterMenuTab'] },
    { field: 'demandSupplyDate', headerName: '时间', menuTabs: ['filterMenuTab'] },
    { field: 'supplyType', headerName: '供应类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2)' },
    { field: 'demandType', headerName: '需求类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
    { field: 'orderNumber', headerName: '订单号', menuTabs: ['filterMenuTab'] },
  ];

  expColumns = [];
  expColumnsOptions: any[] = [
    { field: 'supplyType', options: this.listSupplyType },
    { field: 'demandType', options: this.listDemandType },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.listDemandType;
        break;
      case 2:
        options = this.listSupplyType;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  ngOnInit() {
    this.loadInitData();
    this.loadInputParams();

    this.getDataPath = function (data) {
      return data.listItemCode;
    };

    this.autoGroupColumnDef = {
      headerName: '物料号',
      width: 250,
      // headerCheckboxSelection: true,
      cellRendererParams: {
        // checkbox: (dataItem) => {
        //   return this.canChecked(dataItem);
        // },
        checkbox: false,
        suppressCount: false,
        // innerRenderer: 'fileCellRenderer'
      },
      valueGetter: function (params) {
        // console.log(params);
        return params.data.itemCode;
      },
    };

    this.initExportCols();
  }

  initExportCols() {
    this.expColumns = [];
    this.expColumns.push({ field: 'itemCode', title: '物料号', width: 200 });
    this.columns.forEach(p => {
      this.expColumns.push({ field: p.field, title: p.headerName, width: 200 });
    });
  }

  loadInputParams() {
    // 供应
    this.supply();
  }

  loadInitData() {
    // 需求类型
    this.queryService.GetLookupByTypeNew('MRP_DEMAND_ORIGINATION_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.listDemandType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // 供应类型
    this.queryService.GetLookupByTypeNew('MRP_SUPPLY_ORDER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.listSupplyType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {

  }

  commonQuery() {
    this.queryService.loadGridViewNew(this.queryService.planPeggingQuery, this.getQueryParams(), this.context);
  }

  getQueryParams() {
    // console.log(this.iParam.ID);
    return {
      sourceData: this.iParam,
      queryType: this.queryType, // 查询类型，1-查询需求追溯，2-查询供应追溯
    };
  }

  exportFile() {
    // super.export();
    // this.queryService.exportAction(this.queryService.planPeggingQuery, this.getQueryParams(), this.excelexport, this.context);
    this.excelexport.export(this.gridData);
  }

  demand() {
    this.title = '追溯-需求';
    this.queryType = '1'; // 查询类型，1-查询需求追溯，2-查询供应追溯
    this.query();
  }

  supply() {
    this.title = '追溯-供应';
    this.queryType = '2'; // 查询类型，1-查询需求追溯，2-查询供应追溯
    this.query();
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
}
