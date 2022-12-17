import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
// import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
// import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
// import { NzMessageService } from 'ng-zorro-antd';
// import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
// import { BrandService } from 'app/layout/pro/pro.service';
// import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
// import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AreaPlanningSumService } from './queryService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-area-planning-sum',
  templateUrl: './sop-area-planning-sum.component.html',
  styleUrls: ['./sop-area-planning-sum.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AreaPlanningSumService],
})
export class SopAreaPlanningSumComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
    private queryService: AreaPlanningSumService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
    this.rowComponents = { showCellRenderer: this.mergeCellRenderer() };
  }

  mergeCellRenderer() {
    function ShowCellRenderer() {
    }

    ShowCellRenderer.prototype.init = function(params) {
      this.ui = document.createElement('div');
      // if (params.colDef.field === 'ITEM_CODE_S') {
      //   this.ui.innerHTML = '<div>' + params.data.ITEM_CODE_S + '</div>' +
      //     '<div style="white-space: normal;"><span>' + params.data.ITEM_DESC + '</span></div>';
      // } else {
      this.ui.innerHTML = '<div>' + params.value + '</div>';
      // }
    };
    ShowCellRenderer.prototype.getGui = function() {
      return this.ui;
    };
    return ShowCellRenderer;
  }

  public rowComponents;
  businessUnitOption: any[] = [];
  plantOption: any[] = [];
  classOption: any[] = [];
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
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.businessUnitOption, ngModelChange: this.onBusinessUnitCodeChange },
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption, ngModelChange: this.onPlantCodeChange },
      },
      {
        field: 'demandPeriod',
        title: '需求周期',
        ui: { type: UiType.date },
      },
      {
        field: 'demandDateRange',
        title: '需求日期',
        ui: { type: UiType.dateRange },
      },
      {
        field: 'capacityclass',
        title: '产能分类',
        ui: { type: UiType.select, options: this.classOption },
      },
      {
        field: 'setCode',
        title: '成品编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
          },
        },
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 3,
          extraEvent: {
            RowSelectEventNo: 4,
          },
        },
      },
      {
        field: 'lackSupplyFlag',
        title: '仅查看供应缺口',
        ui: {
          type: UiType.checkbox,
        },
      },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getActivePlantCode(),
      demandPeriod: null,
      demandDateRange: [],
      capacityclass: null,
      setCode: { text: '', value: '' },
      itemCode: { text: '', value: '' },
      lackSupplyFlag: false,
    },
  };
  columns = [
    {
      field: 'buCode', headerName: '事业部', cellRenderer: 'showCellRenderer',
      rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 100, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'plantCode', headerName: '工厂', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 100, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'demandPeriod', headerName: '需求周期', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 130, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'demandDate', headerName: '需求日期', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 130, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'capacityclass', headerName: '产能分类', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 100, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'setCode', headerName: '成品编码', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 100, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'setCodeDesc', headerName: '成品描述', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 130, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fgDemand', headerName: '成品需求数量', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      },
      width: 130, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'supplyQty', headerName: '供应数量', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      }, width: 100, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fgMet', headerName: '产能分配数量', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      }, width: 130, menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fgUnmet', headerName: '产能缺口', rowSpan: function(params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell-area': function(params) {
          return params.data.showCell;
        },
      }, width: 100, menuTabs: ['filterMenuTab'],
    },
    { field: 'itemCode', headerName: '物料编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'assignedDemand', headerName: '物料需求', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'assignedCapacity', headerName: '分配物料能力', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'usage', headerName: '单位用量', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'assingedDiff', headerName: '物料缺口', width: 120, menuTabs: ['filterMenuTab'] },
  ];

  ngOnInit() {
    this.loadBusinessUnitOption();
    this.loadPlantOption(this.queryParams.values.businessUnitCode);
    this.loadClassOption();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: '/api/sop/sopareaplanningsum/query', method: 'GET' },
      this.getQueryParams(),
      this.context,
    );
  }

  getQueryParams() {
    const demandDateRange = this.queryParams.values.demandDateRange;
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      plantCode: this.queryParams.values.plantCode,
      demandPeriod: this.queryParams.values.demandPeriod,
      demandDateS: demandDateRange.length > 0 ? demandDateRange[0] : null,
      demandDateE: demandDateRange.length > 0 ? demandDateRange[1] : null,
      capacityclass: this.queryParams.values.capacityclass,
      setCode: this.queryParams.values.setCode.text,
      itemCode: this.queryParams.values.itemCode.text,
      QueryParams: {
        PageIndex: this._pageNo,
        PageSize: this._pageSize,
      },
      IsExport: false,
      lackSupplyFlag: this.queryParams.values.lackSupplyFlag,
    };
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    const dto = this.getQueryParams();
    dto.IsExport = true;
    this.commonQueryService.exportAction({
      url: '/api/sop/sopareaplanningsum/query',
      method: 'GET',
    }, dto, this.excelexport, this.context);
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getActivePlantCode(),
      demandPeriod: null,
      demandDateRange: [],
      capacityclass: null,
      setCode: { text: '', value: '' },
      itemCode: { text: '', value: '' },
      lackSupplyFlag: false,
    };
  }

  onBusinessUnitCodeChange(val: string) {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.capacityclass = null;
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
    this.queryParams.values.setCode.text = '';
    this.queryParams.values.setCode.value = '';
    this.loadPlantOption(val);
    this.loadClassOption();
  }

  onPlantCodeChange(val: string) {
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
    this.queryParams.values.setCode.text = '';
    this.queryParams.values.setCode.value = '';
  }

  loadBusinessUnitOption() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.businessUnitOption.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode,
        });
      });
    });
  }

  loadClassOption() {
    this.queryService.getClasses(this.queryParams.values.businessUnitCode).subscribe(res => {
      this.classOption.length = 0;
      res.data.forEach(item => {
        this.classOption.push({
          label: item,
          value: item,
        });
      });
    });
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode,
        });
      });
    });
  }

  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.itemCode.text = Text;
    this.queryParams.values.itemCode.value = Value;
  }

  searchItems(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate(this.appTranslationService.translate('请先选择工厂！')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadItems(plantCode: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryService.getUserPlantItemPage(plantCode || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  rowSelect_SetCode({ Row, Text, Value, sender }) {
    this.queryParams.values.setCode.text = Text;
    this.queryParams.values.setCode.value = Value;
  }

  searchItems_SetCode(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate(this.appTranslationService.translate('请先选择工厂！')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems_SetCode(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadItems_SetCode(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.queryService.getUserPlantItemPage(plantCode || '', itemCode || '', '', pageIndex, pageSize, '', 'FG').subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
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
