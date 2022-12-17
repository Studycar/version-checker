import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { NzMessageService } from 'ng-zorro-antd';
import { StockPlanService } from './stock-plan.service';

@Component({
  selector: 'stock-plan',
  templateUrl: './stock-plan.component.html',
  providers: [StockPlanService],
})
export class StockPlanComponent extends CustomBaseContext implements OnInit {
  
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: StockPlanService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
  }

  businessUnitOptions: any[] = [];
  plantOptions: any[] = [];
  prodPlantOptions: any[] = [];
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  
  queryParams = {
    defines: [
      {
        field: 'businessUnit',
        title: '事业部',
        ui: { type: UiType.select, options: this.businessUnitOptions, eventNo: 1,},
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions,},
      },
      {
        field: 'hiWeeks',
        title: '历史周数',
        ui: { type: UiType.text,},
      },
      {
        field: 'itemCode',
        title: this.appTranslationService.translate('物料编码'),
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2
        }
      },
    ],
    values: {
      businessUnit: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      hiWeeks: null,
      itemCode: { value: '', text: '' },
    }
  };

  ngOnInit() {
    this.columns = [
      {
        colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
        checkboxSelection: function (params) { return params.context.dataRowEdit(params.data); },
        headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
        headerComponentParams: {
          template: this.headerTemplate
        }
      },
      {
        field: 'businessUnit',
        headerName: '事业部',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'plantCode',
        headerName: '工厂',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      // {
      //   field: 'itemId',
      //   headerName: '物料ID',
      //   width: 100,
      //   menuTabs: ['filterMenuTab'],
      // },
      {
        field: 'itemCode',
        headerName: '物料编码',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'itemDesc',
        headerName: '物料描述',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'hiWeeks',
        headerName: '历史周数',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'originalSum',
        headerName: '总需求',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'abcValue',
        headerName: 'ABC值',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'xyzValue',
        headerName: 'XYZ值',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'cov',
        headerName: 'COV',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'adi',
        headerName: 'ADI',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'isValue',
        headerName: '库存策略',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'safetyStock',
        headerName: '安全库存',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'minStock',
        headerName: '最小库存',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'maxStock',
        headerName: '最大库存',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'reorderStock',
        headerName: '再订货点',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'prodPlantCode',
        headerName: '生产工厂',
        width: 100,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate1,
        },
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'rygbValue',
        headerName: 'RYGB值',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'onhandStock',
        headerName: '库存量',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'inTransitStock',
        headerName: '在途量',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'shouldFillStock',
        headerName: '应补量',
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'theoryShouldFillStock',
        headerName: '理论应补量',
        width: 120,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'attribute1',
        headerName: '引入安全库存信息',
        width: 150,
        menuTabs: ['filterMenuTab'],
      },
    ];

    this.loadBusinessUnitOptions();
    this.loadPlantCodeOptions(this.queryParams.values.businessUnit);
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  loadBusinessUnitOptions() {
    this.businessUnitOptions.length = 0;
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.businessUnitOptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode
        });
      });
    });
  }

  changeBusinessUnitOptions(value) {
    this.queryParams.values.plantCode = null;
    this.loadPlantCodeOptions(value);
  }

  loadPlantCodeOptions(businessUnit: string) {
    this.plantOptions.length = 0;
    this.commonQueryService.GetUserPlant(businessUnit).subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
        this.prodPlantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', pageIndex, pageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, pageIndex, e.PageSize);
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
      this.gridData = data;
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      });
    });
  }

  getQueryParams(isExport: boolean = false) {
    const params: any = { ...this.queryParams.values, isExport };
    params.itemCode = params.itemCode.text;
    if (isExport) {
      params.pageIndex = 1;
      params.pageSize = 100000;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const exportData = data;
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  public dataRowEdit(dataItem: any) {
    return dataItem.prodPlantCode !== null;
  }

  // 修改生产工厂
  prodPlantChange(dataItem) {
    this.queryService.updateProdPlantCode(dataItem).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('生产工厂修改成功！'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // 将数据写入到安全库存表
  pushToSafeStock() {
    if (this.gridData == null || this.gridData.length === 0) {
      return;
    }
    const pushData = this.gridApi.getSelectedRows();
    if (pushData.length === 0) {
      const msg = this.appTranslationService.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.insertToSafeStock(pushData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      this.query();
    })
  }

  clear() {
    this.queryParams.values = {
      businessUnit: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      hiWeeks: null,
      itemCode: { value: '', text: '' },
    }
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
